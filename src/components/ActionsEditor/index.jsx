import React, { useState } from "react";

function ActionEditor({ pages, actions, onUpdateActions }) {
  const [selectedAction, setSelectedAction] = useState("");

  const handleAddAction = () => {
    if (selectedAction === "Navigate") {
      onUpdateActions([...actions, { type: "Navigate", targetPage: pages[0]?.id }]);
    } else if (selectedAction === "ShowAlert") {
      onUpdateActions([...actions, { type: "ShowAlert", message: "Default Alert" }]);
    }
    setSelectedAction(""); // Reset après ajout
  };

  const handleUpdateAction = (index, newAction) => {
    const updatedActions = [...actions];
    updatedActions[index] = newAction;
    onUpdateActions(updatedActions);
  };

  const handleRemoveAction = (index) => {
    const updatedActions = actions.filter((_, i) => i !== index);
    onUpdateActions(updatedActions);
  };

  return (
    <div>
      <h4>Éditeur d'actions</h4>

      {/* Liste des actions actuelles */}
      {actions.map((action, index) => (
        <div key={index} style={{ marginBottom: "8px", border: "1px solid #ccc", padding: "8px" }}>
          <strong>Action : {action.type}</strong>
          {action.type === "Navigate" && (
            <div>
              <label>Cible :</label>
              <select
                value={action.targetPage}
                onChange={(e) =>
                  handleUpdateAction(index, { ...action, targetPage: e.target.value })
                }
              >
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {action.type === "ShowAlert" && (
            <div>
              <label>Message :</label>
              <input
                type="text"
                value={action.message}
                onChange={(e) =>
                  handleUpdateAction(index, { ...action, message: e.target.value })
                }
              />
            </div>
          )}
          <button onClick={() => handleRemoveAction(index)}>Supprimer</button>
        </div>
      ))}

      {/* Ajouter une nouvelle action */}
      <div>
        <label>Ajouter une action :</label>
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
        >
          <option value="">(Choisir une action)</option>
          <option value="Navigate">Naviguer</option>
          <option value="ShowAlert">Afficher une alerte</option>
        </select>
        <button onClick={handleAddAction} disabled={!selectedAction}>
          Ajouter
        </button>
      </div>
    </div>
  );
}

export default ActionEditor;
