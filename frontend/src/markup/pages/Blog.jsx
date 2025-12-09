/* eslint-disable react/no-unescaped-entities */
// Blog.jsx

import { Link } from 'react-router-dom';
import './blog.css';

const Blog = () => {
  return (
    <div className="blog-container">
      {/* Top Navigation with Button */}
      <div className="top-bar">
        <h1>HUCSH Pharmacy System</h1>
        <Link to="/pharmacy" className="availability-button">
          See Medication Availability
        </Link>
      </div>

      <div className="blog-header">
        <div className="header-content">
          <h2>Revolutionizing Healthcare Access</h2>
          <p>Empowering Patients with Seamless Experiences</p>
        </div>

        <div className="header-image">
          <img
            src="../../../src/assets/images/hucsh.jpg"
            alt="HUCSH Hospital"
          />
        </div>
      </div>

      <div className="blog-content">
        <div className="blog-section">
          <div className="section-image">
            <img
              src="../../../src/assets/images/pharmacy-image.jpeg"
              alt="Pharmacy"
            />
          </div>
          <div className="section-content">
            <h2>Medication Availability</h2>
            <p>
              Easily check the availability of medications at your local
              pharmacies. Our intuitive platform allows you to search for any
              medication and view the real-time stock levels at Pharmacy11,
              Pharmacy87, and Pharmacy125.
            </p>
          </div>
        </div>

        <div className="blog-section">
          <div className="section-content">
            <h2>Health Data Access</h2>
            <p>
              Stay on top of your health with direct access to your latest lab
              results, ultrasound scans, and X-ray reports. Get notified as soon
              as new data is available, and never miss an important update.
            </p>
          </div>
          <div className="section-image">
            <img
              src="../../../src/assets/images/59418782_2273775889608525_8725443820960874496_n.jpg"
              alt="HUCSH Entry"
            />
          </div>
        </div>

        <div className="blog-section">
          <div className="section-image">
            <img
              src="../../../src/assets/images/reult of 64.jpeg"
              alt="Card Releasing"
            />
          </div>
          <div className="section-content">
            <h2>Patient Card-ID Release</h2>
            <p>
              With our intuitive virtual assistant, you can easily request the
              release of your patient card-ID. Simply answer a few questions,
              and we'll handle the process for you, ensuring a seamless and
              efficient experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
