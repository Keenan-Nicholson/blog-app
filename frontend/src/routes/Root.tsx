import { NavBar } from "../components/NavBar";
import "../App.css";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export const Root = () => {
  return (
    <div className="Map">
      <NavBar />
      <Outlet />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        pauseOnHover={true}
      />
    </div>
  );
};
