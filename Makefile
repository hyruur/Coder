.PHONY: help install lint format typecheck test dev clean build

help:
	@echo "Quant Trader - Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make install       - Install dependencies using Poetry"
	@echo "  make dev           - Install in development mode"
	@echo "  make clean         - Remove generated files and caches"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint          - Run all linting and formatting checks"
	@echo "  make format        - Format code with black"
	@echo "  make ruff          - Run ruff linter"
	@echo "  make typecheck     - Run mypy type checking"
	@echo ""
	@echo "Testing:"
	@echo "  make test          - Run tests with pytest"
	@echo "  make test-cov      - Run tests with coverage report"
	@echo "  make test-watch    - Run tests in watch mode (requires pytest-watch)"
	@echo ""
	@echo "Build:"
	@echo "  make build         - Build distribution packages"

install:
	@echo "Installing dependencies with Poetry..."
	poetry install

dev:
	@echo "Installing in development mode..."
	poetry install --with dev

lint: format ruff typecheck
	@echo "✅ All checks passed!"

format:
	@echo "Formatting code with black..."
	black src tests

ruff:
	@echo "Running ruff linter..."
	ruff check src tests --fix

typecheck:
	@echo "Running mypy type checking..."
	mypy src

test:
	@echo "Running tests with pytest..."
	pytest tests/ -v

test-cov:
	@echo "Running tests with coverage..."
	pytest tests/ -v --cov=src/quant_trader --cov-report=html --cov-report=term-missing
	@echo "Coverage report generated in htmlcov/index.html"

test-watch:
	@echo "Running tests in watch mode..."
	ptw tests/ -- -v

clean:
	@echo "Cleaning up generated files..."
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name *.egg-info -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name *.pyc -delete 2>/dev/null || true
	rm -rf build/ dist/ htmlcov/ .coverage
	@echo "✅ Cleanup complete!"

build:
	@echo "Building distribution packages..."
	poetry build
	@echo "✅ Build complete!"

.DEFAULT_GOAL := help
