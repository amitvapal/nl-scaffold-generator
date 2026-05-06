import pytest
from pydantic import ValidationError

from app.models import FileEntry, Scaffold


def test_file_entry_rejects_parent_traversal():
    with pytest.raises(ValidationError):
        FileEntry(path="../etc/passwd", content="x")


def test_file_entry_rejects_absolute_path():
    with pytest.raises(ValidationError):
        FileEntry(path="/etc/passwd", content="x")


def test_file_entry_accepts_nested_relative_path():
    fe = FileEntry(path="src/app/main.py", content="x")
    assert fe.path == "src/app/main.py"


def test_scaffold_requires_entrypoint():
    with pytest.raises(ValidationError):
        Scaffold(
            files=[FileEntry(path="helper.py", content="x")],
            dependencies=[],
            readme="r",
        )


def test_scaffold_accepts_entrypoint_in_subdirectory():
    scaffold = Scaffold(
        files=[FileEntry(path="src/main.py", content="x")],
        dependencies=[],
        readme="r",
    )
    assert len(scaffold.files) == 1


def test_scaffold_rejects_more_than_8_files():
    files = [FileEntry(path="main.py", content="x")] + [
        FileEntry(path=f"f{i}.py", content="x") for i in range(8)
    ]
    with pytest.raises(ValidationError):
        Scaffold(files=files, dependencies=[], readme="r")
