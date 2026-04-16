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
import { playObj, muteSoundCheck } from "./sound.js";
import { saveState, loadState, clearState } from "./localStorage.js";
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
  element.textContent = `${weight}kg`;

  const size = getObjectSize(weight);
  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  element.style.backgroundColor = getColors(weight);

  return element;
}

// Position element on  screen
function placeObj(element, side, distance) {
  const offset = side === "left" ? -distance : distance;
  element.style.position = "absolute";
  element.style.top = "-20px";
  element.style.marginBottom = "-30px";
  element.style.left = "50%";
  element.style.transform = `translateX(calc(-50% + ${offset}px))`;
}

// min and max values
const limits = (v, min, max) => Math.min(max, Math.max(min, v));

// Get click position relative to plank center
function getClickInfo(event) {
  const rect = seesawStage.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const diffX = event.clientX - centerX;
  const side = diffX < 0 ? "left" : "right";
  const plankRect = plank.getBoundingClientRect();
  const half = plankRect.width / 2;
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
// Add log entry
function addLog(weight, side, distancePx) {
  if (!logsArea) return;
  const logEntry = document.createElement("div");
  logEntry.className = "log";
  logEntry.textContent = `📦 ${weight}kg → ${side} side, ${distancePx}px`;
  logsArea.prepend(logEntry);
}
// Show preview on hover
function showPreview(event) {
  const { side, distancePx } = getClickInfo(event);
  if (!previewElement) {
    previewElement = createObj(nextWeightValue);
    previewElement.classList.add("preview");
    clickArea.appendChild(previewElement);
  }
  previewElement.textContent = `${nextWeightValue}kg`;
  const size = getObjectSize(nextWeightValue);
  previewElement.style.width = `${size}px`;
  previewElement.style.height = `${size}px`;
  previewElement.style.backgroundColor = getColors(nextWeightValue);
  previewElement.style.top = "-20px";
  placeObj(previewElement, side, distancePx);
}

function hidePreview() {
  if (previewElement) {
    previewElement.remove();
    previewElement = null;
  }
}
// console.log(showPreview());
// Main click handler
function handleClick(event) {
  playObj();
  hidePreview();
  const weight = nextWeightValue;
  const { side, distancePx } = getClickInfo(event);

  // Save to array
  objects.push({ weight, side, distancePx });

  // Create and place object
  const obj = createObj(weight);
  placeObj(obj, side, distancePx);
  obj.style.top = "-100px";
  clickArea.appendChild(obj);
  // Animate
  requestAnimationFrame(() => {
    obj.style.top = "-20px";
  });
  // Add log
  addLog(weight, side, distancePx);

  // Calculate and update
  const { leftTorque, rightTorque } = getTorques();
  const angle = calculateAngle(leftTorque, rightTorque);
  updateUI(angle);
  rotatePlank(angle);

  // Next weight
  updateNextWeight();
  saveState(objects, nextWeightValue);
}
// Reset everything
function resetAll() {
  objects = [];
  if (clickArea) {
    const allObjects = clickArea.querySelectorAll(".weight-obj");
    allObjects.forEach((obj) => obj.remove());
  }
  if (logsArea) logsArea.innerHTML = "";
  updateUI(0);
  rotatePlank(0);
  updateNextWeight();
  clearState();
}

// Event listeners
clickArea.addEventListener("click", handleClick);
clickArea.addEventListener("mouseenter", showPreview);
clickArea.addEventListener("mousemove", showPreview);
clickArea.addEventListener("mouseleave", hidePreview);
resetButton.addEventListener("click", resetAll);

// Initialize
if (muteBtn) {
  muteSoundCheck(muteBtn);
}

function init() {
  const saved = loadState();
  if (saved) {
    objects = saved.objects || [];
    nextWeightValue = saved.nextWeightValue || getRandomWeight();
    if (nextWeight) nextWeight.textContent = `${nextWeightValue} kg`;

    objects.forEach(({ weight, side, distancePx }) => {
      const el = createObj(weight);
      placeObj(el, side, distancePx);
      clickArea.appendChild(el);
    });

    const { leftTorque, rightTorque } = getTorques();
    const angle = calculateAngle(leftTorque, rightTorque);
    updateUI(angle);
    rotatePlank(angle);
  } else {
    updateUI(0);
    rotatePlank(0);
    updateNextWeight();
  }
}
