import { connectToDatabase } from '../lib/mongodb';
import { Member } from '../models/Member';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      profession,
      company,
      address,
      city,
      postalCode,
      country,
      membershipType,
      plan,
      acceptTerms
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !profession || !acceptTerms) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Create member instance
    const member = new Member({
      firstName,
      lastName,
      email,
      phone,
      profession,
      company,
      address,
      city,
      postalCode,
      country,
      membershipType,
      plan,
      acceptTerms
    });

    // Validate member data
    const validationErrors = member.validate();
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Données de formulaire invalides',
        errors: validationErrors
      });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Check if member already exists
    const existingMember = await db.collection('members').findOne({ email: member.email });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Un membre avec cet email existe déjà'
      });
    }

    // Insert member into database
    const result = await db.collection('members').insertOne(member);
    
    // Get the inserted member
    const insertedMember = await db.collection('members').findOne({ _id: result.insertedId });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Adhésion enregistrée avec succès',
      data: {
        membershipNumber: insertedMember.membershipNumber,
        firstName: insertedMember.firstName,
        lastName: insertedMember.lastName,
        email: insertedMember.email,
        membershipType: insertedMember.membershipType,
        amount: insertedMember.amount,
        joinDate: insertedMember.joinDate,
        expiryDate: insertedMember.expiryDate
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de l\'adhésion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}