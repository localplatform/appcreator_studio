// TreePanel.jsx
import React from "react";
import "./TreePanel.scss";

function TreePanel({ appJSON, selectedId, onSelectComponent }) {
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
            <h4>Arbre</h4>
            {renderTree(appJSON)}
        </div>
    );
}

export default TreePanel;
