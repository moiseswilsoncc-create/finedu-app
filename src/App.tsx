import React from "react";

const App: React.FC = () => {
  console.log("✅ App.tsx montado");

  return (
    <div style={{ padding: "2rem", fontSize: "1.5rem", color: "#2c3e50" }}>
      ✅ Render directo desde App.tsx
    </div>
  );
};

export default App;
