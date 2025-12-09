/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./PharmacyNav.css";

const PharmacyNav = ({ currentPharmacy }) => {
  const pharmacies = [
    { id: "11", name: "Pharmacy 11" },
    { id: "92", name: "Pharmacy 92" },
    { id: "125", name: "Pharmacy 125" },
  ];

  return (
    <div className="pharmacy-nav-container">
      <div className="pharmacy-nav">
        {pharmacies.map((pharmacy) => (
          <Link
            key={pharmacy.id}
            to={`/pharmacy/${pharmacy.id}`}
            className={`pharmacy-nav-item ${
              currentPharmacy === pharmacy.id ? "active" : ""
            }`}
          >
            {pharmacy.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PharmacyNav;