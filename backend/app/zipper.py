from io import BytesIO
from zipfile import ZIP_DEFLATED, ZipFile

from .models import Scaffold


def build_zip(scaffold: Scaffold, project_name: str = "scaffold") -> bytes:
    buf = BytesIO()
    with ZipFile(buf, mode="w", compression=ZIP_DEFLATED) as zf:
        for entry in scaffold.files:
            zf.writestr(f"{project_name}/{entry.path}", entry.content)
        zf.writestr(
            f"{project_name}/requirements.txt",
            "\n".join(scaffold.dependencies) + "\n",
        )
        zf.writestr(f"{project_name}/README.md", scaffold.readme)
    return buf.getvalue()
