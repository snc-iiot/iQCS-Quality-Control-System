import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateDocument } from "@/components/form";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/drop-down";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { renderFormattedDate } from "@/helpers/date-time.helper";
import { useDocument } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TDocument } from "@/types";
import { AlertDialog, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Copy, Ellipsis, Pencil, Trash2, User } from "lucide-react";
import { useState } from "react";

const DocumentManagementPage = () => {
  const { documentList } = useAtomStore();

  const [search, setSearch] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<TDocument | null>(null);
  const { mutateDeleteDocument } = useDocument();

  const filteredDocument = documentList?.filter(
    (part) =>
      part?.document_name?.toLowerCase().includes(search.toLowerCase()) ||
      part?.creator_name?.toLowerCase().includes(search.toLowerCase())
  );

  const dataFileImg = {
    csv: "https://cdn-icons-png.freepik.com/512/8242/8242984.png",
    doc: "https://google.oit.ncsu.edu/wp-content/uploads/sites/6/2021/01/Google_Docs.max-2800x2800-1.png",
    docx: "https://cdn-icons-png.flaticon.com/512/8242/8242988.png",
    xls: "https://cdn-icons-png.flaticon.com/512/4726/4726040.png",
    xlsx: "https://cdn-icons-png.freepik.com/512/8361/8361467.png",
    ppt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGE2kiIB6S3JSnZA4eSrERA7_kZ85W6VyVfw&s",
    pptx: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/.pptx_icon_%282019%29.svg/2048px-.pptx_icon_%282019%29.svg.png",
  };

  return (
    <>
      <div className="container mx-auto flex h-full w-full flex-col overflow-y-auto p-2">
        <div className="flex h-max flex-col gap-2 md:flex-row">
          <PageHeader
            title="การจัดการเอกสาร / Document Management"
            description="เครื่องมือที่ช่วยในการจัดการเอกสารอย่างมีระเบียบ"
          />
          <div className="flex w-full justify-end gap-2">
            <Input
              placeholder="ค้นหา"
              className="w-full md:w-1/4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="whitespace-nowrap" onClick={() => setIsDialogOpen(true)}>
              Add Document
            </Button>
          </div>
        </div>

        {filteredDocument?.length == 0 && (
          <div className="flex h-[10rem] w-full items-center justify-center">
            <p className="text-sm font-bold text-gray-400">No data variable</p>{" "}
          </div>
        )}
        <div className="grid max-h-full grid-cols-1 gap-2 overflow-auto py-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredDocument?.map((info, i) => {
            const { document_name, creator_name, updated_at, source_file, document_id } = info;
            const typeFile = source_file?.split(".")[source_file?.split(".")?.length - 1];
            return (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div
                      key={i}
                      className="flex h-[16rem] w-full cursor-pointer flex-col gap-1 overflow-clip rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                    >
                      <div className="flex h-max w-full items-center justify-center gap-1 overflow-clip">
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate text-sm font-medium">{document_name}</p>
                        </div>
                        <Dropdown
                          icon={<Ellipsis size={28} className="w-min rounded-full p-1 hover:bg-gray-300" />}
                          content={
                            <div className="flex flex-col">
                              <div
                                className="flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-gray-100"
                                onClick={() => {
                                  setIsDialogUpdateOpen(true);
                                  setSelectedDocument(info);
                                }}
                              >
                                <Pencil size={18} />
                                <p className="text-sm font-medium">Edit</p>
                              </div>
                              <div
                                className="flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-gray-100"
                                onClick={() => navigator.clipboard.writeText(source_file)}
                              >
                                <Copy size={18} />
                                <p className="text-sm font-medium">Copy link</p>
                              </div>

                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <div className="flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-gray-100">
                                    <Trash2 size={18} />
                                    <p className="text-sm font-medium">Delete</p>
                                  </div>
                                </AlertDialogTrigger>{" "}
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>คุณต้องการลบข้อมูลหรือไม่? / Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      การกระทำนี้ไม่สามารถย้อนกลับได้ / This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>ยกเลิก / Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={async () => {
                                        await mutateDeleteDocument(document_id);
                                      }}
                                    >
                                      ลบ / Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          }
                        />
                      </div>
                      <a
                        href={source_file}
                        target="_blank"
                        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-white"
                      >
                        {typeFile === "pdf" ? (
                          <iframe src={source_file} />
                        ) : (
                          <div className="p-20">
                            <img src={dataFileImg[typeFile as keyof typeof dataFileImg] ?? ""} alt={typeFile} />
                          </div>
                        )}
                        <div className="absolute left-0 top-0 h-full w-full" />
                      </a>

                      <div className="flex h-max w-full items-center justify-center gap-1 overflow-clip pt-1">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00000020]">
                          <User size={20} />
                        </div>
                        <div className="flex flex-1 items-center gap-1 overflow-hidden">
                          <p className="truncate text-xs font-medium">{creator_name}</p>
                          <div className="min-h-[4px] min-w-[4px] rounded-full bg-black" />
                          <p className="whitespace-nowrap text-xs font-medium">{renderFormattedDate(updated_at)}</p>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[300px] rounded-md bg-white p-2 shadow-md">
                    <p className="text-xs font-medium">
                      {info?.document_description ? info?.document_description : "No description for this document"}
                    </p>
                    <p className="text-xs font-medium">
                      {info?.effective_date ? `Effective Date: ${renderFormattedDate(info?.effective_date)}` : ""}
                    </p>
                    <p className="text-xs font-medium">
                      {info?.expire_date ? `Expire Date: ${renderFormattedDate(info?.expire_date)}` : ""}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80%] min-h-max overflow-auto">
          <DialogHeader>
            <DialogTitle>เพิ่มเอกสาร / Add Document</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>

          <CreateUpdateDocument onClose={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
        <DialogContent className="max-h-[80%] min-h-max overflow-auto">
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
            }}
            onClose={() => {
              setIsDialogUpdateOpen(false);
              setSelectedDocument(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentManagementPage;
