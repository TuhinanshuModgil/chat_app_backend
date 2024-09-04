import express from 'express';
import { getAllGroups, createGroup } from '../controllers/group.controller.js';
import protectRoute from '../middleware/protectRoute.js';
import { getGroupMembers } from '../controllers/groupMessage.controller.js';

const router = express.Router();

// Route to get all groups
router.get('/:userId', protectRoute, getAllGroups);

// Route to create a new group
router.post('/', protectRoute, createGroup);
router.get('/members/:groupId', protectRoute, getGroupMembers);


export default router;
