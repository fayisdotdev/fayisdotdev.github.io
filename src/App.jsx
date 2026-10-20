import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/portfolio";
import AdminPanel from "./pages/AdminPanel";
import AdminGuard from "./components/AdminGuard";
import PasswordRecovery from "./components/PasswordRecovery";

function App() {
  return (
    <>
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
        <Route path="/admin-forgott" element={null} />
      </Routes>
      <PasswordRecovery />
    </>
  );
}

export default App;
