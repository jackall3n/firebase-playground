export function getQueryType(path: string) {
  const segments =
    (path as string)
      ?.split("/")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  if (segments.length === 0) {
    return "NONE";
  }

  const isCollection = segments.length % 2 !== 0;

  return isCollection ? "COLLECTION" : "DOCUMENT";
}
