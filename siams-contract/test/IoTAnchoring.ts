import { expect } from "chai";
import { network } from "hardhat";
import { keccak256, toUtf8Bytes } from "ethers";
import IoTAnchoringModule from "../ignition/modules/IoTAnchoring";

const { ethers, ignition } = await network.connect()

const RELAYER_ROLE = keccak256(toUtf8Bytes("RELAYER_ROLE"));

describe("IoTAnchoring (Hardhat 3 + Chai)", function() {
  async function deployFixture() {
    const [admin, relayer, attacker] = await ethers.getSigners();
    const { anchoring } = await ignition.deploy(IoTAnchoringModule);
    return { anchoring, admin, relayer, attacker };
  }

  it("rejects non-relayer for device event anchoring", async function() {
    const { anchoring, attacker } = await deployFixture();

    const tx = anchoring.connect(attacker).anchorDeviceEvent(
      keccak256(toUtf8Bytes("device1")),
      keccak256(toUtf8Bytes("data1")),
      keccak256(toUtf8Bytes("org1")),
      "temperature",
      Math.floor(Date.now() / 1000)
    );

    await expect(tx).to.be.revert(ethers);
  });

  it("rejects non-relayer for batch anchoring", async function() {
    const { anchoring, attacker } = await deployFixture();

    const tx = anchoring.connect(attacker).anchorBatch(
      keccak256(toUtf8Bytes("root")),
      keccak256(toUtf8Bytes("org1")),
      3,
      Math.floor(Date.now() / 1000)
    );

    await expect(tx).to.be.revert(ethers);
  });
});
