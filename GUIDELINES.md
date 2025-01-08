# Project Development Guidelines

## 1. Development Environment Setup

### Prerequisites

- Node.js v20+
- npm v10+
- Git v2.40+
- Docker and Docker Compose
- Visual Studio Code (recommended)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/discover-my-newsletters.git

# Install dependencies
cd discover-my-newsletters
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your specific configurations

# Install Git hooks
npm run prepare
```

## 2. Development Workflow

### Starting the Development Environment

```bash
# Start all services (frontend, backend, DB, Redis)
docker-compose up

# Start specific services
docker-compose up frontend backend
```

### Running Tests

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend
```

### Code Quality Tools

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Clean build artifacts
npm run clean
```

### NPM Maintenance

```bash
# Diagnose npm issues
npm run diagnose

# Fix npm issues
npm run fix
```

## 3. Git Workflow

### Commit Message Format

We use conventional commits format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or modifying tests
- `build:` Build system changes
- `ci:` CI configuration changes
- `chore:` Maintenance tasks

### Pre-commit Hooks

The following checks run automatically before commits:

- Linting
- Code formatting
- Type checking
- Unit tests
- Commit message validation

## 4. Docker Environment

### Available Services

- Frontend (React): Port 3000
- Backend (Node.js): Port 4000
- MySQL Database: Port 3306
- Redis: Port 6379
- Test Database: Port 3307

### Docker Commands

```bash
# Start development environment
docker-compose up

# Start in production mode
NODE_ENV=production docker-compose up

# Rebuild containers
docker-compose build

# Clean up containers and volumes
docker-compose down -v
```

## 5. Code Quality Standards

### TypeScript

- Strict mode enabled
- No `any` types unless absolutely necessary
- Explicit return types on functions
- Comprehensive error handling
- Proper type definitions
- Consistent code formatting using Prettier
- ESLint configuration for catching unused variables and imports
- Comprehensive type checking across the project

### React Best Practices

- Functional components with hooks
- Proper prop typing
- Memoization for expensive computations
- Error boundaries implementation
- Accessibility standards (WCAG 2.1 compliance)
- Performance monitoring with React Profiler
- State management with React Query for server state
- Redux Toolkit for complex client state
- Component composition over prop drilling
- Strict TypeScript checking for components
- Comprehensive error logging with context
- Automated accessibility testing
- Proper code splitting and lazy loading
- Mobile-first responsive design
- SEO optimization with proper meta tags

### Backend Best Practices

- RESTful API design principles
- OpenAPI/Swagger documentation
- Rate limiting and request throttling
- Proper error handling middleware
- Request validation using zod
- Database query optimization
- Caching strategies (Redis)
- Logging and monitoring (Winston)
- Background job processing
- API versioning
- Health check endpoints
- Graceful shutdown handling
- Database migrations strategy
- Connection pooling
- Request tracing

## 6. Security Best Practices

### Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Secure password hashing
- Two-factor authentication support
- Session management

### API Security

- Rate limiting
- CORS configuration
- Input validation
- XSS protection
- CSRF protection
- Security headers

### Data Protection

- Encrypted environment variables
- Secure database connections
- PII data handling
- Data backup procedures
- Audit logging

## 7. Frontend Design and UX Guidelines

### Responsive Design Principles

- Mobile-first approach
- Consistent scaling across devices
- Adaptive typography
- Flexible layout systems
- Performance-optimized responsive techniques

### UI/UX Best Practices

- Consistent design language
- Animated interactions with Framer Motion
- Accessibility-first design
- Intuitive user interfaces
- Micro-interactions and feedback
- Dark mode support
- Responsive component design

### Performance Optimization

- Lazy loading of components
- Memoization of expensive computations
- Minimal re-renders
- Code splitting
- Efficient state management
- Optimized asset loading
- Reduced layout shifts

### Animation and Interaction Design

- Use Framer Motion for declarative animations
- Subtle, purposeful motion
- Performance-conscious animations
- Consistent easing and timing
- Accessibility-compliant animations
- Reduced motion support

### Styling and Design System

- Tailwind CSS utility-first approach
- CSS variables for theme management
- Consistent spacing and sizing
- Responsive typography
- Dynamic theming
- Modular design tokens
- Centralized style management

### State Management Guidelines

- Use Zustand for lightweight, atomic state
- Separate read and write logic
- Immutable state updates
- Middleware for logging and persistence
- Minimal global state
- Context for deeply nested prop sharing
- Performance-optimized selectors

### Error Handling and User Feedback

- Comprehensive error boundaries
- User-friendly error messages
- Contextual error logging
- Toast notifications
- Graceful error recovery
- Client-side error tracking
- Proactive error prevention

## 8. Monitoring and Observability

### Metrics Collection

- Application performance metrics
- Error rates and types
- API response times
- Database query performance
- Cache hit/miss rates
- Memory usage
- CPU utilization
- Network latency

### Logging Strategy

- Structured logging format
- Log levels (DEBUG, INFO, WARN, ERROR)
- Request/Response logging
- Error stack traces
- User actions logging
- Performance logging
- Security event logging
- Audit trail logging

### Alerting

- Error rate thresholds
- Performance degradation
- Resource utilization
- Security incidents
- Database health
- Cache performance
- API availability
- Custom business metrics

## 9. CI/CD Pipeline

### Continuous Integration

- Pre-commit hooks
- Branch protection rules
- Automated testing
- Code coverage reports
- Static code analysis
- Dependency scanning
- Container scanning
- License compliance checks

### Continuous Deployment

- Environment promotion strategy
- Automated deployments
- Rollback procedures
- Feature flags
- Blue-green deployments
- Canary releases
- Infrastructure as Code
- Secret management

## 10. Deployment

### Production Deployment

```bash
# Build production images
NODE_ENV=production docker-compose build

# Deploy production stack
NODE_ENV=production docker-compose up -d
```

### Environment Variables

- Use `.env` for local development
- Use secure secrets management in production
- Regular credential rotation
- Environment-specific configurations

## 11. Troubleshooting

### Common Issues

- Check logs: `docker-compose logs -f [service]`
- Verify environment variables
- Check service health: `docker-compose ps`
- Review container resources

### Development Tools

- Node.js debugger configuration
- React DevTools setup
- Redux DevTools (if applicable)
- Network debugging tools

## 12. Newsletter-Specific Guidelines

### Content Management

- Newsletter metadata validation
- Content caching strategy
- Image optimization
- Rich text handling
- Draft system
- Version control for content
- Scheduled publishing
- Content moderation

### User Experience

- Subscription management
- Email template system
- Personalization features
- Reading history tracking
- Recommendation engine
- Search functionality
- Social sharing
- Offline reading support

### Analytics

- Newsletter engagement metrics
- User behavior tracking
- A/B testing framework
- Conversion tracking
- Retention analysis
- Content performance metrics
- Search analytics
- Email delivery metrics

## 13. Documentation

### Requirements

- README.md with setup instructions
- API documentation (OpenAPI/Swagger)
- Component documentation
- Architecture diagrams
- Changelog maintenance

### Style Guide

- Clear and concise writing
- Code examples where appropriate
- Regular updates
- Version history
- Troubleshooting guides
