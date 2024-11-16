import { IFolder, IFolderContainsFiles } from "@/assets/images";
import { cn } from "@/lib/utils";
import { useDocument } from "@/services/hooks";
import { useFolder } from "@/services/hooks/use-folder";
import { TFolder } from "@/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { Button } from "../ui/button";
import { TFileProps } from "./file";

export type TFolderProps = {
  data?: TFolder;
  setFolder?: (folder_id: string) => void;
};

export const Folder: FC<TFolderProps> = ({ data = {} as TFolder, setFolder = () => {} }) => {
  const { mutateDeleteFolder, mutateUpdateFolder } = useFolder();
  const { mutateUpdateDocument } = useDocument();
  let holdTimer: NodeJS.Timeout | null = null;
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.folder_name);
  const [isOpenDetails, setIsOpenDetails] = useState("");
  const [onDelete, setOnDelete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
    setIsDragging(false);
    holdTimer = setTimeout(() => {
      if (!isDragging) {
        setIsOpenDetails(data?.folder_id);
      }
    }, 400);
  };

  const handleMouseMove = () => {
    if (holdTimer) {
      setIsDragging(true);
      clearTimeout(holdTimer);
    }
  };

  const handleMouseUp = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "file",
    drop: (item: TFileProps["data"]) => {
      mutateUpdateDocument({
        ...item,
        folder_id: data?.folder_id ?? null,
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
      <motion.div
        ref={drop}
        layoutId={`folder-${data?.folder_id}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: "pointer",
          backgroundColor: "#ffffff00",
          borderRadius: 6,
          boxShadow: "none",
        }}
        className={cn("cursor-pointer rounded-lg px-2", ` ${isOver ? "border-2 border-blue-500" : ""}`)}
      >
        <div className="flex h-[7.4rem] cursor-pointer flex-col items-center justify-center gap-0 overflow-hidden">
          <div
            className="flex h-full w-full items-center justify-center overflow-hidden"
            onClick={() => setFolder(data?.folder_id)}
          >
            <img src={(data?.number_of_files ?? 0) > 0 ? IFolderContainsFiles : IFolder} className="w-full" />
          </div>
          {isEditing ? (
            <div className="relative flex h-[2.7rem] w-full justify-center">
              <textarea
                className="fixed z-50 h-min border-b text-center text-[0.9rem] leading-[1.2]"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={() => {
                  setIsEditing(false);
                  mutateUpdateFolder({ ...data, folder_name: label });
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

      {isOpenDetails !== "" && (
        <div className="absolute left-0 top-0 flex h-screen w-screen flex-col items-center justify-center overflow-hidden p-2">
          <motion.div
            ref={modalRef}
            layoutId={`folder-${data?.folder_id}`}
            style={{
              padding: 10,
              backgroundColor: "#fff",
              borderRadius: 8,
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
            }}
            className="absolute flex h-min w-[20rem] flex-col gap-2"
          >
            <div className="relative flex items-center gap-2">
              <img src={(data?.number_of_files ?? 0) > 0 ? IFolderContainsFiles : IFolder} className="h-[2rem] w-min" />
              <p className="max-w-full">{data?.folder_name}</p>
              <X
                className="absolute right-0 cursor-pointer text-gray-200 hover:text-red-500"
                onClick={() => setIsOpenDetails("")}
              />
            </div>

            {!onDelete ? (
              <div className="">
                <p className="w-full border-b-[1px]">รายละเอียด</p>
                <div className="px-2 pt-1">
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
                  className="w-[6rem] bg-red-500 p-2 text-sm font-bold hover:bg-red-600"
                  onClick={() => setOnDelete(true)}
                  disabled={(data?.number_of_files ?? 0) > 0}
                >
                  ลบโฟลเดอร์
                </Button>
              </div>
            ) : (
              <div className="flex w-full justify-end gap-2">
                <Button
                  size={null}
                  className="w-[4rem] p-2 text-sm font-bold"
                  onClick={() => mutateDeleteFolder(data?.folder_id)}
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
