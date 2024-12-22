import { useState } from "react";
import Player from "./components/Player";
import "./Studio.scss";

/**
 * JSON initial
 */
const initialJSON = {
  id: "root-container",
  type: "Container",
  props: {
    style: {
      border: "1px solid #ccc",
      padding: "16px",
      backgroundColor: "#f9f9f9",
      minHeight: "200px",
    },
  },
  children: [
    {
      id: "text-1",
      type: "Text",
      props: {
        text: "Hello World !",
        style: {
          color: "blue",
          fontSize: "16px",
        },
      },
    },
    {
      id: "btn-1",
      type: "Button",
      props: {
        label: "Click me!",
        style: {
          marginTop: "8px",
        },
      },
    },
  ],
};

function Studio() {
  /**
   * State principal de l'arbre JSON
   */
  const [appJSON, setAppJSON] = useState(initialJSON);

  /**
   * State de l'ID du composant sélectionné
   */
  const [selectedId, setSelectedId] = useState(null);

  /**
   * State pour le type de composant à ajouter (choisi dans la barre de sélection)
   */
  const [newComponentType, setNewComponentType] = useState("Text");

  /**
   * Trouve un noeud dans l'arbre (récursif)
   */
  const findNodeById = (node, id) => {
    if (node.id === id) return node;
    if (!node.children) return null;
    for (let child of node.children) {
      const result = findNodeById(child, id);
      if (result) return result;
    }
    return null;
  };

  /**
   * Handler de sélection
   */
  const handleSelectComponent = (id) => {
    setSelectedId(id);
  };

  const selectedNode = selectedId ? findNodeById(appJSON, selectedId) : null;

  /**
   * Mettre à jour les props d'un noeud
   */
  const updateNodeProps = (nodeId, newProps) => {
    const updateRecursive = (node) => {
      if (node.id === nodeId) {
        return { ...node, props: { ...node.props, ...newProps } };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map((child) => updateRecursive(child)),
        };
      }
      return node;
    };

    setAppJSON((prev) => updateRecursive(prev));
  };

  /**
   * Ajouter un composant (enfant)
   */
  const addComponent = (parentId, newNode) => {
    const addRecursive = (node) => {
      if (node.id === parentId) {
        if (!node.children) {
          // Si jamais node.children n'existe pas, on le crée
          return { ...node, children: [newNode] };
        } else {
          return { ...node, children: [...node.children, newNode] };
        }
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map((child) => addRecursive(child)),
        };
      }
      return node;
    };

    setAppJSON((prev) => addRecursive(prev));
  };

  /**
   * Supprimer un composant (et ses enfants)
   */
  const removeComponent = (nodeId) => {
    const removeRecursive = (node) => {
      if (node.id === nodeId) {
        return null; // supprime ce node
      }
      if (node.children) {
        const newChildren = node.children
          .map((child) => removeRecursive(child))
          .filter(Boolean); // enlève les null
        return { ...node, children: newChildren };
      }
      return node;
    };

    setAppJSON((prev) => {
      const updated = removeRecursive(prev);
      return updated || prev; // si root est supprimé, on garde l'ancien
    });
    if (selectedId === nodeId) {
      setSelectedId(null);
    }
  };

  /**
   * Rendu de l'arbre (à gauche)
   */
  const renderTree = (node, level = 0) => {
    return (
      <div key={node.id} className="studio-tree-node" style={{ marginLeft: level * 12 }}>
        <div
          className={`studio-tree-item ${
            node.id === selectedId ? "selected" : ""
          }`}
          onClick={() => handleSelectComponent(node.id)}
        >
          {node.type} (<em>{node.id}</em>)
        </div>
        {/* Récursif sur les enfants */}
        {node.children &&
          node.children.map((child) => renderTree(child, level + 1))}
      </div>
    );
  };

  /**
   * Gestion du clic sur "Ajouter" dans la topbar
   */
  const handleAddClick = () => {
    const newId = `new-${Math.floor(Math.random() * 10000)}`;
    let newNode = { id: newId, type: newComponentType, props: {} };

    // Props par défaut selon le type
    switch (newComponentType) {
      case "Container":
        newNode.props = {
          style: {
            border: "1px solid #ddd",
            padding: "8px",
            backgroundColor: "#ffffff",
          },
        };
        newNode.children = [];
        break;
      case "Text":
        newNode.props = {
          text: "Nouveau texte",
          style: { color: "red" },
        };
        break;
      case "Button":
        newNode.props = {
          label: "Nouveau bouton",
          style: { margin: "4px" },
        };
        break;
      default:
        break;
    }

    // Si aucun composant sélectionné, on cible la racine
    let targetId = appJSON.id;

    // Sinon, si le composant sélectionné est un Container, on l'utilise comme parent
    if (selectedNode && selectedNode.type === "Container") {
      targetId = selectedNode.id;
    }
    // (Si le composant sélectionné n'est pas un Container, on ne fait rien
    //  ou on retombe sur la racine. Ici, on a déjà targetId = root.)

    addComponent(targetId, newNode);
  };

  return (
    <div className="studio-container">
      {/* Barre du haut pour choisir le composant à ajouter + bouton "Ajouter" */}
      <div className="studio-topbar">
        <label htmlFor="component-select">Type à ajouter :</label>
        <select
          id="component-select"
          value={newComponentType}
          onChange={(e) => setNewComponentType(e.target.value)}
        >
          <option value="Container">Container</option>
          <option value="Text">Text</option>
          <option value="Button">Button</option>
        </select>

        <button onClick={handleAddClick}>Ajouter</button>
      </div>

      {/* Panel de gauche : Arbre */}
      <div className="studio-left-panel">
        <h4>Arbre</h4>
        {renderTree(appJSON)}
      </div>

      {/* Player au centre */}
      <div className="studio-center-panel">
        <h4>Aperçu</h4>
        <div className="studio-player-wrapper">
          <Player
            componentTree={appJSON}
            onSelect={handleSelectComponent}
            selectedId={selectedId}
          />
        </div>
      </div>

      {/* Panneau de propriétés à droite */}
      <div className="studio-right-panel">
        <h4>Propriétés</h4>
        {selectedNode ? (
          <div>
            <p>
              <strong>ID : </strong>
              {selectedNode.id}
            </p>
            <p>
              <strong>Type : </strong>
              {selectedNode.type}
            </p>

            {/* Si c'est un texte */}
            {selectedNode.type === "Text" && (
              <div className="studio-prop-block">
                <label>Texte : </label>
                <input
                  type="text"
                  value={selectedNode.props.text || ""}
                  onChange={(e) =>
                    updateNodeProps(selectedNode.id, { text: e.target.value })
                  }
                />
              </div>
            )}

            {/* Si c'est un bouton */}
            {selectedNode.type === "Button" && (
              <div className="studio-prop-block">
                <label>Label : </label>
                <input
                  type="text"
                  value={selectedNode.props.label || ""}
                  onChange={(e) =>
                    updateNodeProps(selectedNode.id, {
                      label: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* Exemple: éditeur de style de base (couleur fond, couleur texte) */}
            {selectedNode.props.style && (
              <div className="studio-prop-block">
                <label>Couleur de fond : </label>
                <input
                  type="color"
                  value={selectedNode.props.style.backgroundColor || "#ffffff"}
                  onChange={(e) => {
                    updateNodeProps(selectedNode.id, {
                      style: {
                        ...selectedNode.props.style,
                        backgroundColor: e.target.value,
                      },
                    });
                  }}
                />
                <br />
                <label>Couleur du texte : </label>
                <input
                  type="color"
                  value={selectedNode.props.style.color || "#000000"}
                  onChange={(e) => {
                    updateNodeProps(selectedNode.id, {
                      style: {
                        ...selectedNode.props.style,
                        color: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            )}

            {/* Bouton de suppression */}
            <button
              className="delete-btn"
              onClick={() => removeComponent(selectedNode.id)}
            >
              Supprimer ce composant
            </button>
          </div>
        ) : (
          <div>Aucun composant sélectionné</div>
        )}
      </div>
    </div>
  );
}

export default Studio;