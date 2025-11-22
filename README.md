# TechHub Electronics

> A modern, full-featured e-commerce platform showcasing enterprise-level architecture, contemporary UI/UX design, and production-ready development practices.

Built with Laravel 12, React 19, and Inertia.js v2, TechHub Electronics demonstrates advanced full-stack development capabilities with a sleek "Electric Circuit" design theme, comprehensive admin dashboard, and seamless customer shopping experience.

## Tech Stack

### Backend

- **Laravel 12** - PHP framework with latest features
- **PHP 8.3** - Modern PHP with typed properties and enums
- **MySQL 8.0** - Relational database
- **Inertia.js Laravel** - Server-side routing with client-side rendering
- **Laravel Fortify** - Authentication backend
- **Laravel Wayfinder** - Type-safe routing for frontend

### Frontend

- **React 19** - UI library with concurrent features
- **Inertia.js React** - SPA-like experience without API
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Vite** - Lightning-fast build tool

### Testing

- **Pest v4** - Elegant PHP testing framework
- **66 Feature Tests** - Comprehensive test coverage
- **Laravel Pint** - Opinionated code formatter

## Key Features

### Modern Shopping Experience

- **Advanced Product Catalog** - Intelligent search, category filtering, and dynamic sorting
- **Detailed Product Pages** - Comprehensive specifications, high-quality images, and related product recommendations
- **Seamless Shopping Cart** - Real-time updates for both guest and authenticated users
- **Streamlined Checkout** - Multi-step flow with shipping/billing addresses and payment processing
- **Order Tracking** - Complete order history with detailed status updates and product snapshots
- **Secure Authentication** - Register, login, email verification, and password reset via Laravel Fortify
- **Two-Factor Authentication** - Enhanced account security with QR code setup and recovery codes

### Comprehensive Admin Dashboard

- **Analytics Overview** - Real-time sales metrics, order statistics, and revenue insights
- **Product Management** - Full CRUD operations with image uploads, inventory tracking, and SKU management
- **Order Processing** - View customer orders, update statuses, and access detailed order information
- **Category Organization** - Hierarchical product categorization with easy management
- **User Administration** - Manage customer accounts and administrative permissions

### Design & User Experience

