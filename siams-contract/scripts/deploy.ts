import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer, relayer] = await ethers.getSigners();

  const IoTAnchoring = await ethers.getContractFactory("IoTAnchoring");
  const anchoring = await IoTAnchoring.deploy(deployer.address);
  await anchoring.waitForDeployment();

  const anchoringAddress = await anchoring.getAddress();
  console.log("IoTAnchoring deployed to:", anchoringAddress);

  // grant role (same idea as your Ignition module)
  const RELAYER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("RELAYER_ROLE"));
  const tx = await anchoring.grantRole(RELAYER_ROLE, relayer.address);
  await tx.wait();

  // Save deployment for your app
  const outDir = path.join(process.cwd(), "deployments");
  fs.mkdirSync(outDir, { recursive: true });

  const file = path.join(outDir, "local.json");
  fs.writeFileSync(
    file,
    JSON.stringify(
      {
        chainId: (await deployer.provider!.getNetwork()).chainId.toString(),
        IoTAnchoring: anchoringAddress,
        deployer: deployer.address,
        relayer: relayer.address,
      },
      null,
      2
    )
  );

  console.log("Saved:", file);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});


