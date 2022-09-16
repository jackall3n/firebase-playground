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
import classnames from "classnames";
import { getQueryType } from "../../utils/getQueryType";

interface Props {}

const tabs = [
  {
    data: {
      projectId: "zorp-co",
      path: "users/jack",
    },
    active: true,
  },
  {
    data: {
      projectId: "houstn-io",
      path: "users",
    },
  },
];

export function Tabs({}: Props) {
  return (
    <div className="bg-black/10 border-b border-white/10 flex">
      <div className="grid grid-flow-col">
        {tabs.map((tab, index) => {
          const type = getQueryType(tab.data.path);

          return (
            <button
              key={index}
              className={classnames(
                "text-left w-40 text-xs text-white border-x -mb-px border-t-2 px-4 py-3 flex items-center hover:bg-black/20 transition-colors",
                {
                  "border-white/10 border-t-orange-400 bg-gray-800": tab.active,
                  "border-transparent text-white/50": !tab.active,
                }
              )}
            >
              <div className="text-xs font-semibold font-mono pr-3">
                {type === "COLLECTION" && (
                  <span className="text-green-500">COL</span>
                )}
                {type === "DOCUMENT" && (
                  <span className="text-purple-400">DOC</span>
                )}
              </div>
              <div>
                <div className="whitespace-nowrap text-ellipsis overflow-hidden tracking-wide">
                  {tab.data.path}
                </div>
                <div className="whitespace-nowrap text-[10px] text-ellipsis overflow-hidden text-white/30">
                  {tab.data.projectId}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
