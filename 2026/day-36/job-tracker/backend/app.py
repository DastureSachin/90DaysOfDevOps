import os
import psycopg2
from flask import Flask, jsonify

app = Flask(__name__)


def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        port=os.getenv("POSTGRES_PORT", "5432")
    )


@app.route("/")
def home():
    return "Job Tracker API is running 🚀"


@app.route("/health")
def health():
    return {"status": "healthy"}


@app.route("/api/db-test")
def db_test():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return {
            "database": "connected",
            "version": version
        }

    except Exception as e:
        return {
            "database": "connection failed",
            "error": str(e)
        }, 500


@app.route("/api/jobs")
def get_jobs():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT id, company, role, status FROM jobs ORDER BY id;"
        )

        rows = cursor.fetchall()

        jobs = []

        for row in rows:
            jobs.append({
                "id": row[0],
                "company": row[1],
                "role": row[2],
                "status": row[3]
            })

        cursor.close()
        connection.close()

        return jsonify(jobs)

    except Exception as e:
        return {
            "error": str(e)
        }, 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
