Seesaw Simulation
A visual seesaw simulation built with pure JavaScript, HTML, and CSS.
Demo
Live Demo
[Website Link](https://seesawfurkan.netlify.app/)
<img width="1507" height="860" alt="image" src="https://github.com/user-attachments/assets/25f448e2-ff1f-4dab-99cb-78ba8da5adbd" />
<img width="604" height="862" alt="image" src="https://github.com/user-attachments/assets/0b3900a4-7674-4289-9c0a-10305fde1098" />

How It Works
When the user clicks on the seesaw plank, a random-weight object (1–10 kg) is dropped at that position. The seesaw recalculates its tilt based on the torque difference between both sides.
Torque formula:
torque = weight × distance from center
angle = clamp((rightTorque - leftTorque) / 10, -30, +30)
Thought Process & Design Decisions
Coordinate System
The biggest challenge was getting click position right. Since the plank rotates with CSS transform, getBoundingClientRect() returns the rotated element's bounds which shifts coordinates. I solved this by reading the center from seesawStage (which never rotates) instead of the plank directly, then capping distancePx with the plank's half-width.
Separation of Concerns
The project is split into focused modules:

app.js — core logic, events, simulation
clickable.js — DOM element references
config.js — constants (colors, angle cap, torque normalization)
localStorage.js — localStorage read/write
sound.js — mute toggle and drop sound

Object Positioning
Objects are children of #touch (clickArea) which sits inside the plank. Position is calculated as left: 50% with a translateX offset so objects always align relative to the plank center regardless of tilt.
Preview on Hover
Before clicking, a ghost preview of the next object follows the mouse along the plank so the user can see where it will land.
Trade-offs & Limitations

Distance is stored in pixels at the time of click. If the container is resized, the visual position of existing objects may drift slightly from their stored positions.
The drop animation is a simple top transition. A physics-based fall was out of scope for this challenge.
Sound requires user interaction before playing due to browser autoplay policy — this is handled gracefully with a try/catch.

AI Usage
AI tools were used for debugging and syntax help only — specifically for fixing the coordinate offset issue with the rotated plank and catching a missing \* operator in a size calculation. All logic, structure, and decisions were written and reasoned through independently.
Features

Click on plank to drop weighted objects
Smooth tilt animation based on torque
Hover preview of next object
Weight display per side + tilt angle
Drop sound with mute toggle
Drop history log
State persisted in localStorage across page refreshes
Reset button
