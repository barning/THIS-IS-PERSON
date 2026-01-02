import { DISPLAY_NAMES } from '../config/constants.js';
import { getWordOfToday } from '../services/dailyWordService.js';
import { bindDialogTriggers } from '../ui/dialogs.js';
import { ShareControls } from '../ui/shareControls.js';
import { renderStatistics } from '../ui/statistics.js';
import { Timer } from '../ui/timer.js';
import { createSketch } from '../sketch/createSketch.js';

export class GameController {
  constructor({ documentRef = document, url = window.location.href } = {}) {
    this.document = documentRef;
    this.url = url;

    this.loadButton = this.document.querySelector('.load');
    this.loadingScreen = this.document.querySelector('.loading-screen');
    this.timerWrapper = this.document.querySelector('.timer__wrapper');
    this.timerElement = this.document.querySelector('.timer');
    this.shareContainer = this.document.querySelector('.share');
    this.copyButton = this.document.querySelector('.share__friends');
    this.downloadButton = this.document.querySelector('.share__image');
    this.dialogButtons = this.document.querySelectorAll('[data-open]');
    this.howtoDialog = this.document.querySelector('#howto');
    this.statisticsDialog = this.document.querySelector('#statistics');
    this.creditsDialog = this.document.querySelector('#credits');
    this.statisticsList = this.statisticsDialog?.querySelector('.statistics__list') ?? null;
    this.canvasWrapper = this.document.querySelector('#canvas-wrapper');

    this.timer = this.timerElement && this.timerWrapper
      ? new Timer(this.timerElement, this.timerWrapper)
      : null;

    this.shareControls = this.shareContainer && this.copyButton && this.downloadButton
      ? new ShareControls(this.shareContainer, {
          copyButton: this.copyButton,
          downloadButton: this.downloadButton,
        })
      : null;

    this.p5Instance = null;
    this.startGame = this.startGame.bind(this);
  }

  initialize() {
    this.bindDialogTriggers();
    this.bindLoadButton();
  }

  bindDialogTriggers() {
    if (!this.dialogButtons.length) {
      return;
    }

    bindDialogTriggers(
      this.dialogButtons,
      {
        howto: this.howtoDialog,
        credits: this.creditsDialog,
        statistics: this.statisticsDialog,
      },
      () => {
        if (this.statisticsList) {
          renderStatistics(DISPLAY_NAMES, this.statisticsList);
        }
      }
    );
  }

  bindLoadButton() {
    if (!this.loadButton || !this.timer || !this.shareControls) {
      return;
    }

    this.loadButton.addEventListener('click', this.startGame);
  }

  startGame() {
    if (!this.timer || !this.shareControls || !this.canvasWrapper) {
      return;
    }

    if (this.p5Instance) {
      this.p5Instance.remove();
      this.p5Instance = null;
    }

    this.timer.reset();
    this.shareControls.hide();
    this.canvasWrapper.classList.add('loading');

    const wordOfToday = getWordOfToday();
    const sketchFactory = createSketch({
      wordOfToday,
      timer: this.timer,
      shareControls: this.shareControls,
      elements: {
        loadButton: this.loadButton,
        loadingScreen: this.loadingScreen,
        canvasWrapper: this.canvasWrapper,
      },
      url: this.url,
    });

    this.p5Instance = new p5(sketchFactory);
  }
}
