import Link from "next/link";

interface Props {
  projectId: string;
  path?: string;
  value?: string;
}

export function ContentLink({ projectId, path, value }: Props) {
  return (
    <Link
      href={{
        href: "/store",
        query: {
          projectId,
          path,
        },
      }}
    >
      <a
        target="_blank"
        className="block max-w-sm underline bg-white/5 rounded-md px-2 py-1 text-ellipsis overflow-hidden whitespace-nowrap"
      >
        {value}
      </a>
    </Link>
  );
}
