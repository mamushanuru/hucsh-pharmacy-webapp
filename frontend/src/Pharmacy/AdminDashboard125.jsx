import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./InventoryAdmin.css";
import loadingSpinner from "../../src/assets/images/loading-spinner.gif";
import greenSuccessIcon from "../../src/assets/images/green-success.svg";
import errorRedIcon from "../../src/assets/images/error-red.svg";
import ConfirmationDialog from "./ConfirmationDialog";

// Function to calculate time ago
const timeAgo = (date) => {
  if (!date) return "Just now"; // Handle missing or invalid dates

  const now = new Date();
  const updated = new Date(date);
  if (isNaN(updated)) return "Just now"; // Handle invalid date format

  const diffMs = now - updated;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
};

// Function to highlight search term
const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="highlight">
        {part}
      </span>
    ) : (
      part
    )
  );
};

// WebSocket setup
const socket = io("http://localhost:5050"); // Connect to the backend WebSocket server

// Category mapping
const categoryMap = {
  1: "Anti-Infectives",
  2: "Cardiovascular Medications",
  3: "Gastrointestinal Medications",
  4: "CNS Medications",
  5: "Musculoskeletal Medications",
  6: "Endocrine Medications",
  7: "Respiratory Medications",
  8: "Dermatological Medications",
  9: "Pain Management Medications",
  10: "Vaccines",
  11: "Nutritional Supplements",
  12: "Psychiatric Medications",
  13: "Allergy Medications",
  14: "Other Medications",
};

