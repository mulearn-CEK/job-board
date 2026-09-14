import React from "react";
import "./Filters.css";

const EXPERIENCE_LEVELS = ["Fresher", "Intermediate", "Senior"];

function Filters({
  filters,
  onChange,
  onReset,
  parkOptions,
  roleOptions,
  locationOptions,
  resultCount,
}) {
  const update = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="filters">
      <input
        className="filters-search"
        type="text"
        placeholder="Search by job title or company..."
        value={filters.search}
        onChange={update("search")}
      />

      <div className="filters-row">
        <select value={filters.itPark} onChange={update("itPark")}>
          <option value="">All IT Parks</option>
          {parkOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select value={filters.experience} onChange={update("experience")}>
          <option value="">All Experience Levels</option>
          {EXPERIENCE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <select value={filters.role} onChange={update("role")}>
          <option value="">All Roles</option>
          {roleOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select value={filters.location} onChange={update("location")}>
          <option value="">All Locations</option>
          {locationOptions.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <button type="button" className="filters-reset" onClick={onReset}>
          Reset
        </button>
      </div>

      <p className="filters-count">{resultCount} job{resultCount === 1 ? "" : "s"} found</p>
    </div>
  );
}

export default Filters;
