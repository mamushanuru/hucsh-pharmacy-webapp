const userService = require("../services/user.service");

async function createUser(req, res, next) {
  try {
    const userExists = await userService.checkIfUserExists(req.body.user_email);
    if (userExists) {
      return res.status(400).json({
        error: "This email address is already taken!",
      });
    }

    const userData = req.body;
    const user = await userService.createUser(userData);

    res.status(200).json({
      status: true,
      message: "User created successfully!",
      user_id: user.user_id,
    });
  } catch (error) {
    console.error("Error in createUser controller:", error);
    res.status(500).json({
      error: "An error occurred during registration. Please try again.",
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      status: "success",
      data: users, // Ensure this is always an array
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: "Failed to fetch users",
      details: error.message
    });
  }
}

async function getUserByEmail(req, res) {
  const { email } = req.query;
  try {
    const user = await userService.getUserByEmail(email);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    const deleted = await userService.deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ 
      message: "An error occurred while deleting the user",
      error: error.message 
    });
  }
}


module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  deleteUser,
};