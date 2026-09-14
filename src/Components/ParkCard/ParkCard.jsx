import React from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";
import "./ParkCard.css";

/**
 * Landing-page card: same click-through-card pattern as techmyrmidons-web's
 * Landing/Card (icon, heading, description, "Explore" arrow), rebuilt with
 * react-icons instead of that repo's image assets.
 */
function ParkCard({ icon: Icon, name, description, count, link }) {
  return (
    <Link to={link} className="park-card">
      <div className="park-card-icon">
        <Icon />
      </div>
      <p className="park-card-heading">{name}</p>
      <p className="park-card-description">{description}</p>
      <div className="park-card-footer">
        <span className="park-card-count">{count} open jobs</span>
        <span className="park-card-explore">
          Explore <HiArrowRight />
        </span>
      </div>
    </Link>
  );
}

export default ParkCard;
