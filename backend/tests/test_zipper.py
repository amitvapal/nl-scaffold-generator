from io import BytesIO
from zipfile import ZipFile

from app.models import FileEntry, Scaffold
from app.zipper import build_zip


def test_build_zip_writes_files_requirements_and_readme():
    scaffold = Scaffold(
        files=[
            FileEntry(path="main.py", content="print('hi')\n"),
            FileEntry(path="utils.py", content="X = 1\n"),
        ],
        dependencies=["fastapi==0.115.5", "uvicorn==0.32.1"],
        readme="# Test\n\n## Quick Start\n",
    )

    data = build_zip(scaffold, project_name="proj")

    with ZipFile(BytesIO(data)) as zf:
        names = set(zf.namelist())
        assert names == {
            "proj/main.py",
            "proj/utils.py",
            "proj/requirements.txt",
            "proj/README.md",
        }
        assert zf.read("proj/main.py").decode() == "print('hi')\n"
        assert zf.read("proj/utils.py").decode() == "X = 1\n"
        assert zf.read("proj/requirements.txt").decode() == (
            "fastapi==0.115.5\nuvicorn==0.32.1\n"
        )
        assert zf.read("proj/README.md").decode() == "# Test\n\n## Quick Start\n"


def test_build_zip_default_project_name():
    scaffold = Scaffold(
        files=[FileEntry(path="main.py", content="x")],
        dependencies=[],
        readme="r",
    )
    data = build_zip(scaffold)
    with ZipFile(BytesIO(data)) as zf:
        assert "scaffold/main.py" in zf.namelist()
