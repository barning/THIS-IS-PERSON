
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

let video = null; 
let detector = null; 
let detections = []; 
let randomWord = null;
let prompt = "THINKING";
let detectedWish = false;

const shareButton = document.querySelector(".share button");


function preload() {
  detector = ml5.objectDetector('cocossd');
  console.log('detector object is loaded');
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('canvas-wrapper');

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  randomWord = random(displayNames).toUpperCase();
  prompt = "I WANT TO SEE " + randomWord;

  video.elt.addEventListener('loadeddata', function () {
    if (video.elt.readyState >= 2) {
      detector.detect(video, onDetected);

      const loadingDiv = document.querySelector('.full-screen');
      loadingDiv.classList.add('hidden');
    }
  });
}

function draw() {
  if (!video) return;

  image(video, 0, 0);

  for (let i = 0; i < detections.length; i++) {
    checkDetections(detections[i]);
  }

  textSize(32);
  textAlign(CENTER);
  noStroke();
  let backgroundTextWidth = textWidth(prompt) + 10;
  fill(0);
  rect(width / 2 - backgroundTextWidth / 2, height - 64, backgroundTextWidth, 32 + 10);
  fill(255);
  text(prompt, width / 2, height - 30);

  if (detectedWish) {
    noLoop();
  }
}

function drawBoundingBox(object) {
  stroke("#4caf50");
  strokeJoin(ROUND);
  strokeWeight(3);
  noFill();

  rect(object.x, object.y, object.width, object.height);
}

function drawLabel(object) {
  noStroke();
  fill(255);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(18);

  let backgroundTextWidth = textWidth("THIS IS " + object.label.toUpperCase());
  fill(0);
  rect(object.x + object.width / 2 - backgroundTextWidth/2, object.y + 2 , backgroundTextWidth+2, 20);

  fill(255);

  text("THIS IS " + object.label.toUpperCase(), object.x + object.width/2, object.y + 18);
}

function checkDetections(object) {
  if (object.label === randomWord.toLowerCase()) {
    drawBoundingBox(object);
    showShare();

    let oldWord = randomWord;
    let conf = round(object.confidence * 100);
    prompt = conf + "% SURE, THATS " + oldWord;
    detectedWish = true;
  } else {
    drawLabel(object);
  }
}

// callback function. it is called when object is detected
function onDetected(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;

  detector.detect(video, onDetected);
}

function showShare() {
  console.log(shareButton);
  shareButton.parentNode.classList.remove("hidden");
  shareButton.addEventListener("click", shareImage, false);
}

function shareImage() {
  saveCanvas(canvas, 'THIS IS ' + randomWord.toUpperCase(), 'jpg');
}


