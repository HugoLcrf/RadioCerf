import { useEffect } from "react";

const ColorPicker = () => {
  const handleChange = (e) => {
    const color = e.target.value;
    document.documentElement.style.setProperty("--neon-color", color);
    localStorage.setItem("neonColor", color);
  };

  useEffect(() => {
    const saved = localStorage.getItem("neonColor");
    if (saved) {
      document.documentElement.style.setProperty("--neon-color", saved);
    }
  }, []);

  return (
    <div style={{ position: "fixed", top: 20, left: 20 }}>
      <label>🎨 Choisis ta couleur : </label>
      <input type="color" onChange={handleChange} defaultValue="#00ff00" />
    </div>
  );
};

export default ColorPicker;
