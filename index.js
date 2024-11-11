import { Stick } from "./src/stick.js";
import { Brick } from "./src/brick.js";
import { Ball } from "./src/ball.js";

// constants
const STICK_COLOR = "red";
const STICK_HEIGHT = 15;
const NUM_OF_BRICK_ROWS = 4;
const BRICK_WIDTH = 70;
const BRICK_HEIGHT = 20;
const BRICK_COLORS = ["purple", "pink", "blue", "yellow"];
const BALL_RADIUS = 10;
const BALL_COLOR = "white";
const LOCAL_STORAGE_MAX_POINTS_KEY = "maxPoints";
const BALL_SPEED = 13;

// so the bricks aren`t glued to the wall and each other
const CANVAS_BRICK_PADDING_SIDES = 25;
const CANVAS_BRICK_PADDING_FROM_TOP = 100;
const CANVAS_BRICK_ROW_PADDING = 5;
const CANVAS_BRICK_COLUMN_PADDING = 5;

// global value
let brickId = 0;
let maxPoints;
let gameFinished = false;

var canvas;
var ctx;

var stick;
var bricks = [];
var ball;

window.onload = startGame;

function startGame() {
  // read max points
  maxPoints = localStorage.getItem(LOCAL_STORAGE_MAX_POINTS_KEY)
    ? Number(localStorage.getItem(LOCAL_STORAGE_MAX_POINTS_KEY))
    : 0;

  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");

  // style the canvas
  fillCanvas();

  // create the stick
  const stickWidth = canvas.width / 5;
  stick = new Stick(
    stickWidth,
    STICK_HEIGHT,
    STICK_COLOR,
    canvas.width / 2 - stickWidth / 2,
    canvas.height - 100,
    ctx
  );

  // calculate the number of bricks per row
  const remainingWidth = canvas.width - CANVAS_BRICK_PADDING_SIDES * 2;
  const numOfBricksPerRow = Math.floor(
    (remainingWidth + CANVAS_BRICK_ROW_PADDING) /
      (BRICK_WIDTH + CANVAS_BRICK_ROW_PADDING)
  );

  const offsetX =
    (remainingWidth -
      numOfBricksPerRow * BRICK_WIDTH -
      (numOfBricksPerRow - 1) * CANVAS_BRICK_ROW_PADDING) /
      2 +
    CANVAS_BRICK_PADDING_SIDES;

  // create the bricks
  for (let row = 0; row < NUM_OF_BRICK_ROWS; row++) {
    const colorIndex = row % BRICK_COLORS.length;
    const color = BRICK_COLORS[colorIndex];

    const brickY =
      CANVAS_BRICK_PADDING_FROM_TOP +
      row * CANVAS_BRICK_COLUMN_PADDING +
      row * BRICK_HEIGHT;

    for (let i = 0; i < numOfBricksPerRow; i++) {
      const brickX = offsetX + i * CANVAS_BRICK_ROW_PADDING + i * BRICK_WIDTH;

      bricks.push(
        new Brick(
          brickId,
          BRICK_WIDTH,
          BRICK_HEIGHT,
          color,
          brickX,
          brickY,
          ctx,
          BRICK_HEIGHT,
          BRICK_WIDTH,
          CANVAS_BRICK_ROW_PADDING,
          CANVAS_BRICK_COLUMN_PADDING
        )
      );
      brickId++;
    }
  }

  // create the ball
  const ballX = stick.getX() + stick.getWidth() / 2;
  const ballY = stick.getY() - BALL_RADIUS;
  ball = new Ball(
    ballX,
    ballY,
    BALL_RADIUS,
    BALL_SPEED,
    BALL_COLOR,
    ctx,
    bricks,
    stick
  );

  // display points
  displayPoints();

  // set listeners
  setListeners();

  // starts the ball
  animate();
}

function animate() {
  if (gameFinished) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fillCanvas();
  stick.draw();
  bricks.forEach((brick) => brick.draw());

  displayPoints();

  ball.update(canvas.width, canvas.height);

  // Continue the loop
  requestAnimationFrame(animate);
}

function fillCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function displayPoints() {
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";

  ctx.fillStyle = "white";
  ctx.fillText("Points: " + Brick.points, canvas.width - 20, 20);

  ctx.fillStyle = "grey";
  ctx.fillText("Max Points: " + maxPoints, canvas.width - 20, 50);
}

function setListeners() {
  document.addEventListener("gameOver", gameOver);
  document.addEventListener("keydown", onArrowKeys);
}

function onArrowKeys(event) {
  let isLeftArrow = event.key === "ArrowLeft";
  let isRightArrow = event.key === "ArrowRight";

  if (!isLeftArrow && !isRightArrow) {
    return;
  }

  stick.update(isLeftArrow, canvas.width);
}

function gameOver() {
  // stop animate function
  gameFinished = true;

  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "center";

  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(
    "Points made: " + Brick.points,
    canvas.width / 2,
    canvas.height / 2 + 70
  );

  if (Brick.points > maxPoints) {
    ctx.fillText("NEW HIGHSCORE", canvas.width / 2, canvas.height / 2 + 120);

    localStorage.setItem(LOCAL_STORAGE_MAX_POINTS_KEY, Brick.points);
  }

  // reset
  Brick.points = 0;
  bricks = [];
  ball = undefined;
  stick = undefined;
  brickId = 0;

  // Create and display the restart button
  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart Game";
  restartButton.style.position = "absolute";
  restartButton.style.top = "80%";
  restartButton.style.left = "50%";
  restartButton.style.transform = "translate(-50%, -50%)";
  restartButton.style.fontSize = "20px";
  restartButton.style.padding = "10px 20px";
  restartButton.style.cursor = "pointer";

  document.body.appendChild(restartButton);

  restartButton.addEventListener("click", function () {
    restartButton.remove();
    gameFinished = false;
    startGame();
  });
}
