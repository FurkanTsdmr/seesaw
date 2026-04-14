import {
  leftWeight,
  nextWeight,
  tiltAngle,
  rightWeight,
  plank,
  clickArea,
  seesawStage,
  resetButton,
  muteBtn,
  logsArea,
} from "./clickable.js";

// Objects
const objects = [];
let nextWeightValue = Math.floor(Math.random() * 10) + 1;

// Random Weight
function getRandomWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

// The next weight to be placed on the seesaw
function updateNextWeight() {
  nextWeightValue = getRandomWeight();
  if (nextWeight) {
    nextWeight.textContent = `${nextWeightValue} kg`;
  }
  return nextWeightValue;
}
