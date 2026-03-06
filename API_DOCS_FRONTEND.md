# EmpowerHer Market - API Documentation for Frontend Developers

## Base URL
```
Production: https://api.empowerher.et
Development: http://localhost:5001
```

## Authentication
Most endpoints require JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Token is received after successful registration or login and expires in 30 days.

---

## TABLE OF CONTENTS
1. [Authentication & User Management](#1-authentication--user-management)
2. [Product Management](#2-product-management)
3. [Service Management](#3-service-management)
4. [Order Management](#4-order-management)
5. [Bulk Orders (Organizations)](#5-bulk-orders)
6. [Reviews & Ratings](#6-reviews--ratings)
7. [Financial Literacy Content](#7-financial-literacy-content)
8. [Vendor Groups](#8-vendor-groups)
9. [Admin Operations](#9-admin-operations)

---

## 1. AUTHENTICATION & USER MANAGEMENT

### 1.1 Register User
**Endpoint:** `POST /api/users/register`  
**Auth Required:** No  
**Description:** Register a new user (customer, vendor, organization, or admin)

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min 6 chars)",
  "phone": "string (required, format: +251XXXXXXXXX)",
  "role": "string (required: customer|vendor|organization|admin)",
  "language": "string (optional: amharic|afaan_oromo|tigrinya|english)",
  "location": {
    "city": "string",
    "subcity": "string",
    "woreda": "string"
  },
  
  // For vendors only:
  "skills": ["string array"],
  "paymentMethod": "string (telebirr|bank_transfer|cash)",
  "telebirrNumber": "string",
  
  // For organizations only:
  "organizationType": "string (restaurant|office|shop|hotel|other)",
  "businessName": "string"
}
```

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Marta Bekele",
    "email": "marta@example.com",
    "role": "vendor",
    "phone": "+251922345678",
    "language": "amharic"
  }
}
```

**Error Response (400):**
```json
{
  "message": "User already exists"
}
```

**Frontend Implementation Notes:**
- Save the token in localStorage or secure storage
- Redirect based on user role after registration
- Show language selection dropdown
- For vendors: show skills multi-select
- For organizations: show business type dropdown

---

### 1.2 Login
**Endpoint:** `POST /api/users/login`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Marta Bekele",
    "email": "marta@example.com",
    "role": "vendor"
  }
}
```

---

### 1.3 Get User Profile
**Endpoint:** `GET /api/users/profile`  
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "name": "Marta Bekele",
  "email": "marta@example.com",
  "role": "vendor",
  "phone": "+251922345678",
  "location": {
    "city": "Addis Ababa",
    "subcity": "Kirkos",
    "woreda": "08"
  },
  "language": "amharic",
  "skills": ["Laundry", "Babysitting", "Cooking"],
  "bio": "Experienced vendor with 5 years",
  "portfolio": ["url1.jpg", "url2.jpg"],
  "rating": 4.7,
  "totalReviews": 23,
  "totalEarnings": 15000,
  "isVerified": true,
  "isPhoneVerified": true,
  "paymentMethod": "telebirr",
  "telebirrNumber": "+251922345678"
}
```

**Frontend Use Cases:**
- Display user dashboard
- Show profile page
- Display vendor rating badge
- Show verification status

---

### 1.4 Update User Profile
**Endpoint:** `PUT /api/users/profile`  
**Auth Required:** Yes

**Request Body (all fields optional):**
```json
{
  "name": "string",
  "phone": "string",
  "location": {
    "city": "string",
    "subcity": "string",
    "woreda": "string"
  },
  "bio": "string",
  "skills": ["string array"],
  "portfolio": ["image urls"],
  "paymentMethod": "string",
  "telebirrNumber": "string",
  "bankAccount": {
    "bankName": "string",
    "accountNumber": "string"
  }
}
```

**Success Response (200):** Returns updated user object

---

## 2. PRODUCT MANAGEMENT

### 2.1 Create Product
**Endpoint:** `POST /api/products`  
**Auth Required:** Yes (Vendor only)

**Request Body:**
```json
{
  "name": "string (required)",
  "nameAmharic": "string (optional)",
  "description": "string (required)",
  "descriptionAmharic": "string (optional)",
  "price": "number (required)",
  "category": "string (required: handmade_crafts|food|clothes|jewelry|baskets|textiles|other)",
  "stock": "number (default: 0)",
  "minOrderQuantity": "number (default: 1)",
  "images": ["array of image URLs"],
  "bulkPricing": [
    {
      "minQuantity": "number",
      "price": "number"
    }
  ]
}
```

**Success Response (201):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "name": "Handmade Basket",
  "nameAmharic": "በእጅ የተሰራ ቅርጫት",
  "description": "Beautiful handwoven basket",
  "price": 250,
  "category": "baskets",
  "vendor": "65f1a2b3c4d5e6f7g8h9i0j2",
  "stock": 15,
  "images": ["url1.jpg"],
  "bulkPricing": [
    { "minQuantity": 10, "price": 220 },
    { "minQuantity": 50, "price": 200 }
  ],
  "rating": 0,
  "totalReviews": 0,
  "isActive": true,
  "isApproved": false,
  "createdAt": "2024-03-15T10:00:00Z"
}
```

**Frontend Notes:**
- Show "Pending Approval" badge if isApproved is false
- Display bulk pricing table
- Allow image upload (multiple files)
- Show Amharic input fields based on user language

---

### 2.2 Get All Products
**Endpoint:** `GET /api/products`  
**Auth Required:** No

**Query Parameters:**
- `category` - Filter by category
- `search` - Search in name/nameAmharic
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `isApproved` - Filter approved products (true/false)
- `location` - Filter by vendor location

**Example:**
```
GET /api/products?category=baskets&minPrice=100&maxPrice=500&isApproved=true
```

**Success Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "name": "Handmade Basket",
    "nameAmharic": "በእጅ የተሰራ ቅርጫት",
    "price": 250,
    "category": "baskets",
    "images": ["url1.jpg"],
    "stock": 15,
    "rating": 4.5,
    "totalReviews": 12,
    "vendor": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Marta Bekele",
      "phone": "+251922345678",
      "location": {
        "city": "Addis Ababa",
        "subcity": "Kirkos"
      },
      "rating": 4.7,
      "totalReviews": 23,
      "skills": ["Basket Making", "Weaving"]
    },
    "isApproved": true
  }
]
```

**Frontend Use Cases:**
- Product listing page
- Search and filter functionality
- Display vendor info card
- Show rating stars
- "Out of Stock" badge if stock === 0

---

### 2.3 Get Product by ID
**Endpoint:** `GET /api/products/:id`  
**Auth Required:** No

**Success Response (200):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "name": "Handmade Basket",
  "nameAmharic": "በእጅ የተሰራ ቅርጫት",
  "description": "Beautiful handwoven basket made from natural materials",
  "descriptionAmharic": "ከተፈጥሮ ቁሳቁሶች የተሰራ ቆንጆ የእጅ ሥራ ቅርጫት",
  "price": 250,
  "category": "baskets",
  "stock": 15,
  "minOrderQuantity": 1,
  "images": ["url1.jpg", "url2.jpg", "url3.jpg"],
  "bulkPricing": [
    { "minQuantity": 10, "price": 220 },
    { "minQuantity": 50, "price": 200 }
  ],
  "rating": 4.5,
  "totalReviews": 12,
  "vendor": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Marta Bekele",
    "phone": "+251922345678",
    "location": {
      "city": "Addis Ababa",
      "subcity": "Kirkos"
    },
    "rating": 4.7,
    "totalReviews": 23,
    "skills": ["Basket Making", "Weaving"],
    "bio": "Experienced basket maker with 10 years experience",
    "portfolio": ["portfolio1.jpg", "portfolio2.jpg"]
  },
  "isApproved": true,
  "createdAt": "2024-03-15T10:00:00Z"
}
```

**Frontend Use Cases:**
- Product detail page
- Show image gallery
- Display bulk pricing calculator
- Show vendor profile section
- Add to cart button
- Quantity selector (respect minOrderQuantity)

---

### 2.4 Update Product
**Endpoint:** `PUT /api/products/:id`  
**Auth Required:** Yes (Owner only)

**Request Body:** Same as Create Product (all fields optional)

**Success Response (200):** Returns updated product

---

### 2.5 Delete Product
**Endpoint:** `DELETE /api/products/:id`  
**Auth Required:** Yes (Owner only)

**Success Response (200):**
```json
{
  "message": "Product deleted"
}
```

---

## 3. SERVICE MANAGEMENT

### 3.1 Create Service
**Endpoint:** `POST /api/services`  
**Auth Required:** Yes (Vendor only)

**Request Body:**
```json
{
  "name": "string (required)",
  "nameAmharic": "string (optional)",
  "description": "string (required)",
  "descriptionAmharic": "string (optional)",
  "price": "number (required)",
  "category": "string (required: laundry|daycare|cleaning|cooking|catering|sewing|hairdressing|other)",
  "priceType": "string (per_hour|per_day|per_service|per_item)",
  "duration": "string (e.g., '2 hours', '1 day')",
  "location": {
    "city": "string",
    "subcity": "string"
  },
  "availability": [
    {
      "day": "string (monday|tuesday|wednesday|thursday|friday|saturday|sunday)",
      "startTime": "string (HH:MM format)",
      "endTime": "string (HH:MM format)"
    }
  ]
}
```

**Success Response (201):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
  "name": "Laundry Service",
  "nameAmharic": "የልብስ ማጠቢያ አገልግሎት",
  "price": 50,
  "category": "laundry",
  "priceType": "per_item",
  "provider": "65f1a2b3c4d5e6f7g8h9i0j2",
  "availability": [
    {
      "day": "monday",
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ],
  "rating": 0,
  "totalReviews": 0,
  "isApproved": false
}
```

---

### 3.2 Get All Services
**Endpoint:** `GET /api/services`  
**Auth Required:** No

**Query Parameters:**
- `category` - Filter by service category
- `search` - Search in name/nameAmharic
- `location` - Filter by city
- `minPrice` / `maxPrice`
- `isApproved` - true/false

**Example:**
```
GET /api/services?category=laundry&location=Addis Ababa&isApproved=true
```

**Success Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "name": "Laundry Service",
    "nameAmharic": "የልብስ ማጠቢያ አገልግሎት",
    "price": 50,
    "category": "laundry",
    "priceType": "per_item",
    "duration": "1 day",
    "location": {
      "city": "Addis Ababa",
      "subcity": "Kirkos"
    },
    "provider": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Marta Bekele",
      "phone": "+251922345678",
      "rating": 4.7,
      "totalReviews": 23,
      "skills": ["Laundry", "Cleaning"]
    },
    "availability": [...],
    "rating": 4.8,
    "totalReviews": 15,
    "isApproved": true
  }
]
```

**Frontend Use Cases:**
- Service listing page
- Filter by category and location
- Show availability calendar
- Display price with type (e.g., "50 Birr per item")

---

### 3.3 Get Service by ID
**Endpoint:** `GET /api/services/:id`  
**Auth Required:** No

**Success Response (200):** Similar to Get All Services but single object with full details

---

### 3.4 Update Service
**Endpoint:** `PUT /api/services/:id`  
**Auth Required:** Yes (Owner only)

---

### 3.5 Delete Service
**Endpoint:** `DELETE /api/services/:id`  
**Auth Required:** Yes (Owner only)

---

## 4. ORDER MANAGEMENT

### 4.1 Create Order
**Endpoint:** `POST /api/orders`  
**Auth Required:** Yes (Customer)

**Request Body:**
```json
{
  "vendor": "string (vendor user ID, required)",
  "orderType": "string (individual|bulk)",
  "items": [
    {
      "itemType": "string (product|service, required)",
      "itemId": "string (product/service ID, required)",
      "itemName": "string (required)",
      "quantity": "number (required)",
      "price": "number (required)",
      "subtotal": "number (required)"
    }
  ],
  "totalAmount": "number (required)",
  "paymentMethod": "string (telebirr|bank_transfer|cash, required)",
  "deliveryAddress": {
    "city": "string",
    "subcity": "string",
    "woreda": "string",
    "specificLocation": "string",
    "phone": "string"
  },
  "scheduledDate": "ISO date string (optional)",
  "notes": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
  "customer": "65f1a2b3c4d5e6f7g8h9i0j1",
  "vendor": "65f1a2b3c4d5e6f7g8h9i0j2",
  "orderType": "individual",
  "items": [...],
  "totalAmount": 750,
  "status": "pending",
  "paymentMethod": "telebirr",
  "paymentStatus": "pending",
  "deliveryAddress": {...},
  "scheduledDate": "2024-03-20T10:00:00Z",
  "createdAt": "2024-03-15T12:00:00Z"
}
```

**Frontend Notes:**
- Calculate subtotal for each item
- Calculate totalAmount (sum of all subtotals)
- Show payment method selection
- For services, show date/time picker
- Validate delivery address

---

### 4.2 Get My Orders
**Endpoint:** `GET /api/orders/my-orders`  
**Auth Required:** Yes

**Success Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "customer": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Almaz Tesfaye",
      "phone": "+251911234567"
    },
    "vendor": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Marta Bekele",
      "phone": "+251922345678",
      "location": {
        "city": "Addis Ababa"
      }
    },
    "items": [...],
    "totalAmount": 750,
    "status": "confirmed",
    "paymentStatus": "completed",
    "createdAt": "2024-03-15T12:00:00Z"
  }
]
```

