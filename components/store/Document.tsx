import { useEffect, useMemo, useState } from "react";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  collection,
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { flatten, orderBy, uniq } from "lodash";

interface Props {
  path: string;
  projectId: string;
  store: Firestore | null;
}

export function Document({ path, store, projectId }: Props) {
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (!store) {
      return;
    }

    if (!path) {
      return;
    }

    return onSnapshot(doc(store, path), (snapshot) => {
      console.log(snapshot);

      setData(snapshot?.data());
    });
  }, [path, store]);

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="overflow-auto font-mono text-sm">
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
