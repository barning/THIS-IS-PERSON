export function createPromptRenderer(p5Instance) {
  let text = 'THINKING';
  let cachedWidth = 0;
  let lastMeasuredText = null;

  function measureWidth(value) {
    p5Instance.push();
    p5Instance.textSize(32);
    p5Instance.textStyle(p5Instance.BOLD);
    const width = p5Instance.textWidth(value) + 10;
    p5Instance.pop();
    return width;
  }

  function setText(newText) {
    text = newText;
    if (newText !== lastMeasuredText) {
      cachedWidth = measureWidth(newText);
      lastMeasuredText = newText;
    }
  }

  setText(text);

  function draw() {
    p5Instance.push();
    p5Instance.textSize(32);
    p5Instance.textAlign(p5Instance.CENTER);
    p5Instance.textStyle(p5Instance.BOLD);
    p5Instance.noStroke();

    p5Instance.fill(0);
    p5Instance.rect(
      p5Instance.width / 2 - cachedWidth / 2,
      p5Instance.height - 64,
      cachedWidth,
      42
    );

    p5Instance.fill(255);
    p5Instance.text(text, p5Instance.width / 2, p5Instance.height - 30);
    p5Instance.pop();
  }

  return {
    setText,
    draw,
  };
}
