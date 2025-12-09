import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pharmacies from "./Pharmacy/pharmacies";
import Inventory11 from "./Pharmacy/Inventory11";
import Inventory92 from "./Pharmacy/Inventory92";
import Inventory125 from "./Pharmacy/Inventory125";
import SharedLayout from "./SharedLayout";
import Four404 from "./markup/pages/Four404";
import Contact from "./markup/pages/Contact";
import About from "./markup/pages/About";
import Services from "./markup/pages/Services.jsx";
import Unauthorized from "./markup/pages/Unauthorized.jsx";
// import PrivateAuthRoute from "./markup/components/Auth/PrivateAuthRoute.jsx";(i will create this component later)
import Blog from "./markup/pages/Blog.jsx";
import AdminDashboard11 from "./Pharmacy/AdminDashboard11.jsx";
import AdminDashboard92 from "./Pharmacy/AdminDashboard92.jsx";
import AdminDashboard125 from "./Pharmacy/AdminDashboard125.jsx";

import Register from "./markup/pages/Register.jsx";
import Go from "./markup/pages/Go.jsx";
import ManagerRoute from "./routes/ManagerRoute.jsx";
import ManagerDashboard from "./markup/components/manager/ManagerDashboard.jsx";
import EmployeeManagement from "./markup/components/manager/EmployeeManagement.jsx";
import UserManagement from "./markup/components/manager/UserManagement.jsx";
import "./markup/pages/cards.css";
import Developer from "./Footer/Developer.jsx";

 function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route path="/" element={<Blog />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/admin/pharmacy11" element={<AdminDashboard11 />} />
          <Route path="/admin/pharmacy92" element={<AdminDashboard92 />} />
          <Route path="/admin/pharmacy125" element={<AdminDashboard125 />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pharmacy" element={<Pharmacies />} />
          <Route path="/pharmacy/11" element={<Inventory11 />} />
          <Route path="/pharmacy/92" element={<Inventory92 />} />
          <Route path="/pharmacy/125" element={<Inventory125 />} />
          <Route element={<ManagerRoute />}>
            <Route path="manager" element={<ManagerDashboard />}>
              <Route index element={<EmployeeManagement />} />
              <Route path="employees" element={<EmployeeManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Route>
          <Route path="*" element={<Four404 />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Go />} />
          {/* Manager routes */}
          
          
      </Routes>
    </BrowserRouter>
  );
}

export default App;
