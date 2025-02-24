import argparse

def parse_args():
    parser = argparse.ArgumentParser(description="Парсер отзывов с YouTube")
    parser.add_argument(
        "--config",
        type=str,
        required=True,
        help="Путь к конфигурационному файлу (например, config.yaml)"
    )
    parser.add_argument(
        "--drugs",
        type=str,
        required=True,
        help="Путь к файлу с лекарствами (например, drugs.json)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="output.csv",
        help="Путь к выходному CSV-файлу (по умолчанию: output.csv)"
    )
    return parser.parse_args()