import React from "react";
import "./Header.css";  // Style added

function Header() {
  return (
    
    <div className="header">
      <img src="/logo-AT.png" alt="Logo" className="logo" /> 
      <img src="/logo-SeamlessStop.png" alt="Second Logo" className="second-logo" /> {/* 새로운 로고 */}
    </div>
  );
}

export default Header;
