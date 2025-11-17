"""
Quantitative Trading Platform

A comprehensive A-share quantitative trading system with data collection,
AI-powered analysis, backtesting, and live execution capabilities.
"""

from . import ai, api, backtesting, data, execution, shared

__version__ = "0.1.0"
__author__ = "Quant Trader Team"

__all__ = [
    "data",
    "ai",
    "backtesting",
    "execution",
    "api",
    "shared",
]
