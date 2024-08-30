import { EUserRole } from "@/constants/auth";
import { AuthService } from "@/services/auth.service";
import { FC } from "react";

export const ActionWithAdminHOC = (Component: FC) => {
  const { getUserRole } = new AuthService();

  const isAdmin = getUserRole() === EUserRole.ADMIN;

  return (props: any) => {
    return isAdmin ? <Component {...props} /> : null;
  };
};