- **Electric Circuit Theme** - Modern "techy" aesthetic featuring Electric Blue (#0066FF), Deep Violet (#5B2C91), and Cyber Cyan (#00D9FF)
- **Dark Mode Support** - Seamless theme switching with system preference detection and manual toggle
- **WCAG AA Compliant** - Carefully balanced contrast ratios for optimal readability
- **Fully Responsive** - Mobile-first design optimized for all screen sizes
- **Smooth Animations** - Subtle gradients, transitions, and interactive elements
- **Custom Favicon** - Branded tech-themed favicon with circuit node design

### Technical Excellence

- **Type-Safe Routing** - Laravel Wayfinder generates TypeScript functions for all routes
- **API Resources** - Consistent data transformation with Laravel Resources and proper resolution
- **Product Snapshots** - Historical product data preservation ensures order integrity
- **Form Validation** - Comprehensive server-side validation with client-side error handling
- **Real-time Updates** - Instant UI synchronization via Inertia.js without page refreshes
- **Database Transactions** - Atomic order processing for data consistency
- **Eager Loading** - Optimized queries to prevent N+1 problems
- **Role-Based Access** - Secure admin and customer role separation

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd php-ecommerce-demo
    ```

2. **Set up environment variables**

    ```bash
    cp .env.example .env
    ```

3. **Start Docker containers**

    ```bash
    docker-compose up -d
    ```

4. **Install dependencies**

    ```bash
    # Install PHP dependencies
    docker-compose exec app composer install

    # Install Node dependencies
    docker-compose exec node npm install
    ```

5. **Generate application key**

    ```bash
    docker-compose exec app php artisan key:generate
    ```

6. **Run migrations and seed database**

    ```bash
    docker-compose exec app php artisan migrate:fresh --seed
    ```

7. **Build frontend assets**

    ```bash
    docker-compose exec node npm run build
    ```

8. **Access the application**
    - Frontend: http://localhost
    - Vite Dev Server: http://localhost:5173

### Development

To run the frontend in development mode with hot module replacement:

```bash
docker-compose exec node npm run dev
```

## Default Credentials

### Admin Account

- **Email:** admin@techhub.com
- **Password:** password

### Test Customer Accounts

- **Email:** customer1@example.com through customer10@example.com
- **Password:** password

## Project Structure

```
.
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/          # Admin panel controllers
│   │   │   ├── Shop/            # Customer-facing controllers
│   │   │   ├── CartController.php
│   │   │   ├── CheckoutController.php
│   │   │   └── OrderController.php
│   │   ├── Middleware/
│   │   │   ├── IsAdmin.php
│   │   │   └── IsCustomer.php
│   │   └── Requests/            # Form request validation
│   └── Models/                   # Eloquent models
├── database/
│   ├── factories/                # Model factories for testing
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Database seeders
├── resources/
│   ├── js/
│   │   ├── components/          # React components
│   │   │   └── ui/              # Radix UI components
│   │   ├── layouts/             # Page layouts
│   │   └── pages/               # Inertia page components
│   │       ├── Admin/           # Admin panel pages
│   │       ├── Auth/            # Authentication pages
│   │       ├── Cart/            # Shopping cart
│   │       ├── Checkout/        # Checkout flow
│   │       ├── Orders/          # Order management
│   │       ├── Settings/        # User settings
│   │       ├── Shop/            # Product browsing
│   │       └── Home.tsx         # Homepage
│   └── css/
│       └── app.css              # Tailwind CSS entry
├── routes/
│   └── web.php                   # Application routes
└── tests/
    ├── Feature/                  # Feature tests
    └── Unit/                     # Unit tests
```

## Testing

### Run All Tests

```bash
docker-compose exec app php artisan test
```

### Run Specific Test File

```bash
docker-compose exec app php artisan test tests/Feature/CartControllerTest.php
```

### Run Tests with Filter

```bash
docker-compose exec app php artisan test --filter="creates order successfully"
```

### Test Coverage

- 66 Feature Tests
- 301 Assertions
- 100% Critical Path Coverage

## Code Formatting

Format code with Laravel Pint:

```bash
docker-compose exec app vendor/bin/pint
```

## Database

### Seed Data

- **Categories:** 6 electronics categories (Laptops, Smartphones, Audio, Gaming, Wearables, Accessories)
- **Products:** 55+ realistic products with detailed specifications
- **Store Info:** TechHub Electronics store with location and hours
- **Users:** 1 admin + 10 customer accounts

### Reset Database

```bash
docker-compose exec app php artisan migrate:fresh --seed
```

## Docker Services

| Service | Port | Description     |
| ------- | ---- | --------------- |
| Nginx   | 80   | Web server      |
| PHP-FPM | 9000 | PHP processor   |
| MySQL   | 3306 | Database        |
| Node    | 5173 | Vite dev server |

## API Endpoints

### Public Routes

- `GET /` - Homepage
- `GET /shop` - Product listing
- `GET /shop/{slug}` - Product detail
- `GET /cart` - Shopping cart
- `POST /cart` - Add to cart

### Authenticated Routes

- `GET /checkout` - Checkout page
- `POST /checkout` - Process order
- `GET /orders` - Order history
- `GET /orders/{order}` - Order detail

### Admin Routes (requires admin role)

- `GET /admin` - Admin dashboard
- `GET /admin/products` - Product management
- `GET /admin/orders` - Order management

## Environment Variables

Key environment variables in `.env`:

```env
APP_NAME="TechHub Electronics"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=ecommerce
DB_USERNAME=ecommerce_user
DB_PASSWORD=secret

VITE_APP_NAME="${APP_NAME}"
```

## Contributing

This is a demo project for learning and portfolio purposes. Feel free to fork and experiment!

## Development Progress

See [PROGRESS.md](PROGRESS.md) for detailed development progress and completed phases.

## Architecture Decisions

### Why Inertia.js?

- Server-side routing with client-side rendering benefits
- No need for separate API endpoints
- Simplified data flow compared to traditional SPA
- Built-in form handling and validation
- Seamless integration with Laravel

### Why Pest v4?

- Elegant testing syntax
- Built-in browser testing support
- Fast and modern testing framework
- Excellent Laravel integration

### Why Tailwind CSS v4?

- Utility-first approach for rapid UI development
- CSS-first configuration with `@theme` directive
- OKLCH color space for modern browser rendering
- Better performance and smaller bundle sizes

## Project Highlights

This project demonstrates:

- **Modern Laravel Architecture** - Laravel 12's streamlined structure with consolidated configuration
- **Type Safety** - TypeScript throughout the frontend with Laravel Wayfinder route generation
- **Data Integrity** - Product snapshots preserve historical order data
- **Performance Optimization** - Eager loading, efficient queries, and optimized asset delivery
- **Accessibility First** - WCAG AA compliant color schemes and semantic HTML
- **Production Ready** - Comprehensive test coverage, error handling, and validation
- **Contemporary Design** - Moving beyond traditional e-commerce aesthetics with a modern tech theme

## License

This project is open-source and available under the MIT License.

## Contact

**Aaron Knutson** - Full-Stack Developer

- Website: https://www.aknovus.com/
- GitHub: https://github.com/aaronknutson?tab=repositories

---

_Built to showcase modern full-stack development expertise with Laravel, React, and contemporary web technologies._
# php-ecommerce-demo
