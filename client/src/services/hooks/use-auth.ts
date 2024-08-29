import { TChangePassword } from "@/types";
import { AuthService } from "../auth.service";
import { useMutationWithToast } from "./use-mutation-with-toast";

export const useAuth = () => {
  const { changePassword } = new AuthService();

  const { mutateAsync: mutateChangePassword } = useMutationWithToast(
    async (data: TChangePassword) => await changePassword(data),
    "Change password successfully"
  );

  return {
    mutateChangePassword,
  };
};
