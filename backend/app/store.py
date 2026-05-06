from datetime import datetime, timedelta, timezone

from .models import Scaffold

TTL = timedelta(minutes=10)


class JobStore:
    def __init__(self) -> None:
        self._jobs: dict[str, tuple[Scaffold, datetime]] = {}

    def put(self, job_id: str, scaffold: Scaffold) -> None:
        self._purge_expired()
        self._jobs[job_id] = (scaffold, datetime.now(timezone.utc))

    def get(self, job_id: str) -> Scaffold | None:
        self._purge_expired()
        entry = self._jobs.get(job_id)
        return entry[0] if entry else None

    def _purge_expired(self) -> None:
        cutoff = datetime.now(timezone.utc) - TTL
        for job_id in [k for k, (_, ts) in self._jobs.items() if ts < cutoff]:
            del self._jobs[job_id]
