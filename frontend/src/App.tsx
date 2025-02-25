import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/v1/auth/me", {
        withCredentials: true,
      });

      if (res.data) {
        return res.data;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex max-w-6xl mx-auto">
        {authUser ? <Sidebar /> : null}
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/notifications"
            element={
              authUser ? <NotificationPage /> : <Navigate to={"/login"} />
            }
          />
          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
          />
        </Routes>
        {authUser ? <RightPanel /> : null}
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
