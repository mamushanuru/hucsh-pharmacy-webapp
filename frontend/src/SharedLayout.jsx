import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import "./sharedLayout.css"; 

function SharedLayout() {
  return (
    <>
      <Header />
      <div className="content-wrapper">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default SharedLayout;