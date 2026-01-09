export function createDetectionOverlay(p5Instance) {
  function drawBoundingBox(object) {
    p5Instance.push();
    p5Instance.stroke('#4caf50');
    p5Instance.strokeJoin(p5Instance.ROUND);
    p5Instance.strokeWeight(3);
    p5Instance.noFill();
    p5Instance.rect(object.x, object.y, object.width, object.height);
    p5Instance.pop();
  }

  function drawLabel(object, notConvinced = false) {
    const message = notConvinced
      ? `IS THIS ${object.label.toUpperCase()}?`
      : `THIS IS ${object.label.toUpperCase()}`;

    p5Instance.push();
    p5Instance.noStroke();
    p5Instance.fill(255);
    p5Instance.textAlign(p5Instance.CENTER);
    p5Instance.textStyle(p5Instance.BOLD);
    p5Instance.textSize(18);

    const backgroundTextWidth = p5Instance.textWidth(message);
    p5Instance.fill(0);
    p5Instance.rect(
      object.x + object.width / 2 - backgroundTextWidth / 2,
      object.y + 2,
      backgroundTextWidth + 2,
      20
    );

    p5Instance.fill(255);
    p5Instance.text(message, object.x + object.width / 2, object.y + 18);
    p5Instance.pop();
  }

  return {
    drawBoundingBox,
    drawLabel,
  };
}
