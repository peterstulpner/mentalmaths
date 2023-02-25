import React, { useState } from "react";

function Tooltip({ text, children }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseEnter(event) {
    setShowTooltip(true);
    setPosition({ x: event.clientX, y: event.clientY });
  }

  function handleMouseLeave() {
    setShowTooltip(false);
  }

  return (
    <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            top: position.y + 10,
            left: position.x + 10,
            background: "#333",
            color: "#fff",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          {text}
        </div>
      )}
    </span>
  );
}

export default Tooltip;
