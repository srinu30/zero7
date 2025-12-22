import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./FloatingWhatsApp.css";

const FloatingWhatsApp = () => {
  const message = "Hi there, I want to ask about your services.";
  const url = `https://wa.me/${+918919801095}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      className="floating-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaWhatsapp className="floating-whatsapp-icon" />
    </a>
  );
};

export default FloatingWhatsApp;
