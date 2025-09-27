import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import Event from '../../../../../models/Event';

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const { name, email, company, isMember, notes } = await request.json();
    const eventId = params.id;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event is full
    if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
      return NextResponse.json(
        { success: false, message: 'Event is full' },
        { status: 400 }
      );
    }

    // Increment attendee count
    event.currentAttendees += 1;
    await event.save();

    // In a real app, you would save the registration to a separate collection
    // and send confirmation emails, etc.

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      registration: {
        eventId: event._id.toString(),
        eventTitle: event.title,
        attendee: { name, email, company, isMember },
        price: isMember === 'yes' ? event.memberPrice : event.price,
        registrationDate: new Date().toISOString()
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}