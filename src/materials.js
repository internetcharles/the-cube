export const MATERIAL_TYPES = {
  wood: {
    basic: { color: "#a86f3d" },
    pbr: { color: "#a86f3d", roughness: 0.7, metalness: 0.0 },
  },
  glass: {
    basic: { color: "#88ccee" },
    pbr: {
      color: "#88ccee",
      roughness: 0.1,
      metalness: 0.0,
      transparent: true,
      opacity: 0.3,
    },
  },
  metal: {
    basic: { color: "#cccccc" },
    pbr: { color: "#ffffff", roughness: 0.2, metalness: 1.0 },
  },
  fur: {
    basic: { color: "#775533" },
    pbr: { color: "#775533", roughness: 1.0, metalness: 0.0 },
  },
};
