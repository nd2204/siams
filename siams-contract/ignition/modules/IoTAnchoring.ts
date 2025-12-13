import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { keccak256, toUtf8Bytes } from "ethers";

const RELAYER_ROLE = keccak256(toUtf8Bytes("RELAYER_ROLE"));

export default buildModule("IoTAnchoringModule", (m) => {
  const admin = m.getAccount(0);
  const relayer = m.getAccount(1);

  const anchoring = m.contract("IoTAnchoring", [admin]);

  m.call(anchoring, "grantRole", [
    RELAYER_ROLE,
    relayer,
  ]);

  return { anchoring };
});
