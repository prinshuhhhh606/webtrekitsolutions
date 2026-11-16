require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows DNS resolving MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const Admin = require('../models/Admin');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Team = require('../models/Team');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const WebsiteSetting = require('../models/WebsiteSetting');
const Blog = require('../models/Blog');

const defaultServices = [
  {
    title: 'Digital Marketing Services',
    slug: 'digital-marketing-services',
    shortDescription: 'We help businesses increase visibility, generate leads, and boost sales through tailored, result-driven digital strategies.',
    fullDescription: 'We help businesses increase visibility, generate leads, and boost sales through tailored, result-driven digital strategies including social media marketing, SEO, Google & Meta Ads, and automated lead generation.',
    icon: 'TrendingUp',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    category: 'Marketing',
    features: ['Social Media Marketing', 'Search Engine Optimization (SEO)', 'Google & Meta Ads', 'Lead Generation'],
    order: 1,
    isFeatured: true,
  },
  {
    title: 'Website Development Services',
    slug: 'website-development-services',
    shortDescription: 'We build modern, high-performance websites that not only look great but also drive results and support your business growth.',
    fullDescription: 'Webtrek builds responsive, high-performance websites tailored to your business goals. From corporate websites to e-commerce platforms, the team ensures a seamless user experience with modern design and clean coding practices.',
    icon: 'Code2',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
    category: 'Development',
    features: ['Custom Websites', 'Responsive Design', 'E-Commerce Solutions', 'Modern Frameworks'],
    order: 2,
    isFeatured: true,
  },
  {
    title: 'SEO Specialist Services',
    slug: 'seo-specialist-services',
    shortDescription: 'Dominate organic search results, outrank competitors, and capture high-intent customers on Google.',
    fullDescription: 'Complete search engine optimization including technical audits, semantic keyword mapping, high-authority backlink building, and local Google Business Profile rank boosting.',
    icon: 'Search',
    image: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=800&q=80',
    category: 'Marketing',
    features: ['Website SEO Audit', 'Keyword Research & Strategy', 'On-Page SEO', 'Off-Page SEO & Link Building', 'Local SEO', 'Monthly Reporting & Analytics'],
    order: 3,
    isFeatured: true,
  },
  {
    title: 'Social Media Marketing Services',
    slug: 'social-media-marketing-services',
    shortDescription: 'We help businesses build a strong online presence, engage their audience, and drive growth through strategic and creative social media campaigns.',
    fullDescription: 'Build strong community engagement, strategic brand positioning, profile optimization, and targeted social campaigns across Instagram, LinkedIn, and Meta.',
    icon: 'Share2',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    category: 'Marketing',
    features: ['Social Media Strategy & Planning', 'Content Creation & Design', 'Profile Optimization', 'Ad Campaign Management', 'Community Management', 'Analytics & Reporting'],
    order: 4,
    isFeatured: true,
  },
  {
    title: 'Lead Generation Services',
    slug: 'lead-generation-services',
    shortDescription: 'We help you attract, capture, and convert high-quality leads that fuel your business growth with proven strategies and targeted campaigns.',
    fullDescription: 'Targeted customer acquisition combining high-converting landing pages, automated email marketing, Meta Lead Ads, and CRM integrations.',
    icon: 'Target',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    category: 'Marketing',
    features: ['Targeted Campaigns- Meta Ads', 'Landing Page & Funnel Creation', 'Email Marketing Automation', 'Social Media Lead Ads', 'CRM Integration & Lead Management', 'Performance Tracking & Reporting'],
    order: 5,
    isFeatured: true,
  },
];

