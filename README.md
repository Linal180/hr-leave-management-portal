# Leave Request Workflow System

A professional SaaS HR platform for managing employee leave requests, built with Node.js, TypeScript, React, and Material-UI.

## 🚀 Features

### Core Functionality
- **Employee Leave Application**: Submit leave requests with date validation and balance checking
- **Manager Dashboard**: Review, approve, or reject pending leave requests
- **Role-based Access Control**: Separate interfaces for employees and managers
- **Leave Balance Management**: Automatic deduction and validation of leave balances
- **Date Overlap Prevention**: Prevents overlapping leave requests

### Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **Professional Architecture**: Clean separation of concerns with controllers, services, and middleware
- **Validation**: Comprehensive input validation using Zod schemas
- **Authentication**: JWT-based authentication with role-based authorization
- **Responsive Design**: Material-UI components with mobile-first approach
- **Error Handling**: Comprehensive error handling and user feedback
- **Testing**: Unit tests for critical business logic

## 🏗️ Architecture

### Backend (Node.js + TypeScript)
```
backend/
├── src/
│   ├── controllers/     # API endpoint handlers
│   ├── services/        # Business logic layer
│   ├── models/          # Data models and mock data
│   ├── middleware/      # Authentication and validation
│   ├── routes/          # API route definitions
│   ├── utils/           # Utility functions and constants
│   ├── types/           # TypeScript type definitions
│   └── config/          # Configuration management
├── tests/               # Unit tests
└── package.json
```

### Frontend (React + TypeScript + Material-UI)
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Auth/        # Authentication components
│   │   ├── Leave/       # Leave management components
│   │   └── Layout/      # Layout components
│   ├── pages/           # Page components
│   ├── contexts/        # React Context for state management
│   ├── services/        # API service layer
│   ├── constants/       # Application constants
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
└── public/
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build TypeScript**:
   ```bash
   npm run build
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## 🔐 Demo Credentials

### Employee Account
- **Email**: `john.doe@company.com`
- **Password**: `password123`

### Manager Account
- **Email**: `mike.johnson@company.com`
- **Password**: `password123`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/users` - Get all users (admin)

### Leave Management
- `POST /api/leave/apply` - Apply for leave (Employee)
- `GET /api/leave/pending` - Get pending requests (Manager)
- `GET /api/leave/my-requests` - Get employee's requests
- `POST /api/leave/approve/:id` - Approve/reject request (Manager)
- `GET /api/leave/all` - Get all requests
- `GET /api/leave/summary` - Get monthly summary

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🎯 Key Assumptions

1. **Mock Authentication**: Uses hardcoded credentials for demo purposes
2. **In-Memory Storage**: Data is stored in memory (not persistent)
3. **Simple Token System**: Uses basic token format instead of JWT for demo
4. **Single Manager Approval**: All managers can approve any request
5. **Leave Types**: Supports Annual, Sick, and Personal leave types
6. **Default Leave Balance**: New employees start with 20 days of leave

## 🏛️ Design Decisions

### Backend Architecture
- **Controller-Service Pattern**: Controllers handle HTTP concerns, services contain business logic
- **Middleware Chain**: Authentication and validation as reusable middleware
- **Type Safety**: Comprehensive TypeScript types for all data structures
- **Error Handling**: Centralized error handling with consistent response format

### Frontend Architecture
- **Component-Based**: Reusable components with clear separation of concerns
- **Context API**: Global state management for authentication and user data
- **Material-UI**: Professional UI components with consistent design system
- **TypeScript**: Full type safety with shared types between frontend and backend

### Validation Strategy
- **Zod Schemas**: Runtime validation with TypeScript integration
- **Client-Side Validation**: Immediate feedback for better UX
- **Server-Side Validation**: Security and data integrity
- **Date Validation**: Prevents past dates and invalid date ranges

## 🚀 Future Enhancements

1. **Database Integration**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Real JWT Authentication**: Implement proper JWT token system
3. **Email Notifications**: Send notifications for leave status changes
4. **Calendar Integration**: Visual calendar for leave requests
5. **Reporting Dashboard**: Advanced analytics and reporting
6. **Multi-level Approval**: Hierarchical approval workflow
7. **Leave Policies**: Configurable leave policies per department
8. **Mobile App**: React Native mobile application

## 📝 Development Notes

- All string literals are centralized in constants files
- Business logic is separated from UI components
- Error messages are user-friendly and actionable
- Loading states provide clear feedback to users
- Responsive design works on all device sizes
- Code is well-documented and follows TypeScript best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
