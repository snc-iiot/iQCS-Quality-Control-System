import { useDocument, useNGCause, usePart, useProcess } from "@/services/hooks";
import { useAccount } from "@/services/hooks/use-account";
import { useMachine } from "@/services/hooks/use-machine";
import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AuthLayout: FC<Props> = ({ children }) => {
  const { useGetParts } = usePart();
  const { useGetProcess } = useProcess();
  const { useGetDocuments } = useDocument();
  const { useGetNGCauses } = useNGCause();
  const { useGetMachines } = useMachine();
  const { useGetAccounts } = useAccount();

  useGetParts();
  useGetProcess();
  useGetDocuments();
  useGetNGCauses();
  useGetMachines();
  useGetAccounts();

  return <>{children}</>;
};
