// Import the query function from the db.config.js file 
const conn = require("../config/db.config");
// Import the bcrypt module 
const bcrypt = require('bcrypt');

// A function to check if medication exists in the database 
async function checkIfMedicationExists(medicationName) {
  const query = "SELECT * FROM medications WHERE medication_name = ? ";
  const rows = await conn.query(query, [medicationName]);
  return rows.length > 0;
}

// A function to create a new medication 
async function createMedication(medication) {
  let createdMedication = {};
  try {
    const query = "INSERT INTO medications (medication_name, dosage, instructions) VALUES (?, ?, ?)";
    const rows = await conn.query(query, [medication.medication_name, medication.dosage, medication.instructions]);
    
    if (rows.affectedRows !== 1) {
      return false;
    }
    createdMedication = {
      medication_id: rows.insertId,
      medication_name: medication.medication_name
    };
  } catch (err) {
    console.log(err);
  }
  return createdMedication;
}

// A function to get medication by name
async function getMedicationByName(medication_name) {
  const query = "SELECT * FROM medications WHERE medication_name = ?";
  const rows = await conn.query(query, [medication_name]);
  return rows;
}

// Export the functions for use in the controller
module.exports = {
  checkIfMedicationExists,
  createMedication,
  getMedicationByName
};