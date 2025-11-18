Customizable cube.

To run:

- Clone repo
- npm install
- npm run dev

Explanation:

- This app uses three.js rather than React Three Fiber to simulate an environment in which those are the specifications.
- Everything from individual facing to directional lighting is customizable.
- Lighting was made customizable to allow sides away from the light to be properly illuminated if desired.
- React UI uses a sidebar with dropdowns and sliders to customize materials (setting to rather normal or PBR).
- It also uses sliders to increase and decrease metalness and roughness.
- Camera lerps to head-on view of face to allow for a good view of customizing the face itself.
- App implements both mouse drag to rotate camera and WASD + arrows to do the same.
- Architecture wise: the app initializes the canvas in App.js using functions within the ThreeScene.jsx code.
- It also uses useEffects to run functions within ThreeScene on change.

Stretch goals I would have added with more time:

- Face select by click.
- Group select of faces for editing.
- Editing all faces at once.
