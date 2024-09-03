import express from 'express';
import { getAllGroups, createGroup } from '../controllers/group.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

// Route to get all groups
router.get('/:userId', protectRoute, getAllGroups);

// Route to create a new group
router.post('/', protectRoute, createGroup);

export default router;
