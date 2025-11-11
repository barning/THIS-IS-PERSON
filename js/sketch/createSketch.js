import { DETECTION_CONFIDENCE_THRESHOLD } from '../config/constants.js';
import { createDetectionOverlay } from './detectionOverlay.js';
import { createPromptRenderer } from './promptRenderer.js';

export function createSketch({
  wordOfToday,
  timer,
  shareControls,
  elements,
  url,
}) {
  const uppercaseWord = wordOfToday.toUpperCase();

  return (p5Instance) => {
    let video = null;
    let detector = null;
    let detections = [];
    let detectedWish = false;
    let timerStarted = false;

    const promptRenderer = createPromptRenderer(p5Instance);
    const detectionOverlay = createDetectionOverlay(p5Instance);

    promptRenderer.setText('THINKING');

    p5Instance.preload = () => {
      elements.loadButton.classList.add('hidden');
      elements.loadingScreen.classList.remove('hidden');
      detector = ml5.objectDetector('cocossd');
    };

    p5Instance.setup = () => {
      const canvas = p5Instance.createCanvas(640, 480);
      canvas.parent('canvas-wrapper');

      video = p5Instance.createCapture({
        video: {
          width: { min: 320, ideal: 640, max: 640 },
          height: { min: 240, ideal: 480, max: 480 },
        },
        audio: false,
      });

      video.hide();
      promptRenderer.setText(`I WANT TO SEE ${uppercaseWord}`);

      video.elt.addEventListener('loadeddata', () => {
        if (video.elt.readyState < 2) {
          return;
        }

        video.size(p5Instance.width, p5Instance.AUTO);
        const videoHeight = video.elt.videoHeight || video.height || p5Instance.height;
        p5Instance.resizeCanvas(640, videoHeight);

        detector.detect(video, onDetected);
      });
    };

    p5Instance.draw = () => {
      if (!video) {
        return;
      }

      p5Instance.image(video, 0, 0);
      detections.forEach(handleDetection);
      promptRenderer.draw();

      if (detectedWish) {
        p5Instance.noLoop();
      }
    };

    function handleDetection(object) {
      if (detectedWish) {
        return;
      }

      const confidence = p5Instance.float(object.confidence);
      const matchesWord = object.label === wordOfToday.toLowerCase();

      if (!matchesWord) {
        detectionOverlay.drawLabel(object);
        return;
      }

      if (confidence < DETECTION_CONFIDENCE_THRESHOLD) {
        detectionOverlay.drawLabel(object, true);
        return;
      }

      handleSuccessfulDetection(object, confidence);
    }

    function handleSuccessfulDetection(object, confidence) {
      if (detectedWish) {
        return;
      }

      detectionOverlay.drawBoundingBox(object);
      const confidencePercent = p5Instance.round(confidence * 100);
      promptRenderer.setText(`${confidencePercent}% SURE, THATS ${uppercaseWord}`);

      const totalSeconds = timer.stop();
      timer.showCompletionMessage(totalSeconds);
      p5Instance.storeItem(uppercaseWord, totalSeconds);

      shareControls.show({
        onDownload: () => p5Instance.saveCanvas(p5Instance.canvas, `THIS IS ${uppercaseWord}`, 'jpg'),
        getShareText: () =>
          `FOUND TODAYS ${url} WORD IN ${totalSeconds.toFixed()} SECONDS`,
      });

      detectedWish = true;
    }

    function onDetected(error, results) {
      if (error) {
        console.error(error);
      }

      detections = results;
      detector.detect(video, onDetected);

      if (!timerStarted) {
        elements.loadingScreen.classList.add('hidden');
        elements.canvasWrapper.classList.remove('loading');
        timer.start();
        timerStarted = true;
      }
    }
  };
}
