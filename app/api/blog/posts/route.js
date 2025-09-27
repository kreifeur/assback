import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import BlogPost from '../../../../models/BlogPost';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    
    const skip = (page - 1) * limit;

    // Build filter
    let filter = { status: 'published' };
    if (category && category !== 'Tous') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (featured === 'true') filter.isFeatured = true;

    // Get blog posts
    const posts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content'); // Don't include full content in list

    const totalPosts = await BlogPost.countDocuments(filter);

    return NextResponse.json({
      success: true,
      posts: posts.map(post => ({
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
        viewCount: post.viewCount,
        isFeatured: post.isFeatured,
        slug: post.slug
      })),
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit)
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    
    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Create new blog post
    const post = await BlogPost.create({
      ...body,
      slug
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      post: {
        id: post._id.toString(),
        ...post.toObject()
      }
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}