import { useEffect, useRef, useState } from "react";
import ThreeScene from "./ThreeScene";
import { MATERIAL_TYPES } from "./materials";
import "./App.css";

function App() {
  const canvasRef = useRef();

  const [mode, setMode] = useState("basic");
  const [selectedFace, setSelectedFace] = useState(0);
  const [faceMaterials, setFaceMaterials] = useState(Array(6).fill("wood"));
  const [faceRoughness, setFaceRoughness] = useState(Array(6).fill(0.7));
  const [faceMetalness, setFaceMetalness] = useState(Array(6).fill(0.0));
  const [lightPosition, setLightPosition] = useState({ x: 3, y: 5, z: 2 });
  const [lightIntensity, setLightIntensity] = useState(1);

  function updateFaceMaterial(mat) {
    const updated = [...faceMaterials];
    updated[selectedFace] = mat;
    setFaceMaterials(updated);
  }

  function updateFaceRoughness(value) {
    const updated = [...faceRoughness];
    updated[selectedFace] = value;
    setFaceRoughness(updated);
  }

  function updateFaceMetalness(value) {
    const updated = [...faceMetalness];
    updated[selectedFace] = value;
    setFaceMetalness(updated);
  }

  function onFaceSelect(faceIndex) {
    setSelectedFace(faceIndex);
    ThreeScene.rotateCameraToFace(faceIndex); // <-- NEW
  }

  // Create Three.js scene only once
  useEffect(() => {
    if (!canvasRef.current) return;
    ThreeScene.init(canvasRef.current);
  }, []);

  // Update materials whenever UI changes
  useEffect(() => {
    ThreeScene.updateMaterials(
      mode,
      faceMaterials,
      faceRoughness,
      faceMetalness
    );
  }, [mode, faceMaterials, faceRoughness, faceMetalness]);

  // Update light whenever properties change
  useEffect(() => {
    ThreeScene.updateLight(lightPosition, lightIntensity);
  }, [lightPosition, lightIntensity]);

  return (
    <>
      <div className="ui-container">
        {/* UI Panel */}
        <div className="ui-panel">
          <h2>Cube Controls</h2>

          <label>Render Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="basic">Basic</option>
            <option value="pbr">PBR</option>
          </select>

          <h3>Face Settings</h3>

          <label>Select Face</label>
          <select
            value={selectedFace}
            onChange={(e) => onFaceSelect(Number(e.target.value))}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <option key={i} value={i}>
                Face {i}
              </option>
            ))}
          </select>

          <label>Material</label>
          <select
            value={faceMaterials[selectedFace]}
            onChange={(e) => updateFaceMaterial(e.target.value)}
          >
            {Object.keys(MATERIAL_TYPES).map((mat) => (
              <option key={mat} value={mat}>
                {mat}
              </option>
            ))}
          </select>

          {mode === "pbr" && (
            <>
              <label>Roughness: {faceRoughness[selectedFace].toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={faceRoughness[selectedFace]}
                onChange={(e) =>
                  updateFaceRoughness(parseFloat(e.target.value))
                }
              />

              <label>Metalness: {faceMetalness[selectedFace].toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={faceMetalness[selectedFace]}
                onChange={(e) =>
                  updateFaceMetalness(parseFloat(e.target.value))
                }
              />
            </>
          )}

          <h3>Lighting</h3>

          <label>Light X: {lightPosition.x.toFixed(1)}</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={lightPosition.x}
            onChange={(e) =>
              setLightPosition({
                ...lightPosition,
                x: parseFloat(e.target.value),
              })
            }
          />

          <label>Light Y: {lightPosition.y.toFixed(1)}</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={lightPosition.y}
            onChange={(e) =>
              setLightPosition({
                ...lightPosition,
                y: parseFloat(e.target.value),
              })
            }
          />

          <label>Light Z: {lightPosition.z.toFixed(1)}</label>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={lightPosition.z}
            onChange={(e) =>
              setLightPosition({
                ...lightPosition,
                z: parseFloat(e.target.value),
              })
            }
          />

          <label>Light Intensity: {lightIntensity.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={lightIntensity}
            onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
          />
        </div>
        <div className="canvas-container">
          <canvas className="canvas" ref={canvasRef} />
        </div>
      </div>
    </>
  );
}

export default App;
