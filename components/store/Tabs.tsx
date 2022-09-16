import classnames from "classnames";
import { getQueryType } from "../../utils/getQueryType";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useTabs } from "../../providers/TabProvider";

interface Props {}

export function Tabs({}: Props) {
  const { tabs, createTab, switchTab, active } = useTabs();

  function onNewTab() {
    createTab({ data: {} });
  }

  return (
    <div className="bg-black/10 border-b border-white/10 flex">
      <div className="grid grid-flow-col">
        {tabs.map((tab, index) => {
          const type = getQueryType(tab.data.path);
          const isActive = active === index;

          return (
            <button
              onClick={() => switchTab(index)}
              key={index}
              className={classnames(
                "text-left w-40 text-xs text-white border-x -mb-px border-t-2 px-4 py-3 flex items-center hover:bg-black/20 transition-colors",
                {
                  "border-white/10 border-t-orange-400 bg-gray-800": isActive,
                  "border-transparent text-white/50": !isActive,
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
