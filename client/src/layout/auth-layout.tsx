import { useDocument, useNGCause, usePart, useProcess } from "@/services/hooks";
import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AuthLayout: FC<Props> = ({ children }) => {
  const { useGetParts } = usePart();
  const { useGetProcess } = useProcess();
  const { useGetDocuments } = useDocument();
  const { useGetNGCauses } = useNGCause();

  useGetParts();
  useGetProcess();
  useGetDocuments();
  useGetNGCauses();

  return <>{children}</>;
};
