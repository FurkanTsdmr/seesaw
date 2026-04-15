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

// Position element on  screen
function placeObj(element, side, distance) {
  const offset = side === "left" ? -distance : distance;
  element.style.left = "50%";
  element.style.transform = `translateX(calc(-50% + ${offset}px))`;
}

// min and max values
const limits = (v, min, max) => Math.min(max, Math.max(min, v));

// Calculate the total weight
const total = () => {
  let left = 0;
  let right = 0;
  for (const obj of state.objects) {
    if (obj.side === "left") left += obj.objeDrop;
    else right += obj.objeDrop;
  }
  return { left, right };
};

// Get click position relative to plank center
function getClickInfo(event, touchElement) {
  const rect = touchElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const diffX = event.clientX - centerX;
  const side = diffX < 0 ? "left" : "right";
  const half = rect.width / 2;
  const distancePx = Math.min(Math.round(Math.abs(diffX)), Math.round(half));
  return { side, distancePx };
}

// Calculate total weight per side
function getTotalWeights() {
  let leftTotal = 0;
  let rightTotal = 0;
  for (const obj of objects) {
    if (obj.side === "left") leftTotal += obj.weight;
    else rightTotal += obj.weight;
  }
  return { leftTotal, rightTotal };
}

// Calculate torque per side (torque = weight × distance)
function getTorques() {
  let leftTorque = 0;
  let rightTorque = 0;
  for (const obj of objects) {
    const torque = obj.weight * obj.distancePx;
    if (obj.side === "left") leftTorque += torque;
    else rightTorque += torque;
  }
  return { leftTorque, rightTorque };
}

// Calculate angle from torques
function calculateAngle(leftTorque, rightTorque) {
  const raw = (rightTorque - leftTorque) / TORQUE;
  return limits(raw, -ANGLE, ANGLE);
}
// Update UI displays
function updateUI(angle) {
  const { leftTotal, rightTotal } = getTotalWeights();
  if (leftWeight) leftWeight.textContent = leftTotal;
  if (rightWeight) rightWeight.textContent = rightTotal;
  if (tiltAngle) tiltAngle.textContent = `${angle.toFixed(1)}°`;
}

// Rotate plank
function rotatePlank(angle) {
  if (plank)
    plank.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}
