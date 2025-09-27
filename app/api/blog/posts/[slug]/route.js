import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import BlogPost from '../../../../../models/BlogPost';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { slug } = params;

    // Find post by slug and increment view count
    const post = await BlogPost.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Get related posts (same category)
    const relatedPosts = await BlogPost.find({
      category: post.category,
      status: 'published',
      _id: { $ne: post._id }
    })
    .sort({ createdAt: -1 })
    .limit(3)
    .select('-content');

    return NextResponse.json({
      success: true,
      post: {
        id: post._id.toString(),
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        date: post.createdAt.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        author: post.author,
        category: post.category,
        readTime: post.readTime,
        image: post.image,
        viewCount: post.viewCount,
        tags: post.tags,
        slug: post.slug
      },
      relatedPosts: relatedPosts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        excerpt: post.excerpt,
        date: post.createdAt.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        author: post.author,
        category: post.category,
        readTime: post.readTime,
        image: post.image,
        slug: post.slug
      }))
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}