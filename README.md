# WEBTREK IT SOLUTIONS – COMPLETE MERN STACK PLATFORM

A production-ready, full-stack website and administrative platform inspired by [Webtrek IT Solutions](https://webtrekitsolutions.in/). Built with clean **MVC architecture**, robust RESTful APIs, JWT authentication, and modern React 18 with Tailwind CSS.

---

## 🌟 Overview & Key Highlights

- **Visual Inspiration**: Modeled closely after the official [Webtrek IT Solutions](https://webtrekitsolutions.in/) design language:
  - Deep Navy Blue (`#021343`) and Radiant Orange (`#fe8a04`, `#ff5e13`) color identity.
  - Authentic typography (`Plus Jakarta Sans` & `Outfit`).
  - Identical section hierarchy: Hero showcase, Digital Marketing service cards, Website Development focus, Smart & Innovative solutions, Business Value pillars, Achievement counters, Our Best Team, Client testimonials, and interactive FAQ accordion.
- **Frontend Architecture**: React 18, Vite, React Router v7, Tailwind CSS, Lucide Icons, and centralized Axios client.
- **Backend Architecture**: Node.js, Express.js (MVC Pattern), MongoDB, Mongoose, JWT authentication, bcryptjs, Multer file upload handling, and Rate Limiting.
- **Full Admin Control Panel**: Comprehensive dashboard to manage Services, Portfolio Projects, Team Members, Client Testimonials, FAQs, Website Coordinates (Address, Phone, Email, Google Maps), and Customer Enquiries.
- **Automated Database Seeder**: One-command initialization (`npm run seed`) that populates the complete database with rich default reference content.

---

## 📁 Project Folder Structure

```text
webtrekitsolutions/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Topbar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── SectionHeader.jsx
│   │   │   │   ├── WhatsAppButton.jsx
│   │   │   │   └── EnquiryModal.jsx
│   │   │   └── home/
│   │   │       ├── HeroSection.jsx
│   │   │       ├── ServiceCards.jsx
│   │   │       ├── WebDevSection.jsx
│   │   │       ├── AboutSection.jsx
│   │   │       ├── BusinessValue.jsx
│   │   │       ├── AchievementCounters.jsx
│   │   │       ├── TeamSection.jsx
│   │   │       ├── TestimonialsSection.jsx
│   │   │       ├── FAQSection.jsx
│   │   │       └── ContactCTA.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── WebsiteContext.jsx
│   │   ├── layouts/
│   │   │   └── PublicLayout.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── AboutUsPage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   ├── ContactUsPage.jsx
│   │   │   ├── FAQPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminLoginPage.jsx
│   │   │       ├── AdminDashboardPage.jsx
│   │   │       ├── AdminEnquiriesPage.jsx
│   │   │       ├── AdminServicesPage.jsx
│   │   │       ├── AdminProjectsPage.jsx
│   │   │       ├── AdminTeamPage.jsx
│   │   │       ├── AdminTestimonialsPage.jsx
│   │   │       ├── AdminFAQsPage.jsx
│   │   │       └── AdminSettingsPage.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── serviceController.js
│   │   ├── projectController.js
│   │   ├── teamController.js
│   │   ├── testimonialController.js
│   │   ├── faqController.js
│   │   ├── enquiryController.js
│   │   └── settingController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Service.js
│   │   ├── Project.js
│   │   ├── Team.js
│   │   ├── Testimonial.js
│   │   ├── FAQ.js
│   │   ├── Enquiry.js
│   │   └── WebsiteSetting.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── testimonialRoutes.js
│   │   ├── faqRoutes.js
│   │   ├── enquiryRoutes.js
│   │   └── settingRoutes.js
│   ├── utils/
│   │   └── seed.js
│   ├── uploads/
│   ├── .env
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended; v24 installed)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection string)

---

### 2. Backend Setup & Run

Open a terminal and navigate to `backend/`:

```bash
cd backend
npm install
```

Configure `backend/.env` (already pre-configured):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/webtrek_db
JWT_SECRET=webtrek_super_secret_jwt_key_2026_production_ready
JWT_EXPIRE=30d
ADMIN_DEFAULT_EMAIL=admin@webtrekitsolutions.in
ADMIN_DEFAULT_PASSWORD=Admin@Webtrek2026!
CLIENT_URL=http://localhost:5173
```

#### Seed Initial Database
Populate all default reference services, projects, team members, testimonials, FAQs, settings, and the default Super Admin:
```bash
npm run seed
```

#### Start Backend Server
```bash
# Production mode
npm start

# Development watch mode
npm run dev
```
> The API will be accessible at: `http://localhost:5000`
> Health check: `http://localhost:5000/api/health`

---

### 3. Frontend Setup & Run

Open a separate terminal and navigate to `frontend/`:

```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
> The React website will be running at: `http://localhost:5173`

To create an optimized production build:
```bash
npm run build
```

---

## 🔐 Admin Panel Credentials

Access the Admin Portal by visiting:
👉 **URL**: `http://localhost:5173/admin/login`

- **Email**: `admin@webtrekitsolutions.in`
- **Password**: `Admin@Webtrek2026!`

### Admin Capabilities:
1. **Dashboard**: View high-level metrics (Total Enquiries, Services, Projects, Team) and latest client submissions.
2. **Customer Enquiries**: View detailed form submissions, update enquiry progress (`New` ➔ `Contacted` ➔ `In Progress` ➔ `Closed`), and delete spam.
3. **Services**: Add, edit, or delete digital offerings (title, slug, category, short & full descriptions, features list).
4. **Portfolio Projects**: Add and edit case studies (technologies, client name, live URL, banner image).
5. **Team**: Manage team profiles, roles, bios, and LinkedIn/Twitter handles.
6. **Testimonials**: Add verified client feedback, star ratings, and company names.
7. **FAQs**: Manage categorized question-and-answer accordions.
8. **Settings**: Edit official contact numbers (`+91 7496969728`), office address, business hours, and social media links. Changes update on the public website immediately.

---

## 📡 API Endpoint Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | Server uptime and health status |
| **POST** | `/api/auth/login` | Public | Authenticate admin & receive JWT |
| **GET** | `/api/auth/me` | Admin | Fetch current admin profile |
| **GET** | `/api/services` | Public | List all active services |
| **POST** | `/api/services` | Admin | Create new service |
| **PUT** | `/api/services/:id` | Admin | Update existing service |
| **DELETE** | `/api/services/:id` | Admin | Delete service |
| **GET** | `/api/projects` | Public | List portfolio projects (category filter supported) |
| **POST** | `/api/projects` | Admin | Add portfolio project |
| **PUT** | `/api/projects/:id` | Admin | Update portfolio project |
| **DELETE** | `/api/projects/:id` | Admin | Remove portfolio project |
| **GET** | `/api/team` | Public | List team members |
| **POST** | `/api/team` | Admin | Add team member |
| **GET** | `/api/testimonials` | Public | List client testimonials |
| **POST** | `/api/testimonials` | Admin | Add new testimonial |
| **GET** | `/api/faqs` | Public | List FAQs (category filter supported) |
| **POST** | `/api/faqs` | Admin | Create FAQ entry |
| **POST** | `/api/enquiries` | Public | Submit contact form from website |
| **GET** | `/api/enquiries` | Admin | List all inquiries (status filter supported) |
| **GET** | `/api/enquiries/stats`| Admin | Retrieve dashboard statistics |
| **PATCH**| `/api/enquiries/:id` | Admin | Update lead status (`New`, `Contacted`, etc.) |
| **DELETE**| `/api/enquiries/:id`| Admin | Delete inquiry record |
| **GET** | `/api/settings` | Public | Retrieve website contact information |
| **PUT** | `/api/settings` | Admin | Update website contact coordinates & links |

---

## 🧪 Verification & Testing Checklist

- [x] **Home Page (`/`)**: Hero section, service cards, web development showcase, about company, business values, achievement counters, team showcase, testimonials, FAQ, contact CTA, footer.
- [x] **About Us (`/about-us`)**: Mission, vision, core values, priority roadmap, team members, skill progress bars.
- [x] **Our Services (`/our-services`)**: 8 dedicated service sections with individual feature lists and enquiry triggers.
- [x] **Our Projects (`/our-project`)**: Filter tabs for `All`, `Web Development`, `Mobile App`, `E-Commerce`, `Digital Marketing`, `Custom Software`.
- [x] **Contact Us (`/contact-us`)**: Working contact form submitting to `/api/enquiries`, office coordinates in Indore, and interactive Google Maps embed.
- [x] **FAQ Page (`/faq`)**: Search filtering, category tabs, and animated accordion expansion.
- [x] **Admin Authentication**: JWT login, token persistence in localStorage, and automatic route protection.
- [x] **Admin CRUD**: Real-time CRUD operations for services, projects, team, testimonials, FAQs, and enquiries.
- [x] **Responsive Mobile Experience**: Tested for mobile devices with a slide-out navigation drawer and zero horizontal scrolling.

