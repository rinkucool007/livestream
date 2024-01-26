document.addEventListener('DOMContentLoaded', () => {
    const videoContainer = document.getElementById('video-container');
    const liveVideo = document.getElementById('live-video');
    const liveButton = document.getElementById('live-button');
    const recordButton = document.getElementById('record-button');

    let isMaximized = false;

    // Get user media with higher constraints for 4K
    navigator.mediaDevices.getUserMedia({
        video: {
            width: { ideal: 3840 },
            height: { ideal: 2160 },
            frameRate: { ideal: 30 },
        },
    })
    .then((stream) => {
        liveVideo.srcObject = stream;

        // Add a click event to toggle the live button
        liveButton.addEventListener('click', toggleLiveButton);

        // Show the button when the video is playing
        liveVideo.addEventListener('playing', showLiveButton);

        // Add click event to start/stop recording
        recordButton.addEventListener('click', toggleRecording);

        // Listen for click events on the video container
        videoContainer.addEventListener('click', toggleMaximize);

        // Listen to dataavailable event for recording chunks
        mediaRecorder.addEventListener('dataavailable', handleDataAvailable);

        // Listen to stop event to save the recorded video
        mediaRecorder.addEventListener('stop', saveRecordedVideo);
    })
    .catch((error) => {
        console.error('Error accessing camera:', error);
    });

    function toggleLiveButton() {
        liveButton.classList.toggle('live-on');
    }

    function showLiveButton() {
        liveButton.style.display = 'block';
    }

    function toggleRecording() {
        if (mediaRecorder.state === 'inactive') {
            startRecording();
        } else {
            stopRecording();
        }
    }

    function startRecording() {
        recordedChunks = [];
        mediaRecorder.start();
        recordButton.textContent = 'Stop Recording';
        recordButton.classList.add('btn-danger');
    }

    function stopRecording() {
        mediaRecorder.stop();
        recordButton.textContent = 'Start Recording';
        recordButton.classList.remove('btn-danger');
    }

    function handleDataAvailable(event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    }

    function saveRecordedVideo() {
        const blob = new Blob(recordedChunks, { type: 'video/webm; codecs=vp9' });

        // Create a download link for the user
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'recorded_video.webm';

        // Trigger a click on the link to prompt the user to download the video
        downloadLink.click();
    }

    function toggleMaximize() {
        if (!isMaximized) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }

            isMaximized = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }

            isMaximized = false;
        }
    }
});
