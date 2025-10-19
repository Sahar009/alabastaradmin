# Alabastar Admin Dashboard

A comprehensive admin dashboard for managing the Alabastar service provider platform.

## Features

### 🎨 **Beautiful UI Design**
- Modern, responsive design with dark/light mode support
- Animated sidebar with collapsible navigation
- Smooth transitions and hover effects
- Mobile-friendly interface

### 📊 **Dashboard Overview**
- Real-time statistics and metrics
- Interactive charts and graphs
- Recent activities feed
- Service distribution analytics

### 👥 **User Management**
- Complete user listing with search and filters
- User profile management
- Status control (active/inactive/suspended)
- Detailed user information modals

### 🔧 **Provider Management**
- Provider verification system
- Service provider profiles
- Rating and review management
- Earnings tracking

### 📅 **Booking Management**
- All booking overview
- Status management (pending/confirmed/completed/cancelled)
- Customer-provider matching
- Schedule management

### 💰 **Payment Tracking**
- Transaction monitoring
- Payment method tracking
- Status management
- Revenue analytics

### ⭐ **Review System**
- Customer review moderation
- Rating management
- Approval/rejection system
- Flag inappropriate content

### 🔔 **Notification Center**
- System notification management
- Push notification settings
- Email notification controls
- SMS notification options

### ⚙️ **Settings Panel**
- General site settings
- Security configurations
- Email settings
- Database management
- Feature toggles

## Technology Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Styling**: Custom CSS with Tailwind-like utilities

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   cd admin
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

### Demo Login
- **Email**: admin@alabastar.com
- **Password**: admin123

## Project Structure

```
admin/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with sidebar
│   ├── pages/
│   │   ├── Dashboard.jsx       # Overview dashboard
│   │   ├── Users.jsx          # User management
│   │   ├── Providers.jsx      # Provider management
│   │   ├── Bookings.jsx       # Booking management
│   │   ├── Services.jsx       # Service management
│   │   ├── Payments.jsx       # Payment tracking
│   │   ├── Reviews.jsx        # Review management
│   │   ├── Notifications.jsx # Notification center
│   │   ├── Settings.jsx       # Settings panel
│   │   └── Login.jsx          # Admin login
│   ├── App.jsx                # Main app component
│   ├── App.css                # Global styles
│   ├── index.css              # Base styles
│   └── main.jsx               # Entry point
├── package.json
└── vite.config.js
```

## Key Features

### 🎯 **Smart Navigation**
- Collapsible sidebar for more screen space
- Active page highlighting
- Mobile-responsive hamburger menu
- Dark/light mode toggle

### 📈 **Analytics Dashboard**
- Revenue and booking trends
- Service distribution pie charts
- User growth metrics
- Real-time activity feed

### 🔍 **Advanced Filtering**
- Search functionality across all pages
- Status-based filtering
- Date range filtering
- Export capabilities

### 🛡️ **Security Features**
- Admin authentication
- Role-based access control
- Secure token management
- Session handling

### 📱 **Responsive Design**
- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Touch-friendly interface

## Customization

### Theme Colors
The dashboard uses a pink-orange gradient theme that can be customized in `App.css`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  --primary-color: #ec4899;
  --secondary-color: #f97316;
}
```

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation item in `Layout.jsx`

### API Integration
Replace mock data with real API calls:
```javascript
// Example API integration
const fetchUsers = async () => {
  const response = await fetch('/api/admin/users');
  const data = await response.json();
  setUsers(data);
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Alabastar platform and is proprietary software.

---

**Built with ❤️ for Alabastar Admin Team**