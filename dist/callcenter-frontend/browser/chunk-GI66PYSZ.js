// src/app/core/models/agent-status.model.ts
var AgentState;
(function(AgentState2) {
  AgentState2["DISPONIBLE"] = "DISPONIBLE";
  AgentState2["EN_REUNION"] = "EN_REUNION";
  AgentState2["REFRIGERIO"] = "REFRIGERIO";
  AgentState2["SSHH"] = "SSHH";
  AgentState2["EN_LLAMADA"] = "EN_LLAMADA";
  AgentState2["TIPIFICANDO"] = "TIPIFICANDO";
  AgentState2["EN_MANUAL"] = "EN_MANUAL";
})(AgentState || (AgentState = {}));
var AGENT_STATE_LABELS = {
  [AgentState.DISPONIBLE]: "Disponible",
  [AgentState.EN_REUNION]: "En Reuni\xF3n",
  [AgentState.REFRIGERIO]: "Refrigerio",
  [AgentState.SSHH]: "Ba\xF1o",
  [AgentState.EN_LLAMADA]: "En Llamada",
  [AgentState.TIPIFICANDO]: "Tipificando",
  [AgentState.EN_MANUAL]: "Modo Manual"
};
var MANUAL_STATES = [
  AgentState.DISPONIBLE,
  AgentState.EN_REUNION,
  AgentState.REFRIGERIO,
  AgentState.SSHH
];

export {
  AgentState,
  AGENT_STATE_LABELS,
  MANUAL_STATES
};
//# sourceMappingURL=chunk-GI66PYSZ.js.map
