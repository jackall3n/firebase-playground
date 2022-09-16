import { useMemo } from "react";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { Collection } from "./Collection";
import { Document } from "./Document";

interface Props {
  projectId?: string;
  path?: string;
}

export function Query({ projectId, path }: Props) {
  const app = useApp(projectId);
  const store = useStore(app);

  const segments =
    (path as string)
      ?.split("/")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const isCollection = segments.length % 2 !== 0;

  if (!projectId) {
    return (
      <div className="flex justify-center items-start flex-1">
        <div className="text-sm px-3 py-1">
          To get started, enter in a Project ID.
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="flex justify-center items-start flex-1">
        <div className="text-sm px-3 py-1">Now all you need is a path</div>
      </div>
    );
  }

  if (isCollection) {
    return <Collection path={path} store={store} projectId={projectId} />;
  }

  return <Document path={path} store={store} projectId={projectId} />;
}

function useApp(projectId?: string) {
  return useMemo(() => {
    if (!projectId) {
      return null;
    }

    const apps = getApps();
    const app = apps.find((a) => a.name === projectId);

    if (app) {
      return app;
    }

    try {
      return initializeApp(
        {
          projectId,
        },
        projectId
      );
    } catch (e) {
      console.error("failed to get app for id", projectId, e);
    }
  }, [projectId]);
}

function useStore(app?: FirebaseApp | null) {
  return useMemo(() => {
    if (!app) {
      return null;
    }

    return getFirestore(app);
  }, [app]);
}
