# Quant Trader

A comprehensive A-share quantitative trading system built with Python, featuring data collection, AI-powered analysis, backtesting, and live execution capabilities.

## 🎯 Project Goals

- **Data Collection**: Fetch A-share market data from multiple sources (TuShare, AKShare)
- **AI Analysis**: Leverage machine learning for signal generation and prediction
- **Backtesting**: Test strategies against historical data with realistic trading simulation
- **Live Execution**: Execute trades based on generated signals with risk management
- **REST API**: Expose functionality through a modern FastAPI-based REST interface
- **Type Safety**: Full type hints and validation across the codebase

## 📦 Core Modules

```
src/quant_trader/
├── data/           # Data collection and management
├── ai/             # Machine learning and AI models
├── backtesting/    # Backtesting engine
├── execution/      # Trade execution and order management
├── api/            # REST API endpoints
└── shared/         # Shared utilities and models
```

## 🛠️ Tech Stack

### Core Dependencies
- **pandas** - Data manipulation and analysis
- **numpy** - Numerical computing
- **akshare** - A-share financial data
- **tushare** - Chinese financial data
- **fastapi** - Modern web framework
- **pydantic** - Data validation
- **asyncio/aiohttp** - Async HTTP clients

### Development Tools
- **pytest** - Testing framework
- **black** - Code formatting
- **ruff** - Linting
- **mypy** - Static type checking

## 📋 Requirements

- Python 3.10+
- Poetry (for dependency management)
- pip (for installation without Poetry)

## 🚀 Quick Start

### Using Poetry (Recommended)

```bash
# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
poetry install

# Run tests
poetry run pytest

# Run linting
poetry run black src tests
poetry run ruff check src tests

# Run type checking
poetry run mypy src
```

### Using pip

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .

# Install dev dependencies
pip install -e ".[dev]"

# Run tests
pytest
```

## 📝 Project Structure

```
.
├── src/
│   └── quant_trader/          # Main package
│       ├── __init__.py        # Package initialization
│       ├── data/              # Data collection module
│       ├── ai/                # AI/ML module
│       ├── backtesting/       # Backtesting engine
│       ├── execution/         # Trade execution
│       ├── api/               # REST API
│       └── shared/            # Shared utilities
├── tests/                     # Test suite
│   ├── conftest.py           # Pytest configuration
│   └── test_*.py             # Test files
├── pyproject.toml            # Project metadata and dependencies
├── .env.example              # Environment variables template
├── Makefile                  # Build automation
├── README.md                 # This file
└── CONTRIBUTING.md           # Contribution guidelines
```

## 🧪 Testing

Run tests with pytest:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src/quant_trader tests/

# Run specific test file
pytest tests/test_smoke.py

# Run specific test class or function
pytest tests/test_smoke.py::TestQuanitTraderImport::test_version_exists
```

## 🔧 Development Commands

### Code Quality

```bash
# Format code with black
black src tests

# Run linting with ruff
ruff check src tests

# Run type checking with mypy
mypy src

# Run all checks at once
make lint
```

### Common Tasks

```bash
# Install dependencies
make install

# Run tests
make test

# Format code
make format

# Run type checking
make typecheck
```

## 📦 Dependency Management

Dependencies are managed through Poetry. Key dependencies include:

### Runtime
- **pandas**: Data manipulation
- **numpy**: Numerical operations
- **akshare**: A-share data
- **tushare**: Financial data
- **fastapi**: Web framework
- **pydantic**: Validation
- **aiohttp**: Async HTTP

### Development
- **pytest**: Testing
- **black**: Formatting
- **ruff**: Linting
- **mypy**: Type checking

See `pyproject.toml` for complete dependency list and versions.

## 🌍 Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key environment variables:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Data Sources
TUSHARE_TOKEN=your_token_here
AKSHARE_TIMEOUT=30

# Backtesting
BACKTEST_CASH=100000
BACKTEST_COMMISSION=0.0001

# Features
ENABLE_LIVE_TRADING=false
ENABLE_PAPER_TRADING=true
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Code style and conventions
- Testing requirements
- Pull request process
- Commit message format

## 📚 Documentation

- **Type Hints**: Full type annotations across the codebase
- **Docstrings**: Comprehensive module and function documentation
- **Examples**: Example notebooks and scripts (coming soon)

## 🎯 Roadmap

- [ ] Complete data collection modules
- [ ] Implement AI/ML models
- [ ] Build backtesting engine
- [ ] Create trade execution system
- [ ] Develop REST API endpoints
- [ ] Add WebSocket support
- [ ] Create web dashboard
- [ ] Production deployment guide

## ⚖️ License

MIT

## 📞 Support

For issues, questions, or suggestions, please open an issue on the project repository.

---

Built with ❤️ for quantitative trading
