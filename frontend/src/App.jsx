import { BrowserRouter, Routes, Route } from "react-router-dom";

import SharedLayout from "./SharedLayout";

// Public + Common Pages
import Blog from "./markup/pages/Blog.jsx";
import Contact from "./markup/pages/Contact.jsx";
import About from "./markup/pages/About.jsx";
import Services from "./markup/pages/Services.jsx";
import Unauthorized from "./markup/pages/Unauthorized.jsx";
import Four404 from "./markup/pages/Four404.jsx";
import Developer from "./Footer/Developer.jsx";

// Pharmacy Pages
import Pharmacies from "./Pharmacy/pharmacies";
import Inventory11 from "./Pharmacy/Inventory11";
import Inventory92 from "./Pharmacy/Inventory92";
import Inventory125 from "./Pharmacy/Inventory125";

// Pharmacy Dashboards
import AdminDashboard11 from "./Pharmacy/AdminDashboard11.jsx";
import AdminDashboard92 from "./Pharmacy/AdminDashboard92.jsx";
import AdminDashboard125 from "./Pharmacy/AdminDashboard125.jsx";

// Manager + Login/Register Pages
import Register from "./markup/pages/Register.jsx";
import Go from "./markup/pages/Go.jsx";

import ManagerRoute from "./routes/ManagerRoute.jsx";
import ManagerDashboard from "./markup/components/manager/ManagerDashboard.jsx";
import EmployeeManagement from "./markup/components/manager/EmployeeManagement.jsx";
import UserManagement from "./markup/components/manager/UserManagement.jsx";

// Pharmacy Protected Routes
import Pharmacy11Route from "./routes/Pharmacy11Route.jsx";
import Pharmacy92Route from "./routes/Pharmacy92Route.jsx";
import Pharmacy125Route from "./routes/Pharmacy125Route.jsx";

import "./markup/pages/cards.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shared Layout for top navigation */}
        <Route path="/" element={<SharedLayout />}>

          {/* Public pages */}
          <Route index element={<Blog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="developer" element={<Developer />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* PHARMACY — Public Inventory View */}
          <Route path="pharmacy" element={<Pharmacies />} />
          <Route path="pharmacy/11" element={<Inventory11 />} />
          <Route path="pharmacy/92" element={<Inventory92 />} />
          <Route path="pharmacy/125" element={<Inventory125 />} />

          {/* PHARMACY ADMIN DASHBOARDS — Protected */}
          <Route
            path="admin/pharmacy11"
            element={
              <Pharmacy11Route>
                <AdminDashboard11 />
              </Pharmacy11Route>
            }
          />

          <Route
            path="admin/pharmacy92"
            element={
              <Pharmacy92Route>
                <AdminDashboard92 />
              </Pharmacy92Route>
            }
          />

          <Route
            path="admin/pharmacy125"
            element={
              <Pharmacy125Route>
                <AdminDashboard125 />
              </Pharmacy125Route>
            }
          />

          {/* MANAGER ROUTES */}
          <Route
            path="manager"
            element={
              <ManagerRoute>
                <ManagerDashboard />
              </ManagerRoute>
            }
          >
            <Route index element={<EmployeeManagement />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<Four404 />} />
        </Route>

        {/* LOGIN & REGISTER OUTSIDE SHARED LAYOUT */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Go />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
