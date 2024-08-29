import {
  TDefect,
  TDefectSummary,
  TGraphSummary,
  TNGCause,
  TPart,
  TProductivity,
  TProductivitySummary,
  TTopDefect,
  TMachine
} from "@/types";
import { atom } from "jotai";

export const partAtom = atom<TPart[]>([]);
export const ngCauseAtom = atom<TNGCause[]>([]);
export const defectAtom = atom<TDefect[]>([]);
export const defectSummaryAtom = atom<TDefectSummary[]>([]);
export const graphSummaryAtom = atom<TGraphSummary[]>([]);
export const topDefectAtom = atom<TTopDefect[]>([]);

export const productivityAtom = atom<TProductivity[]>([]);
export const productivitySummaryAtom = atom<TProductivitySummary[]>([]);

export const machineAtom = atom<TMachine[]>([]);