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
├── index.html                      # Main HTML file with page structure and dialogs
├── script.js                       # Application entry point (ES6 module)
├── style.css                       # Styles with CSS animations
├── img/                            # Images and favicon assets
├── js/                             # Modular JavaScript code
│   ├── config/
│   │   └── constants.js            # App constants (DISPLAY_NAMES, thresholds)
│   ├── game/
│   │   ├── index.js                # Game initialization entry point
│   │   └── GameController.js       # Main game controller class
│   ├── services/
│   │   └── dailyWordService.js     # Daily word rotation logic
│   ├── sketch/
│   │   ├── createSketch.js         # p5.js sketch factory
│   │   ├── detectionOverlay.js     # Bounding box and label rendering
│   │   └── promptRenderer.js       # On-screen prompt display
│   └── ui/
│       ├── dialogs.js              # Dialog management
│       ├── shareControls.js        # Share/download functionality
│       ├── statistics.js           # Statistics rendering
│       └── timer.js                # Timer class
└── README.md                       # Project documentation
```

## Key Components

### script.js (Entry Point)
- ES6 module that imports and initializes the game via `initializeGame()`
- Uses `DOMContentLoaded` event to start the application

### js/config/constants.js
- `DISPLAY_NAMES`: Array of 85 COCO-SSD detectable objects (exported constant)
- `RELEASE_DATE`: Base date for daily rotation (March 20, 2023)
- `DETECTION_CONFIDENCE_THRESHOLD`: 0.7 (70%) confidence threshold

### js/game/GameController.js
- Main controller class managing game state and UI components
- Instantiates and coordinates Timer, ShareControls, and p5.js sketch
- Handles p5 instance lifecycle (prevents multiple instances)
- Binds event listeners for load button and dialog triggers

### js/services/dailyWordService.js
- `getWordOfToday()`: Calculates daily object based on days since release date
- Uses UTC dates for consistent rotation across timezones
- Modulo arithmetic ensures cycling through all objects

### js/sketch/createSketch.js
- Factory function that creates p5.js sketch with ML5 object detection
- Manages video capture, detector initialization, and detection loop
- Coordinates detection overlay, prompt rendering, timer, and share controls
- `handleDetection()`: Validates detected objects with confidence threshold

### js/sketch/detectionOverlay.js
- `drawBoundingBox()`: Renders green rectangle around detected objects
- `drawLabel()`: Shows object labels (with "IS THIS?" for low confidence)
- Uses p5.js push/pop for state isolation

### js/sketch/promptRenderer.js
- Manages on-screen prompt text ("I WANT TO SEE X", confidence messages)
- Lazy text width measurement (deferred until renderer available)
- Caches width calculations for performance

### js/ui/timer.js
- Timer class with start/stop/reset methods
- Updates display every 100ms, stores elapsed time in seconds
- `showCompletionMessage()`: Displays final time when object found

### js/ui/shareControls.js
- ShareControls class managing download and copy-to-clipboard functionality
- Uses navigator.clipboard API for text sharing
- Callbacks for download action and share text generation

### js/ui/statistics.js
- `renderStatistics()`: Renders localStorage stats as list items
- Reads stored completion times by uppercase object name

### js/ui/dialogs.js
- `bindDialogTriggers()`: Event delegation for dialog open buttons
- Supports callback execution (e.g., rendering statistics on dialog open)

### index.html
- Responsive single-page application
- Three modal dialogs: "How to play", "Credits", "Statistics"
- Canvas wrapper for video feed and object detection overlay
- Loads script.js as ES6 module (`type="module"`)

### style.css
- CSS custom properties for theming (--background, --primary, --secondary, --highlight)
- Animations: shake (button hover), heartbeat (loading text)
- Mobile-responsive design with media queries at 640px breakpoint

## Development Guidelines

### Code Style
- ES6+ modules with import/export syntax
- Use `const` and `let` (no `var`)
- Classes for stateful components (Timer, ShareControls, GameController)
- Factory functions for p5.js sketch and rendering modules
- Descriptive variable names (e.g., `detectedWish`, `wordOfToday`)
- Minimal comments; prefer clear naming and small functions

### Architecture Patterns
- **Dependency injection**: GameController accepts document/URL references for testability
- **Single Responsibility**: Each module handles one concern (timer, dialogs, detection overlay)
- **Factory pattern**: `createSketch()`, `createPromptRenderer()`, `createDetectionOverlay()`
- **Event delegation**: Dialog triggers use shared event handler with class-based routing
- **State isolation**: p5.js rendering uses push/pop to avoid state leakage
- **Lifecycle management**: GameController properly removes previous p5 instances to prevent memory leaks

### Important Conventions
- **Confidence threshold**: 0.7 (70%) defined in `js/config/constants.js` as `DETECTION_CONFIDENCE_THRESHOLD`
- **LocalStorage keys**: Object names in uppercase (e.g., "PERSON", "BICYCLE")
- **Timer precision**: Displays whole seconds to user, stores decimal precision internally
- **Daily rotation**: Based on UTC date to ensure consistency across timezones
- **Module exports**: Use named exports for utilities/classes, default exports for factory functions
- **p5.js instance management**: Always remove previous instance before creating new one
- **Text measurement**: Defer p5.js text width calculations until renderer is initialized

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
- Module structure enables unit testing of individual components:
  - Timer, ShareControls, and GameController are testable classes
  - Factory functions can be tested with mock p5.js instances
  - dailyWordService can be tested with reference dates

### Making Changes
- **No build step required** - ES6 modules work natively in modern browsers
- Test locally with a web server (e.g., `python -m http.server` or VS Code Live Server)
- Consider camera permissions when testing locally vs. HTTPS deployment
- Changes to modules are automatically reflected (no bundling needed)
- When adding new modules, use relative imports with `.js` extension

### Accessibility
- Ensure any new UI elements have appropriate ARIA labels
- Maintain keyboard navigability for interactive elements
- Dialog elements use native HTML `<dialog>` with form method="dialog" for closing

### Performance
- Object detection runs continuously via ML5 callbacks, not intervals
- Drawing optimization: `noLoop()` called when object is detected
- Canvas size constraints: max 640x480 for performance
- Timer uses 100ms polling interval (balances responsiveness and CPU usage)
- Text width caching in promptRenderer avoids repeated measurements
- p5.js push/pop ensures minimal state management overhead

## Common Tasks

### Adding New Objects
Modify the `DISPLAY_NAMES` constant in `js/config/constants.js`. The array currently contains 85 objects from the COCO-SSD model's detectable classes.

### Modifying Detection Logic
Edit the `handleDetection()` function in `js/sketch/createSketch.js`. The confidence threshold is imported from `js/config/constants.js`.

### Adding New UI Components
1. Create a new module in `js/ui/` (e.g., `js/ui/newComponent.js`)
2. Export factory function or class
3. Import and integrate in `GameController.js`
4. Add corresponding HTML elements in `index.html` if needed

### Styling Changes
All styles are in `style.css`. Uses CSS custom properties for easy theming.

### Adding New Dialogs
1. Add `<dialog>` element in `index.html`
2. Add navigation button with `data-open` attribute and appropriate class
3. Update `bindDialogTriggers()` in `js/ui/dialogs.js` to handle new dialog

### Refactoring Sketch Logic
- Extract rendering logic into separate modules in `js/sketch/`
- Use factory functions that accept p5Instance parameter
- Return object with public methods for GameController to call

## Deployment

The application is designed to be hosted as static files. No server-side code or build process required. Requires HTTPS for camera access in production.

Current live deployment: https://www.thisisperson.com
GitHub Pages: https://barning.github.io/THIS-IS-PERSON/
