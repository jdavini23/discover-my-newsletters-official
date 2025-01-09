# Contributing to Discover My Newsletters

## Development Guidelines

### 1. Setup
1. Ensure you have Node.js (v18+) installed
2. Clone the repository
3. Run `npm install`
4. Use `npm run dev` to start development server

### 2. Code Quality
- Always run `npm run lint` before committing
- Use `npm run format` to auto-format code
- Aim for clean, readable, and well-documented code

### 3. Commit Practices
- Use conventional commit format:
  ```
  <type>(scope): <description>
  
  [optional body]
  ```
- Example types: 
  - `feat`: New feature
  - `fix`: Bug fix
  - `docs`: Documentation changes
  - `refactor`: Code restructuring
  - `test`: Adding or modifying tests
  - `chore`: Maintenance tasks

### 4. Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run all checks: `npm run lint && npm run format:check`
5. Submit a PR with a clear description

### 5. Dependency Management
- Check for updates: `npm run deps:check`
- Update dependencies: `npm run deps:update`
- Always review changes before updating

### 6. Performance Considerations
- Use React.memo for pure components
- Minimize re-renders
- Use React Query for efficient data fetching
- Leverage code splitting

### 7. Security
- Never commit sensitive information
- Use environment variables
- Validate and sanitize all inputs
- Keep dependencies updated

## Code of Conduct
- Be respectful
- Collaborate constructively
- Prioritize code quality and team goals

## Questions?
Open an issue or contact the maintainers.
