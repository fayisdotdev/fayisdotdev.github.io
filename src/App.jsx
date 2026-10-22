import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/portfolio";
import AdminGuard from "./components/AdminGuard";
import PasswordRecovery from "./components/PasswordRecovery";

const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    <>
      <Suspense fallback={null}>
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
          <Route path="/admin-forgott" element={null} />
        </Routes>
      </Suspense>
      <PasswordRecovery />
    </>
  );
}

export default App;
