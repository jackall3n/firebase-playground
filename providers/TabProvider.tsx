import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import qs from "querystring";
import { useRouter } from "next/router";
import { cloneDeep } from "lodash";

export interface ITab {
  data: {
    projectId?: string;
    path?: string;
  };
}

export interface ITabContext {
  tabs: ITab[];
  active: number;

  updateTab(tab: ITab): void;

  createTab(tab: ITab): void;

  switchTab(index: number): Promise<void>;
}

export const TabContext = createContext<ITabContext>(undefined as never);
export const useTabs = () => useContext(TabContext);

export function TabProvider({ children }: PropsWithChildren<unknown>) {
  const { push } = useRouter();
  const [tabs, setTabs] = useState<ITab[]>([]);

  useEffect(() => {
    try {
      const value = window.localStorage.getItem("tabs");

      if (!value) {
        return;
      }

      setTabs(JSON.parse(value));
    } catch (e) {}
  }, []);

  const [active = 0, setActive] = useState<number>();

  function updateTabs(tabs: ITab[]) {
    localStorage.setItem("tabs", JSON.stringify(tabs));
    setTabs(cloneDeep(tabs));
  }

  function updateTab(tab: ITab) {
    tabs[active] = cloneDeep(tab);

    updateTabs(tabs);
  }

  async function switchTab(index: number) {
    setActive(index);

    const tab = tabs[index];

    if (!tab) {
      return;
    }

    const query = qs.stringify(tab.data);
    const url = query ? `/store?${query}` : "/store";

    await push(url);
  }

  function createTab(tab: ITab) {
    const updated = [...tabs, tab];
    updateTabs(updated);
    setTimeout(() => switchTab(updated.length - 1));
  }

  return (
    <TabContext.Provider
      value={{ active, switchTab, tabs, updateTab, createTab }}
    >
      {children}
    </TabContext.Provider>
  );
}
