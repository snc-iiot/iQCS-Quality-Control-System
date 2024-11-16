import { AuthService } from "@/services/auth.service";
import { useDocument, useNGCause, usePart, useProcess } from "@/services/hooks";
import { useAccount } from "@/services/hooks/use-account";
import { useFolder } from "@/services/hooks/use-folder";
import { useMachine } from "@/services/hooks/use-machine";
import { usePriceRatio } from "@/services/hooks/use-price-ratio";
import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export const AuthLayout: FC<Props> = ({ children }) => {
  const { useGetParts, useGetHistoryUpdatePrice, useGetModels } = usePart();
  const authService = new AuthService();

  const { useGetProcess } = useProcess();
  const { useGetDocuments } = useDocument();
  const { useGetFolders } = useFolder();
  const { useGetNGCauses } = useNGCause();
  const { useGetMachines } = useMachine();
  const { useGetAccounts } = useAccount();
  const { useGetPriceRatios } = usePriceRatio();

  useGetParts();
  useGetProcess();
  useGetDocuments();
  useGetFolders();
  useGetNGCauses();
  useGetMachines();
  useGetAccounts();
  useGetPriceRatios();
  useGetHistoryUpdatePrice();
  useGetModels();

  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
