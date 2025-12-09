import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./cards.css";

function Home() {
  const cardData = [
    {
      title: "To release your card",
      text: "Manage your card release process.",
      image: "../../../src/assets/images/card.jpeg",
      link: "/submit",
    },
    {
      title: "To Wait Lab result",
      text: "Check back here for your lab results.",
      image: "../../../src/assets/images/lab result room.jpeg",
      link: "/resultrooms",
    },
    {
      title: "See medicines in the pharmacy",
      text: "Browse available medications.",
      image: "../../../src/assets/images/pharmacy-imagee.jpeg",
      link: "/pharmacy", // Link to navigate on click
    },
  ];

  return (
    <div className="card-container">
      <div className="card-grid">
        {cardData.map((card) => (
          <Link to={card.link} key={card.title} className="card">
            <div className="card-image-wrapper">
              <img src={card.image} alt={card.title} className="card-image" />
              <div className="card-overlay">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text">{card.text}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
