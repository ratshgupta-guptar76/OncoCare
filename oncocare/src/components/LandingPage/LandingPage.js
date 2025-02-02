import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import puppy from "../../imgs/puppy.gif"; // Ensure correct path

const LandingPage = () => {
  const navigate = useNavigate();
  const dotsRef = useRef(null);
  const [showPuppy, setShowPuppy] = useState(false);

  useEffect(() => {
    if (!dotsRef.current) return;

    // Clear previous dots to prevent duplication
    dotsRef.current.innerHTML = "";

    const colors = ["#ffeb3b", "#ff8a80", "#80d8ff", "#a7ffeb", "#ccff90"];
    const numDots = 15;

    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      dot.style.left = `${Math.random() * 100}vw`;
      dot.style.animationDuration = `${Math.random() * 20 + 10}s`;
      dot.style.animationDelay = `${Math.random() * 5}s`;

      dotsRef.current.appendChild(dot);
    }

    // Delay the puppy animation for a fun surprise
    setTimeout(() => setShowPuppy(true), 1500);
  }, []);

  return (
    <div className="landing-page">
      {/* Floating Polka Dots */}
      <div className="polka-dots" ref={dotsRef}></div>

      {/* Puppy GIF (outside the container) */}
      <div className={`puppy-container ${showPuppy ? "puppy-show" : ""}`}>
        <img src={puppy} alt="Smiling Puppy" className="puppy" />
      </div>

      {/* Content */}
      <div className="container">
        <h1>OncoCare</h1>
        <p>Your mental health matters. Let’s take the next step together.</p>
        <button className="btn" onClick={() => navigate("/chatbot")}>
          Next Steps →
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
