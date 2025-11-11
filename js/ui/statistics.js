export function renderStatistics(displayNames, statisticsListElement) {
  if (!statisticsListElement) {
    return;
  }

  statisticsListElement.textContent = '';
  const fragment = document.createDocumentFragment();

  displayNames.forEach((name) => {
    const stat = localStorage.getItem(name.toUpperCase());
    if (!stat) {
      return;
    }

    const listItem = document.createElement('li');
    listItem.textContent = `${name.toUpperCase()} found in ${stat} Seconds`;
    fragment.appendChild(listItem);
  });

  statisticsListElement.appendChild(fragment);
}
