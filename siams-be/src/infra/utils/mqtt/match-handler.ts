import { IMqttHandler } from "@domain/interfaces";

export function matchHandler(topic: string, topicTree: any): IMqttHandler | null {
  const topicParts = topic.split("/");
  let currentNode = topicTree;
  let params = {}
  for (let segment of topicParts) {
    if (!currentNode) break;
    if (currentNode[segment]) {
      currentNode = currentNode[segment]
    } else {
      currentNode = currentNode["+"];
      params
    }
  }
  const handler = currentNode as IMqttHandler
  // check if it a valid handler
  return (handler && typeof handler.handle === 'function') ? handler : null;
}
