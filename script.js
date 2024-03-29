import { updateGround, setupGround } from "./ground.js";
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js";
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector("[data-world]");
const scoreElem = document.querySelector("[data-score]");
const startScreenElem = document.querySelector("[data-start-screen]");

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handleStart, { once: true });
document.addEventListener("touchstart", handleStart, { once: true });

let lastTime;
let speedScale;
let score;
function update(time) {
  if (document.hasFocus()) {
    // code to be run every 7 seconds, but only when tab is focused

    if (lastTime == null) {
      lastTime = time;
      window.requestAnimationFrame(update);
      return;
    }
    const delta = time - lastTime;

    updateGround(delta, speedScale);
    updateDino(delta, speedScale);
    updateCactus(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);

    if (checkLose()) return handleLose();
    lastTime = time;
    window.requestAnimationFrame(update);
  } else return handleLose();
}

function checkLose() {
  const dinoRect = getDinoRect();
  return getCactusRects().some((rect) => isCollision(rect, dinoRect));
}
//20 10 -30 10
function isCollision(rect1, rect2) {
  return (
    rect1.left + 15 < rect2.right &&
    rect1.top + 10 < rect2.bottom &&
    rect1.right - 30 > rect2.left &&
    rect1.bottom + 10 > rect2.top
  );
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreElem.textContent = Math.floor(score);
}

function handleStart() {
  lastTime = null;
  speedScale = 1;
  score = 0;
  setupGround();
  setupDino();
  setupCactus();
  startScreenElem.classList.add("hide");
  window.requestAnimationFrame(update);
}

function handleLose() {
  setDinoLose();
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    document.addEventListener("touchstart", handleStart, { once: true });
    startScreenElem.classList.remove("hide");
  }, 100);
}

function setPixelToWorldScale() {
  let worldToPixelScale;
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale * 1.2}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale * 1.3}px`;
}

//Добавить handlePause пока что при скрытии браузера игра делает handleLose
