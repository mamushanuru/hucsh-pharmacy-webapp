const express = require("express");
const router = express.Router();
const inventory125Controller = require("../controllers/inventory125.controller");

// Add a new medication
router.post("/api/inventory125/medications", inventory125Controller.addMedication);

// Get all medications for Pharmacy 125
router.get("/api/inventory125/medications", inventory125Controller.getMedications);

// Get a medication by ID
router.get("/api/inventory125/medications/:id", inventory125Controller.getMedicationById);

// Update a medication
router.put("/api/inventory125/medications/:id", inventory125Controller.updateMedication);

// Delete a medication
router.delete("/api/inventory125/medications/:id", inventory125Controller.deleteMedication);

module.exports = router;