import { ContentLink } from "./ContentLink";

interface Props {
  value: any;
  projectId: string;
}

export function Content({ value, projectId }: Props) {
  const isArray = Array.isArray(value);
  const isObject = typeof value === "object";

  if (isArray) {
    return (
      <div className="bg-white/5 rounded-md px-2 py-1">
        {String(value.length)} items
      </div>
    );
  }

  if (isObject) {
    if ("toDate" in value) {
      return (
        <div className="bg-white/5 rounded-md px-2 py-1">
          {value.toDate().toLocaleDateString()}{" "}
          {value.toDate().toLocaleTimeString()}
        </div>
      );
    }

    if (value?.firestore?.type === "firestore") {
      return (
        <ContentLink
          projectId={projectId}
          path={value?.path}
          value={value?.path}
        />
      );
    }

    return (
      <div className="max-w-sm bg-white/5 font-mono rounded-md px-2 py-1 text-ellipsis overflow-hidden whitespace-nowrap">
        {JSON.stringify(value)}
      </div>
    );
  }

  if (typeof value === "string" && value.startsWith("http")) {
    return (
      <a
        href={value}
        target="_blank"
        className="max-w-sm underline px-2 py-1 text-ellipsis overflow-hidden whitespace-nowrap"
      >
        {value}
      </a>
    );
  }

  if (typeof value === "string") {
    return (
      <div className="max-w-sm px-2 py-1 text-ellipsis overflow-hidden whitespace-nowrap">
        {value}
      </div>
    );
  }

  if (typeof value === "number") {
    return (
      <div className="max-w-sm px-2 py-1 text-right text-ellipsis overflow-hidden whitespace-nowrap">
        {String(value)}
      </div>
    );
  }
  if (typeof value === "boolean") {
    return (
      <div className="flex justify-end">
        <div className="bg-white/5 font-mono rounded-md px-2 py-1">
          {String(value)}
        </div>
      </div>
    );
  }

  if (value === null) {
    return (
      <div className=" max-w-sm px-2 py-1 text-ellipsis overflow-hidden whitespace-nowrap">
        null
      </div>
    );
  }

  if (value === undefined) {
    return (
      <div
        className=" px-2 py-1 text-white/
                20"
      >
        -
      </div>
    );
  }

  console.log({ value });

  return <div className="">?</div>;
}
