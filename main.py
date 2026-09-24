import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from backend.auth.router import router as auth_router
from backend.db import get_connection


load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://hackathon:hackathon@localhost:5432/hackathon",
)


class IssueCreate(BaseModel):
    reporter_id: str
    description: str


app = FastAPI(title="Student Issue API")
app.include_router(auth_router)


@app.get("/api/health")
def health():
    with get_connection() as connection:
        connection.execute("SELECT 1")
    return {"status": "ok", "database": "connected"}


@app.get("/api/issues")
def list_issues():
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, reporter_id, description, upvote_count,
                   is_resolved, created_at, resolved_at
            FROM issue
            ORDER BY created_at DESC
            """
        ).fetchall()
    return [dict(row) for row in rows]


@app.post("/api/issues", status_code=201)
def create_issue(issue: IssueCreate):
    if not issue.description.strip():
        raise HTTPException(status_code=400, detail="Description is required")

    with get_connection() as connection:
        reporter = connection.execute(
            "SELECT id FROM student WHERE id = %s", (issue.reporter_id,)
        ).fetchone()
        if reporter is None:
            raise HTTPException(status_code=404, detail="Reporter not found")

        row = connection.execute(
            """
            INSERT INTO issue (reporter_id, description)
            VALUES (%s, %s)
            RETURNING id, reporter_id, description, upvote_count,
                      is_resolved, created_at, resolved_at
            """,
            (issue.reporter_id, issue.description.strip()),
        ).fetchone()
    return dict(row)