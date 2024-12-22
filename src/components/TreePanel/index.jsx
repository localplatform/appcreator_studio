import React from "react";
import "./TreePanel.scss";

export default function TreePanel({ appJSON, selectedId, onSelectComponent }) {
    /**
     * Rendu récursif d'un noeud
     */
    const renderTree = (node, level = 0) => {
        return (
            <div
                key={node.id}
                className="tree-node"
                style={{ marginLeft: level * 12 }}
            >
                <div
                    className={`tree-item ${node.id === selectedId ? "selected" : ""
                        }`}
                    onClick={() => onSelectComponent(node.id)}
                >
                    {node.type} (<em>{node.id}</em>)
                </div>

                {/* Enfants */}
                {node.children &&
                    node.children.map((child) => renderTree(child, level + 1))}
            </div>
        );
    };

    return (
        <div className="studio-left-panel">
            <h4>Arbre</h4>
            {renderTree(appJSON)}
        </div>
    );
}
