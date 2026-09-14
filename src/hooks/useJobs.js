import { useEffect, useState } from "react";

/**
 * Loads /data/jobs.json, produced by the job-annan-scraper repo's main.py
 * and published here as a static file (see that repo's daily-scrape.yml).
 */
export default function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.PUBLIC_URL}/data/jobs.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setJobs(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { jobs, status };
}
