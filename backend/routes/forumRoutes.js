const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  addComment,
  upvotePost,
  deletePost,
} = require('../controllers/forumController');
const {
  authenticateToken,
  requireForumWritePermission,
} = require('../middleware/auth');

// Public forum reading
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);

// Protected forum writing (active farmers, verified experts, vendors, buyers only)
router.post(
  '/posts',
  authenticateToken,
  requireForumWritePermission,
  createPost
);
router.post(
  '/posts/:id/comments',
  authenticateToken,
  requireForumWritePermission,
  addComment
);
router.post(
  '/posts/:id/upvote',
  authenticateToken,
  requireForumWritePermission,
  upvotePost
);
router.delete('/posts/:id', authenticateToken, deletePost);

module.exports = router;
