import { BrowserRouter as Router } from "react-router-dom";

function App() {
  console.log("✅ App.tsx con BrowserRouter sin rutas");

  return (
    <Router>
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "white",
          backgroundColor: "teal",
          fontSize: "2rem",
          borderRadius: "8px",
          marginTop: "4rem",
        }}
      >
        ✅ BrowserRouter está montado sin rutas
      </div>
    </Router>
  );
}

export default App;