const defaultProjects = [
  {
    title: 'Graphic Design Monthly Subscription',
    slug: 'graphic-design-monthly-subscription',
    description: 'High-impact brand creatives, social media banners, and digital graphics tailored for your monthly marketing strategy.',
    client: 'Webtrek Client',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    technologies: ['Graphic Design', 'Social Media', 'Photoshop', 'Canva'],
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
    isFeatured: true,
    order: 1,
  },
  {
    title: 'Ecommerce Presentation Startup',
    slug: 'ecommerce-presentation-startup',
    description: 'Pitch decks, product roadmaps, and business deck architecture designed for innovative retail startups.',
    client: 'Retail Innovator',
    category: 'Consultant Business',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    technologies: ['Pitch Deck', 'Business Consulting', 'UI Presentation'],
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
    isFeatured: true,
    order: 2,
  },
  {
    title: 'Company Profile Web Development',
    slug: 'company-profile-web-development',
    description: 'Modern, high-performance corporate presence that establishes authority and drives business inquiries.',
    client: 'Corporate Enterprise',
    category: 'Website Development',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
    technologies: ['React.js', 'Node.js', 'Clean Coding', 'Responsive UI'],
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
    isFeatured: true,
    order: 3,
  },
  {
    title: 'Grow Social Media Marketing Business',
    slug: 'grow-social-media-marketing-business',
    description: 'Community building, organic storytelling, and targeted customer engagement on Instagram, LinkedIn, and Meta.',
    client: 'Brand Partner',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    technologies: ['Instagram Marketing', 'Meta Ads', 'Community Growth'],
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
    isFeatured: true,
    order: 4,
  },
  {
    title: 'Photography Ads For Business Media',
    slug: 'photography-ads-business-media',
    description: 'Visual advertising creatives, product photoshoot concepts, and high-CTR social ad creatives.',
    client: 'Media Group',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
    technologies: ['Photography', 'Visual Ads', 'Media Strategy'],
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
    isFeatured: true,
    order: 5,
  },
  {
    title: 'Comeback & Grow Business Services',
    slug: 'comeback-grow-business-services',
    description: 'Holistic business turnaround consulting, digital optimization, and revenue recovery roadmaps.',
    client: 'Commercial Client',
    category: 'Consultant Business',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    technologies: ['IT Consulting', 'Strategic Growth', 'Business Recovery'],
    liveUrl: 'https://webtrekitsolutions.in/our-project/',
    isFeatured: true,
    order: 6,
  },
];

const defaultTeam = [
  {
    name: 'Jane Doe',
    designation: 'Senior Digital Strategist',
    bio: 'Directing strategic brand growth and cross-channel marketing campaigns.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    order: 1,
  },
  {
    name: 'Ronald Ga',
    designation: 'Lead Full Stack Developer',
    bio: 'Specialist in modern web architectures, API security, and high performance.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    order: 2,
  },
  {
    name: 'Kristina',
    designation: 'UI/UX & Product Designer',
    bio: 'Crafting responsive, intuitive design systems and modern user experiences.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    order: 3,
  },
  {
    name: 'Priyanshu Rathore',
    designation: 'Founder & Managing Director',
    bio: 'Visionary leadership driving smart digital partnerships in Indore and beyond.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    order: 4,
  },
];

const defaultTestimonials = [
  {
    clientName: 'John De',
    company: 'Invision Inc.',
    designation: 'Client Partner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    feedback: 'Webtrek IT Solutions is a reliable and creative digital partner. Their technical execution on our web portal and marketing campaigns drove incredible results.',
    rating: 5,
    order: 1,
  },
  {
    clientName: 'Romano',
    company: 'Lead Developer',
    designation: 'Technical Director',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    feedback: 'High-performing, secure, and clean coding standards. Working with Webtrek made our system deployment smooth and on schedule.',
    rating: 5,
    order: 2,
  },
  {
    clientName: 'Radino',
    company: 'Store Manager',
    designation: 'E-commerce Lead',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    feedback: 'From initial consultation to final delivery, the team was responsive and focused on our business goals. Highly recommended for any serious business.',
    rating: 5,
    order: 3,
  },
];

const defaultFAQs = [
  {
    question: 'How To Order Service ?',
    answer: 'At Webtrek IT Solutions, getting started is simple! Step 1: Reach Out. Step 2: Tell Us What You Need. Step 3: Get a Free Quote. Step 4: Confirm & Begin.',
    category: 'General',
    order: 1,
  },
  {
    question: 'Can I Make An Offer ?',
    answer: 'Yes! At Webtrek IT Solutions, we work closely with startups, growing businesses, and established enterprises. We provide tailored scopes and flexible pricing options to align with your exact budget.',
    category: 'General',
    order: 2,
  },
  {
    question: 'How Long Guarante ?',
    answer: 'All our custom web development and software solutions include complimentary post-delivery warranty and dedicated bug-fix support.',
    category: 'Pricing & Support',
    order: 3,
  },
];

