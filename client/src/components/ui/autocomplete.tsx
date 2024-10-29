import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { InputForm } from "../ui-pattern";

interface CustomInputAutoCompleteProps {
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  value?: string | undefined;
  className?: string;
  optionClassName?: string;
  label?: string;
}

export const AutoComplete: React.FC<CustomInputAutoCompleteProps> = ({
  options,
  placeholder,
  onChange,
  value,
  className,
  optionClassName,
  label,
}) => {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
      setOpen(true);
      setHighlightedIndex(-1);
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setOpen(true);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setOpen(false);
    }, 100);
  }, []);

  const handleOptionClick = useCallback(
    (option: string) => {
      onChange(option);
      setOpen(false);
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, filteredOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleOptionClick(filteredOptions[highlightedIndex]);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const option = listRef.current.children[highlightedIndex] as HTMLElement;
      option.scrollIntoView({ block: "center" });
    }
  }, [highlightedIndex]);

  const filteredOptions = options?.filter((option) => option?.toLowerCase().includes(value?.toLowerCase() || ""));

  return (
    <div className={cn("relative", className)}>
      <InputForm
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {open && filteredOptions?.length > 0 && (
        <div
          className={cn(
            "max-h-40 w-full overflow-y-auto rounded-md border bg-white shadow-lg",
            open ? "absolute z-50 mt-2" : "hidden",
            optionClassName
          )}
        >
          {filteredOptions?.length === 0 ? (
            <p className="cursor-pointer rounded-md p-2 text-sm hover:bg-gray-100">No options found</p>
          ) : (
            <ul ref={listRef} className="space-y-1 p-2">
              {filteredOptions?.map((option, index) => (
                <li
                  key={option}
                  onMouseDown={() => handleOptionClick(option)}
                  className={cn(
                    "cursor-pointer rounded-md p-2 text-sm hover:bg-gray-100",
                    highlightedIndex === index ? "bg-gray-200" : ""
                  )}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
