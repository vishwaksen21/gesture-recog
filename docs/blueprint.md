# **App Name**: GestureSim

## Core Features:

- Data Simulation: Simulate accelerometer data input for gesture recognition.
- Assembly Inference: Implement gesture recognition logic in ARM Assembly based on a pre-trained model.
- Result Output: Display the recognized gesture and simulation metrics in a simple UI.

## Style Guidelines:

- Primary color: Dark gray (#333) for a technical feel.
- Secondary color: Light gray (#f0f0f0) for content areas.
- Accent: Teal (#008080) to highlight the recognized gesture and key metrics.
- Simple, single-column layout optimized for displaying code and results.
- Use minimalist icons to represent different gestures.

## Original User Request:
Project Title:
Simulated Edge AI – Assembly-Based Gesture Recognition on a Virtual ARM Cortex-M Microcontroller

		🔹 Objective:
Develop a simulation-based Edge AI project where a basic machine learning model (e.g., for gesture recognition) is manually implemented in ARM Assembly language and executed in a simulated microcontroller environment. The focus is on demonstrating how AI inference can run on resource-constrained embedded systems, without requiring actual hardware.

		🔹 Project Scope:
No physical devices; instead, use simulated sensor data and a virtual ARM Cortex-M environment (e.g., QEMU or Keil emulator).

Train a simple ML model externally (e.g., using Python).

Manually convert the model into Assembly logic.

Run inference using Assembly code simulating microcontroller behavior.

		🔹 Project Workflow:
Simulated Sensor Data Generation

Generate or use a dataset that mimics 3-axis accelerometer readings for different gestures (e.g., up/down, left/right).

Example: CSV file with labeled readings: [accel_x, accel_y, accel_z, label]

Model Training

Train a simple ML model in Python (e.g., decision tree or logistic regression).

Extract the trained model’s logic (threshold-based rules or coefficients) for manual implementation.

Assembly Logic Conversion

Translate the model logic into conditional branching and arithmetic instructions in ARM Assembly.

Optimize the code for memory and speed, keeping microcontroller limitations in mind.

Microcontroller Simulation

Use an emulator such as:

Keil uVision (for STM32 simulation)

QEMU (with Cortex-M target)

Write an Assembly program that:

Loads pre-defined sensor input (from an array in memory or file)

Executes inference logic

Outputs the gesture label (e.g., prints to serial simulation)

Testing and Evaluation

Run the simulated program with different inputs.

Measure accuracy and execution cycles.

Compare against a C implementation or theoretical baseline.

		🔹 Tools & Environment:
Python (for training model and preprocessing data)

Keil uVision or QEMU for ARM Cortex-M simulation

ARMv7-M Assembly Language (for STM32-class CPUs)

Optional: Assembly simulator (like ARMulator or online compilers)

		🔹 Deliverables:
ARM Assembly source code implementing AI logic

Simulated sensor input data files

Python training scripts

Evaluation report (accuracy, memory usage, instruction count)

Screenshots or videos of simulation output

		🔹 Learning Outcomes:
Apply Edge AI principles in a software-only context

Understand how ML inference can be hardcoded in low-level language

Gain hands-on experience in Assembly programming for microcontrollers

Explore model simplification and quantization for embedded deployment

		🔹 Possible Extensions:
Compare Assembly implementation vs C version

Try other model types (e.g., linear classifiers)

Extend to time-series gestures using sliding windows
  