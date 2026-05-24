const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FraudAuditModule", (m) => {
  const fraudAudit = m.contract("FraudAudit");
  return { fraudAudit };
});
