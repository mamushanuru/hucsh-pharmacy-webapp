/* eslint-disable react/no-unescaped-entities */
import './four404.css';
import funnyImage from './../../assets/images/funny-doctor.jpeg';
import { Link } from 'react-router-dom';

const Four404 = () => {
  return (
    <div className="four-oh-four">
      <div className="four-oh-four-container">
        <h1>Oops! 404 Error</h1>
        <p>
          It looks like you've taken a wrong turn and ended up in the hospital's lost and found department.
          Don't worry, we've got just the remedy for your navigational woes!
        </p>
        <img src={funnyImage} alt="Funny 404 Image" className="four-oh-four-image" />
        <button className="four-oh-four-button">
          <Link to="/">Take me back to safety</Link>
        </button>
      </div>
    </div>
  );
};

export default Four404;