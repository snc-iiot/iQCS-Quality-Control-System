import { useNGCause, usePart } from "@/services/hooks";
import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AuthLayout: FC<Props> = ({ children }) => {
  const { useGetParts } = usePart();
  const { useGetNGCauses } = useNGCause();

  useGetParts();
  useGetNGCauses();

  return <>{children}</>;
};
