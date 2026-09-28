import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const applied = jobs.filter((job) => job.status === "Applied").length;
  const interviews = jobs.filter((job) => job.status === "Interview").length;

  return (
    <div className="app">
      <header>
        <div>
          <h1>💼 DevOps Job Tracker</h1>
          <p>Track your job applications in one place.</p>
        </div>
        <span className="live">● Live</span>
      </header>

      <section className="stats">
        <div className="card">
          <span>Total Applications</span>
          <strong>{jobs.length}</strong>
        </div>

        <div className="card">
          <span>Applied</span>
          <strong>{applied}</strong>
        </div>

        <div className="card">
          <span>Interviews</span>
          <strong>{interviews}</strong>
        </div>
      </section>

      <section className="jobs">
        <h2>Job Applications</h2>

        {loading ? (
          <p>Loading applications...</p>
        ) : (
          <div className="job-grid">
            {jobs.map((job) => (
              <div className="job-card" key={job.id}>
                <div className="job-top">
                  <div className="company-icon">
                    {job.company.charAt(0)}
                  </div>

                  <span className={`status ${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                </div>

                <h3>{job.company}</h3>
                <p>{job.role}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer>
        Dockerized React + Flask + PostgreSQL
      </footer>
    </div>
  );
}

export default App;
