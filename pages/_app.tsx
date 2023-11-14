import Header from "@/components/common/Header";
import ModalProvider from "@/context/Modal/ModalProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <>
        <Header />
        <Component {...pageProps} />
      </>
    </ModalProvider>
  );
}