**Frontend Use Cases:**
- Order history page
- Show order status badge with colors:
  - pending: yellow
  - confirmed: blue
  - in_progress: orange
  - completed: green
  - cancelled: red
- Allow review submission for completed orders

---

### 4.3 Get Order by ID
**Endpoint:** `GET /api/orders/:id`  
**Auth Required:** Yes

**Success Response (200):** Full order details with customer and vendor info

---

### 4.4 Update Order Status
**Endpoint:** `PUT /api/orders/:id/status`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "string (pending|confirmed|in_progress|completed|cancelled)"
}
```

**Success Response (200):** Returns updated order

**Frontend Notes:**
- Vendors can update to: confirmed, in_progress, completed
- Customers can update to: cancelled (only if pending)

---

## 5. BULK ORDERS (Organizations)

### 5.1 Create Bulk Order Request
**Endpoint:** `POST /api/bulk-orders`  
**Auth Required:** Yes (Organization only)

**Request Body:**
```json
{
  "vendor": "string (optional, can be null for open request)",
  "items": [
    {
      "itemType": "string (product|service)",
      "itemName": "string",
      "quantity": "number",
      "requestedPrice": "number (optional)"
    }
  ],
  "deliverySchedule": {
    "frequency": "string (once|daily|weekly|monthly)",
    "startDate": "ISO date",
    "endDate": "ISO date (optional)"
  },
  "deliveryAddress": {
    "city": "string",
    "subcity": "string",
    "specificLocation": "string",
    "phone": "string"
  },
  "notes": "string",
  "paymentTerms": "string"
}
```

**Success Response (201):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j6",
  "organization": "65f1a2b3c4d5e6f7g8h9i0j7",
  "vendor": null,
  "status": "requested",
  "items": [...],
  "deliverySchedule": {...},
  "createdAt": "2024-03-15T13:00:00Z"
}
```

