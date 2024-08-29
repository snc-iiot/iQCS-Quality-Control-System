import { GET_ACCOUNTS } from "@/lib/constants";
import { TAccount, TCreateUpdateAccount } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AccountService } from "../account.service";
import { useMutationWithToast } from "./use-mutation-with-toast";

export const useAccount = () => {
  const { getAccounts, createAccount, updateAccount, deleteAccount } = new AccountService();

  const useGetAccounts = () => {
    return useQuery({
      queryKey: [GET_ACCOUNTS],
      queryFn: (): Promise<TAccount[]> => getAccounts(),
      refetchInterval: 10000,
    });
  };

  const { mutateAsync: mutateDeleteAccount } = useMutationWithToast(
    async (data: string) => await deleteAccount(data),
    "Deleting Account",
    [GET_ACCOUNTS]
  );

  const { mutateAsync: mutateCreateAccount } = useMutationWithToast(
    async (data: TCreateUpdateAccount) => await createAccount(data),
    "Creating Account",
    [GET_ACCOUNTS]
  );

  const { mutateAsync: mutateUpdateAccount } = useMutationWithToast(
    async (data: TCreateUpdateAccount) => await updateAccount(data),
    "Updating Account",
    [GET_ACCOUNTS]
  );

  return {
    useGetAccounts,
    mutateDeleteAccount,
    mutateCreateAccount,
    mutateUpdateAccount,
  };
};
