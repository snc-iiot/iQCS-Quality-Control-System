import { EUserRole } from "@/constants/auth";
import { AuthService } from "@/services/auth.service";
import { FC } from "react";

export const WithUserHOC = (Component: FC) => {
  const authService = new AuthService();
  const userRole = authService.getUserRole();

  return (props: React.ComponentProps<typeof Component>) => {
    if (userRole === EUserRole.USER || userRole === EUserRole.ADMIN) {
      return <Component {...props} />;
    }
    return null;
  };
};
