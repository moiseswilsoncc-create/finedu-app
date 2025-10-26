// ✅ Reinsertar BrowserRouter con basename

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestRender from "./components/TestRender";

function App() {
  return (
    <Router basename="/finedu-app">
      <Routes>
        <Route path="/" element={<TestRender />} />
      </Routes>
    </Router>
  );
}

export default App;
