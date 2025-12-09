/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import * as ethiopianDate from 'ethiopian-date'; // Import the library

const ethioMonths = [
  "Meskerem", "Tkmt", "Hidar", "Tahsas", "Tir", 
  "Yäkatit", "Mäggabit", "Maziya", "Genbot", 
  "Säne", "Hamle", "Nehasé", "Pagumē"
];

const WelcomeMessage = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());

      // Convert current date to Ethiopian
      const [year, month, day] = ethiopianDate.toEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());
      
      // Get the Ethiopian month name from the array
      const monthName = ethioMonths[month - 1]; // month is 1-indexed
      
      // Format the Ethiopian date
      const formattedDate = `${monthName} ${day}, ${year}`;
      setCurrentDate(formattedDate);
    };

    // Update time and date immediately
    updateTimeAndDate();

    // Set interval to update time every second
    const intervalId = setInterval(updateTimeAndDate, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="welcome-message">
      Welcome to HUCSH! Today is <strong>{currentDate}</strong>, Time <strong>{currentTime}</strong>
    </div>
  );
};

export default WelcomeMessage;