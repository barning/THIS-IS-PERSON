# Show-me-Person

This is a simple web application that uses [ml5.js](https://ml5js.org/) library to detect objects in a video stream from the user's camera. The application randomly picks an object from a pre-defined list of object names and then prompts the user to find that object. Once the object is detected in the video stream, the application draws a bounding box around it and displays a message indicating that the object has been found.

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
