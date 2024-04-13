const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const recordBtn = document.getElementById("recordBtn");
const downloadBtn = document.getElementById("downloadBtn");
let captureStream = null;
let mediaRecorder = null;
let isRecording = false;
let recordedBlobs = [];

recordBtn.addEventListener('click', startRecording);

function showMsg (msg) {
    alert(msg);
}

// Options for getDisplayMedia()
const displayMediaOptions = {
    video: {
      cursor: "always"
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    }
  };
  
  async function startCapture(displayMediaOptions) {
    try {
      videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      captureStream = videoElem.srcObject
      dumpOptionsInfo();
    } catch(err) {
      console.error("Error: " + err);
    }
  }
  
  function dumpOptionsInfo() {
    const videoTrack = videoElem.srcObject.getVideoTracks()[0];
    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
  }
  
  function stopCapture(evt) {
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
    showMsg('用户停止了分享屏幕');
  }
  
  // Set event listeners for the start and stop buttons 给按钮添加监听事件
  startElem.addEventListener("click", function(evt) {
    startCapture();
  }, false);
  
  stopElem.addEventListener("click", function(evt) {
    stopCapture();
  }, false);
  

  function startRecording() {
  
    const mimeType = getSupportedMimeTypes()[0];
    const options = { mimeType };
  
    try {
      mediaRecorder = new MediaRecorder(captureStream, options);
    } catch (e) {
      showMsg(`创建MediaRecorder出错: ${JSON.stringify(e)}`);
      return;
    }
    recordBtn.textContent = '停止录制';
    isRecording = true;
    downloadBtn.disabled = true;
    mediaRecorder.onstop = (event) => {
      showMsg('录制停止了: ' + event);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    showMsg('录制开始 mediaRecorder: ' + mediaRecorder);
  }
  
  function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }
  
  function stopRecord() {
    isRecording = false;
    mediaRecorder.stop();
    downloadBtn.disabled = false;
    recordBtn.textContent = "开始录制";
    recordedBlobs = []
  }

  downloadBtn.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = '录屏_' + new Date().getTime() + '.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  });
