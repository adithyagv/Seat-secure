import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./AdminDashboard.css"
const eventTypes = [ "Sports", "Workshop", "Culturals"];
const cityOptions = ["Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad"];

const AdminDashboard = () => {
  const location = useLocation();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = location.state?.user;
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    price: "",
    city: "",
    image: "", 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = async () => {
    // Trim all values to prevent empty space issues
    const trimmedEvent = {
      title: newEvent.title.trim(),
      type: newEvent.type.trim(),
      date: newEvent.date.trim(),
      time: newEvent.time.trim(),
      venue: newEvent.venue.trim(),
      description: newEvent.description.trim(),
      price: newEvent.price.toString().trim(), // Convert number to string and trim
      city: newEvent.city.trim(),
      image: newEvent.image.trim(),
    };
  
    console.log("Event Data Before Submission:", trimmedEvent); // Debugging line
  
    // Validate all fields
    if (Object.values(trimmedEvent).some(value => value === "")) {
      alert("Please fill in all fields including the image URL.");
      return;
    }
  
    try {
      const eventToSend = {
        ...trimmedEvent,
        price: Number(trimmedEvent.price), // Ensure price is a number
      };
  
      const response = await fetch("https://seat-secure-backend.onrender.com/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventToSend),
      });
  
      const data = await response.json();
      console.log("Server Response:", data); // Debugging line
  
      if (response.ok) {
        alert("Event added successfully!");
        setNewEvent({
          title: "",
          type: "",
          date: "",
          time: "",
          venue: "",
          description: "",
          price: "",
          city: "Chennai", // Ensure city has a default
          image: "",
        });
      } else {
        alert(data.message || "Error adding event");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add event. Check console for details.");
    }
  };
  
   const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    navigate("/"); 
  };

  return (
    <div className="admin-body">
      <div className="header-det">
      <h1 onClick={() => navigate(-1)}>SeatPal</h1>
        <div className="profile-container">
          <button onClick={handleProfileClick} className="profile-btn">My Profile</button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              
              <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>
      <div className="right"></div>
      <h1 style={{}}>Admin Dashboard</h1>
    <div className="event-container" style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      
      <h2>Add a New Event</h2>

      <input type="text" name="title" placeholder="Title" value={newEvent.title} onChange={handleInputChange} />
      <select name="type" value={newEvent.type} onChange={handleInputChange}>
        <option value="">Select Event Type</option>
        {eventTypes.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>

      <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} />
      <input type="time" name="time" value={newEvent.time} onChange={handleInputChange} />
      <input type="text" name="venue" placeholder="Venue" value={newEvent.venue} onChange={handleInputChange} />
      <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleInputChange}></textarea>
      <input type="number" name="price" placeholder="Price" value={newEvent.price} onChange={handleInputChange} />
      
      <select name="city" value={newEvent.city} onChange={handleInputChange}>
        {cityOptions.map((city, index) => (
          <option key={index} value={city}>{city}</option>
        ))}
      </select>

      <div>
        <label>Event Image URL:</label>
        <input type="text" name="image" placeholder="Image URL" value={newEvent.image} onChange={handleInputChange} />
      </div>

      <button className="bn-admin"onClick={handleAddEvent}>Add Event</button>
    </div>
    </div>
  );
};

export default AdminDashboard;
