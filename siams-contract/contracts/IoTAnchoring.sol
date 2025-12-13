// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract IoTAnchoring is AccessControl {
  bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");

  event DeviceEventAnchored(
    bytes32 indexed deviceId,
    bytes32 indexed dataHash,
    bytes32 indexed orgId,
    string action,
    uint256 timestamp,
    address relayer
  );

  event BatchAnchored(
    bytes32 indexed merkleRoot,
    bytes32 indexed orgId,
    uint256 batchSize,
    uint256 timestamp,
    address relayer
  );

  constructor(address admin) {
    _grantRole(DEFAULT_ADMIN_ROLE, admin);
  }

  // anchor a single payload hash (lightweight metadata)
  function anchorDeviceEvent(
    bytes32 deviceId,
    bytes32 dataHash,
    bytes32 orgId,
    string calldata action,
    uint256 timestamp
  ) external onlyRole(RELAYER_ROLE) {
    emit DeviceEventAnchored(deviceId, dataHash, orgId, action, timestamp, msg.sender);
  }

  // anchor a Merkle root representing a batch of dataHash
  function anchorBatch(
    bytes32 merkleRoot,
    bytes32 orgId,
    uint256 batchSize,
    uint256 timestamp
  ) external onlyRole(RELAYER_ROLE) {
    emit BatchAnchored(merkleRoot, orgId, batchSize, timestamp, msg.sender);
  }

  // Optional: on-chain verifier for Merkle proof (gas cost -> consider off-chain)
  function verifyMerkleProof(bytes32 root, bytes32 leaf, bytes32[] memory proof) public pure returns (bool) {
    bytes32 hash = leaf;
    for (uint i = 0; i < proof.length; i++) {
      bytes32 p = proof[i];
      if (hash <= p) hash = keccak256(abi.encodePacked(hash, p));
      else hash = keccak256(abi.encodePacked(p, hash));
    }
    return hash == root;
  }
}
