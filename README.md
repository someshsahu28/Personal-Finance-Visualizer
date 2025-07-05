# 💰 Personal Finance Tracker

A modern, full-featured personal finance management application built with Next.js 13, TypeScript, and Tailwind CSS. Track your income, expenses, budgets, and gain insights into your spending habits with beautiful charts and analytics.

![Personal Finance Tracker](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 📊 **Transaction Management**
- ✅ Add, edit, and delete income/expense transactions
- ✅ Categorize transactions with predefined categories
- ✅ Real-time transaction filtering and search
- ✅ Transaction history with detailed views

### 💳 **Budget Management**
- ✅ Set monthly budgets by category
- ✅ Track budget vs actual spending
- ✅ Budget alerts when approaching limits
- ✅ Visual budget progress indicators

### 📈 **Analytics & Insights**
- ✅ Interactive charts and visualizations
- ✅ Monthly spending trends
- ✅ Category-wise expense breakdown
- ✅ Spending insights and recommendations
- ✅ Financial overview dashboard

### 🎨 **User Experience**
- ✅ Modern, responsive design
- ✅ Dark/light theme support
- ✅ Smooth animations and transitions
- ✅ Mobile-friendly interface
- ✅ Intuitive navigation with tabs

### 💾 **Data Management**
- ✅ Local storage persistence
- ✅ Real-time data synchronization
- ✅ Import/export capabilities
- ✅ Data validation and error handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

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

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 13** - React framework with App Router
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript

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

## 📁 Project Structure

```
project/
├── app/                    # Next.js 13 App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── BudgetChart.tsx   # Budget visualization
│   ├── BudgetManager.tsx # Budget management
│   ├── CategoryChart.tsx # Category breakdown
│   ├── MonthlyChart.tsx  # Monthly trends
│   ├── SpendingInsights.tsx # Analytics
│   ├── TransactionForm.tsx  # Transaction form
│   └── TransactionList.tsx  # Transaction list
├── lib/                   # Utilities
│   ├── constants.ts      # App constants
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
└── public/              # Static assets
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
Create a `.env.local` file for environment-specific settings:
```env
NEXT_PUBLIC_APP_NAME="Personal Finance Tracker"
```

### **Customization**
- **Categories**: Modify `lib/constants.ts` to add/remove categories
- **Themes**: Customize colors in `tailwind.config.ts`
- **Components**: Extend UI components in `components/ui/`

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

## 🔒 Data Privacy

- **Local Storage**: All data stored locally in browser
- **No External APIs**: Complete offline functionality
- **Privacy First**: No data collection or tracking

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
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Recharts](https://recharts.org/) - Charting Library
- [Lucide](https://lucide.dev/) - Icon Library

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and TypeScript**
