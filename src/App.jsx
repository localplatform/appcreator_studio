import { useState } from "react";
import Player from "./components/Player";
import SettingsPanel from "./components/SettingsPanel";
import TreePanel from "./components/TreePanel";
import "./Studio.scss";

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

export default function Studio() {
  const [appJSON, setAppJSON] = useState(initialJSON);
  const [selectedId, setSelectedId] = useState(null);
  const [newComponentType, setNewComponentType] = useState("Text");

  /**
   * Trouve récursivement un noeud dans l'arbre
   */
  const findNodeById = (node, id) => {
    if (node.id === id) return node;
    if (!node.children) return null;
    for (const child of node.children) {
      const result = findNodeById(child, id);
      if (result) return result;
    }
    return null;
  };

  /**
   * Sélection
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
   * Ajouter un composant
   * => on met display:flex par défaut pour tout le monde
   */
  const addComponent = (parentId, newNode) => {
    const addRecursive = (node) => {
      if (node.id === parentId) {
        if (!node.children) {
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
   * Supprimer un composant
   */
  const removeComponent = (nodeId) => {
    const removeRecursive = (node) => {
      if (node.id === nodeId) {
        return null; // supprime
      }
      if (node.children) {
        const newChildren = node.children
          .map((child) => removeRecursive(child))
          .filter(Boolean);
        return { ...node, children: newChildren };
      }
      return node;
    };

    setAppJSON((prev) => {
      const updated = removeRecursive(prev);
      return updated || prev;
    });
    if (selectedId === nodeId) {
      setSelectedId(null);
    }
  };

  /**
   * Clic sur "Ajouter"
   * => on met display:flex par défaut dans tous les cas
   */
  const handleAddClick = () => {
    const newId = `new-${Math.floor(Math.random() * 10000)}`;
    let newNode = {
      id: newId,
      type: newComponentType,
      props: {
        style: {
          display: "flex", // <<--- Par défaut pour tous
        },
      },
    };

    // Ajout de props particulières selon le type
    switch (newComponentType) {
      case "Container":
        newNode.props.style.flexDirection = "row";
        newNode.props.style.border = "1px solid #ddd";
        newNode.props.style.padding = "8px";
        newNode.props.style.backgroundColor = "#ffffff";
        newNode.children = [];
        break;
      case "Text":
        newNode.props.text = "Nouveau texte";
        break;
      case "Button":
        newNode.props.label = "Nouveau bouton";
        newNode.props.style.margin = "4px";
        break;
      default:
        break;
    }

    // Cibler la racine ou le conteneur sélectionné
    let targetId = appJSON.id;
    if (selectedNode && selectedNode.type === "Container") {
      targetId = selectedNode.id;
    }

    addComponent(targetId, newNode);
  };

  return (
    <div className="studio-container">
      {/* Barre du haut */}
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

      {/* Panel gauche : Arbre */}
      <TreePanel
        appJSON={appJSON}
        selectedId={selectedId}
        onSelectComponent={handleSelectComponent}
      />

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

      {/* Panel de droite : Propriétés */}
      <SettingsPanel
        selectedNode={selectedNode}
        updateNodeProps={updateNodeProps}
        removeComponent={removeComponent}
      />
    </div>
  );
}