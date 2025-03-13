import React from "react"; // ALl react components need 'React'(모든 리액트 컴포넌트는 React를 불어와야 사용 가능)
import "./Button.css";

function Button({ text, onClick }) {
  return (
    <button className="custom-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
