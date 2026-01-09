import { GameController } from './GameController.js';

export function initializeGame(options) {
  const controller = new GameController(options);
  controller.initialize();
  return controller;
}

export { GameController };
