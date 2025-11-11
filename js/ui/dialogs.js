export function bindDialogTriggers(buttons, dialogs, onStatisticsOpen) {
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const { classList } = button;

      if (classList.contains('Howto') && dialogs.howto) {
        dialogs.howto.showModal();
        return;
      }

      if (classList.contains('Credits') && dialogs.credits) {
        dialogs.credits.showModal();
        return;
      }

      if (classList.contains('Statistics') && dialogs.statistics) {
        dialogs.statistics.showModal();
        if (typeof onStatisticsOpen === 'function') {
          onStatisticsOpen();
        }
      }
    });
  });
}
