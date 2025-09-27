import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Event from '../../../../models/Event';

export async function POST(request) {
  try {
    await dbConnect();

    // Clear existing events
    await Event.deleteMany({});

    // Sample events data matching your frontend structure
    const sampleEvents = [
      {
        title: "Congrès Annuel de Cosmétologie 2023",
        date: new Date('2023-09-15'),
        endDate: new Date('2023-09-17'),
        type: "congress",
        location: "Paris Convention Center",
        description: "Notre événement phare réunissant les experts du secteur pour échanger sur les dernières innovations, tendances et défis de la cosmétologie.",
        image: "/events/congres-annuel.jpg",
        price: 299,
        memberPrice: 199,
        status: "upcoming",
        program: [
          "Keynote: L'avenir de la cosmétique durable",
          "Panel: Innovations en formulation",
          "Ateliers pratiques",
          "Session de networking",
          "Cérémonie de remise des prix"
        ],
        maxAttendees: 500,
        currentAttendees: 350,
        isFeatured: true
      },
      {
        title: "Atelier Formulation Naturelle",
        date: new Date('2023-10-05'),
        type: "workshop",
        location: "Laboratoire Cosmetech, Paris",
        description: "Session pratique sur la formulation de cosmétiques naturels et bio. Apprenez les techniques de pointe avec nos experts.",
        image: "/events/atelier-formulation.jpg",
        price: 150,
        memberPrice: 90,
        status: "upcoming",
        program: [
          "Introduction aux ingrédients naturels",
          "Démonstration de formulation",
          "Session pratique",
          "Échanges avec les experts"
        ],
        maxAttendees: 30,
        currentAttendees: 25
      },
      // Add more events from your static data...
      {
        title: "Salon des Innovations Cosmétiques",
        date: new Date('2023-11-20'),
        endDate: new Date('2023-11-22'),
        type: "exhibition",
        location: "Expo Porte de Versailles, Paris",
        description: "Découvrez les dernières innovations produits, technologies et services lors de ce salon professionnel incontournable.",
        image: "/events/salon-innovations.jpg",
        price: 0,
        memberPrice: 0,
        status: "upcoming",
        program: [
          "Exposition des nouveautés",
          "Conférences techniques",
          "Rencontres B2B",
          "Espace networking"
        ]
      },
      {
        title: "Formation Réglementation Cosmétique",
        date: new Date('2023-08-10'),
        type: "training",
        location: "En ligne",
        description: "Formation complète sur la réglementation cosmétique européenne et internationale. Mise à jour des dernières évolutions.",
        image: "/events/formation-reglementation.jpg",
        price: 200,
        memberPrice: 120,
        status: "past",
        program: [
          "Règlementation UE",
          "Exigences documentation",
          "Cas pratiques",
          "Questions-réponses"
        ]
      }
    ];

    await Event.insertMany(sampleEvents);

    return NextResponse.json({
      success: true,
      message: 'Sample events created successfully',
      count: sampleEvents.length
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}