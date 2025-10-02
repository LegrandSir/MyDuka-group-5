# MyDuka - Inventory Management System

![MyDuka Banner]
(https://via.placeholder.com/1200x300/4A90E2/FFFFFF?text=MyDuka+-+Smart+Inventory+Management)



## 📋 Table of Contents
- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

## 🎯 Overview

MyDuka is a comprehensive store management and inventory tracking system designed to help merchants, store admins, and clerks manage day-to-day stock operations effectively. The system provides accurate data entry, clear reporting with visualizations, and smooth communication channels for approvals, supply requests, and financial reconciliation.

## 🔍 Problem Statement

Record keeping and stock taking are essential for every business entity. These processes help businesses make informed decisions on operations such as procurement, sales, and financial planning. While there are many approaches to stock management, only a few businesses can afford advanced tools such as automated report-generating apps. As a result, many businesses rely on manual or tedious methods, which often compromise accuracy and efficiency.

## 💡 Solution

MyDuka provides an affordable, user-friendly inventory management app that:
- Simplifies stock taking processes
- Ensures accurate data collection
- Generates visualized reports for better business insights
- Facilitates communication between team members
- Tracks payments and supplier reconciliation

## ✨ Features

### 🔐 Authentication & User Roles
- **Merchant (Superuser)**: Initializes registration by sending tokenized email invitations to store admins
- **Store Admin**: Registers via tokenized link (time-limited validity) and manages clerks
- **Clerk**: Records daily stock operations and submits supply requests
- JWT-based authentication for secure access

### 📊 Clerk Dashboard
Clerks can:
- Record number of items received
- Track payment status (paid/unpaid)
- Monitor current stock levels
- Log spoiled items (broken, expired, etc.)
- Record buying and selling prices
- Submit product supply requests to store admins

### 🎛️ Admin Dashboard
Admins can:
- View detailed reports on clerks' entries
- Approve or decline supply requests
- Track supplier payments (paid vs unpaid)
- Update payment statuses
- Manage clerk accounts (add, deactivate, delete)

### 👔 Merchant Dashboard (Superuser)
Merchants can:
- Add or remove store admins
- View store-by-store performance reports
- Access visualized graphs and analytics
- Drill down to individual store and product performance
- Track paid vs unpaid products across all stores

### 📈 Reports & Visualization
- Graphical reports (line graphs, bar graphs, pie charts)
- Weekly, monthly, and annual report levels
- Interactive data visualization
- Export capabilities

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js
- **State Management**: Redux Toolkit / Context API
- **Styling**: Tailwind CSS / CSS Modules
- **Visualization**: Chart.js / Recharts / D3.js
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite / Create React App

### Backend
- **Framework**: Python (Flask)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: SQLAlchemy
- **Testing**: Pytest / Minitest
- **Email Service**: Flask-Mail

### DevOps & Tools
- **Version Control**: Git (Gitflow workflow)
- **CI/CD**: GitHub Actions
- **Design**: Figma (wireframes)
- **API Documentation**: Swagger / Postman

## 📁 Project Structure

```
MyDuka-group-5/
├── client/                    # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store configuration
│   │   ├── services/         # API service functions
│   │   ├── utils/            # Utility functions
│   │   ├── assets/           # Images, fonts, etc.
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
├── server/                    # Backend Flask application
│   ├── app/
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Authentication, validation
│   │   ├── utils/            # Helper functions
│   │   └── __init__.py
│   ├── migrations/           # Database migrations
│   ├── tests/                # Backend tests
│   ├── config.py
│   ├── requirements.txt
│   └── run.py
│
├── .github/
│   └── workflows/            # GitHub Actions CI/CD
├── docs/                     # Documentation
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**

### Clone the Repository

```bash
git clone https://github.com/your-organization/MyDuka-group-5.git
cd MyDuka-group-5
```

### Backend Setup

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file in the server directory:
   ```env
   FLASK_APP=run.py
   FLASK_ENV=development
   DATABASE_URL=postgresql://username:password@localhost:5432/myduka_db
   JWT_SECRET_KEY=your-secret-key-here
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_USE_TLS=True
   ```

5. **Initialize the database**:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

6. **Seed the database (optional)**:
   ```bash
   python seed.py
   ```

7. **Run the backend server**:
   ```bash
   flask run
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to the client directory**:
   ```bash
   cd ../client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=MyDuka
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Default Credentials (Development)

After seeding the database, you can use these credentials:

- **Merchant**:
  - Email: `merchant@myduka.com`
  - Password: `merchant123`

- **Admin**:
  - Email: `admin@myduka.com`
  - Password: `admin123`

- **Clerk**:
  - Email: `clerk@myduka.com`
  - Password: `clerk123`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | Register via token | No |
| POST | `/api/auth/refresh` | Refresh JWT token | Yes |
| POST | `/api/auth/logout` | User logout | Yes |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/users` | Get all users | Yes | Admin, Merchant |
| GET | `/api/users/:id` | Get user by ID | Yes | All |
| POST | `/api/users/invite` | Send invitation | Yes | Merchant, Admin |
| PUT | `/api/users/:id` | Update user | Yes | Admin, Merchant |
| DELETE | `/api/users/:id` | Delete user | Yes | Merchant |

### Inventory Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/inventory` | Get all inventory items | Yes | All |
| GET | `/api/inventory/:id` | Get item by ID | Yes | All |
| POST | `/api/inventory` | Add new item | Yes | Clerk, Admin |
| PUT | `/api/inventory/:id` | Update item | Yes | Clerk, Admin |
| DELETE | `/api/inventory/:id` | Delete item | Yes | Admin, Merchant |

### Supply Request Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/supply-requests` | Get all requests | Yes | Admin, Merchant |
| POST | `/api/supply-requests` | Create request | Yes | Clerk |
| PUT | `/api/supply-requests/:id` | Update request status | Yes | Admin |

### Reports Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/reports/sales` | Get sales reports | Yes | Admin, Merchant |
| GET | `/api/reports/inventory` | Get inventory reports | Yes | Admin, Merchant |
| GET | `/api/reports/payments` | Get payment reports | Yes | Admin, Merchant |

For detailed API documentation, visit `/api/docs` when the server is running.

## 🧪 Testing

### Frontend Tests

```bash
cd client
npm test                 # Run all tests
npm test -- --coverage   # Run tests with coverage
npm test -- --watch      # Run tests in watch mode
```

### Backend Tests

```bash
cd server
pytest                   # Run all tests
pytest --cov            # Run tests with coverage
pytest -v               # Run tests in verbose mode
```

### Test Coverage Goals
- Frontend: Minimum 80% coverage
- Backend: Minimum 80% coverage

## 🚢 Deployment

### CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment. The workflow includes:

1. **Code Quality Checks**
   - Linting (ESLint for frontend, Flake8 for backend)
   - Code formatting (Prettier, Black)

2. **Testing**
   - Unit tests
   - Integration tests
   - Test coverage reports

3. **Build**
   - Frontend production build
   - Backend Docker image

4. **Deployment**
   - Automatic deployment to staging on merge to `develop`
   - Manual deployment to production from `main`

### Manual Deployment

#### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy the dist/ folder to your hosting service
```

#### Backend (Heroku/Railway)

```bash
cd server
# Follow your hosting provider's deployment instructions
```

### Environment Variables

Ensure all production environment variables are properly configured in your hosting platform.

## 🤝 Contributing

We follow the **Gitflow workflow** for this project. Please adhere to the following guidelines:

### Branch Naming Convention

- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - New features
- `bugfix/bug-name` - Bug fixes
- `hotfix/issue-name` - Critical fixes

### Workflow

1. **Create a feature branch**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. **Push to remote**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** to `develop` branch

### Commit Message Convention

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example: `feat: add user authentication endpoint`

### Code Review Process

- All PRs require at least one approval
- All tests must pass
- Code coverage must not decrease
- Follow the project's coding standards

## 👥 Team

**Full Stack Team - Group 5**

| Name | Role | GitHub | Email |
|------|------|--------|-------|
| [Name] | Full Stack Developer | [@username](https://github.com/username) | email@example.com |
| [Name] | Full Stack Developer | [@username](https://github.com/username) | email@example.com |
| [Name] | Full Stack Developer | [@username](https://github.com/username) | email@example.com |
| [Name] | Full Stack Developer | [@username](https://github.com/username) | email@example.com |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support, please contact:
- Project Repository: [GitHub Issues](https://github.com/your-organization/MyDuka-group-5/issues)
- Email: support@myduka.com

## 🙏 Acknowledgments

- Moringa School for project guidance
- All contributors and team members
- Open source libraries and tools used in this project

---

**Built with ❤️ by MyDuka Team**