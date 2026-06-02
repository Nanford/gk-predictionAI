export const normalizeRouteQuery = (
  query: Record<string, string | undefined>
): Record<string, string> => {
  const normalized: Record<string, string> = {};

  for (const [key, rawValue] of Object.entries(query)) {
    const segments = (rawValue ?? "").split("&");
    normalized[key] = decodeURIComponent(segments.shift() ?? "");
    for (const segment of segments) {
      const [nestedKey, ...nestedValueParts] = segment.split("=");
      if (nestedKey) {
        normalized[decodeURIComponent(nestedKey)] = decodeURIComponent(nestedValueParts.join("="));
      }
    }
  }

  return normalized;
};