**Status Flow:**
1. requested → Organization creates request
2. quoted → Vendor provides quote
3. accepted → Organization accepts quote
4. in_progress → Order is being fulfilled
5. completed → Order completed
6. cancelled → Order cancelled

---

### 5.2 Get All Bulk Orders
**Endpoint:** `GET /api/bulk-orders`  
**Auth Required:** Yes

**Success Response (200):**
- Organizations see their own bulk orders
- Vendors see bulk orders assigned to them or open requests

---

### 5.3 Update Bulk Order
**Endpoint:** `PUT /api/bulk-orders/:id`  
**Auth Required:** Yes

**Request Body (all optional):**
```json
{
  "vendor": "string (vendor can claim open request)",
  "status": "string",
  "items": [
    {
      "quotedPrice": "number (vendor provides quote)"
    }
  ],
  "totalAmount": "number"
}
```

---

## 6. REVIEWS & RATINGS

### 6.1 Create Review
**Endpoint:** `POST /api/reviews`  
**Auth Required:** Yes (Customer only)

**Request Body:**
```json
{
  "vendor": "string (vendor user ID, required)",
  "order": "string (order ID, required)",
  "itemType": "string (product|service|vendor, required)",
  "itemId": "string (product/service ID, optional for vendor review)",
  "ratings": {
    "quality": "number (1-5, required)",
    "reliability": "number (1-5, required)",
    "service": "number (1-5, required)"
  },
  "comment": "string (optional)",
  "commentAmharic": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j8",
  "customer": "65f1a2b3c4d5e6f7g8h9i0j1",
  "vendor": "65f1a2b3c4d5e6f7g8h9i0j2",
  "overallRating": 4.67,
  "ratings": {
    "quality": 5,
    "reliability": 5,
    "service": 4
  },
  "comment": "Excellent service!",
  "createdAt": "2024-03-15T14:00:00Z"
}
```

