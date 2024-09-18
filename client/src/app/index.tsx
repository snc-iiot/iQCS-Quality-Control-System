import { HomeLayout, RootLayout, SettingWrapper } from "@/layout";
import { OverviewLayout } from "@/layout/overview-layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AccountSettingPage,
  CausePage,
  CostPage,
  DashboardPage,
  DefectHistory,
  HomePage,
  ImportExcelPart,
  LoginPage,
  NotFoundPage,
  PartPage,
  ProcessPage,
  ProductionHistory,
  SettingMachinePage,
  SNCOverview,
} from "../pages";
import DocumentManagementPage from "../pages/document-management-page";
import LoggingProductivityPage from "../pages/logging-productivity-page";
import MenuLoggingPage from "../pages/menu-logging-page";
import MenuManagementPage from "../pages/menu-management-page";
import MenuSettingPage from "../pages/menu-setting-page";

const App = () => {
  return (
    <RootLayout>
      <BrowserRouter basename="/iqcs">
        {/* <BrowserRouter> */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/snc-overview" element={<OverviewLayout />}>
            <Route index element={<SNCOverview />} />
          </Route>
          <Route element={<HomeLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/logging">
              <Route index element={<MenuLoggingPage />} />
              <Route path="productivity" element={<LoggingProductivityPage />} />
              <Route path="ng-product" element={<HomePage />} />
            </Route>
            <Route path="/history/defect" element={<DefectHistory />} />
            <Route path="/history/production" element={<ProductionHistory />} />
            <Route path="/management">
              <Route index element={<MenuManagementPage />} />
              <Route path="document" element={<DocumentManagementPage />} />
              <Route path="complaint" element={<PartPage />} />
            </Route>
            <Route path="/settings" element={<SettingWrapper />}>
              <Route index element={<MenuSettingPage />} />
              <Route path="process" element={<ProcessPage />} />
              <Route path="part" element={<PartPage />} />
              <Route path="part/import" element={<ImportExcelPart />} />
              <Route path="cause" element={<CausePage />} />
              <Route path="account" element={<AccountSettingPage />} />
              <Route path="machine" element={<SettingMachinePage />} />
              <Route path="cost" element={<CostPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </RootLayout>
  );
};

export default App;
