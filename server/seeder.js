const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const Feedback = require('./models/Feedback');

dotenv.config();

const users = [
  {
    name: 'Admin EventHub',
    email: 'admin@eventhub.com',
    password: 'Password123!',
    role: 'admin'
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@eventhub.com',
    password: 'Password123!',
    role: 'organizer'
  },
  {
    name: 'Alex Morgan',
    email: 'alex@eventhub.com',
    password: 'Password123!',
    role: 'organizer'
  },
  {
    name: 'Karim Ben Salem',
    email: 'karim@eventhub.com',
    password: 'Password123!',
    role: 'organizer'
  },
  {
    name: 'Emma Watson',
    email: 'emma@eventhub.com',
    password: 'Password123!',
    role: 'organizer'
  }
];

const nowMs = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

const sampleEvents = [
  {
    title: 'North Africa Tech & AI Summit 2026',
    description: 'The largest gathering of software engineers, AI researchers, and tech founders across North Africa and the Mediterranean. Featuring keynote presentations from leading global AI labs, hands-on workshops on Large Language Models, and direct recruitment networking with fast-growing international startups.',
    category: 'Technology',
    date: new Date(nowMs + 12 * dayMs),
    location: 'Laico Tunis Convention Center, Tunis, Tunisia',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 3 // Karim
  },
  {
    title: 'React Universe & Next.js International Conf 2026',
    description: 'Two days dedicated entirely to modern frontend architecture, React 18 & 19 advancements, React Server Components, Turbopack, and high-performance full-stack web applications. Network with core team maintainers and explore real-world production case studies.',
    category: 'Technology',
    date: new Date(nowMs + 20 * dayMs),
    location: 'Queen Elizabeth II Centre, London, United Kingdom',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 2 // Alex
  },
  {
    title: 'AWS Cloud Architecture & Kubernetes DevFest',
    description: 'Deep dive into zero-downtime microservices deployments, serverless containers, infrastructure as code with Terraform, and multi-region resilience on AWS and hybrid clouds. Includes live debugging sessions and interactive architecture review panels.',
    category: 'Technology',
    date: new Date(nowMs + 28 * dayMs),
    location: 'Palais des Congrès, Paris, France',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 1 // Sarah
  },
  {
    title: 'Tomorrowland Winter Alpine Electro Festival',
    description: 'Experience an unforgettable spectacle where world-class electronic music meets the snow-covered peaks of the French Alps. Over 40 renowned DJs performing on mystical mountain stages surrounded by breathtaking alpine vistas.',
    category: 'Music',
    date: new Date(nowMs + 45 * dayMs),
    location: 'Alpe d\'Huez Grand Domaine Ski, France',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 1 // Sarah
  },
  {
    title: 'Acoustic Sunset Jazz & Soul by the Sea',
    description: 'An intimate evening of live Mediterranean jazz, soulful saxophone improvisations, and acoustic guitar serenades overlooking the sunset on the cliffside of Sidi Bou Said. Gourmet refreshments and specialty mocktails included with entry.',
    category: 'Music',
    date: new Date(nowMs + 8 * dayMs),
    location: 'Marina Bay Promenade, Sidi Bou Said, Carthage, Tunisia',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 3 // Karim
  },
  {
    title: 'Mediterranean Marathon & 10K International',
    description: 'Join over 8,000 professional and amateur runners traversing iconic historic landmarks from downtown Tunis through the ancient ruins of Carthage to the Mediterranean shoreline. Official chip timing, hydration stations, and medal for all finishers.',
    category: 'Sports',
    date: new Date(nowMs + 16 * dayMs),
    location: 'Avenue Habib Bourguiba to Carthage Coast, Tunis, Tunisia',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 3 // Karim
  },
  {
    title: 'Red Bull Urban Streetball & 3x3 Championship',
    description: 'High-octane urban basketball tournament featuring elite 3x3 streetball squads from across Europe. Expect thunderous slam dunks, live hip-hop DJ battles, and freestyle breakdancing showcases between elimination rounds.',
    category: 'Sports',
    date: new Date(nowMs + 24 * dayMs),
    location: 'Mauerpark Urban Arena, Berlin, Germany',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 2 // Alex
  },
  {
    title: 'Global Web3, FinTech & Venture Capital Forum',
    description: 'Connect with over 1,500 sovereign wealth funds, tier-1 venture partners, and breakthrough FinTech innovators. Panels cover real-world asset tokenization, frictionless cross-border payments, and regulatory frameworks across the Middle East and Europe.',
    category: 'Business',
    date: new Date(nowMs + 35 * dayMs),
    location: 'DIFC Fintech Hive Center, Dubai, United Arab Emirates',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 1 // Sarah
  },
  {
    title: 'SaaS Founder Showcase & Angel Pitch Day',
    description: 'Thirty pre-selected early-stage B2B SaaS startups pitch live to a panel of 50 active angel investors and venture capitalists. Includes one-on-one matchmaking sessions, product demos, and evening networking cocktail.',
    category: 'Business',
    date: new Date(nowMs + 18 * dayMs),
    location: 'Station F Innovation Campus, Paris, France',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 2 // Alex
  },
  {
    title: 'Full-Stack MERN & Microservices Architecture Masterclass',
    description: 'An intensive, hands-on workshop guiding engineers through building robust production-ready web platforms with React 18, Node.js Express, MongoDB Atlas, Docker containers, and automated CI/CD pipelines. All attendees receive complete source code and certificates.',
    category: 'Education',
    date: new Date(nowMs + 6 * dayMs),
    location: 'Online Live Interactive Studio & Discord Lounge',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 0 // Admin
  },
  {
    title: 'Contemporary Digital Art & Interactive Light Expo',
    description: 'Explore mind-bending generative digital sculptures, algorithmic projection mapping, and immersive sensory rooms designed by 25 pioneering visual artists. A breathtaking celebration of the intersection of technology and human creativity.',
    category: 'Art & Culture',
    date: new Date(nowMs + 22 * dayMs),
    location: 'Palais de Tokyo Modern Art Wing, Paris, France',
    imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 1 // Sarah
  },
  {
    title: 'International Specialty Coffee & Gourmet Pastry Fair',
    description: 'Indulge in artisanal single-origin espresso tastings, latte art championships, and mouthwatering French and Mediterranean pastries crafted by master bakers and champion baristas from 15 countries.',
    category: 'Other',
    date: new Date(nowMs + 15 * dayMs),
    location: 'Carrousel du Louvre, Paris, France',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    creatorIndex: 3 // Karim
  }
];

