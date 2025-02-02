import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./ChatbotPage.css";
import blackRibbon from "./../../imgs/ribbon_black.svg"; // Import black ribbon
import whiteRibbon from "./../../imgs/ribbon_white.svg"; // Import white ribbon

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [userHistory, setUserHistory] = useState([]);
  const [cancerType, setCancerType] = useState(""); // Default cancer type

  // Gemini API setup
  const API_KEY = "AIzaSyCQl2QssbtEOK4oB0E-afY8TwXf8Xbh26U"; // Replace with your Gemini API key
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Load user history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem("userHistory");
    if (savedHistory) {
      setUserHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save user history to local storage
  const saveUserHistory = (message) => {
    const updatedHistory = [...userHistory, message];
    setUserHistory(updatedHistory);
    localStorage.setItem("userHistory", JSON.stringify(updatedHistory));
  };

  // Function to generate a response using Gemini API
  const generateGeminiResponse = async (userMessage) => {
    try {
      const historyContext = userHistory.slice(-5).join("\n"); // Last 5 messages as context
      const prompt = `Act as a therapist for the User who is a cancer patient. Consider the user's past messages for context, If the user shows no sign of strong emotions or negative behaviours, talk to him like you would any other person and keep the messages short, only if it is somethinng unrelated, ask if they want to hear a joke, otherwise DO NOT use jokes when they are showing strong emotions, also keep in mind that they are cancer patients. Use the HistoryContext to help you answer qwuestions: \nHistory Context-${historyContext}\nUser message: ${userMessage}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating Gemini response:", error);
      return "Sorry, I couldn't process your request. Please try again.";
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInputText("");
    setUserHistory([]);
    localStorage.removeItem("userHistory");
  };

  // Function to handle user messages and bot responses
  const handleSendMessage = async () => {
    if (inputText.trim() !== "") {
      // Display user message
      setMessages((prevMessages) => [...prevMessages, { text: inputText, sender: "user" }]);
      saveUserHistory(inputText);
      setInputText("");

      // Generate bot response using Gemini API
      const botResponse = await generateGeminiResponse(inputText);

      // Display bot response
      setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: "bot" }]);
    }
  };

  // Function to handle cancer type change
  const handleCancerTypeChange = (type) => {
    setCancerType(type);
  };

  // Get solid color for the ribbon based on cancer type
  const getRibbonColor = () => {
    const colors = {
      bladder: "linear-gradient(90deg, #eaa221 0%, #eaa221 33%, #0000ff 33%, #0000ff 67%, #800080 67%, #800080 100%)", // Marigold/Blue/Purple for bladder cancer
      bone: "#ffff00", // Yellow for bone cancer (sarcoma)
      brain: "#808080", // Gray for brain cancer
      breast: "#ff69b4", // Pink for breast cancer
      colorectal: "#00008b", // Dark blue for colon and rectal cancer
      endometrial: "#ffcc99", // Peach for endometrial cancer
      kidney: "#ff6600", // Orange for kidney cancer
      leukemia: "#ffa500", // Orange for leukemia
      liver: "#50c878", // Emerald green for liver cancer
      lung: "#eeeeee", // White for lung cancer
      lymphoma: "#32cd32", // Lime green for lymphoma
      melanoma: "#000000", // Black for melanoma and skin cancer
      nonHodgkinLymphoma: "#32cd32", // Lime green for non-Hodgkin lymphoma
      ovarian: "#008080", // Teal for ovarian cancer
      prostate: "#87cefa", // Light blue for prostate cancer
      stomach: "#ccccff", // Periwinkle for stomach cancer
      thyroid: "linear-gradient(90deg, #008080 0%, #008080 33%, #ff69b4 33%, #ff69b4 67%, #0000ff 67%, #0000ff 100%)", // Teal/Pink/Blue for thyroid cancer
    };
    
    return colors[cancerType] || "#ffffff"; // Default to white if not found
  };

  // Get lighter (cotton candy) version of the color for the background
  const getBackgroundColor = () => {
    const ribbonColor = getRibbonColor();
    return `linear-gradient(135deg, ${ribbonColor}20, ${ribbonColor}10)`; // Gradient with 20% opacity
  };

  // Determine if the ribbon should be white or black based on the background color
  const getRibbonImage = () => {
    const ribbonColor = getRibbonColor();
    const hex = ribbonColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000; // Calculate brightness
    return brightness > 128 ? blackRibbon : whiteRibbon; // Use black ribbon for light colors, white ribbon for dark colors
  };

  return (
    <div className="chatbot-page" style={{ background: getRibbonColor() }}>
      <div className="chatbot-container">
        <h2>OncoCare AI Therapist</h2>
        <div className="chat-window">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === "user" ? "user" : "bot"}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={clearChat} style={{background: getBackgroundColor()}}><font color="black">Clear</font></button>
          <button onClick={handleSendMessage}>Send</button>
        </div>
        <div className="cancer-type-selector">
  <label>Select Cancer Type: </label>
  <select value={cancerType} onChange={(e) => handleCancerTypeChange(e.target.value)}>
    <option value="">Choose Type</option>
    <option value="breast">Breast Cancer</option>
    <option value="lung">Lung Cancer</option>
    <option value="prostate">Prostate Cancer</option>
    <option value="leukemia">Leukemia</option>
    <option value="ovarian">Ovarian Cancer</option>
    <option value="colorectal">Colorectal Cancer</option>
    <option value="skin">Skin Cancer</option>
    <option value="bladder">Bladder Cancer</option>
    <option value="lymphoma">Lymphoma</option>
    <option value="nonHodgkinLymphoma">Non-Hodgkin Lymphoma</option>
    <option value="bone">Bone Cancer (Sarcoma)</option>
    <option value="brain">Brain Cancer</option>
    <option value="endometrial">Endometrial Cancer</option>
    <option value="kidney">Kidney Cancer</option>
    <option value="liver">Liver Cancer</option>
    <option value="stomach">Stomach Cancer</option>
    <option value="thyroid">Thyroid Cancer</option>
  </select>
</div>

      </div>

      <Link to="/">
        <img
          src={getRibbonImage()} // Dynamically set the ribbon image
          alt="Ribbon"
          className="ribbon"
          style={{
            filter: `drop-shadow(2px 2px 4px ${getRibbonColor()})`,
          }}
        />
      </Link>
    </div>
  );
};

export default ChatbotPage;