import audioReceiver from './audioReceiver.js';
import AudioStream from './audioStream.js';
import { ThreadService } from '../ThreadService';

class AudioBridge {

  constructor() {
        // init store
    this.thread = new ThreadService()
    this.audioStream = new AudioStream(this)
    this.ready = false;


  }

  init () {

    this.audioStream.getRecorder().then(recorder => {
      recorder.start()
    })

    this.thread.init().then((thread) => {

      console.log('init audio bridge')
      // this.thread = thread
      this.ready = true
      // this.setupObservables()
      // let room = window.location.hash.replace('#', '');
      // if (room && room !== '') {
      //   thread.rejoinOpenRoom().then((threadID: ThreadID) => {
      //     // this.setRoom(threadID)
      //     console.log(threadID)
      //   })
      // } 

      this.thread.startNewRoom().then( threadId => {
        console.log(`Thread ready: ${threadId}`)
        // thread.setRoom()
        // this.ready = true;
        console.log(this.thread)

        const observable = this.thread.onMessage();

        observable.subscribe((threadEvent) => {
          const m = threadEvent.event.patch;
          console.log('------------------')
          console.log(m)

          // messages.push(m);
          // this.setState({ messages: messages });
        });

        this.thread.getInfoString().then((info) => {
          console.log("INFO")
          console.log(info)
          // const b = Buffer.from(info)
          // console.log(b)
          // console.log({invite: b.toString('hex')})
          // this.setState({invite: b.toString('hex')})
          // this.setupObservables()
        })
      }).catch(e => {
        console.log(e)
      })

    })
  }

  joinExternal() {

  }

  send(data, room) {

    if(this.ready){
      this.thread.send({
        // _id: Math.random(),
        _id: '',
        author: 'vitalik' +Math.random(),
        text: data
      })
    }else {
      console.log('not ready')
    }

  }

}

// var audioBridge = (function () {

//   var lastTimeStamp = new Date().getTime();
//   var initial = true;

//   function init() {


//     // receive data
//       // audioReceiver.receive(data)
    

//     // gunDB.get('audio').get(room).on(function (data, room) {

//     //   if (initial) {
//     //     initial = false;
//     //     return;
//     //   }

//     //   if (lastTimeStamp == data.timestamp) {
//     //     return;
//     //   }
//     //   lastTimeStamp = data.timestamp;

//     //   if (data.user == gunDB._.opt.pid) {
//     //     return;
//     //   }

//     //   audioReceiver.receive(data)
//     // })
//   }



//   return {
//     init: init,
//     send: sendToStore
//   };

// })();

// const audioBridge = new AudioBridge ()

export default AudioBridge;