const sampleFeedbacks = [
  {
    eventIndex: 0, // North Africa Tech
    userIndex: 4, // Emma
    message: 'Attended the opening conference last year and this edition looks even more promising! The AI workshops are truly world class and the venue in Tunis is top tier.',
    rating: 5
  },
  {
    eventIndex: 0, // North Africa Tech
    userIndex: 2, // Alex
    message: 'High-caliber speakers, great networking with startup founders, and very well organized check-in process. Definitely a must-attend for any developer.',
    rating: 5
  },
  {
    eventIndex: 1, // React Universe
    userIndex: 4, // Emma
    message: 'Brilliant insights into React 19 compiler and server components. The Q&A session with core maintainers was worth the ticket alone.',
    rating: 5
  },
  {
    eventIndex: 2, // AWS Cloud
    userIndex: 3, // Karim
    message: 'Excellent practical takeaways on Kubernetes cost optimization and zero-trust security. The live terminal demos were super clean.',
    rating: 4
  },
  {
    eventIndex: 4, // Jazz Sidi Bou Said
    userIndex: 4, // Emma
    message: 'Pure magic! The sea breeze, the golden sunset over the Mediterranean, and the acoustic saxophone melodies created an unforgettable atmosphere.',
    rating: 5
  },
  {
    eventIndex: 5, // Marathon
    userIndex: 1, // Sarah
    message: 'Scenic route through the ancient Roman ruins of Carthage. The hydration stations were abundant and the crowd cheer squads were electrifying.',
    rating: 5
  },
  {
    eventIndex: 7, // Web3 Dubai
    userIndex: 4, // Emma
    message: 'Top tier networking with venture partners and fintech executives. Venue was impeccable and presentations were focused on real utility.',
    rating: 4
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Event.deleteMany();
    await Feedback.deleteMany();
    console.log('[Seeder] Cleared previous database records.');

    // Create users sequentially
    const createdUsers = [];
    for (const u of users) {
      const user = new User(u);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`[Seeder] Created ${createdUsers.length} users (Admin & Event Organizers).`);

    // Create realistic events
    const createdEvents = [];
    for (const ev of sampleEvents) {
      const author = createdUsers[ev.creatorIndex];
      const event = await Event.create({
        title: ev.title,
        description: ev.description,
        category: ev.category,
        date: ev.date,
        location: ev.location,
        imageUrl: ev.imageUrl,
        author: author._id
      });
      createdEvents.push(event);
    }
    console.log(`[Seeder] Created ${createdEvents.length} real events with authentic locations and images.`);

    // Create cumulative feedback entries (1 per user per event)
    for (const fb of sampleFeedbacks) {
      const event = createdEvents[fb.eventIndex];
      const author = createdUsers[fb.userIndex];
      if (event && author) {
        await Feedback.create({
          message: fb.message,
          rating: fb.rating,
          event: event._id,
          author: author._id
        });
      }
    }
    console.log(`[Seeder] Created ${sampleFeedbacks.length} authentic feedback and rating records.`);

    console.log('[Seeder] Real data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]', error);
    process.exit(1);
  }
};

seedData();
