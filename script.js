
const displayNames = [
  'person',
  'bicycle',
  'car',
  'motorcycle',
  'airplane',
  'bus',
  'train',
  'truck',
  'boat',
  'traffic light',
  'fire hydrant',
  'stop sign',
  'parking meter',
  'bench',
  'bird',
  'cat',
  'dog',
  'horse',
  'sheep',
  'cow',
  'elephant',
  'bear',
  'zebra',
  'giraffe',
  'backpack',
  'umbrella',
  'handbag',
  'tie',
  'suitcase',
  'frisbee',
  'skis',
  'snowboard',
  'sports ball',
  'kite',
  'baseball bat',
  'baseball glove',
  'skateboard',
  'surfboard',
  'tennis racket',
  'bottle',
  'wine glass',
  'cup',
  'fork',
  'knife',
  'spoon',
  'bowl',
  'banana',
  'apple',
  'sandwich',
  'orange',
  'broccoli',
  'carrot',
  'hot dog',
  'pizza',
  'donut',
  'cake',
  'chair',
  'couch',
  'potted plant',
  'bed',
  'mirror',
  'dining table',
  'window',
  'desk',
  'toilet',
  'door',
  'tv',
  'laptop',
  'mouse',
  'remote',
  'keyboard',
  'cell phone',
  'microwave',
  'oven',
  'toaster',
  'sink',
  'refrigerator',
  'blender',
  'book',
  'clock',
  'vase',
  'scissors',
  'teddy bear',
  'hair drier',
  'toothbrush'
];

let worfOfToday = null;

let video = null; 
let detector = null; 
let detections = []; 
let randomWord = null;
let prompt = "THINKING";
let detectedWish = false;

let base = null;
let elapsed = 0;
const timerDIV = document.querySelector(".timer")

const loadingScreen = document.querySelector(".loading-screen");
const shareButton = document.querySelector(".share__image");
const copyButton = document.querySelector(".share__friends");
const loadButton = document.querySelector(".load");
const timerWrapper = document.querySelector(".timer__wrapper");

const dialogButtons = document.querySelectorAll("[data-open]");
const howtoDialog = document.querySelector("#howto");
const statisticsDialog = document.querySelector("#statistics");
const creditsDialog = document.querySelector("#credits");

dialogButtons.forEach(function(button) {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    const classList =  this.classList;
    switch (true) {
      case classList.contains("Howto"):
        howtoDialog.showModal();
        break;
      case classList.contains("Credits"):
        creditsDialog.showModal();
        break;
      case classList.contains("Statistics"):
        statisticsDialog.showModal();
        break;
      default:
        console.log(classList.contains("Howto"));
    }
  })
})

let sketch = (s) => {

  s.preload = function () {
    loadButton.classList.add("hidden");
    loadingScreen.classList.remove("hidden");
    detector = ml5.objectDetector('cocossd');
    console.log('detector object is loaded');
  };

  s.setup = function () {
    let canvas = s.createCanvas(640, 480, s.P2D);
    canvas.parent('canvas-wrapper');

    video = s.createCapture(s.VIDEO);
    video.size(640, 480);
    video.hide();

    randomWord = worfOfToday.toUpperCase();
    prompt = "I WANT TO SEE " + randomWord;

    video.elt.addEventListener('loadeddata', function () {
      if (video.elt.readyState >= 2) {
        detector.detect(video, onDetected);
        timerWrapper.classList.remove("hidden");
      }
    });
  };

  s.draw = function () {
    if (!video) return;

    s.image(video, 0, 0);

    for (let i = 0; i < detections.length; i++) {
      checkDetections(detections[i]);
    }

    s.textSize(32);
    s.textAlign(s.CENTER);
    s.noStroke();
    let backgroundTextWidth = s.textWidth(prompt) + 10;
    s.fill(0);
    s.rect(s.width / 2 - backgroundTextWidth / 2, s.height - 64, backgroundTextWidth, 32 + 10);
    s.fill(255);
    s.textStyle(s.BOLD);
    s.text(prompt, s.width / 2, s.height - 30);

    if (detectedWish) {
      s.noLoop();
    }
  };

  s.windowResized = function () {
    if (s.windowWidth < 640) {
      s.resizeCanvas(s.windowWidth, 480);
    } else {
      s.resizeCanvas(640, 480);
    }
  };

  const drawBoundingBox = function (object) {
    s.stroke("#4caf50");
    s.strokeJoin(s.ROUND);
    s.strokeWeight(3);
    s.noFill();

    s.rect(object.x, object.y, object.width, object.height);
  };

  const drawLabel = function (object, notConvinced) {
    let message = "";

    if (notConvinced) {
      message = "IS THIS " + object.label.toUpperCase() + "?";
    } else {
      message = "THIS IS " + object.label.toUpperCase();
    }

    s.noStroke();
    s.fill(255);
    s.textAlign(s.CENTER);
    s.textStyle(s.BOLD);
    s.textSize(18);

    let backgroundTextWidth = s.textWidth(message);
    s.fill(0);
    s.rect(object.x + object.width / 2 - backgroundTextWidth / 2, object.y + 2, backgroundTextWidth + 2, 20);

    s.fill(255);
    s.text(message, object.x + object.width / 2, object.y + 18);
  };

  const checkDetections = function (object) {
    let confidence = s.float(object.confidence);

    if (object.label === randomWord.toLowerCase()) {

      if (confidence < 0.7) {
        drawLabel(object, true);
      } else {
        drawBoundingBox(object);
        showShare();

        let oldWord = randomWord;
        let conf = s.round(confidence * 100);
        prompt = conf + "% SURE, THATS " + oldWord;

        timerWrapper.innerHTML = "FOUND TODAYS WORD IN " + elapsed.toFixed() + " Seconds";
        s.storeItem(randomWord, elapsed);

        detectedWish = true;
      }
    } else {
      drawLabel(object);
    }
  };

  // callback function. it is called when object is detected
  const onDetected = function (error, results) {
    if (error) {
      console.error(error);
    }
    detections = results;

    detector.detect(video, onDetected);
    if (!loadingScreen.classList.contains("hidden")) {
      loadingScreen.classList.add("hidden");

      if (video.loadedmetadata) {
        base = new Date()
        timer();
      }

      document.querySelector('#canvas-wrapper').classList.remove("loading");
    }
  };

  const showShare = function () {
    shareButton.parentNode.classList.remove("hidden");
    shareButton.addEventListener("click", shareImage, false);
    copyButton.addEventListener("click", copyText, false);
  };

  const shareImage = function () {
    s.saveCanvas(s.canvas, 'THIS IS ' + randomWord.toUpperCase(), 'jpg');
  };

  const copyText = function () {
    const text =  "FOUND TODAYS THISISPERSON.COM WORD IN " + elapsed.toFixed() + " SECONDS";
    navigator.clipboard.writeText(text);
    copyButton.textContent = "COPIED TO CLIPBOARD";
  };

  const timer = function () {
    const now = new Date();
    // elapsed time in seconds
    elapsed = (now - base) / 1000.0;
    timerDIV.innerHTML = elapsed.toFixed();

    if (!detectedWish) setTimeout(timer, 100);
  }
  
};

loadButton.addEventListener("click", loadSketch, false);

function getToday(days) {
  const release = new Date('March 20, 2023 00:00:00');
  const today = new Date();

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = today.getTime() - release.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays - 1;
}

function loadSketch(e){
  worfOfToday = displayNames[getToday()];
  let aiSketch = new p5(sketch);
}
