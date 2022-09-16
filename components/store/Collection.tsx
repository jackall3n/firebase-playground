import { useEffect, useMemo, useState } from "react";
import {
  FirebaseApp,
  FirebaseError,
  getApps,
  initializeApp,
} from "firebase/app";
import {
  collection,
  Firestore,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { flatten, orderBy, uniq } from "lodash";
import { ContentLink } from "./content/ContentLink";
import { Content } from "./content/Content";

interface Props {
  path: string;
  projectId: string;
  store: Firestore | null;
}

export function Collection({ path, store, projectId }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<FirebaseError>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!store) {
      return;
    }

    if (!path) {
      return;
    }

    setLoading(true);

    const listener = onSnapshot(
      collection(store, path),
      (snapshot) => {
        console.log(snapshot);

        setData(snapshot.docs);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => {
      setData([]);
      setError(undefined);
      return listener();
    };
  }, [path, store]);

  const headers = useMemo(() => {
    const values = flatten(data.map((a) => Object.keys(a.data())));

    const headers = uniq(values);
    console.log(headers);

    return orderBy(headers);
  }, [data]);

  console.log({ data, headers });

  if (loading) {
    return (
      <div className="flex justify-center items-start flex-1">
        <div className="text-sm px-3 py-1 text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-start flex-1">
        <div className="bg-red-700 text-black/60 rounded-lg text-sm font-semibold px-3 py-1 text-center">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-xs">{data.length} Results</div>

      <div className="overflow-x-auto">
        <table className="flex-1">
          <thead>
            <tr className="text-sm">
              <td className="px-2 py-1">id</td>

              {headers.map((header) => (
                <td key={header} className="px-2 py-1">
                  {header}
                </td>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((document) => {
              const data = document.data();

              return (
                <tr key={document.id} className="font-mono font-light text-xs">
                  <td className="pb-1 pr-1">
                    <ContentLink
                      projectId={projectId}
                      path={`${document.ref.parent.path}/${document.id}`}
                      value={document.id}
                    />
                  </td>

                  {headers.map((header) => {
                    const value = data[header];

                    return (
                      <td key={header} className="max-w-xl pb-1 pr-1">
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                          <Content value={value} projectId={projectId} />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
