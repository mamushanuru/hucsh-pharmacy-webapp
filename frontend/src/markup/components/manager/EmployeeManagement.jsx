import { useState, useEffect } from "react";
import { Button, Table, Form, Modal, Spinner, Pagination, Alert } from "react-bootstrap";
import { useAuth } from "../../../Contexts/AuthContext";
import employeeService from "../../../services/employee.service";
import greenSuccessIcon from "../../../assets/images/green-success.svg";
import errorRedIcon from "../../../assets/images/error-red.svg";
import "./ManagerDashboard.css";

const EmployeeManagement = () => {
  const { isManager, employee: loggedInEmployee } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const employeesPerPage = 10;

  useEffect(() => {
    if (!isManager) {
      showAlert("You don't have permission to access this page", false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [employeesRes, rolesRes] = await Promise.all([
          employeeService.getAllEmployees(),
          employeeService.getAllRoles()
        ]);
    
        setEmployees(employeesRes);
        setRoles(rolesRes);
      } catch (error) {
        console.error("Error fetching data:", error);
        showAlert(error.message, false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isManager]);

  const showAlert = (message, isSuccess) => {
    if (isSuccess) {
      setSuccess(message);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredEmployees = employees.filter((emp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.employee_email.toLowerCase().includes(searchLower) ||
      emp.employee_first_name.toLowerCase().includes(searchLower) ||
      emp.employee_last_name.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setEmployeeToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await employeeService.deleteEmployee(employeeToDelete);
      setEmployees(employees.filter(emp => emp.employee_id !== employeeToDelete));
      showAlert("Employee deleted successfully!", true);
    } catch (error) {
      console.error("Error deleting employee:", error);
      showAlert(error.message, false);
    } finally {
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const employeeData = {
      employee_email: formData.get("email"),
      employee_first_name: formData.get("firstName"),
      employee_last_name: formData.get("lastName"),
      employee_phone: formData.get("phone"),
      employee_password: formData.get("password"),
      facility_role_id: parseInt(formData.get("role")),
      active_employee: 1,
    };

    try {
      if (currentEmployee) {
        await employeeService.updateEmployee(currentEmployee.employee_id, employeeData);
        showAlert("Employee updated successfully!", true);
      } else {
        await employeeService.createEmployee(employeeData);
        showAlert("Employee created successfully!", true);
      }
      
      // Refresh the list
      const updatedEmployees = await employeeService.getAllEmployees();
      setEmployees(updatedEmployees);
      setShowModal(false);
      setCurrentEmployee(null);
    } catch (error) {
      console.error("Error saving employee:", error);
      showAlert(error.message, false);
    }
  };

  if (!isManager) {
    // eslint-disable-next-line react/no-unescaped-entities
    return <Alert variant="danger">You don't have permission to access this page</Alert>;
  }

  return (
    <div className="employee-management">
      {/* Success Alert */}
      {success && (
        <Alert variant="success" className="d-flex align-items-center">
          <img src={greenSuccessIcon} alt="Success" width={24} className="me-2" />
          {success}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="d-flex align-items-center">
          <img src={errorRedIcon} alt="Error" width={24} className="me-2" />
          {error}
        </Alert>
      )}

      <div className="management-header">
        <h3>Employee Management</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add New Employee
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form.Group>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((emp) => (
                  <tr key={emp.employee_id}>
                    <td>{`${emp.employee_first_name} ${emp.employee_last_name}`}</td>
                    <td>{emp.employee_email}</td>
                    <td>{emp.employee_phone || "-"}</td>
                    <td>
                      {roles.find((r) => r.facility_role_id === emp.facility_role_id)?.facility_role_name || "N/A"}
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleEdit(emp)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDelete(emp.employee_id)}
                        disabled={emp.employee_id === loggedInEmployee?.employee_id}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {filteredEmployees.length > employeesPerPage && (
            <Pagination className="justify-content-center">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </Pagination>
          )}
        </>
      )}

      {/* Add/Edit Employee Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setCurrentEmployee(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentEmployee ? "Edit Employee" : "Add New Employee"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                defaultValue={currentEmployee?.employee_first_name || ""}
                required
                placeholder="Enter first name"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                defaultValue={currentEmployee?.employee_last_name || ""}
                required
                placeholder="Enter last name"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                defaultValue={currentEmployee?.employee_email || ""}
                required
                disabled={!!currentEmployee}
                placeholder="Enter email address"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                defaultValue={currentEmployee?.employee_phone || ""}
                placeholder="Enter phone number"
              />
            </Form.Group>
            
            {!currentEmployee && (
              <Form.Group className="mb-3 password-container">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength="6"
                    placeholder="Enter password"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                defaultValue={currentEmployee?.facility_role_id || ""}
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.facility_role_id} value={role.facility_role_id}>
                    {role.facility_role_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setCurrentEmployee(null); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this employee? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;