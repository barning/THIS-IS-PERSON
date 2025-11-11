export class ShareControls {
  constructor(container, { copyButton, downloadButton }, clipboard = navigator.clipboard) {
    this.container = container;
    this.copyButton = copyButton;
    this.downloadButton = downloadButton;
    this.clipboard = clipboard;
    this.defaultCopyLabel = copyButton.textContent;

    this.buildShareText = () => '';
    this.downloadAction = () => {};

    this.handleCopy = this.handleCopy.bind(this);
    this.handleDownload = this.handleDownload.bind(this);

    this.downloadButton.addEventListener('click', this.handleDownload);
    this.copyButton.addEventListener('click', this.handleCopy);
  }

  handleDownload() {
    this.downloadAction();
  }

  async handleCopy() {
    const text = this.buildShareText();
    if (!text || !this.clipboard || typeof this.clipboard.writeText !== 'function') {
      return;
    }

    try {
      await this.clipboard.writeText(text);
      this.copyButton.textContent = 'COPIED TO CLIPBOARD';
    } catch (error) {
      console.error('Failed to copy the share message to the clipboard.', error);
    }
  }

  show({ onDownload, getShareText }) {
    this.downloadAction = onDownload;
    this.buildShareText = getShareText;
    this.container.classList.remove('hidden');
  }

  hide() {
    this.container.classList.add('hidden');
    this.copyButton.textContent = this.defaultCopyLabel;
    this.buildShareText = () => '';
    this.downloadAction = () => {};
  }
}
