import  { useEffect } from 'react';
import './Developer.css';
import devPhoto from '../assets/images/mohammed_nur.jpg';

const Developer = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 🧠 This does the magic!
  }, []);

  return (
    <div className="dev-page">
      <div className="dev-container">
        <div className="dev-image-container">
          <img src={devPhoto} alt="Mohammed Nuru" className="dev-image" />
        </div>
        <div className="dev-info">
          <h1>Mohammed Nuru</h1>
          <p className="dev-role">💻 Full-Stack Web Developer | 📚 Health Informatics Student</p>
          <p className="dev-desc">
            I am the lead developer behind the HUCSH Pharmacy Web App. Passionate about using
            technology to solve real healthcare challenges. I specialize in the MERN stack and
            love building clean, efficient systems that work for real people.
          </p>
          <p className="dev-desc">
            Currently a 4th-year Health Informatics student at Hawassa University, I believe in
            building tech with purpose and impact.
          </p>
          <a href="https://t.me/mohammed_nuru" target="_blank" rel="noopener noreferrer" className="dev-contact">
            📬 Contact me on Telegram
          </a>
        </div>
      </div>
    </div>
  );
};

export default Developer;
