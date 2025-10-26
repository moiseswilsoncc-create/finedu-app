import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FineduProvider } from "./context/FineduContext";
import TestRender from "./components/TestRender";

function App() {
  console.log("✅ App.tsx con FineduProvider y Router");

  return (
    <FineduProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TestRender />} />
        </Routes>
      </Router>
    </FineduProvider>
  );
}

export default App;
