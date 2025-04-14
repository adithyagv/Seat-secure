import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Predict.css";

const Predict = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://seat-secure-ai-model.onrender.com/api/v1/predict",
        {
          price: 50,
          day_of_week: 5,
          type: "concert",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.recommended_events?.length > 0) {
        setEvents(response.data.recommended_events);
      } else {
        setError("No recommended events found");
      }
    } catch (err) {
      console.error("Prediction Fetch Error:", err);
      setError(err.response?.data?.error || "Failed to fetch predictions");
    } finally {
      setLoading(false);
    }
};

  const handleEventClick = (id) => {
    navigate(`/event/${id}`);
  };

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    navigate("/home");
  };

  return (
    <div className="predict-page">
      <div className="header">
        <h1>SeatPal</h1>
        <button onClick={() => navigate("/predict")} className="profile-btn1">
          My preference
        </button>
        <div className="profile-container">
          <button onClick={handleProfileClick} className="profile-btn">
            My Profile
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>
      <h1 className="text-2xl font-bold text-center mb-6">Recommended Events</h1>
      <div className="p-6">
      {loading && <p className="text-center text-gray-500">Loading events...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div >
        {events.map((event, index) => (
          <div key={index} className="event-card1">
            <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
            <p className="text-gray-500">📍 {event.city}</p>
            <p className="text-gray-600">🎭 {event.type}</p>
            <p className="text-green-600 font-bold">💲 {event.price || "N/A"}</p>
            <p className="text-blue-500">📅 Day {event.day_of_week || "Unknown"}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Predict;
