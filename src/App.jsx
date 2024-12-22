import React, { useState, useMemo } from "react";
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

  const componentTypes = [
    { label: "Container", value: "Container" },
    { label: "Text", value: "Text" },
    { label: "Button", value: "Button" },
  ];

  const currentPage = useMemo(() => pages.find((p) => p.id === currentPageId), [pages, currentPageId]);
  const appJSON = currentPage?.tree;

  const updateCurrentPageTree = (newTree) => {
    setPages((prev) =>
      prev.map((p) => (p.id === currentPageId ? { ...p, tree: newTree } : p))
    );
  };

  const findNodeById = (node, id) => {
    if (node.id === id) return node;
    if (!node.children) return null;
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
    return null;
  };

  const handleSelectComponent = (id) => {
    setSelectedId(id);
  };

  const selectedNode = useMemo(() => {
    if (!selectedId) return null;
    return findNodeById(appJSON, selectedId);
  }, [appJSON, selectedId]);

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

  const handleAddClick = (type) => {
    const newId = `new-${Math.floor(Math.random() * 10000)}`;
    let newNode = {
      id: newId,
      type,
      props: {
        style: {
          display: "flex",
        },
      },
    };

    switch (type) {
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

  const addPage = () => {
    const newPageId = `page-${pages.length + 1}`;
    setPages([...pages, { id: newPageId, name: `Page ${pages.length + 1}`, tree: initialPage }]);
    setCurrentPageId(newPageId);
    setSelectedId(null);
  };

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
        <div className="dropdown">
          {componentTypes.map((type) => (
            <div
              key={type.value}
              className="dropdown-item"
              onClick={() => handleAddClick(type.value)}
            >
              {type.label}
            </div>
          ))}
        </div>
      </div>

      {/* Arborescence */}
      <TreePanel
        pages={pages}
        currentPageId={currentPageId}
        onSelectPage={setCurrentPageId}
        selectedId={selectedId}
        onSelectComponent={handleSelectComponent}
        onAddPage={addPage}
        onRenamePage={renamePage}
        onRemovePage={removePage}
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
