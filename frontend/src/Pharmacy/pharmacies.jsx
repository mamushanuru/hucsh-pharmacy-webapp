import { Link } from "react-router-dom";
const pharmacies = [
  { id: 1, name: "92 Pharmacy", path: "/pharmacy/92" }, // Define paths for each pharmacy
  { id: 2, name: "125 Pharmacy", path: "/pharmacy/125" },
  { id: 3, name: "11 Pharmacy", path: "/pharmacy/11" },
];

const Pharmacies = () => {
  return (
    <div className="container">
      <h1>Select a Pharmacy</h1>
      <div className="row">
        {pharmacies.map((pharmacy) => (
          <div className="col-md-4 mb-4" key={pharmacy.id}>
            <div className="card pharmacy-card">
              <div className="card-body">
                <h5 className="card-title">{pharmacy.name}</h5>
                <Link to={pharmacy.path} className="btn btn-primary">
                  Go to Pharmacy
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pharmacies;


