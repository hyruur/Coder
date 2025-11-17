# Contributing to Quant Trader

Thank you for your interest in contributing to the Quant Trader project! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

Please be respectful and professional in all interactions with other contributors and maintainers.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch for your changes
4. Make your changes and add tests
5. Ensure all tests pass and code quality checks pass
6. Push to your fork and submit a pull request

## Development Setup

```bash
# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Clone and setup
git clone https://github.com/yourusername/quant-trader.git
cd quant-trader

# Install dependencies
poetry install

# Create a feature branch
git checkout -b feat/your-feature-name
```

## Code Style

### Python Style

- Use **Black** for code formatting
- Use **Ruff** for linting
- Use **mypy** for type checking
- Maintain PEP 8 compliance

### Type Hints

All new code must include type hints:

```python
def calculate_returns(prices: list[float]) -> float:
    """Calculate simple returns."""
    if not prices or len(prices) < 2:
        return 0.0
    return (prices[-1] - prices[0]) / prices[0]
```

### Docstrings

Use Google-style docstrings:

```python
def process_data(data: pd.DataFrame) -> pd.DataFrame:
    """Process market data.

    Args:
        data: Input DataFrame with OHLCV data.

    Returns:
        Processed DataFrame with technical indicators.

    Raises:
        ValueError: If data is empty or missing required columns.
    """
    pass
```

## Code Quality Checks

Before committing, run:

```bash
# Format code
black src tests

# Lint code
ruff check src tests

# Type checking
mypy src

# All checks together
make lint
```

## Testing

### Test Requirements

- All new features must include tests
- Minimum 80% code coverage
- Use pytest for testing
- Use type hints in test functions

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src/quant_trader tests/

# Run specific test file
pytest tests/test_smoke.py -v

# Run with markers
pytest -m unit
```

### Test Structure

```python
class TestYourFeature:
    """Tests for your feature."""

    def test_basic_functionality(self) -> None:
        """Test basic functionality."""
        result = your_function()
        assert result is not None

    def test_edge_case(self) -> None:
        """Test edge case."""
        with pytest.raises(ValueError):
            your_function_that_raises()
```

## Commit Messages

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, missing semicolons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process, dependencies, etc.

### Examples

```
feat(data): add akshare integration for real-time quotes

Implement data collection from AKShare API for real-time market data.

Closes #123
```

```
fix(backtesting): correct commission calculation

Fix commission calculation in backtest engine to match broker specs.
```

## Pull Request Process

1. **Create a branch** from `main` with a descriptive name:
   ```bash
   git checkout -b feat/add-data-validation
   ```

2. **Make your changes** with clear, focused commits

3. **Add tests** for new functionality

4. **Update documentation** if needed

5. **Ensure quality**:
   ```bash
   make lint
   pytest
   ```

6. **Push to your fork** and create a pull request

7. **Fill out the PR template**:
   - Describe changes clearly
   - Link related issues
   - Explain any trade-offs or decisions

8. **Respond to review** comments constructively

9. **Ensure CI passes** before merge

## Review Process

- Code will be reviewed for:
  - Correctness and logic
  - Type safety and type hints
  - Test coverage
  - Code style and readability
  - Documentation quality
  - Performance implications

- Be open to feedback and iterate on your changes

## Questions?

Feel free to open an issue or ask in pull request discussions.

Thank you for contributing! 🙏
