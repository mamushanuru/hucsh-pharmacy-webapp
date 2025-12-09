const express = require("express");
const router = express.Router();
const inventory92Controller = require("../controllers/inventory92.controller");

// Add a new medication
router.post("/api/inventory92/medications", inventory92Controller.addMedication);

// Get all medications for Pharmacy 92
router.get("/api/inventory92/medications", inventory92Controller.getMedications);

// Get a medication by ID
router.get("/api/inventory92/medications/:id", inventory92Controller.getMedicationById);

// Update a medication
router.put("/api/inventory92/medications/:id", inventory92Controller.updateMedication);

// Delete a medication
router.delete("/api/inventory92/medications/:id", inventory92Controller.deleteMedication);

module.exports = router;