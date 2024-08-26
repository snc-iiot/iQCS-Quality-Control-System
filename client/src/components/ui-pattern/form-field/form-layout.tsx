import { Required } from "@/components/common/required";
import { cn } from "@/lib/utils";
import { FC } from "react";

type Props = {
  align?: "left" | "right";
  children?: any;
  className?: string;
  descriptionText?: string | React.ReactNode;
  error?: string | React.ReactNode;
  id?: string;
  label?: string | React.ReactNode;
  labelOptional?: string | React.ReactNode;
  layout?: "horizontal" | "vertical" | "flex";
  style?: React.CSSProperties;
  beforeLabel?: string;
  afterLabel?: string | React.ReactNode;
  nonBoxInput?: boolean;
  labelLayout?: "horizontal" | "vertical";
  isRequired?: boolean;
};

export const FormLayout: FC<Props> = ({
  align = "left",
  children,
  className,
  descriptionText,
  error,
  id,
  label,
  labelOptional,
  layout = "vertical",
  style,
  beforeLabel,
  afterLabel,
  labelLayout = "horizontal",
  isRequired,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        className,
        layout === "horizontal" && "flex-row",
        layout === "flex" && "flex",
        align === "right" && "items-end"
      )}
      style={style}
    >
      {label && (
        <label
          htmlFor={id}
          className={`whitespace-nowrap text-sm font-semibold ${
            labelLayout === "horizontal" ? "flex items-center gap-2" : ""
          }`}
        >
          {beforeLabel && <span>{beforeLabel}</span>}
          {label}
          {labelOptional && <span className="text-xs text-gray-400">{labelOptional}</span>}
          {isRequired && <Required />}
          {afterLabel && <span>{afterLabel}</span>}
        </label>
      )}
      {children}
      {descriptionText && <span className="text-xs text-gray-400">{descriptionText}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
