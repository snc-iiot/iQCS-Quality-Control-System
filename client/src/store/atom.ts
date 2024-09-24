import {
  TAccount,
  TDefect,
  TDefectSummary,
  TDocument,
  TGraphSummary,
  THistoryUpdatePrice,
  TMachine,
  TModel,
  TNGCause,
  TPart,
  TPartSummary,
  TPlant,
  TPriceRatio,
  TProcess,
  TProductivity,
  TProductivitySummary,
  TSNCOverview,
  TSNCPartDetail,
  TTopDefect,
} from "@/types";
import { atom } from "jotai";

export const plantsAtom = atom<TPlant[]>([]);
export const processAtom = atom<TProcess[]>([]);
export const documentAtom = atom<TDocument[]>([]);
export const partAtom = atom<TPart[]>([]);
export const ngCauseAtom = atom<TNGCause[]>([]);
export const defectAtom = atom<TDefect[]>([]);
export const defectSummaryAtom = atom<TDefectSummary[]>([]);
export const graphSummaryAtom = atom<TGraphSummary[]>([]);
export const partSummaryAtom = atom<TPartSummary[]>([]);
export const topDefectAtom = atom<TTopDefect[]>([]);
export const productivityAtom = atom<TProductivity[]>([]);
export const productivitySummaryAtom = atom<TProductivitySummary[]>([]);
export const machineAtom = atom<TMachine[]>([]);
export const accountAtom = atom<TAccount[]>([]);
export const priceRatioAtom = atom<TPriceRatio[]>([]);
export const historyUpdatePriceAtom = atom<THistoryUpdatePrice[]>([]);
export const sncOverviewAtom = atom<TSNCOverview[]>([]);
export const sncPartDetailAtom = atom<TSNCPartDetail[]>([]);
export const modelAtom = atom<TModel[]>([]);
