import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useJobs from "../../hooks/useJobs";
import Filters from "../../Components/Filters/Filters";
import JobCard from "../../Components/JobCard/JobCard";
import "./JobsPage.css";

const EMPTY_FILTERS = { search: "", itPark: "", experience: "", role: "", location: "" };

function JobsPage() {
  const { park } = useParams();
  const { jobs, status } = useJobs();
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, itPark: park || "" });

  // Keep the itPark filter in sync if navigating between /jobs/:park links.
  useEffect(() => {
    setFilters((f) => ({ ...f, itPark: park || "" }));
  }, [park]);

  const parkOptions = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.it_park))).sort(),
    [jobs]
  );
  const roleOptions = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.role_type))).sort(),
    [jobs]
  );
  const locationOptions = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location).filter(Boolean))).sort(),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (filters.itPark && j.it_park !== filters.itPark) return false;
      if (filters.experience && j.experience_level !== filters.experience) return false;
      if (filters.role && j.role_type !== filters.role) return false;
      if (filters.location && j.location !== filters.location) return false;
      if (search) {
        const haystack = `${j.title} ${j.company}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }, [jobs, filters]);

  return (
    <div className="page jobs-page">
      <div className="jobs-page-header">
        <h1>{filters.itPark || "All"} Jobs</h1>
        <Link to="/" className="jobs-page-back">
          ← Back to home
        </Link>
      </div>

      <Filters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({ ...EMPTY_FILTERS })}
        parkOptions={parkOptions}
        roleOptions={roleOptions}
        locationOptions={locationOptions}
        resultCount={filteredJobs.length}
      />

      {status === "loading" && <p className="jobs-page-status">Loading jobs…</p>}
      {status === "error" && (
        <p className="jobs-page-status">
          Couldn't load job data. Make sure public/data/jobs.json exists.
        </p>
      )}
      {status === "ready" && filteredJobs.length === 0 && (
        <p className="jobs-page-status">No jobs match these filters.</p>
      )}

      <div className="jobs-grid">
        {filteredJobs.map((job) => (
          <JobCard key={job.job_id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobsPage;
