import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./AddMedicationForm.css";

function AddMedicationForm() {
  const [medicationName, setMedicationName] = useState("");
  const [pharmaId, setPharmaId] = useState("");
  const [availability, setAvailability] = useState("");
  const [availabilityUpdated, setAvailabilityUpdated] = useState("");
  const [medicationUnit, setMedicationUnit] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Error states
  const [medicationNameError, setMedicationNameError] = useState("");
  const [pharmaIdError, setPharmaIdError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [categoryIdError, setCategoryIdError] = useState("");
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    let isValid = true;

    if (!medicationName) {
      setMedicationNameError("Medication name is required");
      isValid = false;
    } else {
      setMedicationNameError("");
    }

    if (!pharmaId) {
      setPharmaIdError("Please select a pharmacy");
      isValid = false;
    } else {
      setPharmaIdError("");
    }

    if (!availability || isNaN(availability)) {
      setAvailabilityError("Availability must be a valid number");
      isValid = false;
    } else {
      setAvailabilityError("");
    }

    if (!categoryId) {
      setCategoryIdError("Please select a category");
      isValid = false;
    } else {
      setCategoryIdError("");
    }

    if (!isValid) {
      return;
    }

    // Simulate successful form submission
    setSuccess(true);
    setServerError("");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <section className="medication-section">
      <div className="container">
        <div className="medication-title">
          <h2>Add a New Medication</h2>
        </div>
        <form onSubmit={handleSubmit} className="medication-form">
          {serverError && <div className="validation-error">{serverError}</div>}
          {success && <div className="success-message">Medication added successfully!</div>}

          <div className="form-group">
            <label htmlFor="medicationName">Medication Name</label>
            <input
              type="text"
              id="medicationName"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              placeholder="Enter medication name"
            />
            {medicationNameError && <div className="validation-error">{medicationNameError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="pharmaId">Pharmacy</label>
            <select
              id="pharmaId"
              value={pharmaId}
              onChange={(e) => setPharmaId(e.target.value)}
            >
              <option value="">Select a Pharmacy</option>
              <option value="1">Pharmacy 11</option>
              <option value="2">Pharmacy 92</option>
              <option value="3">Pharmacy 125</option>
            </select>
            {pharmaIdError && <div className="validation-error">{pharmaIdError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="availability">Availability</label>
            <input
              type="number"
              id="availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="Enter availability quantity"
            />
            {availabilityError && <div className="validation-error">{availabilityError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="availabilityUpdated">Availability Updated</label>
            <input
              type="datetime-local"
              id="availabilityUpdated"
              value={availabilityUpdated}
              onChange={(e) => setAvailabilityUpdated(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="medicationUnit">Medication Unit</label>
            <input
              type="text"
              id="medicationUnit"
              value={medicationUnit}
              onChange={(e) => setMedicationUnit(e.target.value)}
              placeholder="E.g., mg, ml"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select a Category</option>
              <option value="1">Category 1</option>
              <option value="2">Category 2</option>
              <option value="3">Category 3</option>
            </select>
            {categoryIdError && <div className="validation-error">{categoryIdError}</div>}
          </div>

          <button type="submit" className="submit-btn">
            Add Medication
          </button>
        </form>
      </div>
    </section>
  );
}

export default AddMedicationForm;