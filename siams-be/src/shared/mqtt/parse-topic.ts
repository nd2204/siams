export function parseTopic(topic: string, pattern: string): Record<string, string> {
  const topicParts = topic.split("/");
  const patternParts = pattern.split("/");

  const params: Record<string, string> = {};
  for (let i = 0; i < topicParts.length; i++) {
    if (patternParts[i] === "+") {
      params[`${i}`] = topicParts[i];
    } else if (patternParts[i].startsWith("{") && patternParts[i].endsWith("}")) {
      // hỗ trợ {orgId}, {clusterId}...
      const key = patternParts[i].substring(1, patternParts[i].length - 1);
      params[key] = topicParts[i];
    } else if (patternParts[i].startsWith(":")) {
      // hỗ trợ :orgId, :clusterId...
      const key = patternParts[i].substring(1, patternParts[i].length);
      params[key] = topicParts[i];
    }
  }
  return params;
}
