const express = require('express');
const { body, validationResult } = require('express-validator');
const { Task, Project, User } = require('../models');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/tasks/dashboard/summary
// @desc    Get dashboard summary
// @access  Private
// NOTE: This must be BEFORE /:id routes to prevent "dashboard" from being matched as an ID
router.get('/dashboard/summary', protect, async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === 'member') {
      whereClause.assignedTo = req.user.id;
    }

    const totalTasks = await Task.count({ where: whereClause });
    const todoTasks = await Task.count({ where: { ...whereClause, status: 'todo' } });
    const inProgressTasks = await Task.count({ where: { ...whereClause, status: 'in-progress' } });
    const doneTasks = await Task.count({ where: { ...whereClause, status: 'done' } });
    
    // Overdue tasks
    const today = new Date();
    const overdueTasks = await Task.count({
      where: {
        ...whereClause,
        status: { [Op.ne]: 'done' },
        dueDate: { [Op.lt]: today }
      }
    });

    res.json({
      total: totalTasks,
      todo: todoTasks,
      inProgress: inProgressTasks,
      done: doneTasks,
      overdue: overdueTasks
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('title', 'Title is required').not().isEmpty(),
  body('projectId', 'Project ID is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.id
    });
    
    const populatedTask = await Task.findByPk(task.id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json(populatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/tasks
// @desc    Get tasks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;
    
    let whereClause = {};
    if (projectId) whereClause.projectId = projectId;
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;

    // Members only see tasks assigned to them
    if (req.user.role === 'member') {
      whereClause.assignedTo = req.user.id;
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] }
      ]
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Ensure member only updates their own tasks, but allow admins to update any
    if (req.user.role !== 'admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Members can only update status
    let updateData = req.body;
    if (req.user.role !== 'admin') {
      updateData = { status: req.body.status };
    }

    await task.update(updateData);
    
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.destroy();
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