const defaultBlogs = [
  {
    title: 'Why Modern Web Development Demands High-Speed Scalable Frameworks',
    slug: 'why-modern-web-development-demands-high-speed-scalable-frameworks',
    category: 'Web Development',
    author: 'Webtrek Engineering',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Webtrek builds responsive, high-performance websites tailored to your business goals. Clean coding practices and modern architectures ensure seamless conversions.',
    content: `In the modern digital landscape, user attention spans are measured in seconds. If your business website takes longer than 3 seconds to load, over 50% of potential customers abandon the page.\n\nAt Webtrek IT Solutions, we leverage high-speed frameworks like React.js, Vite, Node.js, and optimized database indexing to ensure lightning-fast page transitions, exceptional mobile responsiveness, and high Core Web Vitals scores.\n\nKey pillars of modern web engineering:\n1. Clean component architecture and code splitting.\n2. Server-side caching and lightweight API payloads.\n3. Mobile-first fluid responsive layouts.\n4. Robust cybersecurity, SSL/TLS, and database protection.\n\nBy investing in scalable technology today, businesses avoid costly re-platforming and ensure their website remains competitive for years to come.`,
    readTime: '5 min read',
    tags: ['Web Development', 'React', 'Performance', 'Tech Trends'],
    isPublished: true,
  },
  {
    title: 'Top Digital Marketing Strategies to Grow Online-Based Businesses in 2026',
    slug: 'top-digital-marketing-strategies-grow-online-businesses-2026',
    category: 'Digital Marketing',
    author: 'Marketing Strategy Team',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'How data-driven PPC campaigns, social media marketing, and SEO lead funnels accelerate customer acquisition and revenue.',
    content: `Organic search visibility and targeted customer acquisition are the lifeblood of online businesses. Modern marketing requires an omnichannel approach connecting search intent, social proof, and automated email nurturing.\n\nTop strategies for 2026:\n1. Targeted Google Search Ads for high-intent queries.\n2. Engaging short-form video reels on Instagram and LinkedIn.\n3. Local SEO optimization to dominate Indore and regional map searches.\n4. Automated CRM funnels that convert incoming enquiries into paying customers immediately.\n\nWebtrek IT Solutions provides complete end-to-end digital marketing services tailored to your specific industry and budget.`,
    readTime: '6 min read',
    tags: ['Digital Marketing', 'SEO', 'Lead Generation', 'Growth'],
    isPublished: true,
  },
  {
    title: 'Transforming Business Efficiency with Custom Software & Automation',
    slug: 'transforming-business-efficiency-custom-software-automation',
    category: 'IT Consulting',
    author: 'Solutions Architect',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Leveraging modern cloud technology, AI, and workflow automation to streamline operations, eliminate bottlenecks, and stay competitive.',
    content: `Off-the-shelf software often fails to adapt to unique business operations. Custom business software, enterprise dashboards, and workflow automations bridge this gap.\n\nBenefits of tailored software solutions:\n1. Elimination of manual repetitive data entry.\n2. Centralized customer data and transparent analytics.\n3. Seamless integration between CRM, inventory, and payment gateways.\n4. Scalable cloud architecture supporting multi-branch growth.\n\nWebtrek IT Solutions consults with business owners to design, architect, and deploy custom enterprise platforms that drive measurable profitability.`,
    readTime: '7 min read',
    tags: ['Software Development', 'Automation', 'Cloud', 'Consulting'],
    isPublished: true,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/webtrek_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

    // Seed Admin
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@webtrekitsolutions.in';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      await Admin.create({
        name: 'Webtrek Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'superadmin',
      });
      console.log(`[Seed] Admin created: ${adminEmail}`);
    } else {
      admin.password = adminPassword;
      await admin.save();
      console.log(`[Seed] Admin password updated to '${adminPassword}' for ${adminEmail}`);
    }

    // Replace with exact reference data
    await Service.deleteMany({});
    await Service.insertMany(defaultServices);
    console.log(`[Seed] Inserted ${defaultServices.length} reference services.`);

    await Project.deleteMany({});
    await Project.insertMany(defaultProjects);
    console.log(`[Seed] Inserted ${defaultProjects.length} reference projects.`);

    await Team.deleteMany({});
    await Team.insertMany(defaultTeam);
    console.log(`[Seed] Inserted ${defaultTeam.length} reference team members.`);

    await Testimonial.deleteMany({});
    await Testimonial.insertMany(defaultTestimonials);
    console.log(`[Seed] Inserted ${defaultTestimonials.length} reference testimonials.`);

    await FAQ.deleteMany({});
    await FAQ.insertMany(defaultFAQs);
    console.log(`[Seed] Inserted ${defaultFAQs.length} reference FAQs.`);

    await Blog.deleteMany({});
    await Blog.insertMany(defaultBlogs);
    console.log(`[Seed] Inserted ${defaultBlogs.length} reference blogs.`);

    await WebsiteSetting.deleteMany({});
    await WebsiteSetting.create({
      companyName: 'Webtrek IT Solutions',
      tagline: 'Smart Partner For To Grow Your Best Business',
      phone: '+91 9039811558',
      email: 'webtrekitsolutions@gmail.com',
      address: '328 Patnipura, Main Road, Indore',
      businessHours: 'Mon - Sat: 9:30 AM - 6:30 PM (Sunday Closed)',
      socialLinks: {
        facebook: 'https://www.facebook.com/webtrekitsolutions',
        twitter: 'https://x.com/WebtrekIT',
        whatsapp: 'https://wa.me/919039811558',
      },
      stats: {
        projectsCompleted: '150+',
        clientSatisfaction: '99%',
        yearsExperience: '5+',
        supportHours: '24/7',
      },
    });
    console.log('[Seed] Settings updated with exact reference coordinates.');

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = { seedDB };
