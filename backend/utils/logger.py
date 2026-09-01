import logging
import sys


def setup_logger():
    """Configure and return application logger."""

    logger = logging.getLogger("customer_management")
    logger.setLevel(logging.DEBUG)

    # Prevent duplicate handlers if this module is imported multiple times
    if logger.handlers:
        return logger

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)

    # Formatter
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    console_handler.setFormatter(formatter)

    # Add handler
    logger.addHandler(console_handler)

    return logger


# Create logger instance
logger = setup_logger()
