class Brick {
  static points = 0;

  constructor(
    id,
    width,
    height,
    color,
    x,
    y,
    ctx,
    BRICK_HEIGHT,
    BRICK_WIDTH,
    rowPadding,
    columnPadding
  ) {
    this.id = id;
    this.hit = false;

    this.color = color;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.ctx = ctx;

    this.BRICK_HEIGHT = BRICK_HEIGHT;
    this.BRICK_WIDTH = BRICK_WIDTH;
    this.rowPadding = rowPadding;
    this.columnPadding = columnPadding;
  }

  draw() {
    if (this.hit) {
      return;
    }

    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = "white";

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);

    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = "transparent";
  }

  getY() {
    return this.y;
  }

  getX() {
    return this.x;
  }

  getYrange() {
    return [
      this.y - this.columnPadding / 2,
      this.y + this.BRICK_HEIGHT + this.columnPadding / 2,
    ];
  }

  getXrange() {
    return [
      this.x - this.rowPadding / 2,
      this.x + this.BRICK_WIDTH + this.rowPadding / 2,
    ];
  }

  setHit(value) {
    this.hit = value;

    if (value) {
      Brick.points += 1;
    }
  }

  isHit() {
    return this.hit;
  }
}

export { Brick };
