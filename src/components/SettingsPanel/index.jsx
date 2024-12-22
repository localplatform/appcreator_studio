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

  const incrementPxValue = (styleKey, step = 1) => {
    const currentValue = parseInt(style[styleKey] || "0", 10);
    handleStyleChange(styleKey, `${currentValue + step}px`);
  };

  const decrementPxValue = (styleKey, step = 1) => {
    const currentValue = parseInt(style[styleKey] || "0", 10);
    handleStyleChange(styleKey, `${Math.max(0, currentValue - step)}px`);
  };

  const handleBoxShadowChange = (key, value) => {
    const [horizontal, vertical, blur, spread, color] = (
      style.boxShadow || "0px 0px 0px 0px #000"
    ).split(" ");

    const newBoxShadow = {
      horizontal,
      vertical,
      blur,
      spread,
      color,
      [key]: value,
    };

    const boxShadowString = `${newBoxShadow.horizontal || "0px"} ${
      newBoxShadow.vertical || "0px"
    } ${newBoxShadow.blur || "0px"} ${
      newBoxShadow.spread || "0px"
    } ${newBoxShadow.color || "#000"}`;

    handleStyleChange("boxShadow", boxShadowString);
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

      {/* Propriétés spécifiques */}
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

      {/* Styles */}
      <div className="prop-block">
        <h5>Style</h5>

        {/* Flexbox-related styles */}
        <div className="style-input">
          <label>justifyContent :</label>
          <select
            value={style.justifyContent || ""}
            onChange={(e) =>
              handleStyleChange("justifyContent", e.target.value)
            }
          >
            <option value="">(none)</option>
            <option value="flex-start">flex-start</option>
            <option value="flex-end">flex-end</option>
            <option value="center">center</option>
            <option value="space-between">space-between</option>
            <option value="space-around">space-around</option>
            <option value="space-evenly">space-evenly</option>
          </select>
        </div>

        <div className="style-input">
          <label>alignItems :</label>
          <select
            value={style.alignItems || ""}
            onChange={(e) => handleStyleChange("alignItems", e.target.value)}
          >
            <option value="">(none)</option>
            <option value="flex-start">flex-start</option>
            <option value="flex-end">flex-end</option>
            <option value="center">center</option>
            <option value="baseline">baseline</option>
            <option value="stretch">stretch</option>
          </select>
        </div>

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
          label="flexGrow"
          styleKey="flexGrow"
          styleObj={style}
          onChange={handleStyleChange}
        />

        {/* Font-related styles */}
        <div className="style-input">
          <label>fontWeight :</label>
          <select
            value={style.fontWeight || ""}
            onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
          >
            <option value="">(none)</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={(i + 1) * 100}>
                {(i + 1) * 100}
              </option>
            ))}
          </select>
        </div>

        <div className="style-input">
          <label>fontFamily :</label>
          <select
            value={style.fontFamily || ""}
            onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
          >
            <option value="">(none)</option>
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
          </select>
        </div>

        {/* Border Radius */}
        <div className="style-input">
          <label>borderRadius :</label>
          <select
            value={parseInt(style.borderRadius || "0", 10)}
            onChange={(e) =>
              handleStyleChange("borderRadius", `${e.target.value}px`)
            }
          >
            {[...Array(11)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {/* Other styles with +/- buttons */}
        {["margin", "padding", "width", "height", "fontSize"].map((key) => (
          <div key={key} className="style-input">
            <label>{key} :</label>
            <button onClick={() => decrementPxValue(key)}>-</button>
            <input
              type="text"
              value={parseInt(style[key] || "0", 10)}
              onChange={(e) =>
                handleStyleChange(
                  key,
                  `${parseInt(e.target.value || "0", 10)}px`
                )
              }
            />
            <button onClick={() => incrementPxValue(key)}>+</button>
          </div>
        ))}

        {/* Background and text color */}
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

        {/* Border */}
        <StyleInput
          label="border"
          styleKey="border"
          styleObj={style}
          onChange={handleStyleChange}
        />

        {/* Gap */}
        <StyleInput
          label="gap"
          styleKey="gap"
          styleObj={style}
          onChange={handleStyleChange}
        />

        {/* Box Shadow */}
        <div className="prop-block">
          <h5>Box Shadow</h5>
          <StyleInput
            label="Horizontal Offset"
            styleKey="horizontal"
            styleObj={{ horizontal: style.boxShadow?.split(" ")[0] || "0px" }}
            onChange={(key, value) => handleBoxShadowChange("horizontal", value)}
          />
          <StyleInput
            label="Vertical Offset"
            styleKey="vertical"
            styleObj={{ vertical: style.boxShadow?.split(" ")[1] || "0px" }}
            onChange={(key, value) => handleBoxShadowChange("vertical", value)}
          />
          <StyleInput
            label="Blur Radius"
            styleKey="blur"
            styleObj={{ blur: style.boxShadow?.split(" ")[2] || "0px" }}
            onChange={(key, value) => handleBoxShadowChange("blur", value)}
          />
          <StyleInput
            label="Spread Radius"
            styleKey="spread"
            styleObj={{ spread: style.boxShadow?.split(" ")[3] || "0px" }}
            onChange={(key, value) => handleBoxShadowChange("spread", value)}
          />
          <StyleInput
            label="Shadow Color"
            styleKey="color"
            styleObj={{ color: style.boxShadow?.split(" ")[4] || "#000" }}
            onChange={(key, value) => handleBoxShadowChange("color", value)}
            type="color"
          />
        </div>
      </div>

      {/* Supprimer */}
      <button
        className="delete-btn"
        onClick={() => removeComponent(id)}
        style={{ marginTop: 16 }}
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
