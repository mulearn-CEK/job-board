import React from "react";
import { HiOutlineBuildingOffice2, HiOutlineMapPin, HiOutlineCalendarDays } from "react-icons/hi2";
import "./JobCard.css";

const EXPERIENCE_CLASS = {
  Fresher: "badge-fresher",
  Intermediate: "badge-intermediate",
  Senior: "badge-senior",
};

function JobCard({ job }) {
  const experienceClass = EXPERIENCE_CLASS[job.experience_level] || "badge-intermediate";

  return (
    <div className="job-card">
      <div className="job-card-top">
        <div>
          <p className="job-card-title">{job.title}</p>
          <p className="job-card-company">
            <HiOutlineBuildingOffice2 /> {job.company || "—"}
          </p>
        </div>
        <span className="job-card-park">{job.it_park}</span>
      </div>

      <div className="job-card-meta">
        <span>
          <HiOutlineMapPin /> {job.location || "Kerala"}
        </span>
        {job.deadline && (
          <span>
            <HiOutlineCalendarDays /> Apply by {job.deadline}
          </span>
        )}
      </div>

      <div className="job-card-badges">
        <span className={`badge ${experienceClass}`}>{job.experience_level}</span>
        <span className="badge badge-role">{job.role_type}</span>
      </div>

      {job.apply_link && (
        <a
          className="job-card-apply"
          href={job.apply_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View & Apply
        </a>
      )}
    </div>
  );
}

export default JobCard;
