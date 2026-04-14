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
/*
// Access Query -> True
// console.log("Can i access ? ", leftWeight ? "true" : "false");
// Click Query -> True
// if (clickArea) {
//   clickArea.addEventListener("click", (e) => {
//     console.log(
//       "Access Click Func.",
//       e.clientX,
//       e.clientY,
//       clickArea ? "true" : "false",
//     );
//   });
// }
*/

// Objects
const objects = [];
let nextWeightValue = Math.floor(Math.random() * 10) + 1;

// Random Weight
function getRandomWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

console.log(getRandomWeight());
