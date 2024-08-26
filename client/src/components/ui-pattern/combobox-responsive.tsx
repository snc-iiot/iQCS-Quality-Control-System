import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { FC, useState } from "react";
import { Button } from "../ui/button";

interface ComboBoxResponsiveProps {
  label: string;
  labelFilter: string;
  options: { value: string; label: string }[];
  value: string;
  emptyLabel: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
}

export const ComboBoxResponsive: FC<ComboBoxResponsiveProps> = ({
  labelFilter,
  options,
  value,
  emptyLabel,
  onChange,
  label,
  error,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  const optionWithOutDuplicate = options.filter(
    (v, i, a) => a.findIndex((t) => t.value === v.value) === i && v.value !== ""
  );

  if (isDesktop) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold">{label}</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full justify-between font-normal")}>
              {optionWithOutDuplicate?.find((option) => option.value === value)?.label ?? emptyLabel}
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-max p-0" align="start">
            <OptionList
              options={optionWithOutDuplicate}
              selectedOption={value}
              setSelectedOption={(value) => {
                onChange(value);
                setOpen(false);
              }}
              label={labelFilter}
            />
          </PopoverContent>
        </Popover>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild className="w-full">
          <Button variant="outline" className="w-full justify-between font-normal">
            {optionWithOutDuplicate?.find((option) => option.value === value)?.label ?? emptyLabel}
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList
              options={optionWithOutDuplicate}
              selectedOption={value}
              setSelectedOption={(value) => {
                onChange(value);
                setOpen(false);
              }}
              label={labelFilter}
            />
          </div>
        </DrawerContent>
      </Drawer>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

const OptionList: FC<{
  options: { value: string; label: string }[];
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  label?: string;
}> = ({ options, selectedOption, setSelectedOption, label = "Select option" }) => {
  return (
    <Command>
      <CommandInput placeholder={label} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.label}
              value={option.label}
              onSelect={() => {
                setSelectedOption(option.value);
              }}
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                {selectedOption === option.value && <CheckIcon className="h-4 w-4" />}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
