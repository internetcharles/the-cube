import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { MATERIAL_TYPES } from "./materials";

const FACE_VIEWS = [
  new THREE.Vector3(1, 0, 0), // Face 0 → +X
  new THREE.Vector3(-1, 0, 0), // Face 1 → -X
  new THREE.Vector3(0, 1, 0), // Face 2 → +Y
  new THREE.Vector3(0, -1, 0), // Face 3 → -Y
  new THREE.Vector3(0, 0, 1), // Face 4 → +Z
  new THREE.Vector3(0, 0, -1), // Face 5 → -Z
];

const ThreeScene = {
  renderer: null,
  camera: null,
  scene: null,
  cube: null,
  directionalLight: null,
  woodTexture: null,
  glassTexture: null,
  metalTexture: null,
  furTexture: null,
  dragging: false,
  prev: { x: 0, y: 0 },

  init(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);

    this.camera.position.set(4, 4, 4);
    this.camera.lookAt(0, 0, 0);

    this.resize(canvas);

    // Scene
    this.scene = new THREE.Scene();

    // Lighting
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(3, 5, 2);
    this.scene.add(this.directionalLight);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // Load Wood Texture
    const textureLoader = new THREE.TextureLoader();
    this.woodTexture = textureLoader.load("/wood.png");
    this.woodTexture.wrapS = THREE.RepeatWrapping;
    this.woodTexture.wrapT = THREE.RepeatWrapping;

    this.glassTexture = textureLoader.load("/glass.png");
    this.glassTexture.wrapS = THREE.RepeatWrapping;
    this.glassTexture.wrapT = THREE.RepeatWrapping;

    this.metalTexture = textureLoader.load("/metal.png");
    this.metalTexture.wrapS = THREE.RepeatWrapping;
    this.metalTexture.wrapT = THREE.RepeatWrapping;

    this.furTexture = textureLoader.load("/fur.png");
    this.furTexture.wrapS = THREE.RepeatWrapping;
    this.furTexture.wrapT = THREE.RepeatWrapping;

    // Load Environment HDR
    new RGBELoader().load("/env.hdr", (hdr) => {
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = hdr;
    });

    // Create Cube With 6 Materials
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const defaultMaterials = Array(6).fill(
      new THREE.MeshBasicMaterial({ color: "white" })
    );
    this.cube = new THREE.Mesh(geometry, defaultMaterials);
    this.scene.add(this.cube);

    // Drag Rotation
    canvas.addEventListener("pointerdown", (e) => {
      this.dragging = true;
      this.prev.x = e.clientX;
      this.prev.y = e.clientY;
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.prev.x;
      const dy = e.clientY - this.prev.y;
      this.cube.rotation.y += dx * 0.01;
      this.cube.rotation.x += dy * 0.01;
      this.prev.x = e.clientX;
      this.prev.y = e.clientY;
    });

    canvas.addEventListener("pointerup", () => (this.dragging = false));

    this.animate();
    window.addEventListener("resize", () => this.resize(canvas));
  },

  rotateCameraToFace(faceIndex) {
    const dir = FACE_VIEWS[faceIndex].clone().normalize();

    const distance = 5; // distance from cube
    const targetPos = dir.multiplyScalar(distance);

    // Start → End interpolation
    const start = this.camera.position.clone();
    const end = targetPos;

    let t = 0;
    const duration = 0.5; // half second rotation

    const animateTransition = () => {
      t += 0.02;

      // smoothstep easing
      const k = t / duration;
      const smooth = k * k * (3 - 2 * k);

      this.camera.position.lerpVectors(start, end, smooth);
      this.camera.lookAt(0, 0, 0);

      if (t < duration) {
        requestAnimationFrame(animateTransition);
      }
    };

    animateTransition();
  },

  resize(canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  },

  updateMaterials(faceModes, faceMaterials, faceRoughness, faceMetalness) {
    this.cube.material = faceMaterials.map((type, index) => {
      const mat = MATERIAL_TYPES[type];
      if (faceModes[index] === "basic") {
        const basicMat = new THREE.MeshBasicMaterial(mat.basic);
        if (type === "wood" && this.woodTexture) {
          basicMat.map = this.woodTexture;
        } else if (type === "glass" && this.glassTexture) {
          basicMat.map = this.glassTexture;
        } else if (type === "metal" && this.metalTexture) {
          basicMat.map = this.metalTexture;
        } else if (type === "fur" && this.furTexture) {
          basicMat.map = this.furTexture;
        }
        return basicMat;
      } else {
        const pbrProps = { ...mat.pbr };
        pbrProps.roughness = faceRoughness[index];
        pbrProps.metalness = faceMetalness[index];
        if (type === "wood" && this.woodTexture) {
          pbrProps.map = this.woodTexture;
        } else if (type === "glass" && this.glassTexture) {
          pbrProps.map = this.glassTexture;
        } else if (type === "metal" && this.metalTexture) {
          pbrProps.map = this.metalTexture;
        } else if (type === "fur" && this.furTexture) {
          pbrProps.map = this.furTexture;
        }
        return new THREE.MeshStandardMaterial(pbrProps);
      }
    });
  },

  updateLight(position, intensity) {
    if (!this.directionalLight) return;
    this.directionalLight.position.set(position.x, position.y, position.z);
    this.directionalLight.intensity = intensity;
  },

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  },
};

export default ThreeScene;