**Frontend Notes:**
- Show 3 separate star ratings (Quality, Reliability, Service)
- Calculate overall rating automatically: (quality + reliability + service) / 3
- Only allow review after order is completed
- One review per order

---

### 6.2 Get Vendor Reviews
**Endpoint:** `GET /api/reviews/vendor/:vendorId`  
**Auth Required:** No

**Success Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j8",
    "customer": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Almaz Tesfaye"
    },
    "overallRating": 4.67,
    "ratings": {
      "quality": 5,
      "reliability": 5,
      "service": 4
    },
    "comment": "Excellent service!",
    "commentAmharic": "በጣም ጥሩ አገልግሎት!",
    "createdAt": "2024-03-15T14:00:00Z"
  }
]
```

**Frontend Use Cases:**
- Display on vendor profile page
- Show rating breakdown (quality, reliability, service)
- Display comments in user's preferred language

---

## 7. FINANCIAL LITERACY CONTENT

### 7.1 Get All Content
**Endpoint:** `GET /api/financial-content`  
**Auth Required:** No

**Query Parameters:**
- `category` - pricing, saving, business_growth, marketing, budgeting, other
- `contentType` - video, article, tip

**Example:**
```
GET /api/financial-content?category=pricing&contentType=video
```

**Success Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j9",
    "title": "How to Price Your Products",
    "titleAmharic": "ምርቶችዎን እንዴት ዋጋ ማስያዝ እንደሚቻል",
    "description": "Learn the basics of pricing",
    "descriptionAmharic": "የዋጋ አወጣጥ መሰረታዊ ነገሮችን ይማሩ",
    "contentType": "video",
    "category": "pricing",
    "videoUrl": "https://youtube.com/watch?v=example",
    "thumbnailUrl": "https://example.com/thumb.jpg",
    "duration": "10:30",
    "views": 245,
    "createdAt": "2024-03-10T10:00:00Z"
  }
]
```

