import { useState, useMemo } from "react";
import Player from "./components/Player";
import SettingsPanel from "./components/SettingsPanel";
import TreePanel from "./components/TreePanel";
import "./Studio.scss";

const initialPage = {
  id: "root-container",
  type: "Container",
  props: {
    style: {
      display: "flex",
      width: "100%",
      height: "auto",
      backgroundColor: "#f9f9f9",
      minHeight: "200px",
    },
  },
  children: [],
};

export default function App() {
  const [pages, setPages] = useState([{ id: "page-1", name: "Page 1", tree: initialPage }]);
  const [currentPageId, setCurrentPageId] = useState("page-1");
  const [selectedId, setSelectedId] = useState(null);
  const [newComponentType, setNewComponentType] = useState("Text");

  // Page actuelle
  const currentPage = useMemo(() => pages.find((p) => p.id === currentPageId), [pages, currentPageId]);
  const appJSON = currentPage?.tree;

  // Mise à jour du JSON de la page actuelle
  const updateCurrentPageTree = (newTree) => {
    setPages((prev) =>
      prev.map((p) => (p.id === currentPageId ? { ...p, tree: newTree } : p))
    );
  };

  // Recherche d'un nœud dans l'arbre
  const findNodeById = (node, id) => {
    if (node.id === id) return node;
    if (!node.children) return null;
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
    return null;
  };

  // Gestion de la sélection d'un composant
  const handleSelectComponent = (id) => {
    setSelectedId(id);
  };

  // Nœud sélectionné
  const selectedNode = useMemo(() => {
    if (!selectedId) return null;
    return findNodeById(appJSON, selectedId);
  }, [appJSON, selectedId]);

  // Mise à jour des propriétés d'un composant
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
    updateCurrentPageTree(updateRecursive(appJSON));
  };

  // Ajouter un composant
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
    updateCurrentPageTree(addRecursive(appJSON));
  };

  // Supprimer un composant
  const removeComponent = (nodeId) => {
    const removeRecursive = (node) => {
      if (node.id === nodeId) {
        return null;
      }
      if (node.children) {
        const newChildren = node.children
          .map((c) => removeRecursive(c))
          .filter(Boolean);
        return { ...node, children: newChildren };
      }
      return node;
    };
    const updatedTree = removeRecursive(appJSON);
    updateCurrentPageTree(updatedTree || appJSON);
    if (selectedId === nodeId) {
      setSelectedId(null);
    }
  };

  // Gestion de l'ajout de composants
  const handleAddClick = () => {
    const newId = `new-${Math.floor(Math.random() * 10000)}`;
    let newNode = {
      id: newId,
      type: newComponentType,
      props: {
        style: {
          display: "flex",
        },
      },
    };

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

    let targetId = appJSON.id;
    if (selectedNode && selectedNode.type === "Container") {
      targetId = selectedNode.id;
    }

    addComponent(targetId, newNode);
  };

  // Ajouter une nouvelle page
  const addPage = () => {
    const newPageId = `page-${pages.length + 1}`;
    setPages([...pages, { id: newPageId, name: `Page ${pages.length + 1}`, tree: initialPage }]);
    setCurrentPageId(newPageId);
    setSelectedId(null);
  };

  // Supprimer une page
  const removePage = (pageId) => {
    if (pages.length > 1) {
      setPages((prev) => prev.filter((p) => p.id !== pageId));
      if (currentPageId === pageId) {
        setCurrentPageId(pages[0].id);
      }
    }
  };

  // Renommer une page
  const renamePage = (pageId, newName) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, name: newName } : p))
    );
  };

  return (
    <div className="studio-container">
      {/* Barre supérieure */}
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

      {/* Arborescence */}
      <TreePanel
        pages={pages}
        currentPageId={currentPageId}
        onSelectPage={setCurrentPageId}
        onRenamePage={renamePage}
        onRemovePage={removePage}
        onAddPage={addPage}
        selectedId={selectedId}
        onSelectComponent={handleSelectComponent}
      />

      {/* Player */}
      <div className="studio-center-panel">
        <div className="studio-player-wrapper">
          <Player
            componentTree={appJSON}
            onSelect={handleSelectComponent}
            selectedId={selectedId}
          />
        </div>
      </div>

      {/* Panneau de droite */}
      <SettingsPanel
        selectedNode={selectedNode}
        updateNodeProps={updateNodeProps}
        removeComponent={removeComponent}
      />
    </div>
  );
}
