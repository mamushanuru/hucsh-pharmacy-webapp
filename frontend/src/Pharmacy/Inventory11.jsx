import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Inventory.css";
import PharmacyNav from "./PharmacyNav";

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
const socket = io("http://localhost:5000"); // Connect to the backend WebSocket server

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

const Inventory11 = () => {
  const [medicines, setMedicines] = useState([]); // State to store medications
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchText, setSearchText] = useState(""); // Search text
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category filter
  const [sortBy, setSortBy] = useState("recent"); // Default sort by "recent"
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const itemsPerPage = 9; // Items per page

  // Fetch medications from the backend
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventory11/medications");
        if (!response.ok) throw new Error("Failed to fetch medications");
        const { data } = await response.json();
        setMedicines(data); // Set the medications array
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  // WebSocket listener for real-time updates
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
      socket.disconnect(); // Clean up the listener
    };
  }, []);

  // Filter medicines
  const filteredMedicines = medicines.filter(
    (medicine) =>
      (!selectedCategory || medicine.category === parseInt(selectedCategory)) &&
      medicine.medication_name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Sort medicines
  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    if (sortBy === "name") return a.medication_name.localeCompare(b.medication_name);
    if (sortBy === "availability") return b.availability - a.availability;
    if (sortBy === "recent") return new Date(b.availability_updated) - new Date(a.availability_updated);
    return 0;
  });

  // Paginate medicines
  const totalPages = Math.ceil(sortedMedicines.length / itemsPerPage);
  const paginatedMedicines = sortedMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="text-center py-5">Loading medications...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container">
      <PharmacyNav currentPharmacy="11" />
      <h1 className="inventory-title">Pharmacy 11 Inventory</h1>
      <p className="inventory-subtitle">Explore available medications with real-time updates.</p>

      {/* Search and Filter Controls */}
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

      {/* Medications List */}
      <div className="row">
        {paginatedMedicines.map((medicine) => (
          <div className="col-md-4 mb-4" key={medicine.medication_id}>
            <div className={`medicine-card ${medicine.availability ? "available" : "unavailable"}`}>
              <div className="card-body">
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination d-flex justify-content-center mt-4">
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="align-self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary ms-2"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Inventory11;