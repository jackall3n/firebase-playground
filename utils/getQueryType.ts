export function getQueryType(path: string) {
    const segments =
        (path as string)
            ?.split("/")
            .map((s) => s.trim())
            .filter(Boolean) ?? [];

    const isCollection = segments.length % 2 !== 0;

    return (isCollection ? 'COLLECTION' : 'DOCUMENT')
}