**Frontend Use Cases:**
- Learning center page
- Filter by category
- Show video player for videos
- Show article reader for articles
- Display tips as cards
- Track views when content is opened

---

### 7.2 Get Content by ID
**Endpoint:** `GET /api/financial-content/:id`  
**Auth Required:** No

**Success Response (200):** Full content details (automatically increments view count)

---

### 7.3 Create Content (Admin)
**Endpoint:** `POST /api/financial-content`  
**Auth Required:** Yes (Admin only)

---

## 8. VENDOR GROUPS

### 8.1 Create Group
**Endpoint:** `POST /api/vendor-groups`  
**Auth Required:** Yes (Vendor only)

**Request Body:**
```json
{
  "name": "string (required)",
  "nameAmharic": "string (optional)",
  "description": "string",
  "descriptionAmharic": "string",
  "category": "string (cooking|craft_making|textile_work|services|other, required)",
  "location": {
    "city": "string",
    "subcity": "string"
  }
}
```

**Success Response (201):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j10",
  "name": "Addis Ababa Craft Makers",
  "nameAmharic": "አዲስ አበባ የእጅ ሥራ ሰሪዎች",
  "category": "craft_making",
  "admin": "65f1a2b3c4d5e6f7g8h9i0j2",
  "members": ["65f1a2b3c4d5e6f7g8h9i0j2"],
  "location": {
    "city": "Addis Ababa"
  },
  "isActive": true,
  "createdAt": "2024-03-15T15:00:00Z"
}
```

---

### 8.2 Get All Groups
**Endpoint:** `GET /api/vendor-groups`  
**Auth Required:** No

**Query Parameters:**
- `category` - Filter by group category
- `location` - Filter by city

**Success Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j10",
    "name": "Addis Ababa Craft Makers",
    "nameAmharic": "አዲስ አበባ የእጅ ሥራ ሰሪዎች",
    "category": "craft_making",
    "admin": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Marta Bekele",
      "phone": "+251922345678"
    },
    "members": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
        "name": "Marta Bekele",
        "skills": ["Basket Making"],
        "location": {
          "city": "Addis Ababa"
        }
      }
    ],
    "location": {
      "city": "Addis Ababa"
    }
  }
]
```

