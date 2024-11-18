import { File, TFileProps } from "@/components/common/file";
import { Folder } from "@/components/common/folder";
import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateDocument } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDocument } from "@/services/hooks";
import { useFolder } from "@/services/hooks/use-folder";
import { useAtomStore } from "@/store";
import { TDocument } from "@/types";
import { ChevronRight, FilePlus, FolderPlus, MoreHorizontal } from "lucide-react";
import { FC, Fragment, useState } from "react";
import { useDrop } from "react-dnd";

const DocumentManagementPage: FC = () => {
  const { mutateUpdateDocument } = useDocument();
  const { mutateCreateFolder } = useFolder();
  const { documentList, folderList } = useAtomStore();

  const [search, setSearch] = useState<string>("");
  const [isDialogCreateFolder, setIsDialogCreateFolder] = useState<boolean>(false);
  const [isDialogCreateOpen, setIsDialogCreateOpen] = useState<boolean>(false);
  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<TDocument | null>(null);
  const [folder, setFolder] = useState<string>("");

  const CountNewFolder = folderList?.filter((info) => info?.folder_name?.slice(0, 10) === "New Folder")?.length;

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "file",
    drop: (item: TFileProps["data"]) => {
      mutateUpdateDocument({
        ...item,
        folder_id: null,
        document_name: item?.document_name ?? "",
        document_data: null,
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <>
      <div className="container mx-auto flex h-full w-full flex-col overflow-y-auto p-2">
        <div className="flex h-max flex-col gap-2 md:flex-row">
          <PageHeader
            title="การจัดการเอกสาร / Document Management"
            description="เครื่องมือที่ช่วยในการจัดการเอกสารอย่างมีระเบียบ"
          />
          <div className="flex w-full items-center justify-end gap-2">
            <Input
              placeholder="ค้นหา"
              className="w-full md:w-1/4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {!isDialogCreateOpen === !isDialogCreateFolder ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsDialogCreateFolder(true)} disabled={folder !== ""}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    <span>Add Folder</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDialogCreateOpen(true)}>
                    <FilePlus className="mr-2 h-4 w-4" />
                    <span>Add Document</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            )}
          </div>
        </div>

        <div className=" flex cursor-pointer gap-1 border-b-2 py-2">
          <p
            onClick={() => setFolder("")}
            ref={drop}
            className={cn(
              "cursor-pointer rounded-lg border-2 border-white px-2",
              ` ${isOver && folder !== "" ? "  border-blue-500" : ""}`
            )}
          >
            หน้าหลัก
          </p>

          {folder !== "" && (
            <div className=" flex gap-1">
              <ChevronRight />
              <p>{folderList?.find(({ folder_id }) => folder_id === folder)?.folder_name}</p>
            </div>
          )}
        </div>

        <div className="grid max-h-full grid-cols-4 gap-4 overflow-auto py-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-12">
          {folder === "" &&
            folderList?.map((info) => (
              <div key={`folder-${info?.folder_id}`} className="group">
                <Folder data={info} setFolder={setFolder} />
              </div>
            ))}

          {documentList
            ?.filter(({ folder_id }) => (folder === "" ? (folder_id ?? "") === "" : folder === folder_id))
            ?.map((data) => (
              <Fragment key={`file-document-${data?.document_id}`}>
                <File data={data} {...{ setIsDialogUpdateOpen, setSelectedDocument }} />
              </Fragment>
            ))}
        </div>

        <Dialog open={isDialogCreateFolder} onOpenChange={setIsDialogCreateFolder}>
          <DialogContent className="max-h-[80%] overflow-auto">
            <DialogHeader>
              <DialogTitle>เพิ่มโฟลเดอร์ / Add Folder</DialogTitle>
              <DialogDescription>
                โปรดอ่านคำอธิบายกดยืนยัน / Please read the description and press confirm.
              </DialogDescription>
            </DialogHeader>
            <p>
              กรุณากดเพิ่มโฟลเดอร์ เพื่อทำการเพิ่มโฟลเดอร์ "
              {CountNewFolder > 0 ? `New Folder (${CountNewFolder})` : "New Folder"}"{" "}
            </p>
            <Button
              onClick={async () => {
                await mutateCreateFolder({
                  folder_name: CountNewFolder > 0 ? `New Folder (${CountNewFolder})` : "New Folder",
                });
                setIsDialogCreateFolder(false);
              }}
            >
              Add Folder
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={isDialogCreateOpen} onOpenChange={setIsDialogCreateOpen}>
          <DialogContent className="max-h-[80%] overflow-auto">
            <DialogHeader>
              <DialogTitle>เพิ่มเอกสาร / Add Document</DialogTitle>
              <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
            </DialogHeader>
            <CreateUpdateDocument onClose={() => setIsDialogCreateOpen(false)} folderId={folder} />
          </DialogContent>
        </Dialog>

        <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
          <DialogContent className="max-h-[80%] overflow-auto">
            <DialogHeader>
              <DialogTitle>แก้ไขเอกสาร / Edit Document</DialogTitle>
              <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
            </DialogHeader>
            <CreateUpdateDocument
              data={{
                document_name: selectedDocument?.document_name ?? "",
                document_data: selectedDocument?.source_file ?? "",
                document_description: selectedDocument?.document_description ?? "",
                effective_date: selectedDocument?.effective_date ?? "",
                expire_date: selectedDocument?.expire_date ?? "",
                document_id: selectedDocument?.document_id ?? "",
                source_file: selectedDocument?.source_file ?? "",
                folder_id: folder ?? "",
              }}
              onClose={() => {
                setIsDialogUpdateOpen(false);
                setSelectedDocument(null);
              }}
              folderId={folder}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default DocumentManagementPage;
