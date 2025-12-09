const express = require("express");
const router = express.Router();
const inventory11Controller = require("../controllers/inventory11.controller");

// Add a new medication
router.post("/api/inventory11/medications", inventory11Controller.addMedication);

// Get all medications for Pharmacy 11
router.get("/api/inventory11/medications", inventory11Controller.getMedications);

// Get a medication by ID
router.get("/api/inventory11/medications/:id", inventory11Controller.getMedicationById);

// Update a medication
router.put("/api/inventory11/medications/:id", inventory11Controller.updateMedication);

// Delete a medication
router.delete("/api/inventory11/medications/:id", inventory11Controller.deleteMedication);

module.exports = router;