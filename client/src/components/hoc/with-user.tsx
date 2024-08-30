import { EUserRole } from "@/constants/auth";
import { AuthService } from "@/services/auth.service";
import { FC } from "react";

const authService = new AuthService();

export const WithUserHOC = (Component: FC) => {
  const userRole = authService.getUserRole();

  return (props: React.ComponentProps<typeof Component>) => {
    if (userRole === EUserRole.USER || userRole === EUserRole.ADMIN) {
      return <Component {...props} />;
    }
    return null;
  };
};
