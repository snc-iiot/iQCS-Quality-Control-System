import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateDocument } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/drop-down";
import { Input } from "@/components/ui/input";
import { useAtomStore } from "@/store";
import { ArrowDownToLine, Copy, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

const DocumentManagementPage = () => {
  const { documentList } = useAtomStore();

  const [search, setSearch] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const filteredDocument = documentList?.filter(
    (part) =>
      part?.document_name?.toLowerCase().includes(search.toLowerCase()) ||
      part?.inspector_name?.toLowerCase().includes(search.toLowerCase())
  );

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
          {filteredDocument?.map(({ document_name, inspector_name, updated_at }, i) => (
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
                      <div className="flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-gray-100">
                        <Pencil size={18} />
                        <p className="text-sm font-medium">Edit</p>
                      </div>
                      <div className="flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-gray-100">
                        <Copy size={18} />
                        <p className="text-sm font-medium">Copy link</p>
                      </div>
                      <div className="flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-gray-100">
                        <ArrowDownToLine size={18} />
                        <p className="text-sm font-medium">Download</p>
                      </div>
                      <div className="flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-gray-100">
                        <Trash2 size={18} />
                        <p className="text-sm font-medium">Delete</p>
                      </div>
                    </div>
                  }
                />
              </div>
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-white">
                <img
                  className="w-full"
                  src="https://images.template.net/wp-content/uploads/2017/01/17001629/Sample-Word-Document-Template.jpg"
                  alt="file"
                />
                {/* <iframe src="https://snc-services.sncformer.com/snconeway/PDF%20File/CALENDAR%202024.pdf" /> */}
              </div>
              <div className="flex h-max w-full items-center justify-center gap-1 overflow-clip pt-1">
                <div className="h-6 w-6 rounded-full">
                  <img
                    className="w-full"
                    src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                    alt="file"
                  />
                </div>
                <div className="flex flex-1 items-center gap-1 overflow-hidden">
                  <p className="truncate text-xs font-medium">{inspector_name}</p>
                  <div className="mt-1 min-h-[4px] min-w-[4px] rounded-full bg-black" />
                  <p className="whitespace-nowrap text-xs font-medium">{updated_at}</p>
                  {/* <p className="whitespace-nowrap text-xs font-medium">Ang 21, 2024</p> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มเอกสาร / Add Document</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>

          <CreateUpdateDocument onClose={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentManagementPage;
