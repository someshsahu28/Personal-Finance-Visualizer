# 💰 Personal Finance Tracker

A comprehensive full-stack personal finance management application built with Next.js 13, MongoDB Atlas, and modern web technologies. Features secure user authentication, real-time data persistence, and beautiful financial insights with interactive visualizations.

![Personal Finance Tracker](https://img.shields.io/badge/Next.js-13.5.1-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge&logo=jsonwebtokens)

## ✨ Features

### 🔐 **Authentication & Security**
- ✅ **User Registration** with email validation
- ✅ **Secure Login** with JWT tokens
- ✅ **Password hashing** using bcrypt (12 salt rounds)
- ✅ **HTTP-only cookies** for session management
- ✅ **Protected routes** with middleware authentication
- ✅ **Multi-user support** with data isolation

### 📊 **Transaction Management**
- ✅ **Add, edit, and delete** income/expense transactions
- ✅ **Categorize transactions** with predefined categories
- ✅ **Real-time transaction** filtering and search
- ✅ **Transaction history** with detailed views
- ✅ **API-based CRUD** operations with MongoDB
- ✅ **Date-based filtering** and organization

### 💳 **Budget Management**
- ✅ **Set monthly budgets** by category
- ✅ **Track budget vs actual** spending
- ✅ **Budget alerts** when approaching limits
- ✅ **Visual budget progress** indicators
- ✅ **Budget performance** tracking over time
- ✅ **API-based budget** management

### 📈 **Analytics & Insights**
- ✅ **Interactive charts** and visualizations
- ✅ **Monthly spending** trends
- ✅ **Category-wise expense** breakdown
- ✅ **Spending insights** and recommendations
- ✅ **Financial overview** dashboard
- ✅ **Real-time data** visualization

### 🎨 **User Experience**
- ✅ **Modern, responsive** design
- ✅ **Dark/light theme** support
- ✅ **Smooth animations** and transitions
- ✅ **Mobile-friendly** interface
- ✅ **Intuitive navigation** with tabs
- ✅ **Loading states** and error handling

### 💾 **Data Management**
- ✅ **MongoDB Atlas** cloud database
- ✅ **Real-time data** synchronization
- ✅ **RESTful API** endpoints
- ✅ **Data validation** and error handling
- ✅ **User data isolation** and security
- ✅ **Production-ready** database setup

## 🔌 API Endpoints

### **Authentication Routes**

#### `POST /api/auth/signup`
Register a new user account
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### `POST /api/auth/signin`
Authenticate user and create session
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### `GET /api/auth/verify`
Verify JWT token and get user info
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### `POST /api/auth/logout`
Clear user session and logout

### **Transaction Routes**

#### `GET /api/transactions`
Get all user transactions
```json
{
  "transactions": [
    {
      "_id": "transaction_id",
      "amount": 50.00,
      "description": "Grocery shopping",
      "category": "food",
      "type": "expense",
      "date": "2024-01-15",
      "userId": "user_id"
    }
  ]
}
```

#### `POST /api/transactions`
Create a new transaction
```json
{
  "amount": 50.00,
  "description": "Grocery shopping",
  "category": "food",
  "type": "expense",
  "date": "2024-01-15"
}
```

#### `DELETE /api/transactions/[id]`
Delete a specific transaction

### **Budget Routes**

#### `GET /api/budgets`
Get all user budgets
```json
{
  "budgets": [
    {
      "_id": "budget_id",
      "categoryId": "food",
      "amount": 500.00,
      "month": "2024-01",
      "userId": "user_id"
    }
  ]
}
```

#### `POST /api/budgets`
Create or update a budget
```json
{
  "categoryId": "food",
  "amount": 500.00,
  "month": "2024-01"
}
```

#### `DELETE /api/budgets/[id]`
Delete a specific budget

### **Database Test Route**

#### `GET /api/test-db`
Test MongoDB connection status

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- MongoDB Atlas account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker

   # JWT Secret Key (Change this in production!)
   JWT_SECRET=your-super-secret-jwt-key-here

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up MongoDB Atlas**
   - Create a [MongoDB Atlas](https://www.mongodb.com/atlas) account
   - Create a new cluster
   - Get your connection string
   - Add your IP address to the whitelist
   - Update `MONGODB_URI` in `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 13.5.1** - React framework with App Router
- **React 18** - UI library with hooks
- **TypeScript 5.0** - Type-safe JavaScript

### **Backend & Database**
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose** - MongoDB object modeling
- **Next.js API Routes** - Serverless API endpoints
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing

### **Authentication & Security**
- **JWT Tokens** - Stateless authentication
- **HTTP-only Cookies** - Secure session management
- **bcrypt Hashing** - Password security (12 salt rounds)
- **Protected Routes** - Middleware authentication

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons
- **CSS Modules** - Scoped styling

### **Charts & Visualization**
- **Recharts** - Composable charting library
- **Dynamic imports** - Optimized chart loading

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **@types packages** - TypeScript definitions

## 📁 Project Structure

```
project/
├── app/                          # Next.js 13 App Router
│   ├── api/                     # API Routes
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── signin/route.ts # User login
│   │   │   ├── signup/route.ts # User registration
│   │   │   ├── verify/route.ts # Token verification
│   │   │   └── logout/route.ts # User logout
│   │   ├── transactions/       # Transaction endpoints
│   │   │   ├── route.ts       # GET/POST transactions
│   │   │   └── [id]/route.ts  # DELETE transaction
│   │   ├── budgets/           # Budget endpoints
│   │   │   ├── route.ts       # GET/POST budgets
│   │   │   └── [id]/route.ts  # DELETE budget
│   │   └── test-db/route.ts   # Database connection test
│   ├── budgets/               # Budget management page
│   │   └── page.tsx
│   ├── insights/              # Financial insights page
│   │   └── page.tsx
│   ├── signin/                # Sign in page
│   │   └── page.tsx
│   ├── signup/                # Sign up page
│   │   └── page.tsx
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Dashboard/Home page
├── components/                # React components
│   ├── ui/                   # shadcn/ui components
│   ├── BudgetChart.tsx       # Budget visualization
│   ├── BudgetManager.tsx     # Budget management
│   ├── CategoryChart.tsx     # Category breakdown
│   ├── Header.tsx            # Navigation header
│   ├── MonthlyChart.tsx      # Monthly trends
│   ├── SpendingInsights.tsx  # Analytics
│   ├── TransactionForm.tsx   # Transaction form
│   └── TransactionList.tsx   # Transaction list
├── lib/                      # Utilities & Configuration
│   ├── constants.ts          # App constants
│   ├── mongodb.ts            # Database connection
│   └── utils.ts              # Helper functions
├── models/                   # MongoDB Models
│   ├── User.ts               # User schema
│   ├── Transaction.ts        # Transaction schema
│   └── Budget.ts             # Budget schema
├── middleware.ts             # Next.js middleware
├── .env.local               # Environment variables
└── public/                  # Static assets
```

## 🎯 Key Components

### **Transaction Management**
- **TransactionForm**: Add/edit transactions with validation
- **TransactionList**: Display and manage transaction history

### **Budget Features**
- **BudgetManager**: Set and manage monthly budgets
- **BudgetChart**: Visualize budget vs spending

### **Analytics**
- **MonthlyChart**: Track spending trends over time
- **CategoryChart**: Pie chart of expense categories
- **SpendingInsights**: AI-powered spending analysis

## 🔧 Configuration

### **Environment Variables**
Create a `.env.local` file with the following variables:
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Personal Finance Tracker"
```

### **MongoDB Setup**
1. **Create MongoDB Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Create a database user
   - Whitelist your IP address

2. **Database Collections**
   - `users` - User accounts and authentication
   - `transactions` - Financial transactions
   - `budgets` - Monthly budget settings

3. **Connection Security**
   - Use strong passwords
   - Enable IP whitelisting
   - Use connection string with SSL

### **JWT Configuration**
- **Secret Key**: Use a strong, random 32+ character secret
- **Token Expiry**: Tokens expire in 7 days
- **Cookie Settings**: HTTP-only, secure cookies
- **Production**: Use environment-specific secrets

### **Customization**
- **Categories**: Modify `lib/constants.ts` to add/remove categories
- **Themes**: Customize colors in `tailwind.config.ts`
- **Components**: Extend UI components in `components/ui/`
- **Database Models**: Extend schemas in `models/` directory

## 📱 Features in Detail

### **Dashboard Overview**
- Real-time financial summary cards
- Quick access to add transactions
- Recent transaction preview
- Budget status indicators

### **Transaction Categories**
**Expense Categories:**
- 🍽️ Food & Dining
- 🚗 Transportation  
- 🛍️ Shopping
- 🎬 Entertainment
- 📄 Bills & Utilities
- 🏥 Healthcare
- 📚 Education
- ✈️ Travel
- 📦 Other

**Income Categories:**
- 💼 Salary
- 💻 Freelance
- 📈 Investment
- 🏢 Business
- 💰 Other Income

### **Budget Management**
- Set monthly limits per category
- Visual progress bars
- Alert system for overspending
- Historical budget tracking

## 🚀 Performance Optimizations

- **Dynamic Imports**: Charts loaded only when needed
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js built-in optimization
- **Bundle Analysis**: Optimized bundle sizes

## 🔒 Security & Privacy

### **Data Security**
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure, stateless authentication
- **HTTP-only Cookies**: XSS protection
- **Environment Variables**: Sensitive data protection
- **MongoDB Atlas**: Enterprise-grade security

### **User Privacy**
- **Data Isolation**: Each user sees only their data
- **No Tracking**: No analytics or user tracking
- **Secure Sessions**: Automatic session management
- **Privacy First**: Minimal data collection

### **Production Security**
- **HTTPS Required**: Secure data transmission
- **Environment Secrets**: Production-grade secrets
- **Database Security**: Atlas security features
- **Regular Updates**: Keep dependencies updated

## 🚀 Deployment

### **Vercel Deployment (Recommended)**
1. **Connect Repository**
   - Import project to [Vercel](https://vercel.com)
   - Connect your GitHub repository

2. **Environment Variables**
   ```env
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   - Vercel automatically builds and deploys
   - Custom domain configuration available

### **Other Deployment Options**
- **Netlify**: With serverless functions
- **AWS**: Lambda + API Gateway
- **Docker**: Container deployment
- **Traditional VPS**: Node.js server

### **Production Checklist**
- ✅ Set strong JWT secret (32+ characters)
- ✅ Configure MongoDB Atlas for production
- ✅ Set up proper environment variables
- ✅ Enable HTTPS/SSL
- ✅ Configure domain and DNS
- ✅ Test all API endpoints
- ✅ Monitor application performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud Database Platform
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Recharts](https://recharts.org/) - Charting Library
- [Lucide](https://lucide.dev/) - Icon Library
- [JWT](https://jwt.io/) - JSON Web Tokens
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password Hashing

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and TypeScript**
