"""Smoke tests for the Quant Trader platform."""

import quant_trader


class TestQuanitTraderImport:
    """Test basic package imports."""

    def test_version_exists(self) -> None:
        """Test that the package has a version."""
        assert hasattr(quant_trader, "__version__")
        assert quant_trader.__version__ == "0.1.0"

    def test_package_modules_exist(self) -> None:
        """Test that all main modules are accessible."""
        assert hasattr(quant_trader, "data")
        assert hasattr(quant_trader, "ai")
        assert hasattr(quant_trader, "backtesting")
        assert hasattr(quant_trader, "execution")
        assert hasattr(quant_trader, "api")
        assert hasattr(quant_trader, "shared")

    def test_data_module_import(self) -> None:
        """Test data module can be imported."""
        from quant_trader import data  # noqa: F401

    def test_ai_module_import(self) -> None:
        """Test ai module can be imported."""
        from quant_trader import ai  # noqa: F401

    def test_backtesting_module_import(self) -> None:
        """Test backtesting module can be imported."""
        from quant_trader import backtesting  # noqa: F401

    def test_execution_module_import(self) -> None:
        """Test execution module can be imported."""
        from quant_trader import execution  # noqa: F401

    def test_api_module_import(self) -> None:
        """Test api module can be imported."""
        from quant_trader import api  # noqa: F401

    def test_shared_module_import(self) -> None:
        """Test shared module can be imported."""
        from quant_trader import shared  # noqa: F401


def test_sample_data_fixture(sample_data: dict) -> None:
    """Test sample data fixture."""
    assert sample_data == {"test": "data"}
