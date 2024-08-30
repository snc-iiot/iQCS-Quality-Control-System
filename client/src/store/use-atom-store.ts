import { useAtom } from "jotai";
import {
  accountAtom,
  defectAtom,
  defectSummaryAtom,
  documentAtom,
  graphSummaryAtom,
  machineAtom,
  ngCauseAtom,
  partAtom,
  plantsAtom,
  processAtom,
  productivityAtom,
  productivitySummaryAtom,
  topDefectAtom,
} from "./atom";

export const useAtomStore = () => {
  const [plantList, setPlantList] = useAtom(plantsAtom);

  const [processList, setProcessList] = useAtom(processAtom);
  const [partList, setPartList] = useAtom(partAtom);
  const [documentList, setDocumentList] = useAtom(documentAtom);
  const [ngCauseList, setNgCauseList] = useAtom(ngCauseAtom);

  const [defectList, setDefectList] = useAtom(defectAtom);
  const [defectSummaryList, setDefectSummaryList] = useAtom(defectSummaryAtom);
  const [graphSummaryList, setGraphSummaryList] = useAtom(graphSummaryAtom);
  const [topDefectList, setTopDefectList] = useAtom(topDefectAtom);

  const [productivityList, setProductivityList] = useAtom(productivityAtom);
  const [productivitySummaryList, setProductivitySummaryList] = useAtom(productivitySummaryAtom);

  const [machineList, setMachineList] = useAtom(machineAtom);
  const [accountList, setAccountList] = useAtom(accountAtom);

  return {
    plantList,
    setPlantList,
    processList,
    setProcessList,
    partList,
    setPartList,
    documentList,
    setDocumentList,
    ngCauseList,
    setNgCauseList,
    defectList,
    setDefectList,
    defectSummaryList,
    setDefectSummaryList,
    graphSummaryList,
    setGraphSummaryList,
    topDefectList,
    setTopDefectList,
    productivityList,
    setProductivityList,
    productivitySummaryList,
    setProductivitySummaryList,
    machineList,
    setMachineList,
    accountList,
    setAccountList,
  };
};
