import { DBInfo } from "@textile/threads";
import {Libp2pCryptoIdentity} from '@textile/threads-core';
import { Collection, Database, KeyInfo, JSONSchema, ThreadID } from "@textile/hub";
import { ChatInstance } from './types';
import { getIdentity } from './helpers';
import { fromEvent, Observable } from 'rxjs';

// We'll use this directly to delete our dbs when needed
const level = require("level");
const dbName = "threads.chat.reboot";

export class ThreadService {
  public threadID: ThreadID
  private db?: Database
  private identity?: Libp2pCryptoIdentity
  private room?: Collection<ChatInstance>

  constructor () {
    // Create a default threadID to use if no room is joined
    const room = window.location.hash.replace('#', '')
    this.threadID = room ? ThreadID.fromString(room) : ThreadID.fromRandom()


  }
  
  public init  = async (): Promise<ThreadService> => {
    // Create or restore identity from localStorage
    this.identity = await getIdentity()

    /* You'll need to include this information in your app */
    const key: KeyInfo = {key: process.env.REACT_APP_API_KEY || 'bq5t3vy4nh4bv6chuveibkjlw5y'}
    // We could also consider prefixing the db by identity (or some # of chars from the public key)
    this.db = await Database.withKeyInfo(key, dbName, undefined, process.env.REACT_APP_API) // final variable can be undefined
    return this;
  } 

  /**
   * Reset the current db.
   * Done by first closing it if open, deleting the existing data, and re-initializing.
   */
  public reset = async (): Promise<ThreadService> => {
    console.log('closing')

    try{
      console.log(this.db)
      await this.db?.close()
      console.log('closed!!!')
    }catch(e){
      console.log(e)
    }

    console.log('destroy')
    // This will actually "destroy" the database. This is handy here because we're "switching" rooms.
    // But it might NOT be want you want in a real-world app!
    await new Promise<void>((resolve, reject) => {
      level.destroy(dbName, (err?: Error) => {
        if (err !== undefined) reject(err)
        resolve()
      })
    })
    console.log('initinnnng')
    return this.init()
  };

  /**
   * Stores the threadId as a string in the URL
   * Allows for simple refresh / returning to room
   */
  public storeCurrentRoom = () => {
    const room = this.threadID.toString()
    window.location.hash = room
  }

  /**
   * Uses the default threadID to start a new thread and chat room
   */
  public startNewRoom = async () => {
    console.log('starting room')
    if (!this.identity) {
      throw new Error('Identity not found')
    }
    if (!this.db) {
      throw new Error('Database not setup')
    }
    /** Start with an empty thread */
    await this.reset() // Reset deletes any existing data for us
    console.log('starting')
    console.log(this.identity)
    console.log(this.threadID)
    try{
      await this.db.start(this.identity, {threadID: this.threadID})

    }catch(e){
      console.log(e)
    }

    console.log('collection')
    await this.createCollection()
    this.storeCurrentRoom()
    return this.threadID
  }
  
  /**
   * Uses the result of getDBInfo to join a remote room
   * @param invite the parsed value returned from getDBInfo
   */
  public joinExternalRoom = async (invite: DBInfo) => {
    console.log('joining room')
    // debugger
    if (!this.identity) {
      throw new Error('Identity not found')
    }
    // Since we're joining an external room, we'll reset our local db and context.
    // This might NOT be what you want to do in a real-world app!
    await this.reset();

    if (!this.db) {
      throw new Error('Database not setup')
    }

    console.log('payload')
    console.log(this.identity)
    console.log(invite)
    console.log(this.db)
    /** Join from the Invite payload */
    const err = await this.db.startFromInfo(this.identity, invite)
    if (err instanceof Error) throw err
    this.threadID = this.db.threadID || this.threadID
    console.log('creating collection')

    await this.createCollection()
    
    console.log('store current room')

    this.storeCurrentRoom()
    console.log('returning with id')
    return this.threadID
  }

  /**
   * Restart a DB already after a browser refresh
   */
  public rejoinOpenRoom = async () => {
    if (!this.identity) {
      throw new Error('Identity not found')
    }
    if (!this.db) {
      throw new Error('Database not setup')
    }

    await this.db.start(this.identity, {threadID: this.threadID})
    // await this.db.start(this.identity)
    await this.createCollection()
    this.threadID = this.db.threadID || this.threadID
    return this.db.threadID
  }
  
  /**
   * Creates a collection using the Chat schema (ChatInstance)
   * If the chat thread already exists, this will reconnect it with `get`.
   * 
   * Note: You can create multiple "rooms" in the same thread, as different
   * collections with different names. Image a shared workplace chat.
   */
  public createCollection = async () => {
    console.log('create collection')

    if (!this.db) {
      throw new Error('No db')
    }
    const {collections} = this.db
    if (collections.get('basic-chat')) {
      /** Chat exists, so just use it as the reference */
      this.room = collections.get('basic-chat')
    } else {
      /** Chat doesn't exist, create it */
      this.room = await this.db.newCollection<ChatInstance>('basic-chat', chatSchema)
    }
    this.storeCurrentRoom()
  }
  /**
   * This will export the "invite" necessary for other to join the same thread.
   * 
   * Note, recipients will have access to all collections in the same thread.
   */
  public getInfoString = async () => {
    if (!this.db) {
      throw new Error('No db')
    }
    const info = await this.db.getDBInfo(true)
    return JSON.stringify(info)
  }

  /**
   * Will broadcast a message over the thread
   * @param message ChatInstance
   */
  public send = async (message: ChatInstance) => {
    if (!this.room) {
      throw new Error('DB not ready')
    }
    await this.room.insert(message)

    if (!this.db || !this.db.threadID) {
      throw new Error('DB not ready')
    }
  }

  /**
   * Provides an Observable to wire into the UI state
   */
  public onMessage (): Observable<ChatInstance> {
    if (!this.db) {
      throw new Error('DB not setup')
    }
    return fromEvent(this.db.emitter, 'basic-chat.*.0')
  }

  /**
   * disconnect - used when unmounting
   */
  public disconnect (): void {
    if (!this.db) {
      return
    }
    this.db.close()
  }
}

export const chatSchema: JSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    ChatBasic: {
      title: "ChatBasic",
      type: "object",
      properties: {
        _id: {
          type: "string",
        },
        text: {
          type: "string",
        },
        author: {
          type: "string",
        },
      },
      required: ["text", "author", "_id"],
    },
  },
};
