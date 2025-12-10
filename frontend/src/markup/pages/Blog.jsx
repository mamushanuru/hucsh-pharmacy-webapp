import { Link } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import './blog.css';

// Image imports (create these files in your assets/images folder)
import hospitalImage from '../../../src/assets/images/hucsh.jpg';
import pharmacyDashboard from '../../../src/assets/images/59418782_2273775889608525_8725443820960874496_n.jpg';
import medicationSearch from '../../../src/assets/images/59418782_2273775889608525_8725443820960874496_n.jpg';
import teamManagement from '../../../src/assets/images/59418782_2273775889608525_8725443820960874496_n.jpg';
const Blog = () => {
  const { isManager, isPharmacy11Admin, isPharmacy92Admin, isPharmacy125Admin, isLogged } = useAuth();

  const getMainButton = () => {
    if (isManager) {
      return { text: "Go to Manager Dashboard", path: "/manager" };
    }
    if (isPharmacy11Admin) {
      return { text: "Manage Pharmacy 11", path: "/admin/pharmacy11" };
    }
    if (isPharmacy92Admin) {
      return { text: "Manage Pharmacy 92", path: "/admin/pharmacy92" };
    }
    if (isPharmacy125Admin) {
      return { text: "Manage Pharmacy 125", path: "/admin/pharmacy125" };
    }
    return { text: "See Medication Availability", path: "/pharmacy" };
  };

  const getRoleSpecificContent = () => {
    if (isManager) {
      return {
        title: "Hospital Management Dashboard",
        subtitle: "Oversee all pharmacy operations and staff",
        features: [
          {
            title: "Employee Management",
            description: "Full CRUD operations for staff with role assignment",
            image: teamManagement
          },
          {
            title: "User Oversight",
            description: "Monitor and manage all registered pharmacy users",
            image: teamManagement
          },
          {
            title: "Advanced Analytics",
            description: "Track medication flow across all pharmacies",
            image: pharmacyDashboard
          }
        ]
      };
    }

    if (isPharmacy11Admin || isPharmacy92Admin || isPharmacy125Admin) {
      const pharmacyNum = isPharmacy11Admin ? "11" : isPharmacy92Admin ? "92" : "125";
      return {
        title: `Pharmacy ${pharmacyNum} Admin Portal`,
        subtitle: "Real-time medication management system",
        features: [
          {
            title: "Inventory Control",
            description: "Update medication availability in real-time",
            image: pharmacyDashboard
          },
          {
            title: "Stock Monitoring",
            description: "Track medication levels and set alerts",
            image: medicationSearch
          },
          {
            title: "Quick Actions",
            description: "Fast access to common management tasks",
            image: teamManagement
          }
        ]
      };
    }

    // Public view
    return {
      title: "HUCSH Pharmacy System",
      subtitle: "Empowering patients with seamless medication access",
      features: [
        {
          title: "Medication Availability",
          description: "Check real-time stock at all hospital pharmacies",
          image: medicationSearch
        },
        {
          title: "Health Data Access",
          description: "View your medical reports and history",
          image: hospitalImage
        },
        {
          title: "Patient Services",
          description: "Manage your hospital ID and appointments",
          image: teamManagement
        }
      ]
    };
  };

  const { title, subtitle, features } = getRoleSpecificContent();
  const mainButton = getMainButton();

  return (
    <div className="blog-container">
      {/* Top Navigation with Dynamic Button */}
      <div className="top-bar">
        <h1>{title}</h1>
        <Link to={mainButton.path} className="availability-button">
          {mainButton.text}
        </Link>
      </div>

      {/* Hero Section */}
      <div className="blog-header">
        <div className="header-content">
          <h2>{isLogged ? "Your Admin Portal" : "Revolutionizing Healthcare Access"}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="header-image">
          <img 
            src={isLogged ? pharmacyDashboard : hospitalImage} 
            alt={isLogged ? "Admin Dashboard" : "HUCSH Hospital"} 
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="blog-content">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className={`blog-section ${index % 2 === 0 ? '' : 'reversed'}`}
          >
            <div className="section-image">
              <img src={feature.image} alt={feature.title} />
            </div>
            <div className="section-content">
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
              {isLogged && (
                <Link to={mainButton.path} className="feature-link">
                  Go to {feature.title.split(' ')[0]} →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;