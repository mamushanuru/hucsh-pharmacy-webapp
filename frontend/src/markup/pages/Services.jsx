/* eslint-disable react/no-unescaped-entities */
import "./about.css"

function Services() {
  return (
    <section className="services-section">
      <h2>Our Services</h2>
      <div className="service-cards">
        <div className="service-card">
          <h3>Pharmacy</h3>
          <p>
            Easily check the availability of medications at your local
            pharmacies. Our intuitive platform allows you to search for any
            medication and view the real-time stock levels at Pharmacy11,
            Pharmacy92, and Pharmacy125.
          </p>
        </div>
        <div className="service-card">
          <h3>Health Data Access</h3>
          <p>
            Stay on top of your health with direct access to your latest lab
            results, ultrasound scans, and X-ray reports. Get notified as soon
            as new data is available, and never miss an important update.
          </p>
        </div>
        <div className="service-card">
          <h3>Patient Card-ID Release</h3>
          <p>
            With our intuitive virtual assistant, you can easily request the
            release of your patient card-ID. Simply answer a few questions, and
            we'll handle the process for you, ensuring a seamless and efficient
            experience.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Services