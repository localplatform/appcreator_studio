// SettingsPanel.jsx
import React from "react";
import "./SettingsPanel.scss";

function SettingsPanel({ selectedNode, updateNodeProps, removeComponent }) {
  if (!selectedNode) {
    return (
      <div className="studio-right-panel">
        <h4>Propriétés</h4>
        <p>Aucun composant sélectionné</p>
      </div>
    );
  }

  const { id, type, props = {} } = selectedNode;
  const style = props.style || {};

  // Mise à jour immédiate du JSON parent
  const handlePropChange = (propKey, value) => {
    updateNodeProps(id, {
      ...props,
      [propKey]: value,
    });
  };

  const handleStyleChange = (styleKey, value) => {
    updateNodeProps(id, {
      ...props,
      style: {
        ...style,
        [styleKey]: value,
      },
    });
  };

  return (
    <div className="studio-right-panel">
      <h4>Propriétés</h4>
      <p>
        <strong>ID :</strong> {id}
      </p>
      <p>
        <strong>Type :</strong> {type}
      </p>

      {/* Spécifique "Text" */}
      {type === "Text" && (
        <div className="prop-block">
          <label>Texte :</label>
          <input
            type="text"
            value={props.text || ""}
            onChange={(e) => handlePropChange("text", e.target.value)}
          />
        </div>
      )}

      {/* Spécifique "Button" */}
      {type === "Button" && (
        <div className="prop-block">
          <label>Label :</label>
          <input
            type="text"
            value={props.label || ""}
            onChange={(e) => handlePropChange("label", e.target.value)}
          />
        </div>
      )}

      {/* Style */}
      <div className="prop-block">
        <h5>Style</h5>
        <div className="style-input">
          <label>flexDirection :</label>
          <select
            value={style.flexDirection || ""}
            onChange={(e) => handleStyleChange("flexDirection", e.target.value)}
          >
            <option value="">(none)</option>
            <option value="row">row</option>
            <option value="column">column</option>
            <option value="row-reverse">row-reverse</option>
            <option value="column-reverse">column-reverse</option>
          </select>
        </div>

        <StyleInput
          label="backgroundColor"
          styleKey="backgroundColor"
          styleObj={style}
          onChange={handleStyleChange}
          type="color"
        />
        <StyleInput
          label="color"
          styleKey="color"
          styleObj={style}
          onChange={handleStyleChange}
          type="color"
        />
        <StyleInput
          label="margin"
          styleKey="margin"
          styleObj={style}
          onChange={handleStyleChange}
        />
        <StyleInput
          label="padding"
          styleKey="padding"
          styleObj={style}
          onChange={handleStyleChange}
        />
        <StyleInput
          label="border"
          styleKey="border"
          styleObj={style}
          onChange={handleStyleChange}
        />
        <StyleInput
          label="fontSize"
          styleKey="fontSize"
          styleObj={style}
          onChange={handleStyleChange}
        />
        <StyleInput
          label="width"
          styleKey="width"
          styleObj={style}
          onChange={handleStyleChange}
        />
        <StyleInput
          label="height"
          styleKey="height"
          styleObj={style}
          onChange={handleStyleChange}
        />
      </div>

      {/* Supprimer */}
      <button
        className="delete-btn"
        onClick={() => removeComponent(id)}
        style={{ marginTop: 16, color: "red" }}
      >
        Supprimer ce composant
      </button>
    </div>
  );
}

/** Petit composant factorisé pour un champ de style */
function StyleInput({ label, styleKey, styleObj, onChange, type = "text" }) {
  return (
    <div className="style-input">
      <label>{label} :</label>
      <input
        type={type}
        value={styleObj[styleKey] || ""}
        onChange={(e) => onChange(styleKey, e.target.value)}
      />
    </div>
  );
}

export default SettingsPanel;
