import { TResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export const useMutationWithToast = <TData,>(
  action: (data: TData) => Promise<TResponse<unknown>>,
  loadingMessage: string,
  revalidateKey?: string[]
) => {
  const queryClient = useQueryClient();

  const mutationFn = async (data: TData) => {
    // Show loading Swal
    Swal.fire({
      title: loadingMessage,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await action(data);

      Swal.close();

      // Show result Swal
      Swal.fire({
        title: res?.message,
        icon: res?.status,
        timer: 2000,
        showConfirmButton: false,
      });

      if (revalidateKey) {
        queryClient?.invalidateQueries({
          queryKey: revalidateKey,
        });
      }

      return res;
    } catch (error) {
      // Handle error
      Swal.fire({
        title: "Error",
        text: "An error occurred while processing your request.",
        icon: "error",
        showConfirmButton: false,
      });
      throw error;
    }
  };

  const { mutateAsync } = useMutation<TResponse<unknown>, Error, TData>({
    mutationFn,
  });

  return { mutateAsync };
};
