# start 05-03-2026
1. 

TN Temples Backend Project Overview Report
Based on a comprehensive analysis of the codebase, here's a detailed report on the project overview, architecture, and data flow:

PROJECT OVERVIEW
Name: TN Temples Backend
Type: RESTful API for temple information management in Tamil Nadu
Tech Stack:

Runtime: Node.js with Express.js v5.2.1
Database: MongoDB with Mongoose v9.2.4
Authentication: JWT (JSON Web Tokens)
File Storage: Multer (disk storage)
Email: Nodemailer (Gmail)
Security: Helmet, CORS, bcryptjs
Logging: Morgan
ARCHITECTURE
The application follows a layered, service-oriented architecture:

Key Layers:

Routes (src/routes/): HTTP endpoints for auth, temples, masters, contributor requests
Controllers (src/controllers/): Handle HTTP requests/responses
Services (src/services/): Business logic implementation
Repositories (src/repositories/): Data access layer abstractions
Models (src/models/): MongoDB schemas
Middleware (src/middleware/): Authentication, file uploads, logging
DATA MODELS
User Model
name, email (unique), password (hashed)
role (Public, Contributor, Trusted Contributor, Admin)
points, district, inviteToken & expiry
isActive, isVerified flags
Temple Model
name, slug, history, description
deity, district, timings, location (GeoJSON Point)
images array, festivals array
contributor, status (pending/approved/rejected)
views counter, approval metadata
Master Data Models
Deity: name (unique)
District: name (unique)
Festival: name, month, description
ContributorRequest Model
name, email, district, message
status (pending/approved/rejected)
API ENDPOINTS & FUNCTIONALITY
1. AUTHENTICATION (/api/v1/auth)
POST /login - User login
POST /register - Admin creates users
GET /me - Get profile
POST /set-password - Set password via invite
2. TEMPLE MANAGEMENT (/api/v1/temples)
Public: List temples, get by slug, nearby search
Contributor: Create temples (3-10 images), view own temples
Admin: Approve/reject pending temples
3. CONTRIBUTOR REQUESTS (/api/v1/contributors)
POST / - Submit request
GET / - Admin views requests
PATCH /:id/approve - Admin approves
4. MASTER DATA (/api/v1/masters)
Generic CRUD for Deity, District, Festival entities
REQUEST FLOW EXAMPLES
Public Temple Listing
Temple Creation (Contributor)
Geolocation Query
AUTHENTICATION & AUTHORIZATION
JWT Tokens: 7-day expiry, HS256 algorithm
Middleware: protect (verify token), authorize (check roles)
Roles: Public (view), Contributor (submit), Admin (manage)
CONTRIBUTOR ONBOARDING WORKFLOW
User submits request → status="pending"
Admin approves → generates invite token → sends email
User clicks link → sets password → account activated
User can now login and contribute temples
KEY FEATURES
✅ JWT authentication with role-based access
✅ Temple CRUD with approval workflow
✅ Multi-image upload (3-10 per temple)
✅ Geospatial search for nearby temples
✅ Contributor request system with email invites
✅ Generic master data management
✅ Secure file storage and serving