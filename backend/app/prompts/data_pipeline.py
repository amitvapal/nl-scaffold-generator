PROMPT = r"""App type: Data pipeline.

Conventions:
- Single entrypoint pipeline.py with three clearly-named functions: extract, transform, load.
- Use pandas for in-memory data manipulation.
- argparse-driven CLI: at minimum --input and --output paths.
- Configure logging via logging.basicConfig at INFO level; log start, row counts, and finish.

Example output for "Clean a CSV of customer records":
{"files":[{"path":"pipeline.py","content":"import argparse\nimport logging\nfrom pathlib import Path\n\nimport pandas as pd\n\nlog = logging.getLogger(\"pipeline\")\n\ndef extract(path: Path) -> pd.DataFrame:\n    log.info(\"reading %s\", path)\n    return pd.read_csv(path)\n\ndef transform(df: pd.DataFrame) -> pd.DataFrame:\n    log.info(\"transforming %d rows\", len(df))\n    df = df.dropna(subset=[\"email\"]).copy()\n    df[\"email\"] = df[\"email\"].str.strip().str.lower()\n    df[\"name\"] = df[\"name\"].str.title()\n    return df.drop_duplicates(subset=[\"email\"])\n\ndef load(df: pd.DataFrame, path: Path) -> None:\n    log.info(\"writing %d rows to %s\", len(df), path)\n    df.to_csv(path, index=False)\n\ndef main() -> None:\n    logging.basicConfig(level=logging.INFO, format=\"%(asctime)s %(levelname)s %(name)s: %(message)s\")\n    parser = argparse.ArgumentParser(description=\"Clean customer CSV\")\n    parser.add_argument(\"--input\", type=Path, required=True)\n    parser.add_argument(\"--output\", type=Path, required=True)\n    args = parser.parse_args()\n    load(transform(extract(args.input)), args.output)\n\nif __name__ == \"__main__\":\n    main()\n"}],"dependencies":["pandas==2.2.3"],"readme":"# Customer Cleaner\n\nNormalizes and dedupes a CSV of customer records.\n\n## Quick Start\n\n```bash\npip install -r requirements.txt\npython pipeline.py --input customers.csv --output cleaned.csv\n```\n"}
"""
