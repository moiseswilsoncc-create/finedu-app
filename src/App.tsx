import { FineduProvider } from "./context/FineduContext";

function App() {
  console.log("✅ App.tsx con FineduProvider sin Router");

  return (
    <FineduProvider>
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "white",
          backgroundColor: "darkred",
          fontSize: "2rem",
          borderRadius: "8px",
          marginTop: "4rem",
        }}
      >
        ✅ FineduProvider está montado sin Router
      </div>
    </FineduProvider>
  );
}

export default App;
