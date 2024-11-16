import { GET_FOLDERS } from "@/lib/constants";
import { TCreateUpdateFolder, TFolder } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { FolderService } from "../folder.service";
import { useMutationWithToast } from "./use-mutation-with-toast";

export const useFolder = () => {
  const { getFolders, createFolder, updateFolder, deleteFolder } = new FolderService();

  const useGetFolders = () => {
    return useQuery({
      queryKey: [GET_FOLDERS],
      queryFn: (): Promise<TFolder[]> => getFolders(),
      refetchInterval: 10000,
    });
  };

  const { mutateAsync: mutateCreateFolder } = useMutationWithToast(
    async (data: TCreateUpdateFolder) => await createFolder(data),
    "Folder created successfully",
    [GET_FOLDERS]
  );

  const { mutateAsync: mutateUpdateFolder } = useMutationWithToast(
    async (data: TCreateUpdateFolder) => await updateFolder(data),
    "Folder updated successfully",
    [GET_FOLDERS]
  );

  const { mutateAsync: mutateDeleteFolder } = useMutationWithToast(
    async (folder_id: string) => await deleteFolder(folder_id),
    "Folder deleted successfully",
    [GET_FOLDERS]
  );

  return {
    useGetFolders,
    mutateCreateFolder,
    mutateUpdateFolder,
    mutateDeleteFolder,
  };
};
