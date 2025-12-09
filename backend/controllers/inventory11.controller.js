const inventory11Service = require("../services/inventory11.service");

class Inventory11Controller {
  // Add a new medication
  async addMedication(req, res) {
    try {
      const medicationData = req.body;
      console.log("Received medication data:", medicationData);
      const result = await inventory11Service.addMedication(medicationData);

      // Emit WebSocket event
      const io = req.app.get('io'); // Access the `io` instance
      io.emit('medicationChanged', { action: 'add', ...result });

      res.status(201).json({
        status: "success",
        message: "Medication added successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error adding medication:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while adding the medication",
        error: error.message,
      });
    }
  }

  // Get all medications for Pharmacy 11
  async getMedications(req, res) {
    try {
      const medications = await inventory11Service.getMedications();
      res.status(200).json({
        status: "success",
        data: medications,
      });
    } catch (error) {
      console.error("Error fetching medications:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching medications",
      });
    }
  }

  // Get a medication by ID
  async getMedicationById(req, res) {
    try {
      const medicationId = req.params.id;
      const medication = await inventory11Service.getMedicationById(medicationId);
      if (!medication) {
        return res.status(404).json({
          status: "fail",
          message: "Medication not found",
        });
      }
      res.status(200).json({
        status: "success",
        data: medication,
      });
    } catch (error) {
      console.error("Error fetching medication:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching the medication",
      });
    }
  }

  // Update a medication
  async updateMedication(req, res) {
    try {
      const medicationId = req.params.id;
      const medicationData = req.body;
      console.log("Updating medication with ID:", medicationId);
      console.log("Update data:", medicationData);

      const result = await inventory11Service.updateMedication(medicationId, medicationData);

      // Emit WebSocket event
      const io = req.app.get('io'); // Access the `io` instance
      io.emit('medicationChanged', { action: 'update', ...result });

      res.status(200).json({
        status: "success",
        message: "Medication updated successfully",
      });
    } catch (error) {
      console.error("Error updating medication:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while updating the medication",
      });
    }
  }

  // Delete a medication
  async deleteMedication(req, res) {
    try {
      const medicationId = req.params.id;
      const result = await inventory11Service.deleteMedication(medicationId);

      // Emit WebSocket event
      const io = req.app.get('io'); // Access the `io` instance
      io.emit('medicationChanged', { action: 'delete', medication_id: medicationId });

      res.status(200).json({
        status: "success",
        message: "Medication deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting medication:", error);
      res.status(500).json({
        status: "error",
        message: "An error occurred while deleting the medication",
      });
    }
  }
}

module.exports = new Inventory11Controller();