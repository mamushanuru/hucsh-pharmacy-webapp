import { useState, useEffect } from "react";
import { Table, Form, Button, Spinner, Pagination, Alert, Modal } from "react-bootstrap";
import { getAllUsers, deleteUser } from "../../../services/user.service";
import greenSuccessIcon from "../../../assets/images/green-success.svg";
import errorRedIcon from "../../../assets/images/error-red.svg";
import "./ManagerDashboard.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      showAlert(err.message || "Failed to fetch users", false);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showAlert = (message, isSuccess) => {
    if (isSuccess) {
      setSuccess(message);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userToDelete);
      setUsers(users.filter(user => user.user_id !== userToDelete));
      showAlert("User deleted successfully!", true);
    } catch (error) {
      console.error("Error deleting user:", error);
      showAlert(error.message || "Failed to delete user", false);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.user_email.toLowerCase().includes(searchLower) ||
      (user.user_first_name && user.user_first_name.toLowerCase().includes(searchLower)) ||
      (user.user_last_name && user.user_last_name.toLowerCase().includes(searchLower))
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="user-management">
      <h3>User Management</h3>

      {success && (
        <Alert variant="success" className="d-flex align-items-center">
          <img src={greenSuccessIcon} alt="Success" width={24} className="me-2" />
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="d-flex align-items-center">
          <img src={errorRedIcon} alt="Error" width={24} className="me-2" />
          {error}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map(user => (
                  <tr key={user.user_id}>
                    <td>{`${user.user_first_name || ''} ${user.user_last_name || ''}`}</td>
                    <td>{user.user_email}</td>
                    <td>{user.user_phone || "-"}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDelete(user.user_id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    {users.length === 0 ? "No users found" : "No matching users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {filteredUsers.length > usersPerPage && (
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
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

export default UserManagement;