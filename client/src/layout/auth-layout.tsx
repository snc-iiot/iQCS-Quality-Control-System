import { AuthService } from "@/services/auth.service";
import { useDocument, useNGCause, usePart, useProcess } from "@/services/hooks";
import { useAccount } from "@/services/hooks/use-account";
import { useMachine } from "@/services/hooks/use-machine";
import { usePriceRatio } from "@/services/hooks/use-price-ratio";
import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export const AuthLayout: FC<Props> = ({ children }) => {
  const { useGetParts } = usePart();
  const authService = new AuthService();

  const { useGetProcess } = useProcess();
  const { useGetDocuments } = useDocument();
  const { useGetNGCauses } = useNGCause();
  const { useGetMachines } = useMachine();
  const { useGetAccounts } = useAccount();
  const { useGetPriceRatios } = usePriceRatio();

  useGetParts();
  useGetProcess();
  useGetDocuments();
  useGetNGCauses();
  useGetMachines();
  useGetAccounts();
  useGetPriceRatios();

  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
