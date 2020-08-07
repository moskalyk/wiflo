import AudioStream from './audioStream.js';
import audioBridge from './audioBridge.js';
  var audioRecorder;

export default class AudioTransmitter {
  audioRecorder = null
  
  constructor(audioStreamer, audioBridge){
      // this.as = audioStreamer
      this.audioStreamer = audioStreamer
      this.audioBridge = audioBridge

      this.audioStreamer.getRecorder().then(recorder => {
        this.audioRecorder = recorder;
      });
  }

   start() {
    audioRecorder.start();
  }

  stop() {
    audioRecorder.stop();
  }

  transmitAudioData(data) {
    var base64String = btoa(
      new Uint8Array(data)
        .reduce((onData, byte) => onData + String.fromCharCode(byte), ''));

    var dataToSend = this.constructData('binary', base64String)
    this.audioBridge.send(dataToSend);
  }

  transmitMetadata(metadata) {
    var dataToSend = this.constructData('metadata', metadata);
    this.audioBridge.send(dataToSend);
  }

  transmitStartData() {
    var dataToSend = this.constructData('started', 'started')
    this.audioBridge.send(dataToSend);
  }

  transmitStopData() {
    var dataToSend = this.constructData('stopped', 'stopped')
    this.audioBridge.send(dataToSend);
  }

  constructData(event, data) {
    var dataToSend = {}

    // dataToSend.user = gunDB._.opt.pid

    // hack
    dataToSend.user = Math.random()
    dataToSend.event = event
    dataToSend.timestamp = new Date().getTime();

    if (event == 'metadata') {
      dataToSend.data = JSON.stringify(data);
    } else if (event == 'binary') {
      dataToSend.data = data;
    }

    return dataToSend;
  }

}
