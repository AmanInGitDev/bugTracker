const Project = require('../models/Project');
// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, teamMembers } = req.body;
    const project = new Project({ title, description, teamMembers });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add team member
exports.addTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const project = await Project.findByIdAndUpdate(
      id,
      { $addToSet: { teamMembers: email } },
      { new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove team member
exports.removeTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const project = await Project.findByIdAndUpdate(
      id,
      { $pull: { teamMembers: email } },
      { new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add this method to your projectController
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};