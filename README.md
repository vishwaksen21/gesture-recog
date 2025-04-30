# GestureSim

Simulate and visualize ARM Assembly-based gesture recognition on virtual sensor data using Next.js and Shadcn UI.

## Development

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Deployment to Firebase Hosting

This project is configured for deployment to Firebase Hosting using its Web Frameworks support (App Hosting).

**Prerequisites:**

*   [Node.js](https://nodejs.org/) (version specified in `package.json`)
*   Firebase Account: [https://firebase.google.com/](https://firebase.google.com/)
*   Firebase CLI installed and authenticated:
    ```bash
    npm install -g firebase-tools
    firebase login
    ```

**Steps:**

1.  **Create a Firebase Project:** If you don't have one already, create a project in the [Firebase Console](https://console.firebase.google.com/).
2.  **Configure Project ID:**
    *   Open the `.firebaserc` file in the project root.
    *   Replace `"your-firebase-project-id"` with your actual Firebase Project ID. You can find this in your Firebase Project Settings -> General tab.
3.  **Build the Project:**
    ```bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    ```
4.  **Deploy:**
    ```bash
    firebase deploy --only hosting
    ```
    This command uses the configuration in `firebase.json`. The Firebase CLI detects Next.js, builds necessary cloud functions, and deploys static assets and functions to Firebase Hosting.

5.  **Visit Your Site:** Once deployment is complete, the Firebase CLI will output the URL of your deployed application.

## Project Overview

*   **Frontend:** Next.js (App Router), React, TypeScript
*   **UI:** Shadcn/ui, Tailwind CSS
*   **Styling:** Custom theme in `src/app/globals.css`
*   **Simulation Logic:** Placeholder JavaScript functions in `src/app/page.tsx` mimicking gesture detection.
*   **Assembly Code:** Conceptual ARM Assembly representation displayed in the UI (`src/app/page.tsx`).
*   **Components:** Reusable UI components in `src/components/`.

## Key Features

*   **Data Simulation:** Generate random or specific gesture sensor data (accelerometer X, Y, Z).
*   **Conceptual Inference:** Displays example ARM Assembly code representing the inference logic.
*   **Result Visualization:** Shows the generated input data, the conceptual Assembly, the recognized gesture (based on the simulation logic), and simulated performance metrics (execution cycles, memory usage).
*   **Interactive UI:** Select the type of gesture data to generate and run the simulation on demand.
