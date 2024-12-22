import React from "react";
import "./Player.scss";

function Player({ componentTree, onSelect, selectedId }) {
  const renderNode = (node) => {
    const { id, type, props = {}, children = [] } = node;
    const isSelected = id === selectedId;

    // Gestion des styles
    const handleClick = (e) => {
      e.stopPropagation(); // Empêche la propagation du clic
      onSelect(id);
    };

    // Style conditionnel pour indiquer la sélection
    const borderStyle = isSelected ? "2px dashed blue" : "none";

    switch (type) {
      case "Container":
        return (
          <div
            key={id}
            style={{ ...props.style, border: borderStyle, boxSizing: "border-box" }} // Applique les styles
            onClick={handleClick}
          >
            {/* Rend les enfants récursivement */}
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
              e.stopPropagation(); // Empêche la propagation
              onSelect(id);
              alert(`Bouton cliqué : ${props.label || "Sans label"}`);
            }}
          >
            {props.label || "Button"}
          </button>
        );
      default:
        // Si le type est inconnu, rendre un div par défaut
        return (
          <div key={id} style={{ ...props.style, border: borderStyle }} onClick={handleClick}>
            Type inconnu : {type}
          </div>
        );
    }
  };

  // Vérifie si le conteneur principal est bien défini
  if (!componentTree) {
    return <div className="player-error">Aucun arbre de composants à afficher.</div>;
  }

  // Applique les styles au conteneur racine
  return (
    <div className="player-wrapper">
      <div
        className="player-content"
        style={{
          ...componentTree.props?.style, // Applique les styles définis pour le conteneur principal
          position: "relative", // Position relative pour permettre des enfants positionnés
          overflow: "auto", // Gère les débordements
          boxSizing: "border-box",
        }}
      >
        {renderNode(componentTree)}
      </div>
    </div>
  );
}

export default Player;
