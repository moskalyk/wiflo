// require('./audio/audioBridge.js')
// require('./audio/audioStream.js')
// require('./audio/audioReceiver.js')
// require('./audio/audioTransmitter.js')
import AudioBridge from './audio/audioBridge.js';

import { Collection, Database, KeyInfo, JSONSchema, ThreadID } from "@textile/hub";


export class AudioService {
  public threadID?: ThreadID
  private db?: Database
  public audioBridge?: any

  constructor () {
    // Create a default threadID to use if no room is joined
    // const room = window.location.hash.replace('#', '')
    // this.threadID = room ? ThreadID.fromString(room) : ThreadID.fromRandom()
  	this.audioBridge = new AudioBridge()
    this.audioBridge.init()
  }
  
  // public init  = async (): Promise<AudioService> => {
  public init  = async (): Promise<any> => {
  	console.log('initialing audio')
  	// connect

  	// send data

  	setInterval(() => {
  		console.log('testing')
  		this.audioBridge.send('howdie')
  	}, 1000)
  } 
}

function str2ab(str:any ) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    bufView = new Uint8Array([])
    return buf;
}