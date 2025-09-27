import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { db } = await connectToDatabase();
    
    const members = await db.collection('members')
      .find({})
      .project({ 
        firstName: 1,
        lastName: 1,
        email: 1,
        membershipType: 1,
        membershipNumber: 1,
        status: 1,
        joinDate: 1,
        expiryDate: 1
      })
      .sort({ joinDate: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: members,
      count: members.length
    });

  } catch (error) {
    console.error('Get members error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des membres'
    });
  }
}