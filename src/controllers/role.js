const Role = require('../models/role');
const User = require('../models/user');

// Get all roles with associated users
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
 
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new role
exports.createRole = async (req, res) => {
  const { name } = req.body;
  const role = new Role({ name });

  try {
    const newRole = await role.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a role
exports.updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(updatedRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ message: 'Deleted Role' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
