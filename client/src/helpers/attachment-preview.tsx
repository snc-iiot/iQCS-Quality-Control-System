import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { X as Close, Expand, ExternalLink, Share, ZoomIn, ZoomOut } from "lucide-react";
import { FC, useEffect, useState } from "react";

export type TAttachmentType = "pdf" | "docx" | "pptx" | "xlsx" | "video" | "audio" | "image" | "other";

interface IAttachmentPreviewProps {
  attachment: {
    id: string;
    name: string;
    type: TAttachmentType;
    uri: string;
  } | null;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AttachmentPreview: FC<IAttachmentPreviewProps> = ({ attachment, className, isOpen, onClose }) => {
  const [fileZoom] = useState<{
    defaultZoom: number;
    zoomJump: number;
  }>({ defaultZoom: 1.1, zoomJump: 0.2 });

  const [zoom, setZoom] = useState(attachment?.type === "pdf" ? 0.5 : 1);

  useEffect(() => {
    if (!attachment) return;
    setZoom(attachment?.type === "pdf" ? 0.5 : 1);
  }, [attachment?.type]);

  if (!attachment) return null;

  const { name, uri } = attachment;
  const containerClasses = cn(
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",
    !isOpen && "hidden",
    className
  );

  const handleZoomIn = () => setZoom((prevZoom) => prevZoom + 0.1); // Increase zoom
  const handleZoomOut = () => setZoom((prevZoom) => (prevZoom > 0.2 ? prevZoom - 0.1 : prevZoom)); // Decrease zoom with a lower limit

  return (
    <div className={containerClasses}>
      <div className="flex h-screen w-full flex-col rounded-lg">
        <header className="flex items-center justify-between bg-black bg-opacity-90 px-4 py-4">
          <h2 className="text-lg font-medium text-white">{name}</h2>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  setZoom(1);
                }}
              >
                <Expand className="h-5 w-5 text-white" />
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    handleZoomOut();
                  }}
                >
                  <ZoomOut className="h-5 w-5 cursor-pointer text-white" />
                </button>

                <span className="rounded-full border px-2 py-0.5 text-sm text-white">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => {
                    handleZoomIn();
                  }}
                >
                  <ZoomIn className="h-5 w-5 cursor-pointer text-white" />
                </button>
              </div>
              <button
                onClick={() => {
                  window.open(uri, "_blank");
                }}
              >
                <ExternalLink className="h-5 w-5 text-white" />
              </button>
              <button>
                <Share className="h-5 w-5 text-white" />
              </button>
              <Button
                onClick={() => {
                  window.open(uri, "_blank");
                }}
              >
                Download
              </Button>
            </div>
            <button onClick={onClose}>
              <Close className="h-5 w-5 text-white" />
            </button>
          </div>
        </header>
        <div className="relative flex h-full flex-col items-start gap-2">
          <div className="relative flex h-0 w-full flex-grow flex-col overflow-hidden">
            <DocViewer
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "100%",
                overflow: "auto",
                backgroundColor: "#f5f5f5",
                border: "none",
                zoom: zoom,
              }}
              className="!border-none"
              documents={[
                {
                  uri,
                  fileType: attachment.type,
                },
              ]}
              pluginRenderers={DocViewerRenderers}
              config={{
                pdfZoom: {
                  defaultZoom: fileZoom.defaultZoom,
                  zoomJump: 0.2,
                },
                pdfVerticalScrollByDefault: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
