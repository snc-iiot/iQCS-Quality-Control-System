import { HomeLayout, RootLayout } from "@/layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  CausePage,
  DashboardPage,
  HistoryPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  PartPage,
  ProcessPage,
} from "./pages";
import DocumentManagementPage from "./pages/document-management-page";
import LoggingProductivityPage from "./pages/logging-productivity-page";
import MenuLoggingPage from "./pages/menu-logging-page";
import MenuManagementPage from "./pages/menu-management-page";
import MenuSettingPage from "./pages/menu-setting-page";

const App = () => {
  return (
    <RootLayout>
      {/* <BrowserRouter basename="/toolbox-on-cloud"> */}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<HomeLayout />}>
            <Route index element={<DashboardPage />} />

            <Route path="/logging">
              <Route index element={<MenuLoggingPage />} />
              <Route path="productivity" element={<LoggingProductivityPage />} />
              <Route path="ng-product" element={<HomePage />} />
            </Route>

            <Route path="/history" element={<HistoryPage />} />

            <Route path="/management">
              <Route index element={<MenuManagementPage />} />
              <Route path="document" element={<DocumentManagementPage />} />
              <Route path="complaint" element={<PartPage />} />
            </Route>

            <Route path="/settings">
              <Route index element={<MenuSettingPage />} />
              <Route path="process" element={<ProcessPage />} />
              <Route path="part" element={<PartPage />} />
              <Route path="cause" element={<CausePage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </RootLayout>
  );
};

export default App;
