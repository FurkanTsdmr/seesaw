import { SOUND } from "../scripts/config.js";
import { muteBtn } from "./clickable.js";

const soundWater = new Audio("../sound/dropsound.mp3");
soundWater.preload = "auto";

// users' voice preference
let isMuted = localStorage.getItem(SOUND) === "1";

// Update UI button preference
const updateButton = (muteBtn) => {
  muteBtn.setAttribute("aria-pressed", String(isMuted));
  muteBtn.textContent = isMuted ? "Sound:Off" : "Sound:On";
};

//Users not mute play sound if its not mute
export const playObj = () => {
  if (isMuted) return;
  try {
    soundWater.currentTime = 0;
    soundWater.play();
  } catch {}
};
