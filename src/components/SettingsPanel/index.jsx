import React, { useEffect, useState } from "react";
import "./SettingsPanel.scss";

function SettingsPanel({ selectedNode, updateNodeProps, removeComponent }) {
    // States locaux : localProps et localStyle
    const [localProps, setLocalProps] = useState({});
    const [localStyle, setLocalStyle] = useState({});

    // Quand on change de composant sélectionné, on "charge" ses props dans nos states
    useEffect(() => {
        if (selectedNode) {
            setLocalProps({ ...selectedNode.props });
            setLocalStyle({ ...(selectedNode.props.style || {}) });
        } else {
            setLocalProps({});
            setLocalStyle({});
        }
    }, [selectedNode]);

    // Fonction pour synchroniser nos valeurs locales -> le JSON global
    const commitChanges = () => {
        if (!selectedNode) return;
        // On envoie toutes les props, en s'assurant de bien inclure style
        updateNodeProps(selectedNode.id, {
            ...localProps,
            style: { ...localStyle },
        });
    };

    // Helpers pour mettre à jour localProps/localStyle au fil de la frappe
    // (sans impacter le JSON parent)
    const setPropValue = (key, value) => {
        setLocalProps((prev) => ({ ...prev, [key]: value }));
    };
    const setStyleValue = (key, value) => {
        setLocalStyle((prev) => ({ ...prev, [key]: value }));
    };

    // Si rien n'est sélectionné
    if (!selectedNode) {
        return (
            <div className="studio-right-panel">
                <h4>Propriétés</h4>
                <div>Aucun composant sélectionné</div>
            </div>
        );
    }

    const { id, type } = selectedNode;

    // Petits composants pour factoriser un input text et un select
    const StyleInput = ({ label, styleKey, type = "text" }) => (
        <div className="style-input">
            <label>{label} :</label>
            <input
                type={type}
                value={localStyle[styleKey] || ""}
                onChange={(e) => setStyleValue(styleKey, e.target.value)}
                onBlur={commitChanges}
            />
        </div>
    );

    const StyleSelect = ({ label, styleKey, options = [] }) => (
        <div className="style-input">
            <label>{label} :</label>
            <select
                value={localStyle[styleKey] || ""}
                onChange={(e) => setStyleValue(styleKey, e.target.value)}
                onBlur={commitChanges}
            >
                <option value="">(aucun)</option>
                {options.map((op) => (
                    <option key={op} value={op}>
                        {op}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="studio-right-panel">
            <h4>Propriétés</h4>

            <p>
                <strong>ID : </strong> {id}
            </p>
            <p>
                <strong>Type : </strong> {type}
            </p>

            {/* Propriétés spécifiques au type */}
            {type === "Text" && (
                <div className="prop-block">
                    <label>Texte : </label>
                    <input
                        type="text"
                        value={localProps.text || ""}
                        onChange={(e) => setPropValue("text", e.target.value)}
                        onBlur={commitChanges}
                    />
                </div>
            )}

            {type === "Button" && (
                <div className="prop-block">
                    <label>Label : </label>
                    <input
                        type="text"
                        value={localProps.label || ""}
                        onChange={(e) => setPropValue("label", e.target.value)}
                        onBlur={commitChanges}
                    />
                </div>
            )}

            {/* Bloc pour les styles */}
            <div className="prop-block">
                <h5>Style</h5>

                {/* flexDirection (on l'affiche même si c'est un Text/Button : libre à vous) */}
                <StyleSelect
                    label="flexDirection"
                    styleKey="flexDirection"
                    options={["row", "column", "row-reverse", "column-reverse"]}
                />

                {/* Couleur de fond */}
                <StyleInput
                    label="backgroundColor"
                    styleKey="backgroundColor"
                    type="color"
                />

                {/* Couleur du texte */}
                <StyleInput label="color" styleKey="color" type="color" />

                {/* margin, padding, border, fontSize, etc. */}
                <StyleInput label="margin" styleKey="margin" />
                <StyleInput label="padding" styleKey="padding" />
                <StyleInput label="border" styleKey="border" />
                <StyleInput label="fontSize" styleKey="fontSize" />
                <StyleInput label="width" styleKey="width" />
                <StyleInput label="height" styleKey="height" />
            </div>

            {/* Bouton pour supprimer */}
            <button className="delete-btn" onClick={() => removeComponent(id)}>
                Supprimer ce composant
            </button>
        </div>
    );
}

export default React.memo(SettingsPanel);
