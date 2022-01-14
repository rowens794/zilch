import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="absolute inset-0 bg-red-900">
      <div className="h-full max-w-md m-auto bg-red-700 ">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
