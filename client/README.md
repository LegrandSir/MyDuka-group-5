# MyDuka - Inventory Management System

![MyDuka Banner](https://via.placeholder.com/1200x300/4A90E2/FFFFFF?text=MyDuka+-+Smart+Inventory+Management)

## 📝 Description

MyDuka is a comprehensive store management and inventory tracking system designed to help merchants, store admins, and clerks manage day-to-day stock operations effectively. The system addresses the challenge of manual stock-taking by providing an affordable, user-friendly solution that simplifies inventory management, ensures accurate data collection, and generates visualized reports for better business insights.

### Key Features:
- **Role-based access control** (Merchant, Admin, Clerk)
- **Real-time inventory tracking** with automated updates
- **Supply request management** with approval workflows
- **Payment tracking** for suppliers and reconciliation
- **Visual analytics** with weekly, monthly, and annual reports
- **User management** with invitation-based registration

## 🛠️ Tools Used

### Frontend
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling and responsive design
- **Chart.js / Recharts** - Data visualization
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Jest & React Testing Library** - Testing

### Backend
- **Python 3.9+** - Programming language
- **Flask** - Web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Relational database
- **Flask-JWT-Extended** - JWT authentication
- **Flask-Mail** - Email service for invitations
- **Flask-CORS** - Cross-origin resource sharing
- **Pytest** - Testing framework
- **Alembic** - Database migrations

### DevOps & Tools
- **Git & GitHub** - Version control
- **GitHub Actions** - CI/CD pipeline
- **Figma** - UI/UX design
- **Postman** - API testing
- **Docker** - Containerization (optional)

---

## 🚀 Complete Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download Here](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download Here](https://www.python.org/)
- **PostgreSQL** (v12 or higher) - [Download Here](https://www.postgresql.org/)
- **Git** - [Download Here](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-organization/MyDuka-group-5.git
cd MyDuka-group-5
```

### Step 2: Backend Setup

#### 2.1 Navigate to the server directory
```bash
cd server
```

#### 2.2 Create and activate a virtual environment

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

#### 2.3 Install Python dependencies
```bash
pip install -r requirements.txt
```

#### 2.4 Set up PostgreSQL database

**Create a new database:**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE myduka_db;

# Create user (optional)
CREATE USER myduka_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE myduka_db TO myduka_user;

# Exit
\q
```

#### 2.5 Configure environment variables

Create a `.env` file in the `server` directory:

```bash
touch .env
```

Add the following configuration (update with your credentials):

```env
# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-here

# Database Configuration
DATABASE_URL=postgresql://myduka_user:your_password@localhost:5432/myduka_db

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ACCESS_TOKEN_EXPIRES=3600

# Email Configuration (Gmail example)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com

# Application Configuration
APP_URL=http://localhost:5173
```

**Note:** For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833).

#### 2.6 Initialize the database

```bash
# Initialize migrations
flask db init

# Create initial migration
flask db migrate -m "Initial migration"

# Apply migrations
flask db upgrade
```

#### 2.7 Seed the database (optional)

```bash
python seed.py
```

This creates sample data including:
- 1 Merchant account
- 2 Admin accounts
- 3 Clerk accounts
- Sample inventory items
- Sample supply requests

#### 2.8 Start the backend server

```bash
flask run
```

The API will be available at `http://localhost:5000`

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Step 3: Frontend Setup

#### 3.1 Open a new terminal and navigate to the client directory

```bash
cd client
```

#### 3.2 Install Node.js dependencies

```bash
npm install
```

#### 3.3 Configure environment variables

Create a `.env` file in the `client` directory:

```bash
touch .env
```

Add the following configuration:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MyDuka
```

#### 3.4 Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🎮 How to Run Your App

### Running in Development Mode

#### Start Backend Server (Terminal 1)
```bash
cd server
source venv/bin/activate  # On Windows: venv\Scripts\activate
flask run
```

#### Start Frontend Server (Terminal 2)
```bash
cd client
npm run dev
```

### Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Use the following default credentials (if you seeded the database):

**Merchant Account:**
- Email: `merchant@myduka.com`
- Password: `merchant123`

**Admin Account:**
- Email: `admin@myduka.com`
- Password: `admin123`

**Clerk Account:**
- Email: `clerk@myduka.com`
- Password: `clerk123`

### Running Tests

#### Frontend Tests
```bash
cd client
npm test                 # Run all tests
npm test -- --coverage   # Run with coverage report
npm test -- --watch      # Run in watch mode
```

#### Backend Tests
```bash
cd server
source venv/bin/activate
pytest                   # Run all tests
pytest --cov            # Run with coverage report
pytest -v               # Verbose mode
```

### Building for Production

#### Frontend
```bash
cd client
npm run build
```
The production build will be created in the `dist/` directory.

#### Backend
```bash
cd server
# Set environment variables for production
export FLASK_ENV=production
flask run
```

---


### 1. Login Page
```
![Login Page](https://via.placeholder.com/800x500/2C3E50/FFFFFF?text=Login+Page+-+Secure+Authentication)
*Secure login page with email and password authentication for all user roles*
```
---

### 2. Merchant Dashboard
```
![Merchant Dashboard](https://via.placeholder.com/800x500/3498DB/FFFFFF?text=Merchant+Dashboard+-+Overview+%26+Analytics)
*Comprehensive merchant dashboard showing store performance, analytics, and multi-store management with interactive charts and KPIs*

---
```

### 3. Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x500/27AE60/FFFFFF?text=Admin+Dashboard+-+Supply+Requests+%26+Payments)
*Admin interface for managing supply requests, tracking payments, and overseeing clerk activities with approval workflows*

---

### 4. Clerk Dashboard
![Clerk Dashboard](https://via.placeholder.com/800x500/E74C3C/FFFFFF?text=Clerk+Dashboard+-+Inventory+Management)
*Clerk interface for daily stock operations including recording items received, stock levels, spoilage, and creating supply requests*

---

### 5. Inventory Management
![Inventory Table](https://via.placeholder.com/800x500/9B59B6/FFFFFF?text=Inventory+Table+-+Real-time+Stock+Tracking)
*Detailed inventory table with real-time stock levels, pricing information, and payment status tracking*

---

### 6. Reports & Analytics
![Reports Dashboard](https://via.placeholder.com/800x500/F39C12/FFFFFF?text=Analytics+%26+Reports+-+Data+Visualization)
*Visual reports with interactive charts showing sales trends, inventory levels, and financial performance over weekly, monthly, and annual periods*

---

## 👥 Authors

**MyDuka Development Team - Group 5**

```

| Name | Role | GitHub | Email |
|------|------|--------|-------|
| John Doe | Full Stack Developer | [@johndoe](https://github.com/johndoe) | john.doe@example.com |
| Jane Smith | Full Stack Developer | [@janesmith](https://github.com/janesmith) | jane.smith@example.com |
| Michael Brown | Full Stack Developer | [@michaelbrown](https://github.com/michaelbrown) | michael.brown@example.com |
| Sarah Johnson | Full Stack Developer | [@sarahjohnson](https://github.com/sarahjohnson) | sarah.johnson@example.com |
```
---

## 🙏 Acknowledgements

We would like to express our gratitude to:

- **Moringa School** - For providing the learning environment and project guidelines
- **Our Technical Mentors** - For guidance and code reviews throughout the development process
- **Open Source Community** - For the amazing libraries and tools that made this project possible
- **Beta Testers** - For valuable feedback and bug reports
- **Stack Overflow Community** - For helping us troubleshoot issues during development

### Special Thanks To:
- React.js and Flask communities for excellent documentation
- Chart.js team for making data visualization simple
- Testing Library maintainers for robust testing tools

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

```
MIT License

Copyright (c) 2025 MyDuka Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support & Contact

For questions, issues, or contributions:

- **GitHub Issues**: [Report a Bug](https://github.com/your-organization/MyDuka-group-5/issues)
- **Email**: support@myduka.com
- **Documentation**: [Wiki](https://github.com/your-organization/MyDuka-group-5/wiki)

---

## 🔄 Version History

- **v1.0.0** (2025-01-15) - Initial release
  - User authentication and role management
  - Inventory tracking system
  - Supply request workflows
  - Payment management
  - Reports and analytics

---

## 🚦 Project Status

**Status**: ✅ Active Development

**Current Version**: 1.0.0

**Next Release**: v1.1.0 (Planned features: Mobile app, Advanced analytics, Multi-language support)

---

**Built with ❤️ by MyDuka Team**

⭐ **Star this repository** if you find it helpful!