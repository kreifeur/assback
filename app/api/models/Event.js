import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: 1000
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  endDate: {
    type: Date
  },
  location: {
    type: String,
    required: [true, 'Event location is required']
  },
  type: {
    type: String,
    enum: ['congress', 'workshop', 'training', 'exhibition', 'networking', 'visit'],
    required: true
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  memberPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['upcoming', 'past', 'cancelled'],
    default: 'upcoming'
  },
  program: [String],
  maxAttendees: {
    type: Number,
    min: 1
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  organizer: {
    type: String,
    default: 'Association de Cosmétologie'
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add index for better query performance
eventSchema.index({ date: 1, status: 1, type: 1 });

export default mongoose.models.Event || mongoose.model('Event', eventSchema);