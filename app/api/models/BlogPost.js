import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog post title is required'],
    trim: true,
    maxlength: 200
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: 300
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: String,
    required: [true, 'Author is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Maquillage', 'Soins', 'Naturel', 'Nutrition', 'Parfum', 'Innovation', 'Tendances']
  },
  readTime: {
    type: String,
    required: [true, 'Read time is required']
  },
  image: {
    type: String,
    default: ''
  },
  featuredImage: {
    type: String,
    default: ''
  },
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  seoTitle: String,
  seoDescription: String,
  slug: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better performance
blogPostSchema.index({ category: 1, status: 1 });
blogPostSchema.index({ isFeatured: 1, status: 1 });
blogPostSchema.index({ createdAt: -1 });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);