import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/portfolio";
import AdminPanel from "./pages/AdminPanel";
import AdminGuard from "./components/AdminGuard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route
        path="/super-admin"
        element={
          <AdminGuard>
            <AdminPanel />
          </AdminGuard>
        }
      />

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