const AdminDashboard125 = () => {
  const [medicines, setMedicines] = useState([]); // State to store medications
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showAddForm, setShowAddForm] = useState(false); // Toggle add form
  const [editMedication, setEditMedication] = useState(null); // Medication being edited
  const [newMedication, setNewMedication] = useState({
    medication_name: "",
    availability: 1,
    dosage: "",
    dosage_unit: "",
    category: 1, // Default to first category
    pharma_id: 1, // Set pharma_id to 1 by default
  });
  const [searchText, setSearchText] = useState(""); // Search text
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category filter
  const [sortBy, setSortBy] = useState("recent"); // Default sort by "recent"
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation dialog state
  const [medicationToDelete, setMedicationToDelete] = useState(null); // Medication to delete
  const [message, setMessage] = useState({ type: "", text: "" }); // Success/error message

  // Fetch medications from the backend
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/inventory125/medications");
        if (!response.ok) throw new Error("Failed to fetch medications");
        const { data } = await response.json(); // Destructure the `data` property
        setMedicines(data); // Set the medications array
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications(); // Call the function
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    socket.on('medicationChanged', (data) => {
      if (data.action === 'delete') {
        // Remove deleted medication
        setMedicines((prev) => prev.filter((med) => med.medication_id !== data.medication_id));
      } else {
        // Update or add medication
        setMedicines((prev) => {
          const existingIndex = prev.findIndex((med) => med.medication_id === data.medication_id);
          if (existingIndex >= 0) {
            // Update existing medication
            const updatedMedicines = [...prev];
            updatedMedicines[existingIndex] = data;
            return updatedMedicines;
          } else {
            // Add new medication
            return [...prev, data];
          }
        });
      }
    });

    return () => {
      socket.off('medicationChanged'); // Clean up the listener
    };
  }, []);

  // Add a new medication
  const handleAddMedication = async (e) => {
    e.preventDefault();
    try {
      const medicationData = {
        ...newMedication,
        dosage: newMedication.dosage || null, // Set to null if empty
        dosage_unit: newMedication.dosage_unit || null, // Set to null if empty
      };

      const response = await fetch("http://localhost:5050/api/inventory125/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicationData),
      });
      if (!response.ok) throw new Error("Failed to add medication");
      setShowAddForm(false);
      setNewMedication({
        medication_name: "",
        availability: 1,
        dosage: "",
        dosage_unit: "",
        category: 1,
        pharma_id: 1,
      }); // Reset form fields
      setMessage({ type: "success", text: "Medication added successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error("Error adding medication:", error);
      setMessage({ type: "error", text: "Failed to add medication. Please try again." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Hide message after 3 seconds
    }
  };

  // Update a medication
  const handleUpdateMedication = async (e) => {
    e.preventDefault();
    try {
      const updatedMedication = {
        ...editMedication,
        dosage: editMedication.dosage || null, // Set to null if empty
        dosage_unit: editMedication.dosage_unit || null, // Set to null if empty
      };

      const response = await fetch(
        `http://localhost:5050/api/inventory125/medications/${editMedication.medication_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMedication),
        }
      );
      if (!response.ok) throw new Error("Failed to update medication");
      setEditMedication(null); // Close the edit form
      setMessage({ type: "success", text: "Medication updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error("Error updating medication:", error);
      setMessage({ type: "error", text: "Failed to update medication. Please try again." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Hide message after 3 seconds
    }
  };

  // Delete a medication
  const handleDeleteMedication = async (id) => {
    try {
      const response = await fetch(`http://localhost:5050/api/inventory125/medications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete medication");
      setMedicines((prev) => prev.filter((med) => med.medication_id !== id)); // Update UI immediately
      setMessage({ type: "success", text: "Medication deleted successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error("Error deleting medication:", error);
      setMessage({ type: "error", text: "Failed to delete medication. Please try again." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Hide message after 3 seconds
    }
  };

  // Filter and sort medications
  const filteredMedicines = medicines.filter(
    (medicine) =>
      (!selectedCategory || medicine.category === parseInt(selectedCategory)) &&
      (medicine.medication_name?.toLowerCase() || "").includes(searchText.toLowerCase())
  );

  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    if (sortBy === "name") return a.medication_name.localeCompare(b.medication_name);
    if (sortBy === "availability") return b.availability - a.availability;
    if (sortBy === "recent") return new Date(b.availability_updated) - new Date(a.availability_updated);
    return 0;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <img src={loadingSpinner} alt="Loading..." />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1 className="inventory-title">Pharmacy 125 Admin Dashboard</h1>
      <p className="inventory-subtitle">Manage medications with ease.</p>

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`message-overlay ${message.type}`}
          onClick={() => setMessage({ type: "", text: "" })}
        >
          <div className="message-content">
            <img
              src={message.type === "success" ? greenSuccessIcon : errorRedIcon}
              alt={message.type}
            />
            <p>{message.text}</p>
          </div>
        </div>
      )}

      {/* Search, Filter, and Sort Controls */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Medicines"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-3">
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {Object.entries(categoryMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="availability">Sort by Availability</option>
            <option value="recent">Sort by Recent</option>
          </select>
        </div>
      </div>

      {/* Add Medication Button */}
      <button
        className="btn btn-primary mb-4"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Cancel" : "Add New Medication"}
      </button>

      {/* Add Medication Form */}
      {showAddForm && (
        <form onSubmit={handleAddMedication} className="mb-4">
          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Medication Name"
                value={newMedication.medication_name}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, medication_name: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Dosage (optional)"
                value={newMedication.dosage || ""}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, dosage: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Dosage Unit (optional)"
                value={newMedication.dosage_unit || ""}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, dosage_unit: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-control"
                value={newMedication.category}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, category: parseInt(e.target.value) })
                }
                required
              >
                {Object.entries(categoryMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-control"
                value={newMedication.availability}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, availability: parseInt(e.target.value) })
                }
              >
                <option value={1}>Available</option>
                <option value={0}>Unavailable</option>
              </select>
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-success">
                Add
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Medications List */}
      <div className="row">
        {sortedMedicines.map((medicine) => (
          <div className="col-md-4 mb-4" key={medicine.medication_id}>
            <div className={`medicine-card ${medicine.availability ? "available" : "unavailable"}`}>
              <div className="card-body">
                {editMedication?.medication_id === medicine.medication_id ? (
                  <form onSubmit={handleUpdateMedication}>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Medication Name"
                      value={editMedication.medication_name}
                      onChange={(e) =>
                        setEditMedication({ ...editMedication, medication_name: e.target.value })
                      }
                      required
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Dosage (optional)"
                      value={editMedication.dosage || ""}
                      onChange={(e) =>
                        setEditMedication({ ...editMedication, dosage: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Dosage Unit (optional)"
                      value={editMedication.dosage_unit || ""}
                      onChange={(e) =>
                        setEditMedication({ ...editMedication, dosage_unit: e.target.value })
                      }
                    />
                    <select
                      className="form-control mb-2"
                      value={editMedication.category}
                      onChange={(e) =>
                        setEditMedication({ ...editMedication, category: parseInt(e.target.value) })
                      }
                      required
                    >
                      {Object.entries(categoryMap).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                    <select
                      className="form-control mb-2"
                      value={editMedication.availability}
                      onChange={(e) =>
                        setEditMedication({ ...editMedication, availability: parseInt(e.target.value) })
                      }
                    >
                      <option value={1}>Available</option>
                      <option value={0}>Unavailable</option>
                    </select>
                    <button type="submit" className="btn btn-success me-2">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditMedication(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <h5 className="card-title">
                      {highlightSearchTerm(medicine.medication_name, searchText)}
                    </h5>
                    <p className="card-dosage">{`${medicine.dosage} ${medicine.dosage_unit}`}</p>
                    <p className="card-text">Category: {categoryMap[medicine.category]}</p>
                    <p className="card-status">
                      {medicine.availability ? (
                        <span className="text-success">Available</span>
                      ) : (
                        <span className="text-danger">Unavailable</span>
                      )}
                    </p>
                    <p className="card-updated">{timeAgo(medicine.availability_updated)}</p>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => {
                        setEditMedication({
                          ...medicine,
                          category: medicine.category, // Ensure category is included
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setMedicationToDelete(medicine.medication_id);
                        setShowConfirmation(true);
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this medication?"
          onConfirm={() => {
            handleDeleteMedication(medicationToDelete);
            setShowConfirmation(false);
          }}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard125;