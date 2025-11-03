export function parseTopic(topic: string, pattern: string): Record<string, string> {
  const topicParts = topic.split("/");
  const patternParts = pattern.split("/");

  const params: Record<string, string> = {};
  for (let i = 0; i < topicParts.length; i++) {
    const placeholder = patternParts[i]
    if (placeholder === "+") {
      params[`${i}`] = topicParts[i];
    } else if (placeholder.startsWith("{") && placeholder.endsWith("}")) {
      // hỗ trợ {orgId}, {clusterId}...
      const key = placeholder.substring(1, placeholder.length - 1);
      params[key] = topicParts[i];
    } else if (placeholder.startsWith(":")) {
      // hỗ trợ :orgId, :clusterId...
      const key = placeholder.substring(1, placeholder.length);
      params[key] = topicParts[i];
    }
  }
  return params;
}
