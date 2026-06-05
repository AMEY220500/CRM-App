import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/login"
        element={
          <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold text-foreground">
              Login Page - Coming Soon
            </h1>
          </div>
        }
      />
      <Route
        path="/dashboard"
        element={
          <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold text-foreground">
              Dashboard - Coming Soon
            </h1>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
