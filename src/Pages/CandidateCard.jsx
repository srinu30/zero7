import React, { useState } from "react";
import "./BenchList.css";

const CandidateCard = ({ candidate }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`candidate-card ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="card-inner">
        <div className="card-front">
          <h3>{candidate.name}</h3>
          <p>{candidate.role}</p>
          <p>{candidate.exp}</p>
          <p>{candidate.location}</p>
          <button className="btn-gradient">Get Details</button>
        </div>
        <div className="card-back">
          <h3>Contact Info</h3>
          <p>Email: example@zero7.com</p>
          <p>Phone: +91-9876543210</p>
          <p>For more details, contact our management.</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
