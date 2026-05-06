PROMPT = r"""App type: CLI tool.

Conventions:
- Framework: Click. Entrypoint file is cli.py with a click.Group.
- Provide at least 2 subcommands.
- Use the `rich` library for any user-facing output (tables, panels, progress).
- Expose a console_scripts-style entry by making `python cli.py <command>` work directly.

Example output for "A CLI to manage a local notes file":
{"files":[{"path":"cli.py","content":"import json\nfrom pathlib import Path\n\nimport click\nfrom rich.console import Console\nfrom rich.table import Table\n\nNOTES = Path.home() / \".notes.json\"\nconsole = Console()\n\ndef _load() -> list[dict]:\n    return json.loads(NOTES.read_text()) if NOTES.exists() else []\n\ndef _save(notes: list[dict]) -> None:\n    NOTES.write_text(json.dumps(notes, indent=2))\n\n@click.group()\ndef cli() -> None:\n    \"\"\"Manage local notes.\"\"\"\n\n@cli.command()\n@click.argument(\"text\")\ndef add(text: str) -> None:\n    notes = _load()\n    notes.append({\"id\": len(notes) + 1, \"text\": text})\n    _save(notes)\n    console.print(f\"[green]added[/green] note {len(notes)}\")\n\n@cli.command(name=\"list\")\ndef list_cmd() -> None:\n    notes = _load()\n    table = Table(title=\"Notes\")\n    table.add_column(\"ID\", justify=\"right\")\n    table.add_column(\"Text\")\n    for n in notes:\n        table.add_row(str(n[\"id\"]), n[\"text\"])\n    console.print(table)\n\nif __name__ == \"__main__\":\n    cli()\n"}],"dependencies":["click==8.1.7","rich==13.9.4"],"readme":"# Notes CLI\n\nLightweight note-taking CLI backed by `~/.notes.json`.\n\n## Quick Start\n\n```bash\npip install -r requirements.txt\npython cli.py add \"buy milk\"\npython cli.py list\n```\n"}
"""