**Frontend Use Cases:**
- Community page
- Show member count
- Display group categories
- Allow vendors to discover and join groups

---

### 8.3 Join Group
**Endpoint:** `POST /api/vendor-groups/:id/join`  
**Auth Required:** Yes (Vendor only)

**Success Response (200):** Returns updated group with new member

**Error Response (400):**
```json
{
  "message": "Already a member"
}
```

---

## 9. ADMIN OPERATIONS

### 9.1 Approve Vendor
**Endpoint:** `PUT /api/admin/vendors/:id/approve`  
**Auth Required:** Yes (Admin only)

**Success Response (200):** Returns updated user with isVerified: true

---

### 9.2 Approve Product
**Endpoint:** `PUT /api/admin/products/:id/approve`  
**Auth Required:** Yes (Admin only)

**Success Response (200):** Returns updated product with isApproved: true

---

### 9.3 Approve Service
**Endpoint:** `PUT /api/admin/services/:id/approve`  
**Auth Required:** Yes (Admin only)

**Success Response (200):** Returns updated service with isApproved: true

---

## COMMON PATTERNS & BEST PRACTICES

### Error Handling
All endpoints return errors in this format:
```json
{
  "message": "Error description"
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (no token or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

### Pagination (Future Enhancement)
Currently not implemented, but plan for:
```
GET /api/products?page=1&limit=20
```

### Language Support
- Always send both English and Amharic fields when creating content
- Display based on user's language preference
- Fallback to English if Amharic not available

### Image Uploads
- Images should be uploaded to a separate service (AWS S3, Cloudinary, etc.)
- Send image URLs in the request body
- Recommended image sizes:
  - Product images: 800x800px
  - Portfolio images: 1200x800px
  - Thumbnails: 300x300px

### Date Formats
- All dates are in ISO 8601 format
- Example: "2024-03-15T10:00:00Z"
- Use JavaScript Date object or moment.js for formatting

### Phone Number Format
- Ethiopian format: +251XXXXXXXXX
- Example: +251911234567

### Payment Integration
- Payment processing is handled separately
- After successful payment, update order paymentStatus to "completed"
- Store transactionId from payment gateway

---

## FRONTEND IMPLEMENTATION CHECKLIST

### Authentication
- [ ] Login form
- [ ] Registration form with role selection
- [ ] Token storage (localStorage/sessionStorage)
- [ ] Auto-logout on token expiration
- [ ] Protected routes based on user role

### Customer Features
- [ ] Browse products with filters
- [ ] Browse services with filters
- [ ] Product detail page
- [ ] Service detail page
- [ ] Shopping cart
- [ ] Checkout flow
- [ ] Order history
- [ ] Submit reviews
- [ ] View financial literacy content

### Vendor Features
- [ ] Vendor dashboard (earnings, orders, ratings)
- [ ] Add/edit products
- [ ] Add/edit services
- [ ] Manage orders
- [ ] View reviews
- [ ] Update profile and portfolio
- [ ] Join vendor groups

### Organization Features
- [ ] Create bulk order requests
- [ ] View bulk order status
- [ ] Accept vendor quotes
- [ ] Manage recurring orders

### Admin Features
- [ ] Approve vendors
- [ ] Approve products/services
- [ ] Upload financial content
- [ ] View platform statistics

---

## SUPPORT & QUESTIONS

For technical support or questions about the API:
- Backend Developer: [Your Contact]
- API Documentation: This file
- Postman Collection: POSTMAN_GUIDE_PART1.md
