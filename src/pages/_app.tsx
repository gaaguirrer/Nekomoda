import type { AppProps } from "next/app";
import "../styles/globals.css";
import { useEffect } from "react";
import { enterDemoMode } from "@/infrastructure/demo/demoMode";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    enterDemoMode();
  }, []);

  return <Component {...pageProps} />;
}
