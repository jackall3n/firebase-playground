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
import updateDb from "update-browserslist-db";

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

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const value = window.localStorage.getItem(key);

      if (!value) {
        return setValue(defaultValue);
      }

      const parsed = JSON.parse(value);

      setValue(parsed ?? defaultValue);
    } catch (e) {}
  }, []);

  function update(fn: (value: T) => T) {
    setValue((value) => {
      const updated = cloneDeep(fn(value));

      window.localStorage.setItem(key, JSON.stringify(updated));

      return updated;
    });
  }

  return [value, update] as const;
}

export function TabProvider({ children }: PropsWithChildren<unknown>) {
  const { push } = useRouter();
  const [{ tabs, active }, setData] = useLocalStorage("data", {
    tabs: [] as ITab[],
    active: 0,
  });

  function updateTab(tab: ITab) {
    setData((data) => {
      data.tabs[active] = tab;

      return data;
    });
  }

  async function switchTab(index: number) {
    setData((data) => {
      data.active = index;

      return data;
    });

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

    setData((data) => {
      data.tabs = [...tabs, tab];

      return data;
    });

    setTimeout(() => switchTab(updated.length - 1), 1);
  }

  return (
    <TabContext.Provider
      value={{ active, switchTab, tabs, updateTab, createTab }}
    >
      {children}
    </TabContext.Provider>
  );
}
