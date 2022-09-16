import "../styles/globals.css";
import type { AppProps } from "next/app";
import { TabProvider } from "../providers/TabProvider";
import {useEffect} from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TabProvider>
      <Component {...pageProps} />
    </TabProvider>
  );
}

export default MyApp;
