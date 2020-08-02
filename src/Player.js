import React, { Component } from 'react'


class Player extends Component {
  
  componentDidMount(){
    // set up basic variables for app

const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');

// disable stop button while not recording

// stop.disabled = true;

// visualiser setup - create web audio api context and canvas

let audioCtx;
const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);
    
    console.log(stream)

    // record.onclick = function() {
    //   mediaRecorder.start(1000);
    //   console.log(mediaRecorder.state);
    //   console.log("recorder started");
    //   record.style.background = "red";

    //   stop.disabled = false;
    //   record.disabled = true;
    // }

    // stop.onclick = function() {
    //   mediaRecorder.stop();
    //   console.log(mediaRecorder.state);
    //   console.log("recorder stopped");
    //   record.style.background = "";
    //   record.style.color = "";
    //   // mediaRecorder.requestData();

    //   stop.disabled = true;
    //   record.disabled = false;
    // }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      const deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      // deleteButton.textContent = 'Delete';
      // deleteButton.className = 'delete';

      if(clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");

      deleteButton.onclick = function(e) {
        let evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function() {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      console.log(e.data)
      chunks.push(e.data);
      
      const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      // var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      // document.querySelector("audio").src = URL.createObjectURL(blob);
      
      if(count == 2) {
        console.log('new audio')
        audio.push(new Audio(URL.createObjectURL(blob)))
        chunks = []
        count = 0
      }
      
      count++
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}

const audio = []
var count = 0

setInterval(() => {
  // pop of the list
  console.log('checking...')
  console.log(audio)
  //play teh element
  if(audio.length > 0){
    const audioEl = audio[0]
    console.log(audioEl)
    
    audioEl.addEventListener("canplaythrough", event => {
      /* the audio is now playable; play it if permissions allow */
      audioEl.play();
    });
  }
  
  //on stopping play of that element, queue the next one
  
}, 2000)


function visualize(stream) {
  if(!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(255, 255, 255, 1)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'RGBA(84, 84, 84, 1)';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;


    for(let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT/2;
      // console.log(y)
      // console.log(v)

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();
  
  }
  
  render(){
    return(
      <>
        <section class="main-controls">
          <canvas class="visualizer" height="200px" style={{width: '500px'}}></canvas>
          <div id="buttons">
          </div>
        </section>
      </>
      )
  }
}

export default Player