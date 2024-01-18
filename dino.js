import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const dinoElem = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.46;
const GRAVITY = 0.0017;
const DINO_FRAME_COUNT = 5;
const FRAME_TIME = 100;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;

// let isDucking;

export function setupDino() {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElem, "--bottom", 12);
  document.removeEventListener("keydown", onJump);
  document.addEventListener("keydown", onJump);

  document.removeEventListener("touchstart", onJump);
  document.addEventListener("touchstart", onJump);
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}

export function setDinoLose() {
  dinoElem.src = "imgs/dino-lose.png";
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = `imgs/dino-stationary.png`;
    return;
  }

  // if (isDucking) {
  //   dinoElem.src =''
  // }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta);

  if (getCustomProperty(dinoElem, "--bottom") <= 12) {
    setCustomProperty(dinoElem, "--bottom", 12);
    isJumping = false;
  }

  yVelocity -= GRAVITY * delta;
}

function onJump(e) {
  // if (e.code !== "Space" || isJumping) return;
  if (isJumping) return;
  yVelocity = JUMP_SPEED;
  isJumping = true;
}
