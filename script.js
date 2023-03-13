
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


function preload() {
  detector = ml5.objectDetector('cocossd');
  console.log('detector object is loaded');
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  video.elt.addEventListener('loadeddata', function () {
    if (video.elt.readyState >= 2) {
      detector.detect(video, onDetected);

      randomWord = random(displayNames).toUpperCase();

      prompt = "I WANT TO SEE " + randomWord;

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
    drawResult(detections[i]);
  }

  textSize(32);
  textAlign(CENTER);
  let backgroundTextWidth = textWidth(prompt) + 10;
  fill(0);
  rect(width / 2 - backgroundTextWidth / 2, height - 64, backgroundTextWidth, 32 + 10);
  fill(255);
  text(prompt, width / 2, height - 30);

  if (detectedWish) {
    noLoop();
  }
}

function drawResult(object) {
  drawBoundingBox(object);
  drawLabel(object);
}

function drawBoundingBox(object) {
  stroke(255, 255, 255, 100);
  strokeJoin(ROUND);
  strokeWeight(3);
  noFill();

  rect(object.x, object.y, object.width, object.height);
}

function drawLabel(object) {
  noStroke();
  fill(255);
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(18);

  text(object.label.toUpperCase(), object.x + 5, object.y + 18);
}

function checkDetections(object) {
  if (object.label === randomWord.toLowerCase()) {
    let oldWord = randomWord;
    let conf = round(object.confidence * 100);
    prompt = conf + "% SURE, THATS A " + oldWord;
    detectedWish = true;
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

