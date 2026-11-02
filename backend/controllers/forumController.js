const ForumPost = require('../models/ForumPost');

/**
 * @route   GET /api/forum/posts
 * @desc    Public browse forum discussion threads
 * @access  Public
 */
const getPosts = async (req, res, next) => {
  try {
    const { tag, search } = req.query;
    const filter = { isModerated: false };

    if (tag && tag !== 'all') {
      filter.tag = tag;
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { content: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const posts = await ForumPost.find(filter)
      .populate('authorId', 'name role district expertVerificationStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: posts.length,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/forum/posts/:id
 * @desc    Get single forum post with comments
 * @access  Public
 */
const getPostById = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id).populate(
      'authorId',
      'name role district expertVerificationStatus'
    );

    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Forum post not found.' });
    }

    res.status(200).json({
      status: 'success',
      post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/forum/posts
 * @desc    Create a new discussion post
 * @access  Protected (Active Farmer, Verified Expert, Vendor, Buyer)
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, tag } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: 'error',
        message: 'Post title and content are required.',
      });
    }

    const isExpert = req.user.role === 'expert' && req.user.expertVerificationStatus === 'verified';

    const post = new ForumPost({
      authorId: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      isExpert,
      title: title.trim(),
      content: content.trim(),
      tag: tag || 'general',
      upvotes: 0,
    });

    await post.save();

    res.status(201).json({
      status: 'success',
      message: 'Forum topic published successfully.',
      post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/forum/posts/:id/comments
 * @desc    Add a comment to a discussion thread
 * @access  Protected (Active Farmer, Verified Expert, Vendor, Buyer)
 */
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Comment content cannot be empty.',
      });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found.' });
    }

    const isExpert = req.user.role === 'expert' && req.user.expertVerificationStatus === 'verified';

    const comment = {
      authorId: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      isExpert,
      content: content.trim(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({
      status: 'success',
      message: 'Comment posted.',
      post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/forum/posts/:id/upvote
 * @desc    Upvote a post
 * @access  Protected (Active Farmer, Verified Expert, Vendor, Buyer)
 */
const upvotePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found.' });
    }

    const userIdStr = req.user._id.toString();
    const alreadyUpvoted = post.upvotedBy.some((id) => id.toString() === userIdStr);

    if (alreadyUpvoted) {
      post.upvotedBy = post.upvotedBy.filter((id) => id.toString() !== userIdStr);
      post.upvotes = Math.max(0, post.upvotes - 1);
    } else {
      post.upvotedBy.push(req.user._id);
      post.upvotes += 1;
    }

    await post.save();

    res.status(200).json({
      status: 'success',
      upvotes: post.upvotes,
      hasUpvoted: !alreadyUpvoted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/forum/posts/:id
 * @desc    Delete or moderate a post
 * @access  Protected (Author or Admin)
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found.' });
    }

    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Unauthorized to delete this post.' });
    }

    await ForumPost.findByIdAndDelete(req.params.id);

    res.status(200).json({ status: 'success', message: 'Forum post deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  addComment,
  upvotePost,
  deletePost,
};
