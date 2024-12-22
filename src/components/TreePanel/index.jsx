import React, { useState } from "react";
import "./TreePanel.scss";

export default function TreePanel({
  pages,
  currentPageId,
  onSelectPage,
  onRenamePage,
  onRemovePage,
  onAddPage,
  selectedId,
  onSelectComponent,
}) {
  const [editingPageId, setEditingPageId] = useState(null); // Suivi de la page en cours de renommage
  const [editingValue, setEditingValue] = useState(""); // Valeur temporaire pour l'édition

  const handleDoubleClick = (pageId, currentName) => {
    setEditingPageId(pageId);
    setEditingValue(currentName);
  };

  const handleRename = (pageId) => {
    if (editingValue.trim() !== "") {
      onRenamePage(pageId, editingValue.trim());
    }
    setEditingPageId(null); // Terminer le mode édition
  };

  const renderTree = (node, level = 0) => {
    return (
      <div key={node.id} style={{ marginLeft: level * 12 }}>
        <div
          className={`tree-item ${node.id === selectedId ? "selected" : ""}`}
          onClick={() => onSelectComponent(node.id)}
        >
          {node.type} (<em>{node.id}</em>)
        </div>
        {node.children &&
          node.children.map((child) => renderTree(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="studio-left-panel">
      <h4>Arborecense</h4>
      {pages.map((page) => (
        <div
          key={page.id}
          className={`page-item ${page.id === currentPageId ? "selected-page" : ""}`}
          onClick={() => onSelectPage(page.id)}
        >
          {/* En-tête de la page : Nom et bouton supprimer */}
          <div className="page-header">
            {editingPageId === page.id ? (
              <input
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={() => handleRename(page.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(page.id);
                }}
                autoFocus
              />
            ) : (
              <div
                className="page-name"
                onDoubleClick={() => handleDoubleClick(page.id, page.name)}
              >
                {page.name}
              </div>
            )}
            <button
              className="delete-btn"
              onClick={() => onRemovePage(page.id)}
              disabled={pages.length === 1}
            >
              Supprimer
            </button>
          </div>

          {/* Arborescence */}
          {page.id === currentPageId && (
            <div className="tree-container">{renderTree(page.tree)}</div>
          )}
        </div>
      ))}

      {/* Bouton pour ajouter une nouvelle page */}
      <button className="add-page-btn" onClick={onAddPage}>
        Ajouter une page
      </button>
    </div>
  );
}
