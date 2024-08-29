import { GET_DOCUMENTS } from "@/lib/constants";
import { TCreateUpdateDocument, TDocument } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { DocumentService } from "../document.service";
import { useMutationWithToast } from "./use-mutation-with-toast";

export const useDocument = () => {
  const { getDocuments, createDocument, updateDocument, deleteDocument } = new DocumentService();

  const useGetDocuments = () => {
    return useQuery({
      queryKey: [GET_DOCUMENTS],
      queryFn: (): Promise<TDocument[]> => getDocuments(),
      refetchInterval: 10000,
    });
  };

  const { mutateAsync: mutateCreateDocument } = useMutationWithToast(
    async (data: TCreateUpdateDocument) => await createDocument(data),
    "Document created successfully",
    [GET_DOCUMENTS]
  );

  const { mutateAsync: mutateUpdateDocument } = useMutationWithToast(
    async (data: TCreateUpdateDocument) => await updateDocument(data),
    "Document updated successfully",
    [GET_DOCUMENTS]
  );

  const { mutateAsync: mutateDeleteDocument } = useMutationWithToast(
    async (document_id: string) => await deleteDocument(document_id),
    "Document deleted successfully",
    [GET_DOCUMENTS]
  );

  return {
    useGetDocuments,
    mutateCreateDocument,
    mutateUpdateDocument,
    mutateDeleteDocument,
  };
};
