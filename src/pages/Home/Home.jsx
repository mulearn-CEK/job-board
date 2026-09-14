import React, { useMemo } from "react";
import { HiOutlineCpuChip, HiOutlineBuildingOffice, HiOutlineGlobeAlt, HiOutlineSquares2X2 } from "react-icons/hi2";
import useJobs from "../../hooks/useJobs";
import ParkCard from "../../Components/ParkCard/ParkCard";
import "./Home.css";

const PARKS = [
  {
    key: "Technopark",
    name: "Technopark",
    description: "Trivandrum's IT hub — the largest IT park in Kerala.",
    icon: HiOutlineCpuChip,
  },
  {
    key: "Infopark",
    name: "Infopark",
    description: "Kochi's flagship IT park, home to hundreds of companies.",
    icon: HiOutlineBuildingOffice,
  },
  {
    key: "Cyberpark",
    name: "Cyberpark",
    description: "Kozhikode's IT park, growing hub for North Kerala.",
    icon: HiOutlineGlobeAlt,
  },
];

function Home() {
  const { jobs, status } = useJobs();

  const counts = useMemo(() => {
    const map = {};
    jobs.forEach((j) => {
      map[j.it_park] = (map[j.it_park] || 0) + 1;
    });
    return map;
  }, [jobs]);

  return (
    <div className="page home">
      <div className="home-hero">
        <h1>Kerala IT Park Jobs</h1>
        <p>
          Live job listings from Technopark, Infopark, and Cyberpark, scraped
          daily and searchable in one place.
        </p>
      </div>

      <div className="park-grid">
        {PARKS.map((park) => (
          <ParkCard
            key={park.key}
            icon={park.icon}
            name={park.name}
            description={park.description}
            count={status === "ready" ? counts[park.key] || 0 : "…"}
            link={`/jobs/${park.key}`}
          />
        ))}
        <ParkCard
          icon={HiOutlineSquares2X2}
          name="All Jobs"
          description="Browse every listing across all three IT parks with full filters."
          count={status === "ready" ? jobs.length : "…"}
          link="/jobs"
        />
      </div>

      {status === "error" && (
        <p className="home-error">
          Couldn't load job data. Make sure public/data/jobs.json exists.
        </p>
      )}
    </div>
  );
}

export default Home;
