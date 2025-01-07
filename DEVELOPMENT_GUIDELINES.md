# Development Guidelines and Best Practices

## 1. Code Quality and Structure

### 1.1 General Principles

- **Single Responsibility Principle**:

  - Each component, function, and module should have a single, well-defined purpose
  - Aim for components under 200 lines
  - Break large components into smaller, focused components

- **DRY (Don't Repeat Yourself)**:

  - Avoid code duplication
  - Extract common logic into:
    - Reusable functions
    - Custom hooks
    - Utility modules

- **KISS (Keep It Simple, Stupid)**:
  - Prefer simple, readable solutions
  - Avoid over-engineering
  - Write code that is easy to understand and maintain

### 1.2 Folder Structure

```
src/
├── components/
│   ├── common/       # Reusable, generic components
│   ├── layout/       # Layout-specific components
│   ├── newsletter/   # Newsletter-specific components
│   └── ui/           # Low-level UI components
├── pages/            # Top-level page components
├── hooks/            # Custom React hooks
├── stores/           # State management (Zustand stores)
├── services/         # API and data fetching logic
├── utils/            # Utility functions and helpers
├── types/            # TypeScript type definitions
└── constants/        # Constant values and enums
```

### 1.3 Naming Conventions

- Use PascalCase for:

  - React components
  - Types
  - Interfaces

- Use camelCase for:

  - Variables
  - Functions
  - Hooks
  - Object properties

- Prefix custom hooks with 'use' (e.g., `useNewsletter`)
- Use meaningful, descriptive names that indicate purpose

### 1.4 Import Organization

- Order imports consistently:
  1. External libraries
  2. Internal imports (components, hooks, types)
  3. Local imports (same directory)
- Use absolute imports to improve readability

## 2. TypeScript and React Guidelines

### 2.1 Type Safety

- Use strict TypeScript mode in `tsconfig.json`
- Always use explicit type annotations
- Prefer more specific types over broad ones
- Use discriminated unions for complex type scenarios
- Implement branded types for additional type safety
- Avoid `any` type whenever possible
- Use `unknown` instead of `any` when type is uncertain
- Use `const` assertions for literal types

#### Type Safety Examples

```typescript
// Branded type
type EmailBrand = { readonly brand: unique symbol };
type Email = string & EmailBrand;

// Discriminated union
type ActionResult = { status: 'success'; data: any } | { status: 'error'; error: string };

// Const assertion
const colors = ['red', 'green', 'blue'] as const;
```

### 2.2 Component Best Practices

- Prefer function declarations over arrow functions for components
- Avoid inline function definitions in render methods
- Use prop destructuring with type annotations
- Implement prop type validation
- Prefer composition over inheritance
- Create small, focused components

#### Component Example

```typescript
interface NewsletterCardProps {
  newsletter: Newsletter;
  onAction?: (id: string) => void;
}

function NewsletterCard({ newsletter, onAction }: NewsletterCardProps) {
  // Component implementation
}
```

### 2.3 Performance Optimization

- Use React.lazy and Suspense for code splitting
- Implement `React.memo` with custom comparison function
- Use `useCallback` and `useMemo` judiciously
- Prefer native CSS or CSS-in-JS for animations
- Use Profiler API for performance monitoring
- Implement virtualization for long lists

#### Performance Example

```typescript
const MemoizedNewsletterCard = React.memo(
  NewsletterCard,
  (prevProps, nextProps) => prevProps.newsletter.id === nextProps.newsletter.id
);
```

### 2.4 Hook Best Practices

- Create custom hooks for complex logic
- Follow the Rules of Hooks
- Avoid conditional hook calls
- Use `useReducer` for complex state logic
- Implement custom hooks with clear, single responsibilities

#### Custom Hook Example

```typescript
function useNewsletter(initialNewsletter?: Newsletter) {
  const [newsletter, setNewsletter] = useState(initialNewsletter);
  // Additional newsletter-related logic
  return { newsletter, setNewsletter };
}
```

## 3. State Management Guidelines

### 3.1 Zustand Store Principles

- Keep stores focused and atomic
- Use immer for immutable state updates
- Separate read and write logic
- Avoid complex logic in stores
- Use middleware for logging, persistence

### 3.2 State Mutation

- Never mutate state directly
- Use immutable update patterns
- Prefer functional updates for state dependent on previous state

## 4. Error Handling

### 4.1 Error Boundary Rules

- Wrap entire application and critical sections with error boundaries
- Provide user-friendly error messages
- Log errors with comprehensive details
- Implement error recovery mechanisms

### 4.2 Error Logging

- Log errors with context (component, user action, timestamp)
- Use a centralized error logging service
- Capture and report unhandled promise rejections

## 5. Testing Guidelines

### 5.1 Testing Strategy

- Aim for 80%+ test coverage
- Write unit tests for utilities and pure functions
- Use integration tests for complex workflows
- Implement end-to-end tests for critical user journeys

### 5.2 Test Writing Principles

- Use descriptive test names
- Test both happy paths and edge cases
- Keep tests independent and isolated

## Conclusion

These guidelines are living documents. They should evolve with the project and team's understanding of best practices.
