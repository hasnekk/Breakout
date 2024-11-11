class Stick {
  constructor(width, height, color, x, y, ctx) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;

    this.ctx = ctx;
  }

  draw() {
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = "white";

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);

    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = "transparent";
  }

  update(isLeftArrow, canvasWidth) {
    const delta = isLeftArrow ? -this.width / 4 : this.width / 4;
    let newX = this.x + delta;

    if (newX < 0) {
      newX = 0;
    }

    if (newX + this.width > canvasWidth) {
      newX = canvasWidth - this.width;
    }

    this.x = newX;
  }

  getY() {
    return this.y;
  }

  getX() {
    return this.x;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getXrange() {
    return [this.x, this.x + this.width];
  }
}

export { Stick };
