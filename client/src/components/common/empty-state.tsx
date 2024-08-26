import { FC } from "react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  image?: string;
  primaryAction?: {
    title: string;
    onClick: () => void;
  };
  secondaryAction?: {
    title: string;
    onClick: () => void;
  };
}

const EmptyState: FC<EmptyStateProps> = ({
  title = "ไม่พบข้อมูล",
  description = "ไม่พบข้อมูลที่คุณต้องการ",
  image,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="flex flex-col items-center justify-center">
        {image ? (
          <div className="flex items-center justify-center">
            <img src={image} alt="empty-state" className="h-auto w-[300px]" />
          </div>
        ) : null}

        <h1 className="text-center text-xl font-bold">{title}</h1>
        <p className="text-center text-sm">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {secondaryAction ? (
          <Button onClick={secondaryAction.onClick} variant="outline">
            {secondaryAction.title}
          </Button>
        ) : null}
        {primaryAction ? <Button onClick={primaryAction.onClick}>{primaryAction.title}</Button> : null}
      </div>
    </div>
  );
};

export default EmptyState;
