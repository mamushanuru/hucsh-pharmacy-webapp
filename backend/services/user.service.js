// user.service.js
const { pool } = require("../config/db.config"); // Import pool
const bcrypt = require("bcrypt");

// A function to check if a user exists in the database
async function checkIfUserExists(email) {
  const query = "SELECT * FROM users WHERE user_email = ?";
  const [rows] = await pool.query(query, [email]); // Use pool.query
  console.log(rows); // Log the result for debugging
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// A function to create a new user
async function createUser(user) {
  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();
    await connection.beginTransaction(); // Start a transaction

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.user_password, salt);

    // Insert the email into the users table
    const [userResult] = await connection.query(
      "INSERT INTO users (user_email, active_user) VALUES (?, ?)",
      [user.user_email, user.active_user]
    );

    if (userResult.affectedRows !== 1) {
      throw new Error("Failed to insert into users table");
    }

    // Get the user_id from the insert
    const user_id = userResult.insertId;

    // Insert the remaining data into the user_info table
    const [userInfoResult] = await connection.query(
      "INSERT INTO user_info (user_id, user_first_name, user_last_name, user_phone) VALUES (?, ?, ?, ?)",
      [user_id, user.user_first_name, user.user_last_name, user.user_phone]
    );

    if (userInfoResult.affectedRows !== 1) {
      throw new Error("Failed to insert into user_info table");
    }

    // Insert the hashed password into the user_pass table
    const [userPassResult] = await connection.query(
      "INSERT INTO user_pass (user_id, user_password_hashed) VALUES (?, ?)",
      [user_id, hashedPassword]
    );

    if (userPassResult.affectedRows !== 1) {
      throw new Error("Failed to insert into user_pass table");
    }

    // Commit the transaction
    await connection.commit();

    // Return the user object
    return { user_id };
  } catch (err) {
    // Rollback the transaction in case of error
    if (connection) await connection.rollback();
    console.error("Error creating user:", err);
    throw err; // Re-throw the error to be handled by the controller
  } finally {
    // Release the connection back to the pool
    if (connection) connection.release();
  }
}

// A function to get a user by email
async function getUserByEmail(user_email) {
  const query = `
    SELECT * FROM users 
    INNER JOIN user_info ON users.user_id = user_info.user_id 
    INNER JOIN user_pass ON users.user_id = user_pass.user_id 
    WHERE users.user_email = ?
  `;
  const [rows] = await pool.query(query, [user_email]);
  return rows;
}
async function getAllUsers() {
  const query = `
    SELECT 
      u.user_id,
      u.user_email,
      u.active_user,
      u.added_date,
      ui.user_first_name,
      ui.user_last_name,
      ui.user_phone
    FROM users u
    JOIN user_info ui ON u.user_id = ui.user_id
  `;
  const [rows] = await pool.query(query);
  return rows;
}

async function deleteUser(userId) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Delete from user_pass first
    await connection.query("DELETE FROM user_pass WHERE user_id = ?", [userId]);
    
    // Then delete from user_info
    await connection.query("DELETE FROM user_info WHERE user_id = ?", [userId]);
    
    // Finally delete from users
    const [result] = await connection.query("DELETE FROM users WHERE user_id = ?", [userId]);
    
    await connection.commit();
    return result.affectedRows > 0;
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Error deleting user:", err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
}


// Export the functions for use in the controller
module.exports = {
  checkIfUserExists,
  createUser,
  getUserByEmail,
  deleteUser,
  getAllUsers,
};