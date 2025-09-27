import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Event from '../../../models/Event';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    
    // Build filter
    let filter = {};
    if (type && type !== 'all') filter.type = type;
    if (status && status !== 'all') filter.status = status;
    if (featured === 'true') filter.isFeatured = true;

    // Get events sorted by date
    const events = await Event.find(filter).sort({ date: 1 });

    return NextResponse.json({
      success: true,
      events: events.map(event => ({
        id: event._id.toString(),
        title: event.title,
        date: event.date.toISOString().split('T')[0],
        endDate: event.endDate ? event.endDate.toISOString().split('T')[0] : null,
        type: event.type,
        location: event.location,
        description: event.description,
        image: event.image,
        price: event.price.toString(),
        memberPrice: event.memberPrice.toString(),
        status: event.status,
        program: event.program,
        organizer: event.organizer,
        maxAttendees: event.maxAttendees,
        currentAttendees: event.currentAttendees,
        isFeatured: event.isFeatured
      }))
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
    
    // Create new event
    const event = await Event.create(body);

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event: {
        id: event._id.toString(),
        ...event.toObject()
      }
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}