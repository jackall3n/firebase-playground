import { useState } from "react";
import qs from "querystring";
import classnames from "classnames";
import { getQueryType } from "../../utils/getQueryType";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

interface Props {}

const TABS: Array<{ data: { projectId?: string; path?: string } }> = [
  {
    data: {},
  },
];

export function Tabs({}: Props) {
  const { push } = useRouter();
  const [tabs, setTabs] = useState(TABS);
  const [activeTab, setActiveTab] = useState(tabs.length - 1);

  function onNewTab() {
    setTabs((tabs) => {
      const updated = [...tabs, { data: {} } as any];

      setTimeout(() => onSetTab(updated.length - 1), 1);

      return updated;
    });
  }

  async function onSetTab(index: number) {
    setActiveTab(index);

    const tab = tabs[index];

    if (!tab) {
      return;
    }

    const query = qs.stringify(tab.data);
    const url = query ? `/store?${query}` : "/store";

    await push(url);
  }

  return (
    <div className="bg-black/10 border-b border-white/10 flex">
      <div className="grid grid-flow-col">
        {tabs.map((tab, index) => {
          const type = getQueryType(tab.data.path);
          const active = activeTab === index;

          return (
            <button
              onClick={() => onSetTab(index)}
              key={index}
              className={classnames(
                "text-left w-40 text-xs text-white border-x -mb-px border-t-2 px-4 py-3 flex items-center hover:bg-black/20 transition-colors",
                {
                  "border-white/10 border-t-orange-400 bg-gray-800": active,
                  "border-transparent text-white/50": !active,
                }
              )}
            >
              <div className="text-xs font-semibold font-mono pr-3">
                {type === "NONE" && <span className="text-sky-500">NEW</span>}
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

      <button
        className="m-2 transition-colors hover:bg-white/10 rounded-md aspect-square flex items-center justify-center"
        onClick={onNewTab}
      >
        <PlusIcon className="w-6 h-6 m-2 text-white" />
      </button>
    </div>
  );
}
