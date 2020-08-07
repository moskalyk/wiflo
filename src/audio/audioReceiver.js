import AudioStream from './audioStream.js';

function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  bufView = null;
  return buf;
}

class AudioReceiver {
  constructor() {
    this.audiostream = new AudioStream()
    this.player = {}
  }

    receivedStarted() {
      console.log("Disable button?");
    }

    receivedStopped() {
      this.player.stop();
    }

    receivedMetadata(metadata) {
      this.player = this.audiostream.getNewPlayer(metadata);
    }

    receivedAudioData(audioData) {
      let byteCharacters = atob(audioData);
      let byteArray = str2ab(byteCharacters);

      this.player.play(byteArray);
    }

    receivedEvent(data) {
      if (data.event == 'started') {
        this.receivedStarted()

      } else if (data.event == 'stopped') {
        this.receivedStopped()

      } else if (data.event == 'metadata') {
        var metadata = JSON.parse(data.data);
        this.receivedMetadata(metadata);

      } else if (data.event == 'binary') {
        this.receivedAudioData(data.data)
      }
    }
}

export default AudioReceiver;
