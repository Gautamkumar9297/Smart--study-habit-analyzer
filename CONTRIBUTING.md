# Contributing to Smart Study Habit Analyzer

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/study-habit-analyzer.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Follow the setup instructions in [SETUP_GUIDE.md](SETUP_GUIDE.md)

## Development Workflow

### Before Making Changes

1. Ensure all services are running correctly
2. Test the existing functionality
3. Create a new branch for your feature/fix

### Making Changes

1. Write clean, readable code
2. Follow the existing code style
3. Add comments for complex logic
4. Update documentation if needed

### Testing Your Changes

1. Test manually in the browser
2. Verify all three services work together
3. Check for console errors
4. Test on different screen sizes (responsive design)

### Committing Changes

Use clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "Add student performance trend chart"
git commit -m "Fix Excel upload validation bug"
git commit -m "Update ML model prediction accuracy"

# Bad commit messages
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

### Submitting a Pull Request

1. Push your changes to your fork
2. Create a Pull Request to the main repository
3. Describe your changes clearly
4. Reference any related issues
5. Wait for review and address feedback

## Code Style Guidelines

### JavaScript/React

- Use functional components with hooks
- Use meaningful variable names
- Keep components small and focused
- Use async/await for asynchronous operations
- Add PropTypes or TypeScript types

### Python/Flask

- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings to functions
- Handle exceptions properly

### CSS/Tailwind

- Use Tailwind utility classes
- Keep custom CSS minimal
- Ensure responsive design
- Test on mobile devices

## Project Structure

```
study-habit-analyzer/
├── frontend/          # React application
├── backend/           # Node.js/Express API
├── ml-service/        # Flask ML service
└── docs/              # Documentation
```

## Areas for Contribution

### Features
- Additional analytics visualizations
- Export functionality (PDF reports)
- Email notifications
- Mobile app version
- Advanced filtering and search

### Improvements
- Performance optimization
- Better error handling
- Improved UI/UX
- Accessibility enhancements
- Test coverage

### Documentation
- API documentation
- User guides
- Video tutorials
- Translation to other languages

### Bug Fixes
- Check the Issues tab for reported bugs
- Test edge cases
- Improve validation

## Questions?

If you have questions:
1. Check existing documentation
2. Search closed issues
3. Open a new issue with the "question" label

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the project

Thank you for contributing! 🎉
