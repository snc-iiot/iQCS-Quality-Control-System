import { useAtom } from "jotai";
import {
  defectAtom,
  defectSummaryAtom,
  graphSummaryAtom,
  ngCauseAtom,
  partAtom,
  productivityAtom,
  productivitySummaryAtom,
  topDefectAtom,
} from "./atom";

export const useAtomStore = () => {
  const [partList, setPartList] = useAtom(partAtom);
  const [ngCauseList, setNgCauseList] = useAtom(ngCauseAtom);

  const [defectList, setDefectList] = useAtom(defectAtom);
  const [defectSummaryList, setDefectSummaryList] = useAtom(defectSummaryAtom);
  const [graphSummaryList, setGraphSummaryList] = useAtom(graphSummaryAtom);
  const [topDefectList, setTopDefectList] = useAtom(topDefectAtom);

  const [productivityList, setProductivityList] = useAtom(productivityAtom);
  const [productivitySummaryList, setProductivitySummaryList] = useAtom(productivitySummaryAtom);

  return {
    partList,
    setPartList,
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
  };
};
