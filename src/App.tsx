// 🛠️ Ruta comodín para capturar cualquier URL

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestRender from "./components/TestRender";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<TestRender />} />
      </Routes>
    </Router>
  );
}

export default App;
