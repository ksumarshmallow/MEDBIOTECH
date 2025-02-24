import logging
from colorlog import ColoredFormatter

def setup_logging():
    """
    Настройка красивого и цветного логирования.
    """
    formatter = ColoredFormatter(
        "%(log_color)s%(asctime)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        reset=True,
        log_colors={
            'DEBUG': 'cyan',
            'INFO': 'green',
            'WARNING': 'yellow',
            'ERROR': 'red',
            'CRITICAL': 'red,bg_white',
        },
        secondary_log_colors={},
        style='%'
    )

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    logger.addHandler(console_handler)

    logging.addLevelName(logging.INFO, "🟢 INFO")
    logging.addLevelName(logging.WARNING, "🟡 WARNING")
    logging.addLevelName(logging.ERROR, "🔴 ERROR")
    logging.addLevelName(logging.DEBUG, "🔵 DEBUG")