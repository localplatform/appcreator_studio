// Player.jsx
import React from "react";
import "./Player.scss";

function Player({ componentTree, onSelect, selectedId }) {
  const renderNode = (node) => {
    const { id, type, props = {}, children = [] } = node;
    const isSelected = id === selectedId;

    const handleClick = (e) => {
      e.stopPropagation();
      onSelect(id);
    };

    const borderStyle = isSelected ? "2px dashed blue" : "none";

    switch (type) {
      case "Container":
        return (
          <div
            key={id}
            style={{ ...props.style, border: borderStyle }}
            onClick={handleClick}
          >
            {children.map(renderNode)}
          </div>
        );
      case "Text":
        return (
          <span
            key={id}
            style={{ ...props.style, border: borderStyle }}
            onClick={handleClick}
          >
            {props.text}
          </span>
        );
      case "Button":
        return (
          <button
            key={id}
            style={{ ...props.style, border: borderStyle }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id);
              alert("Bouton cliqué !");
            }}
          >
            {props.label || "Button"}
          </button>
        );
      default:
        return (
          <div key={id} style={{ border: borderStyle }} onClick={handleClick}>
            Type inconnu : {type}
          </div>
        );
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {renderNode(componentTree)}
    </div>
  );
}

export default Player;
