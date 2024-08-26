import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FC } from "react";
import { FormLayout } from "./form-layout";

export interface RadioFormProps {
  label?: string;
  descriptionText?: string | React.ReactNode | undefined;
  error?: string;
  layout?: "horizontal" | "vertical";
  options: {
    label: string | React.ReactNode;
    value: string;
  }[];
  value?: string;
  onChange?: (value: string) => void;
  afterLabel?: string;
  beforeLabel?: string;
  labelOptional?: string | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  required?: boolean;
}

export const RadioForm: FC<RadioFormProps> = ({
  label,
  descriptionText,
  error,
  layout,
  options,
  value,
  onChange,
  ...props
}) => {
  return (
    <FormLayout
      {...props}
      label={label}
      descriptionText={descriptionText}
      error={error}
      layout={layout}
      isRequired={props.required}
    >
      <RadioGroup value={value} onValueChange={onChange}>
        {options?.map((option, i) => (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`option-${i}`} />
            <label className="text-sm" htmlFor={`option-${i}`}>
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
    </FormLayout>
  );
};
