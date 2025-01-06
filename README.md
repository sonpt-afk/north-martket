# NorthSide Marketplace

A modern e-commerce platform built with React, TypeScript, and Node.js that enables users to buy and sell products through a bidding system.

## 🚀 Features

- **User Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Protected routes

- **Product Management**

  - Create, read, update, and delete products
  - Image upload with Cloudinary integration
  - Advanced filtering and search capabilities
  - Real-time product status updates

- **Bidding System**

  - Place bids on products
  - Track bid history
  - Real-time notifications
  - Bid status management

- **Admin Dashboard**
  - User management
  - Product approval workflow
  - Analytics and monitoring

## 🛠️ Tech Stack

### Frontend

- React 18 with TypeScript
- Redux Toolkit for state management
- Ant Design for UI components
- Tailwind CSS for styling
- Axios for API communication
- React Router v7 for routing

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Multer for file handling

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/northside-mp.git
cd northside-mp
```

2. Install dependencies:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

3. Create

.env

file in root directory:

```env
mongo_url=your_mongodb_url
jwt_secret=your_jwt_secret
cloud_name=your_cloudinary_name
cloud_api_key=your_cloudinary_key
cloud_api_secret=your_cloudinary_secret
```

4. Start the development servers:

```bash
# Start backend (from root directory)
npm run server

# Start frontend (from client directory)
npm run dev
```

## 🌟 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── apicalls/      # API integration
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store and slices
│   │   ├── types/        # TypeScript type definitions
│   │   └── hooks/        # Custom React hooks
│   └── ...
└── server/                # Backend Node.js application
    ├── config/           # Configuration files
    ├── middlewares/      # Express middlewares
    ├── models/          # Mongoose models
    ├── routes/         # Express routes
    └── server.js       # Entry point
```
