import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import BlogPost from '../../../../models/BlogPost';

export async function POST(request) {
  try {
    await dbConnect();

    // Clear existing blog posts
    await BlogPost.deleteMany({});

    // Sample blog posts matching your frontend structure
    const samplePosts = [
      {
        title: "Les Tendances Maquillage de l'Automne 2023",
        excerpt: "Découvrez les palettes de couleurs et techniques qui définiront cette saison.",
        content: `
          <p>L'automne 2023 apporte avec lui une palette de couleurs riche et des techniques innovantes qui redéfinissent le maquillage. Des tons bordeaux aux fumés verts, découvrez les tendances qui domineront cette saison.</p>
          
          <h3>Les couleurs phares</h3>
          <p>Les nuances de bordeaux, de prune et de vert profond sont incontournables cette saison. Ces couleurs apportent profondeur et caractère à tous les looks.</p>
          
          <h3>Les techniques à maîtriser</h3>
          <p>Le "strobing" subtil et le contouring naturel restent de mise, avec une préférence pour des finitions plus naturelles et lumineuses.</p>
          
          <p>Continuez votre lecture pour découvrir comment adapter ces tendances à votre routine beauté quotidienne!</p>
        `,
        author: "Sophie Laurent",
        category: "Maquillage",
        readTime: "5 min de lecture",
        image: "/blog/autumn-trends.jpg",
        tags: ["maquillage", "tendances", "automne", "couleurs"],
        isFeatured: true,
        status: "published"
      },
      {
        title: "Soins de la Peau : Routine Matinale Essentielle",
        excerpt: "Les étapes incontournables pour préparer votre peau à affronter la journée.",
        content: `
          <p>Une routine matinale efficace est essentielle pour protéger et préparer votre peau aux agressions quotidiennes. Découvrez les étapes clés pour une peau radieuse tout au long de la journée.</p>
          
          <h3>Nettoyage en douceur</h3>
          <p>Commencez par un nettoyant doux qui élimine les impuretés sans agresser la barrière cutanée. Privilégiez les textures gel ou lait selon votre type de peau.</p>
          
          <h3>Hydratation ciblée</h3>
          <p>Appliquez une crème hydratante adaptée à vos besoins spécifiques. Les peaux sèches opteront pour des textures riches, tandis que les peaux grasses préféreront des formulations légères.</p>
          
          <h3>Protection solaire indispensable</h3>
          <p>Terminez toujours avec une protection SPF, même par temps nuageux. C'est la meilleure protection contre le vieillissement prématuré.</p>
        `,
        author: "Marc Dubois",
        category: "Soins",
        readTime: "7 min de lecture",
        image: "/blog/morning-routine.jpg",
        tags: ["soins", "routine", "matin", "peau"],
        isFeatured: true,
        status: "published"
      },
      {
        title: "Les Ingrédients Naturels à Privilégier",
        excerpt: "Focus sur les composants biologiques qui révolutionnent la cosmétique.",
        content: `
          <p>La cosmétique naturelle continue de gagner du terrain, portée par des ingrédients aux propriétés remarquables. Tour d'horizon des composants à privilégier pour une beauté plus verte.</p>
          
          <h3>L'huile de jojoba</h3>
          <p>Excellente pour tous les types de peau, l'huile de jojoba régule la production de sébum et possède une composition proche de celle du sébum humain.</p>
          
          <h3>L'aloe vera</h3>
          <p>Apaisant, hydratant et régénérant, l'aloe vera est un incontournable pour calmer les irritations et hydrater en profondeur.</p>
          
          <h3>L'argile</h3>
          <p>Purifiante et absorbante, l'argile est idéale pour les masques détoxifiants. Chaque couleur d'argile possède des propriétés spécifiques.</p>
        `,
        author: "Élise Martin",
        category: "Naturel",
        readTime: "6 min de lecture",
        image: "/blog/natural-ingredients.jpg",
        tags: ["naturel", "ingrédients", "bio", "écologique"],
        status: "published"
      },
      // Add more posts from your static data...
      {
        title: "L'Impact de la Nutrition sur la Beauté de la Peau",
        excerpt: "Comment votre alimentation influence directement votre apparence.",
        content: `
          <p>Votre assiette est votre première routine beauté. Découvrez comment certains aliments peuvent transformer l'apparence de votre peau de l'intérieur.</p>
          
          <h3>Les antioxydants</h3>
          <p>Présents dans les fruits rouges, le thé vert et les légumes colorés, les antioxydants luttent contre le vieillissement cellulaire causé par les radicaux libres.</p>
          
          <h3>Les acides gras essentiels</h3>
          <p>Les oméga-3 et oméga-6, que l'on trouve dans les poissons gras, les noix et les graines, maintiennent l'hydratation cutanée et préservent l'intégrité de la barrière lipidique.</p>
          
          <h3>Les vitamines essentielles</h3>
          <p>La vitamine C stimule la production de collagène, la vitamine E protège des dommages oxydatifs, et la vitamine A favorise le renouvellement cellulaire.</p>
        `,
        author: "Dr. Claire Vincent",
        category: "Nutrition",
        readTime: "8 min de lecture",
        image: "/blog/nutrition-impact.jpg",
        tags: ["nutrition", "alimentation", "santé", "peau"],
        status: "published"
      }
    ];

    // Generate slugs and create posts
    const postsWithSlugs = samplePosts.map(post => {
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      return { ...post, slug };
    });

    await BlogPost.insertMany(postsWithSlugs);

    return NextResponse.json({
      success: true,
      message: 'Sample blog posts created successfully',
      count: postsWithSlugs.length
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}