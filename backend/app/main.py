from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine

app = FastAPI(title="LogiSense API")


@app.get("/")
def root():
    return {
        "message": "LogiSense API is running"
    }


@app.get("/api/v1/database/test")
def database_test():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            value = result.scalar()

        return {
            "success": True,
            "database": "PostgreSQL",
            "message": "Database connection successful",
            "result": value,
        }

    except Exception as e:
        return {
            "success": False,
            "database": "PostgreSQL",
            "message": "Database connection failed",
            "error": str(e),
        }