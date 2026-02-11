import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import AdminPanel from "./pages/AdminPanel";
import AdminGuard from "./components/AdminGuard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />

      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminPanel />
          </AdminGuard>
        }
      />
    </Routes>
  );
}

export default App;
