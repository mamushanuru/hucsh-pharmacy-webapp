const { pool } = require("../config/db.config");

class Inventory125Service {
  // Add a new medication
  async addMedication(medicationData) {
    const query = `
      INSERT INTO Medications (
        medication_name, pharma_id, availability, availability_updated, dosage, dosage_unit, category
      ) VALUES (?, ?, ?, NOW(), ?, ?, ?)
    `;
    const values = [
      medicationData.medication_name,
      medicationData.pharma_id,
      medicationData.availability,
      medicationData.dosage,
      medicationData.dosage_unit,
      medicationData.category,
    ];
    const [result] = await pool.query(query, values);

    // Fetch the newly added medication
    const [rows] = await pool.query("SELECT * FROM Medications WHERE medication_id = ?", [result.insertId]);
    return rows[0]; // Return the full medication object
  }

  // Get all medications for Pharmacy 125
  async getMedications() {
    const query = `
      SELECT 
        m.medication_id,
        m.medication_name,
        m.pharma_id,
        m.availability,
        m.availability_updated,
        m.dosage,
        m.dosage_unit,
        m.category
      FROM Medications m
      WHERE m.pharma_id = 3
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // Get a medication by ID
  async getMedicationById(medicationId) {
    const query = `
      SELECT * FROM Medications
      WHERE medication_id = ? AND pharma_id = 3
    `;
    const [rows] = await pool.query(query, [medicationId]);
    return rows[0];
  }

  // Update a medication
  async updateMedication(medicationId, medicationData) {
    const query = `
      UPDATE Medications
      SET
        medication_name = ?,
        availability = ?,
        availability_updated = NOW(),
        dosage = ?,
        dosage_unit = ?,
        category = ?
      WHERE medication_id = ? AND pharma_id = 3
    `;
    const values = [
      medicationData.medication_name,
      medicationData.availability,
      medicationData.dosage,
      medicationData.dosage_unit,
      medicationData.category,
      medicationId,
    ];
    const [result] = await pool.query(query, values);

    // Fetch the updated medication
    const [rows] = await pool.query("SELECT * FROM Medications WHERE medication_id = ?", [medicationId]);
    return rows[0]; // Return the full medication object
  }

  // Delete a medication
  async deleteMedication(medicationId) {
    const query = `
      DELETE FROM Medications
      WHERE medication_id = ? AND pharma_id = 3
    `;
    const [result] = await pool.query(query, [medicationId]);
    return result;
  }
}

module.exports = new Inventory125Service();