import { PageHeader } from "@/components/common/page-header";
import { FormField } from "@/components/ui-pattern";
import { InputForm } from "@/components/ui-pattern/form-field/input-form";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { validationImportExcelPartSchema } from "@/components/validations";
import { ExcelHelper } from "@/helpers/excel.helper";
import { usePart } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TCreateUpdatePart } from "@/types";
import { FC, useRef, useState } from "react";

type TGenerateExcelTemplate = {
  process_id: string;
  customer: string;
  total_part: number | null;
};

export const ImportExcelPart: FC = () => {
  const { processList } = useAtomStore();
  const excelHelper = new ExcelHelper();
  const inputRef = useRef<HTMLInputElement>(null);
  const initialValues: TGenerateExcelTemplate = {
    process_id: "",
    customer: "",
    total_part: null,
  };

  const { mutateImportExcelPart } = usePart();

  const [importPart, setImportPart] = useState<TCreateUpdatePart[]>([]);

  const handleSubmit = async (values: TGenerateExcelTemplate) => {
    const data = Array.from({ length: values.total_part ?? 1 }).map((_) => ({
      part_code: "",
      part_name: "",
      processes: values?.process_id,
      price: null,
      sap_code: "",
      part_description: "",
      customers: values?.customer,
    }));
    excelHelper.downloadExcelData(data, `import-part-${values?.customer}-${values?.total_part}-part`);
  };

  const getProcessName = (processId: string) => {
    const process = processList?.find((process) => process?.process_id === processId);
    return process?.process_name ?? processId;
  };

  const HEADER = [
    "No.",
    "Part Code",
    "Part Name",
    "Processes",
    "Price",
    "SAP Code (Optional)",
    "Part Description (Optional)",
    "Customers (Optional)",
    "#",
  ];

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row">
          <PageHeader
            title="นำเข้า Part จาก Excel / Import Part from Excel"
            description="นำเข้า Part จาก Excel และ สามารถเพิ่ม ลบ แก้ไข"
          />
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <Button
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            Import Excel
          </Button>
          <Button variant="outline" onClick={() => setImportPart([])}>
            Clear
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-max" variant="outline">
                Generate Excel Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Excel Template</DialogTitle>
                <DialogDescription>เลือก Process ที่ต้องการ หลังจากนั้นกดปุ่ม Download</DialogDescription>
              </DialogHeader>
              <FormField
                id="import-excel-part"
                onSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={validationImportExcelPartSchema}
              >
                {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
                  console.log("errors", errors);
                  return (
                    <div className="space-y-4">
                      <SelectForm
                        label="Process"
                        options={processList?.map((process) => ({
                          label: process?.process_name,
                          value: process?.process_id,
                        }))}
                        placeholder="Select Process"
                        name="process_id"
                        value={values.process_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.process_id}
                        required
                      />
                      <InputForm
                        label="Customer"
                        placeholder="Enter Customer Name"
                        name="customer"
                        value={values.customer}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.customer}
                        required
                      />
                      <InputForm
                        label="Total Part"
                        placeholder="Enter Total Part"
                        name="total_part"
                        value={values.total_part}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.total_part}
                        required
                        type="number"
                        inputMode="numeric"
                      />
                      <div className="flex w-full gap-2">
                        <Button className="w-full" type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                          Generate Excel Template and Download
                        </Button>
                      </div>
                    </div>
                  );
                }}
              </FormField>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative flex h-0 flex-grow flex-col">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="bg-secondary">
                {HEADER?.map((header, index) => <TableHead key={index}>{header}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {importPart?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={HEADER.length} className="text-center">
                    Please import excel file to see the data here or generate excel template to import part
                  </TableCell>
                </TableRow>
              )}

              {importPart?.map((part, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Input
                      value={part?.part_code}
                      onChange={(e) => {
                        const newPart = [...importPart];
                        newPart[index].part_code = e.target.value;
                        setImportPart(newPart);
                      }}
                      className="h-8 rounded-none border-none"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={part?.part_name}
                      onChange={(e) => {
                        const newPart = [...importPart];
                        newPart[index].part_name = e.target.value;
                        setImportPart(newPart);
                      }}
                      className="h-8 rounded-none border-none"
                    />
                  </TableCell>
                  <TableCell>{getProcessName(part?.processes[0])}</TableCell>
                  <TableCell>
                    <Input
                      value={part?.price ?? ""}
                      onChange={(e) => {
                        const newPart = [...importPart];
                        newPart[index].price = +e.target.value;
                        setImportPart(newPart);
                      }}
                      className="h-8 rounded-none border-none"
                      type="number"
                      inputMode="numeric"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={part?.sap_code}
                      onChange={(e) => {
                        const newPart = [...importPart];
                        newPart[index].sap_code = e.target.value;
                        setImportPart(newPart);
                      }}
                      className="h-8 rounded-none border-none"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={part?.part_description}
                      onChange={(e) => {
                        const newPart = [...importPart];
                        newPart[index].part_description = e.target.value;
                        setImportPart(newPart);
                      }}
                      className="h-8 rounded-none border-none"
                    />
                  </TableCell>
                  <TableCell>
                    {part?.customers?.map((customer, index) => <span key={index}>{customer}</span>)}
                  </TableCell>
                  <TableCell>
                    <button
                      className="font-semibold text-red-500 hover:underline"
                      onClick={() => {
                        const newPart = [...importPart];
                        newPart.splice(index, 1);
                        setImportPart(newPart);
                        if (inputRef.current) {
                          inputRef.current.value = "";
                        }
                      }}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex w-full items-center justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild disabled={importPart?.length === 0}>
              <Button>Save Import Part</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to import part?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to import part. Please make sure all the data is correct before you continue
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    const res = await mutateImportExcelPart(importPart);
                    if (res?.status === "success") {
                      setImportPart([]);
                      if (inputRef.current) {
                        inputRef.current.value = "";
                      }
                    }
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx, .xls .csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            excelHelper.parseExcelData(file).then((data) => {
              const importPart = data.map((part) => ({
                part_code: part?.part_code,
                part_name: part?.part_name,
                processes: [part?.processes],
                price: part?.price == 0 ? null : part?.price,
                sap_code: part?.sap_code,
                part_description: part?.part_description,
                customers: [part?.customers],
              }));

              setImportPart(importPart);
            });
          }
        }}
      />
    </div>
  );
};
