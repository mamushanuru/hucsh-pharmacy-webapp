import { useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const { employee } = useAuth();
  const [activeTab, setActiveTab] = useState("employees");

  return (
    <div className="manager-dashboard">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
        <div className="welcome-message">
          Welcome, {employee?.employee_first_name}
        </div>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="employees" as={Link} to="employees">
              Employees
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="users" as={Link} to="users">
              Users
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </Tab.Container>
    </div>
  );
};

export default ManagerDashboard;