import { IFiles } from "@/assets/images";
import { AttachmentPreview } from "@/helpers/attachment-preview";
import { useDocument } from "@/services/hooks";
import { TDocument } from "@/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { Button } from "../ui/button";

export type TFileProps = {
  data?: TDocument;
  setSelectedDocument?: (data: TDocument) => void;
  setIsDialogUpdateOpen?: (data: boolean) => void;
};

export const File: FC<TFileProps> = ({
  data = {} as TDocument,
  setSelectedDocument = () => {},
  setIsDialogUpdateOpen = () => {},
}) => {
  const { mutateDeleteDocument, mutateUpdateDocument } = useDocument();

  let holdTimer: NodeJS.Timeout | null = null;
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "file",
    item: data,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [label, setLabel] = useState(data.document_name);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState("");
  const [onDelete, setOnDelete] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);

  const TFile = data?.source_file?.split(".")[data?.source_file?.split(".")?.length - 1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpenDetails("");
      }
    };

    if (isOpenDetails) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenDetails]);

  const handleMouseDown = () => {
    setIsDragging2(false);
    holdTimer = setTimeout(() => {
      if (!isDragging2) {
        setIsOpenDetails(data?.document_id);
      }
    }, 400);
  };

  const handleMouseMove = () => {
    if (holdTimer) {
      setIsDragging2(true);
      clearTimeout(holdTimer);
    }
  };

  const handleMouseUp = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
    }
  };

  return (
    <>
      <motion.div
        ref={drag}
        layoutId={`file-${data?.document_id}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: "pointer",
          backgroundColor: "#ffffff00",
          borderRadius: 0,
          boxShadow: "none",
        }}
        className={`${isDragging ? "opacity-50" : ""}`}
      >
        <div className="flex h-[7.4rem] cursor-pointer flex-col items-center justify-center gap-0 overflow-hidden">
          {data?.source_file.split(".")[3] === "pdf" ? (
            <div
              className="flex h-full w-full items-center justify-center overflow-hidden"
              onClick={() => setIsOpen(true)}
            >
              <img src={IFiles[TFile as keyof typeof IFiles] ?? ""} className="h-full" />
            </div>
          ) : (
            <a
              href={data?.source_file}
              target="_blank"
              rel="noopener noreferrer"
              type="application/pdf"
              className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-white"
            >
              <img src={IFiles[TFile as keyof typeof IFiles] ?? ""} className="h-full" />
            </a>
          )}
          {isEditing ? (
            <div className="relative flex h-[2.7rem] w-full justify-center">
              <textarea
                className="fixed z-50 h-min border-b text-center text-[0.9rem] leading-[1.2]"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={() => {
                  setIsEditing(false);
                  mutateUpdateDocument({ ...data, document_name: label, document_data: null });
                }}
                autoFocus
              />
            </div>
          ) : (
            <p
              className="line-clamp-2 h-[2.7rem] w-full text-center text-[0.9rem] leading-[1.2]"
              onDoubleClick={() => setIsEditing(true)}
            >
              {label}
            </p>
          )}
        </div>
      </motion.div>

      <AttachmentPreview
        attachment={{ id: data?.document_id, name: data?.document_name, type: "pdf", uri: data?.source_file }}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {isOpenDetails !== "" && (
        <div className="absolute left-0 top-0 flex h-screen w-screen flex-col items-center justify-center overflow-hidden p-2">
          <motion.div
            ref={modalRef}
            layoutId={`file-${data?.document_id}`}
            style={{
              padding: 10,
              backgroundColor: "#fff",
              borderRadius: 8,
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
            }}
            className="absolute flex h-min w-[20rem] flex-col gap-2"
          >
            <div className="relative flex items-center gap-2">
              <img
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                }
                className="h-[2rem] w-min"
              />
              <p className="max-w-full">{data?.document_name}</p>
              <X
                className="absolute right-0 cursor-pointer text-gray-200 hover:text-red-500"
                onClick={() => setIsOpenDetails("")}
              />
            </div>

            {!onDelete ? (
              <div className="">
                <p className="w-full border-b-[1px]">รายละเอียด</p>
                <div className="px-2 pt-1">
                  {data?.document_description && (
                    <div className=" flex w-full flex-col gap-1">
                      <p className="as -mb-2 w-[6rem] text-sm">คำอธิบาย :</p>
                      <p className=" indent-2">{data?.document_description}</p>
                    </div>
                  )}
                  {data?.effective_date && (
                    <div className=" flex w-full flex-col gap-1">
                      <p className="as -mb-2 w-[6rem] text-sm">วันที่มีผลบังคับใช้ :</p>
                      <p className=" indent-2">{format(new Date(data?.effective_date), "MMM dd, yyyy HH:mm")}</p>
                    </div>
                  )}
                  {data?.expire_date && (
                    <div className=" flex w-full flex-col gap-1">
                      <p className="as -mb-2 w-[6rem] text-sm">วันหมดอายุ :</p>
                      <p className=" indent-2">{format(new Date(data?.expire_date), "MMM dd, yyyy HH:mm")}</p>
                    </div>
                  )}
                  {data?.creator_name && (
                    <div className=" flex w-full flex-col gap-1">
                      <p className="as -mb-2 w-[6rem] text-sm">ผู้สร้าง :</p>
                      <p className=" indent-2">{data?.creator_name}</p>
                    </div>
                  )}
                  {data?.created_at && (
                    <div className=" flex w-full flex-col gap-1">
                      <p className="as -mb-2 w-[6rem] text-sm">วันที่สร้าง :</p>
                      <p className=" indent-2">{format(new Date(data?.created_at), "MMM dd, yyyy HH:mm")}</p>
                    </div>
                  )}
                  {data?.updated_at && (
                    <div className=" flex w-full flex-col gap-1">
                      <p className="as -mb-2 w-[6rem] text-sm">อัปเดทล่าสุด :</p>
                      <p className=" indent-2">{format(new Date(data?.updated_at), "MMM dd, yyyy HH:mm")}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="">
                <p className="w-full border-b-[1px]">ลบโฟลเดอร์</p>
                <p className="pt-1 text-sm">กรุณากดยืนยัน เพื่อทำการลบโฟลเดอร์นี้</p>
              </div>
            )}

            {!onDelete ? (
              <div className="flex w-full justify-end gap-2">
                <Button
                  size={null}
                  className="w-[6rem]  p-2 text-sm font-bold  "
                  onClick={() => {
                    setIsOpenDetails("");
                    setSelectedDocument(data);
                    setIsDialogUpdateOpen(true);
                  }}
                >
                  แก้ไขเอกสาร
                </Button>
                <Button
                  size={null}
                  className="w-[6rem] bg-red-500 p-2 text-sm font-bold hover:bg-red-600"
                  onClick={() => setOnDelete(true)}
                >
                  ลบไฟล์
                </Button>
              </div>
            ) : (
              <div className="flex w-full justify-end gap-2">
                <Button
                  size={null}
                  className="w-[4rem] p-2 text-sm font-bold"
                  onClick={() => mutateDeleteDocument(data?.document_id)}
                >
                  ยืนยัน
                </Button>
                <Button
                  size={null}
                  className="w-[4rem] bg-red-500 p-2 text-sm font-bold hover:bg-red-600"
                  onClick={() => setOnDelete(false)}
                >
                  ยกเลิก
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};
