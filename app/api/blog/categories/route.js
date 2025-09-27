import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import BlogPost from '../../../../models/BlogPost';

export async function GET() {
  try {
    await dbConnect();

    // Get categories with post counts
    const categories = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      categories: categories.map(cat => ({
        name: cat._id,
        count: cat.count
      }))
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}