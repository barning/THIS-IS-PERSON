export class Timer {
  constructor(timerElement, wrapperElement) {
    this.wrapperElement = wrapperElement;
    this.defaultMarkup = wrapperElement.innerHTML;
    this.defaultValue = timerElement.textContent;
    this.timerElement = timerElement;

    this.startTimestamp = null;
    this.timeoutId = null;
    this.lastDisplayedValue = null;
    this.elapsedSeconds = 0;
  }

  initializeTimerElement() {
    if (!this.wrapperElement.contains(this.timerElement)) {
      this.wrapperElement.innerHTML = this.defaultMarkup;
      this.timerElement = this.wrapperElement.querySelector('.timer');
    }
  }

  scheduleNextTick() {
    this.timeoutId = window.setTimeout(() => this.updateDisplay(), 100);
  }

  updateDisplay() {
    if (this.startTimestamp === null) {
      return;
    }

    this.elapsedSeconds = (Date.now() - this.startTimestamp) / 1000;
    const nextValue = this.elapsedSeconds.toFixed();

    if (
      this.wrapperElement.contains(this.timerElement) &&
      nextValue !== this.lastDisplayedValue
    ) {
      this.timerElement.textContent = nextValue;
      this.lastDisplayedValue = nextValue;
    }

    this.scheduleNextTick();
  }

  start() {
    this.clear();
    this.initializeTimerElement();
    this.timerElement.textContent = this.defaultValue;
    this.startTimestamp = Date.now();
    this.elapsedSeconds = 0;
    this.lastDisplayedValue = null;
    this.wrapperElement.classList.remove('hidden');
    this.updateDisplay();
  }

  stop() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.startTimestamp !== null) {
      this.elapsedSeconds = (Date.now() - this.startTimestamp) / 1000;
      this.startTimestamp = null;
    }

    return this.elapsedSeconds;
  }

  clear() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  reset() {
    this.clear();
    this.startTimestamp = null;
    this.elapsedSeconds = 0;
    this.wrapperElement.classList.add('hidden');
    this.wrapperElement.innerHTML = this.defaultMarkup;
    this.timerElement = this.wrapperElement.querySelector('.timer');
    this.timerElement.textContent = this.defaultValue;
    this.lastDisplayedValue = null;
  }

  showCompletionMessage(totalSeconds) {
    const message = `FOUND TODAYS WORD IN ${totalSeconds.toFixed()} Seconds`;
    if (this.wrapperElement.textContent !== message) {
      this.wrapperElement.textContent = message;
    }
  }

  getElapsedSeconds() {
    return this.elapsedSeconds;
  }
}
