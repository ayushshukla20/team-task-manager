const express = require('express');
const { body, validationResult } = require('express-validator');
const { Project, User, Task } = require('../models');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

// @route   POST /api/projects
// @desc    Create a project
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('name', 'Name is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      ownerId: req.user.id
    });
    
    // Add owner as a member
    await project.addMember(req.user.id);
    
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/projects
// @desc    Get user's projects
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      // Admin sees projects they own OR are a member of
      projects = await Project.findAll({
        include: [{
          model: User,
          as: 'members',
          attributes: ['id', 'name', 'email'],
          where: { id: req.user.id },
          required: false // LEFT JOIN so we still get owned projects even if not technically a member (though they should be)
        }],
        order: [['createdAt', 'DESC']]
      });
      // Fallback: simpler approach - Admin sees all projects
      projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
    } else {
      // Member sees projects they are added to
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Project,
          as: 'projects',
          through: { attributes: [] }
        }]
      });
      projects = user.projects;
    }
    
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'], through: { attributes: [] } }
      ]
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check access
    const isMember = project.members.some(m => m.id === req.user.id);
    if (req.user.role !== 'admin' && !isMember) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/projects/:id/members
// @desc    Add member to project
// @access  Private/Admin
router.post('/:id/members', protect, authorize('admin'), async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found with this email' });

    await project.addMember(user);
    res.json({ message: 'Member added to project successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
