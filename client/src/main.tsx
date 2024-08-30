import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/styles/globals.css";
import "@/styles/custom.css";
import { Provider } from "jotai";
import AppProviders from "./lib/app-providers.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider>
    <AppProviders>
      <App />
    </AppProviders>
  </Provider>
);
