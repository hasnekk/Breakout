const hitSound = new Audio("../assets/sounds/ballHitSound.mp3");

class Ball {
  constructor(x, y, radius, speed, color, ctx, bricks, stick) {
    this.radius = radius;
    this.ctx = ctx;
    this.color = color;
    this.speed = speed;
    this.x = x;
    this.y = y;

    this.bricks = bricks;
    this.stick = stick;

    // start moving
    this.angle = Math.PI / 4 + Math.random() * (Math.PI / 2);
    this.dx = this.speed * Math.cos(this.angle);
    this.dy = -Math.abs(this.speed * Math.sin(this.angle));
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  update(canvasWidth, canvasHeight) {
    const steps = this.speed / 2; // Number of small steps to take per frame

    /**
     * Insted of making one big move for the ball we make 5 small ones.
     * This is done because when the speed is higher the x and y dont fit inside the correct brick bounds.
     */
    for (let i = 0; i < steps; i++) {
      const nextX = this.x + this.dx / steps;
      const nextY = this.y + this.dy / steps;

      // Hit the wall left or right
      if (nextX + 2 * this.radius >= canvasWidth || nextX <= 0) {
        this.dx = -this.dx;
      }

      // Hit the ceiling
      if (nextY < 0) {
        this.dy = -this.dy;
      }

      // stick missed
      if (nextY >= canvasHeight) {
        document.dispatchEvent(new Event("gameOver"));
        break;
      }

      // hits a brick
      let bricksExist = false;
      for (const brick of this.bricks) {
        if (brick.isHit()) {
          continue;
        }

        bricksExist = true;

        const [brickXStart, brickXEnd] = brick.getXrange();
        const [brickYStart, brickYEnd] = brick.getYrange();

        if (
          nextX >= brickXStart &&
          nextX <= brickXEnd &&
          nextY >= brickYStart &&
          nextY <= brickYEnd
        ) {
          this.dy *= -1;

          // Mark the brick as hit
          brick.setHit(true);
          hitSound.currentTime = 0;
          hitSound.play();

          break; // Stop checking other bricks once one is hit
        }
      }

      if (!bricksExist) {
        document.dispatchEvent(new Event("gameOver"));
        break;
      }

      // Collision with the stick
      const [stickXStart, stickXEnd] = this.stick.getXrange();
      if (
        nextY >= this.stick.getY() &&
        nextX >= stickXStart &&
        nextX <= stickXEnd
      ) {
        this.dy *= -1;
      }

      // Update the ball's position
      this.x += this.dx / steps;
      this.y += this.dy / steps;
    }

    this.draw();
  }
}

export { Ball };
