"""Pytest configuration and shared fixtures."""

import pytest


@pytest.fixture
def sample_data():
    """Sample data fixture for testing."""
    return {"test": "data"}
