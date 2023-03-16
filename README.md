# Show Me Person!

This is a web application that uses [ml5.js](https://ml5js.org/), [p5js](https://p5js.org/) and [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) model to detect objects in real-time through the webcam of the user. The app randomly selects an object and the user's goal is to make the application detect this specific object.

How to use the application
--------------------------

1.  Open the application in a web browser that supports the getUserMedia API (e.g. Chrome or Firefox).
2.  Allow the application to access your camera when prompted.
3.  The application will randomly select an object from the list of objects and prompt you to find it.
4.  Move the camera around until the object is detected in the video stream.
5.  Once the object is detected, a bounding box will be drawn around it and a message will be displayed indicating that the object has been found.

Code Overview
-------------

The code is written in JavaScript and uses the p5.js library for creating and manipulating the canvas element. The ml5.js library is used for object detection using the COCO-SSD model.

The code defines a list of object names to detect, initializes the video stream, and starts the object detection process using ml5.js. Once an object is detected, it is drawn on the canvas with a bounding box, and a message is displayed indicating that the object has been found. The code also uses a callback function to continue object detection after each detection is made.
