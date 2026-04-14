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

import { ANGLE, TORQUE, COLORS } from "./config.js";
// Objects
let objects = [];
let nextWeightValue = 1;
let previewElement = null;

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

// Colors
function getColors(weight) {
  return COLORS[weight - 1] || COLORS[0];
}
// Size Weight
function getObjectSize(weight) {
  const minSize = 28;
  const maxSize = 44;
  return minSize + ((weight - 1) / 9) * (maxSize - minSize);
}
// Weight Div Element
function createObj(weight) {
  const element = document.createElement("div");
  element.className = "weight-obj";
  element.textContent = `${weight} kg`;

  const size = getObjectSize(weight);
  element.style.width = `${size} px`;
  element.style.height = `${size} px`;
  element.style.backgroundColor = getColors(weight);

  return element;
}
console.log(createObj(5));
