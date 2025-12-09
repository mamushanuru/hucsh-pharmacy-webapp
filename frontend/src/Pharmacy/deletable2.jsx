import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Inventory.css";
import loadingSpinner from "../../src/assets/images/loading-spinner.gif";

// Function to calculate time ago
const timeAgo = (date) => {
  const now = new Date();
  const updated = new Date(date);
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

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
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

const AdminDashboard11 = () => {
  const [medicines, setMedicines] = useState([]); // State to store medications
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showAddForm, setShowAddForm] = useState(false); // Toggle add form
  const [editMedication, setEditMedication] = useState(null); // Medication being edited
  const [newMedication, setNewMedication] = useState({
    medication_name: "",
    pharma_id: 1, // Default to 1
    availability: 1,
    dosage: "",
    dosage_unit: "",
    category_id: 1,
  });
  const [searchText, setSearchText] = useState(""); // Search text
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category filter
  const [sortBy, setSortBy] = useState("name"); // Sorting option

  const debouncedSearchText = useDebounce(searchText, 300); // Debounced search text

  // Categories
  const categories = [
    { id: 1, name: "Anti-Infectives" },
    { id: 2, name: "Cardiovascular Medications" },
    { id: 3, name: "Gastrointestinal Medications" },
    { id: 4, name: "Central Nervous System (CNS) Medications" },
    { id: 5, name: "Musculoskeletal Medications" },
    { id: 6, name: "Endocrine Medications" },
    { id: 7, name: "Respiratory Medications" },
    { id: 8, name: "Dermatological Medications" },
    { id: 9, name: "Pain Management Medications" },
    { id: 10, name: "Vaccines" },
    { id: 11, name: "Nutritional Supplements" },
    { id: 12, name: "Psychiatric Medications" },
    { id: 13, name: "Allergy Medications" },
    { id: 14, name: "Other Medications" },
  ];

  // Fetch medications from the backend
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventory11/medications");
        if (!response.ok) {
          throw new Error("Failed to fetch medications");
        }
        const data = await response.json();
        setMedicines(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  // Add a new medication
  const handleAddMedication = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/inventory11/medications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMedication),
      });
      if (!response.ok) {
        throw new Error("Failed to add medication");
      }
      const result = await response.json();
      setMedicines([...medicines, result.data]);
      setShowAddForm(false);
      setNewMedication({
        medication_name: "",
        pharma_id: 1,
        availability: 1,
        dosage: "",
        dosage_unit: "",
        category_id: 1,
      });
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  // Update a medication
  const handleUpdateMedication = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory11/medications/${editMedication.medication_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            medication_name: editMedication.medication_name,
            availability: editMedication.availability,
            dosage: editMedication.dosage,
            dosage_unit: editMedication.dosage_unit,
            category_id: editMedication.category_id, // Ensure category_id is included
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update medication");
      }
      const updatedMedications = medicines.map((med) =>
        med.medication_id === editMedication.medication_id ? editMedication : med
      );
      setMedicines(updatedMedications);
      setEditMedication(null);
    } catch (error) {
      console.error("Error updating medication:", error);
    }
  };

  // Delete a medication
  const handleDeleteMedication = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/inventory11/medications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete medication");
      }
      const updatedMedications = medicines.filter((med) => med.medication_id !== id);
      setMedicines(updatedMedications);
    } catch (error) {
      console.error("Error deleting medication:", error);
    }
  };

  // Filter and sort medications
  const filteredMedicines = medicines.filter(
    (medicine) =>
      (!selectedCategory || medicine.category_name === selectedCategory) &&
      medicine.medication_name.toLowerCase().includes(debouncedSearchText.toLowerCase())
  );

  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    if (sortBy === "name") {
      return a.medication_name.localeCompare(b.medication_name);
    } else if (sortBy === "availability") {
      return b.availability - a.availability;
    } else if (sortBy === "recent") {
      return new Date(b.availability_updated) - new Date(a.availability_updated);
    }
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
      <h1 className="inventory-title">Pharmacy 11 Admin Dashboard</h1>
      <p className="inventory-subtitle">Manage medications with ease.</p>

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
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
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
                placeholder="Dosage"
                value={newMedication.dosage}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, dosage: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Dosage Unit"
                value={newMedication.dosage_unit}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, dosage_unit: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-control"
                value={newMedication.category_id}
                onChange={(e) =>
                  setNewMedication({ ...newMedication, category_id: parseInt(e.target.value) })
                }
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
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
                      value={editMedication.medication_name}
                      onChange={(e) =>
                        setEditMedication({ ...editMedication, medication_name: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      value={editMedication.dosage}
                      onChange={(e) =>
                        setEditMedication({ ...editMedication, dosage: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editMedication.dosage_unit}
                      onChange={(e) =>
                        setEditMedication({ ...editMedication, dosage_unit: e.target.value })
                      }
                    />
                    <select
                      className="form-control mb-2"
                      value={editMedication.category_id}
                      onChange={(e) =>
                        setEditMedication({ ...editMedication, category_id: parseInt(e.target.value) })
                      }
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
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
                      {highlightSearchTerm(medicine.medication_name, debouncedSearchText)}
                    </h5>
                    <p className="card-dosage">{`${medicine.dosage} ${medicine.dosage_unit}`}</p>
                    <p className="card-text">Category: {medicine.category_name}</p>
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
                      onClick={() => setEditMedication({ ...medicine })}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteMedication(medicine.medication_id)}
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
    </div>
  );
};

export default AdminDashboard11;