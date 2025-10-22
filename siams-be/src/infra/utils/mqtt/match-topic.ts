export function matchTopic(subscribed: string, received: string): boolean {
  const subscribedParts = subscribed.split("/");
  const receivedParts = received.split("/");

  if (subscribedParts.length !== receivedParts.length) return false;

  for (let i = 0; i < subscribedParts.length; i++) {
    const part = subscribedParts[i]
    if (part.startsWith(":") || part.startsWith("{") || part.startsWith("+")) continue
    if (part !== receivedParts[i]) return false
  }
  return true
}
