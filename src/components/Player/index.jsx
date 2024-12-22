import './Player.scss';

function Player({ componentTree, onSelect, selectedId }) {
    /**
     * Fonction récursive qui renvoie le bon composant
     * en fonction de node.type
     */
    const renderComponent = (node) => {
      const { id, type, props = {}, children = [] } = node;
  
      const handleClick = (e) => {
        e.stopPropagation();
        onSelect(id);
      };
  
      // Déterminer si le composant est sélectionné
      const isSelected = id === selectedId;
  
      // On construit une classe conditionnelle
      const baseClass = "player-component";
      const selectedClass = isSelected ? " selected" : "";
  
      switch (type) {
        case "Container":
          return (
            <div
              key={id}
              onClick={handleClick}
              className={`${baseClass} container${selectedClass}`}
              style={props.style}
            >
              {children.map((child) => renderComponent(child))}
            </div>
          );
  
        case "Text":
          return (
            <span
              key={id}
              onClick={handleClick}
              className={`${baseClass} text${selectedClass}`}
              style={props.style}
            >
              {props.text}
            </span>
          );
  
        case "Button":
          return (
            <button
              key={id}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(id);
                alert("Bouton cliqué !");
              }}
              className={`${baseClass} button${selectedClass}`}
              style={props.style}
            >
              {props.label}
            </button>
          );
  
        default:
          return (
            <div key={id} className="unknown-type">
              Type inconnu : {type}
            </div>
          );
      }
    };
  
    return <div className="player-root">{renderComponent(componentTree)}</div>;
  }
  
  export default Player;