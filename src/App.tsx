// ✅ App sin BrowserRouter

import { Routes, Route } from "react-router-dom";
import TestRender from "./components/TestRender";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TestRender />} />
    </Routes>
  );
}

export default App;
