# Copilot Instructions for THIS IS PERSON

## Project Overview

THIS IS PERSON is a JavaScript web application that challenges users to find specific objects using their camera. The app uses machine learning to detect objects in real-time video streams and verify when users successfully locate the daily target object.

## Technology Stack

- **p5.js** (v1.6.0): Canvas creation and manipulation
- **ml5.js** (v0.12.2): Machine learning library for object detection
- **COCO-SSD**: Pre-trained TensorFlow.js model for object detection
- Pure HTML5, CSS3, and vanilla JavaScript (no build system or frameworks)

## Project Structure

```
.
├── index.html      # Main HTML file with page structure and dialogs
├── script.js       # Main JavaScript with ML detection logic
├── style.css       # Styles with CSS animations
├── img/            # Images and favicon assets
└── README.md       # Project documentation
```

## Key Components

### script.js
- `displayNames`: Array of 88 COCO-SSD detectable objects
- `sketch`: p5.js sketch object containing setup, draw, and detection logic
- `getToday()`: Calculates daily object rotation based on release date
- `onDetected()`: Callback for ML5 object detection results
- `checkDetections()`: Validates detected objects against target with confidence threshold (0.7)

### index.html
- Responsive single-page application
- Three modal dialogs: "How to play", "Credits", "Statistics"
- Canvas wrapper for video feed and object detection overlay
- Share functionality for results

### style.css
- CSS custom properties for theming (--background, --primary, --secondary, --highlight)
- Animations: shake (button hover), heartbeat (loading text)
- Mobile-responsive design with media queries at 640px breakpoint

## Development Guidelines

### Code Style
- Use `const` and `let` (no `var`)
- ES6+ syntax is acceptable
- Single quotes for strings in JavaScript
- Descriptive variable names (e.g., `detectedWish`, `randomWord`)
- Comments are minimal; prefer clear naming

### Important Conventions
- Confidence threshold of 0.7 (70%) required for object detection confirmation
- LocalStorage used for statistics persistence (key: object name in uppercase)
- Timer precision: displays as whole seconds to user, stores with decimal precision
- Daily object rotation based on days since March 20, 2023 release date

### Browser APIs Used
- `navigator.mediaDevices.getUserMedia()` (via p5.js createCapture)
- `localStorage` for statistics
- `navigator.clipboard` for share functionality
- `<dialog>` HTML element for modals

### Testing Considerations
- No automated test suite exists
- Manual testing requires:
  - Camera access permission
  - Physical objects matching COCO-SSD detection classes
  - Testing across different browsers for camera/dialog support
- Confidence threshold testing may require adjusting environment/lighting

### Making Changes
- **No build step required** - changes to HTML/CSS/JS are immediately effective
- Open `index.html` in a browser with a local web server for testing
- Consider camera permissions when testing locally vs. HTTPS deployment

### Accessibility
- Ensure any new UI elements have appropriate ARIA labels
- Maintain keyboard navigability for interactive elements
- Dialog elements use native HTML `<dialog>` with form method="dialog" for closing

### Performance
- Object detection runs continuously via callbacks, not intervals
- Drawing optimization: `noLoop()` called when object is detected
- Canvas size constraints: max 640x480 for performance

## Common Tasks

### Adding New Objects
Modify the `displayNames` array in `script.js` - limited to COCO-SSD's 80 object classes.

### Modifying Detection Logic
Edit `checkDetections()` function in `script.js`. Current confidence threshold is 0.7.

### Styling Changes
All styles are in `style.css`. Uses CSS custom properties for easy theming.

### Adding New Dialogs
1. Add `<dialog>` element in `index.html`
2. Add navigation button with `data-open` attribute
3. Add case in dialog button click handler in `script.js`

## Deployment

The application is designed to be hosted as static files. No server-side code or build process required. Requires HTTPS for camera access in production.

Current live deployment: https://www.thisisperson.com
GitHub Pages: https://barning.github.io/THIS-IS-PERSON/
