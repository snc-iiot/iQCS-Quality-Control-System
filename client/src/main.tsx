import App from "@/app";
import ReactDOM from "react-dom/client";
import "@/styles/globals.css";
import "@/styles/custom.css";
import AppProviders from "@/lib/app-providers.tsx";
import { Provider } from "jotai";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider>
    <AppProviders>
      <App />
    </AppProviders>
  </Provider>
);
