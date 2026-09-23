from pathlib import Path
import csv


DATA_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "bengaluru_crime_2023.csv"
)


def get_bengaluru_crime_history() -> list[dict]:
    """
    Load historical Bengaluru crime totals.

    This dataset contains city-level aggregate counts.
    It is contextual evidence only and must not be treated
    as location-specific incident data.
    """

    if not DATA_FILE.exists():
        return []

    with DATA_FILE.open(
        "r",
        encoding="utf-8-sig",
        newline="",
    ) as file:
        reader = csv.DictReader(file)

        records = []

        for row in reader:
            crime_type = row.get("Type of Crime")

            if not crime_type or crime_type == "TOTAL":
                continue

            reported = row.get("2023 Reported")
            detected = row.get("2023 Detected")

            if reported is None or detected is None:
                continue

            try:
                reported_count = int(reported)
                detected_count = int(detected)
            except ValueError:
                continue

            records.append(
                {
                    "crime_type": crime_type,
                    "year": 2023,
                    "reported": reported_count,
                    "detected": detected_count,
                    "geographic_scope": "Bengaluru city",
                    "source": "OpenCity Bengaluru Crime Data 2023",
                }
            )

        return records

