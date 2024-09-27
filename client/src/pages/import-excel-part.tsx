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
import Swal from "sweetalert2";

type TGenerateExcelTemplate = {
  model_id: string;
  type: "LOCAL" | "SKD";
  process_id: string;
  customer: string;
  total_part: number | null;
};

export const ImportExcelPart: FC = () => {
  const { processList, modelList } = useAtomStore();
  const excelHelper = new ExcelHelper();
  const inputRef = useRef<HTMLInputElement>(null);
  const initialValues: TGenerateExcelTemplate = {
    model_id: "",
    type: "LOCAL",
    process_id: "",
    customer: "",
    total_part: null,
  };

  const { mutateImportExcelPart } = usePart();

  const [importPart, setImportPart] = useState<TCreateUpdatePart[]>([]);

  const handleSubmit = async (values: TGenerateExcelTemplate) => {
    const data = Array.from({ length: values.total_part ?? 1 }).map((_) => ({
      model_id: values?.model_id,
      part_code: "",
      part_name: "",
      processes: values?.process_id,
      price: null,
      type: values?.type,
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    enum Schema {
      MODEL_ID = "model_id",
      PART_CODE = "part_code",
      PART_NAME = "part_name",
      PROCESSES = "processes",
      PRICE = "price",
      TYPE = "type",
      SAP_CODE = "sap_code",
      PART_DESCRIPTION = "part_description",
      CUSTOMERS = "customers",
    }

    const schemaKeys = new Set(Object.values(Schema));
    const excelData = await excelHelper.parseExcelData(file);

    const mapPartToSchema = (part: any): TCreateUpdatePart | null => {
      const newPart = {} as TCreateUpdatePart;

      for (const key of Object.keys(part)) {
        if (!schemaKeys.has(key as Schema)) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Invalid key "${key}" in Excel file`,
          });
          return null; // Return null to exclude invalid parts
        }

        switch (key) {
          case Schema.MODEL_ID:
            newPart.model_id = part[key];
            break;
          case Schema.PART_CODE:
            newPart.part_code = part[key];
            break;
          case Schema.PART_NAME:
            newPart.part_name = part[key];
            break;
          case Schema.PROCESSES:
            newPart.processes = [part[key]];
            break;
          case Schema.PRICE:
            newPart.price = part[key] === 0 ? null : part[key];
            break;
          case Schema.TYPE:
            newPart.type = part[key];
            break;
          case Schema.SAP_CODE:
            newPart.sap_code = part[key];
            break;
          case Schema.PART_DESCRIPTION:
            newPart.part_description = part[key];
            break;
          case Schema.CUSTOMERS:
            newPart.customers = [part[key]];
            break;
        }
      }

      return newPart;
    };
    const importPart = excelData?.map(mapPartToSchema).filter(Boolean) as TCreateUpdatePart[];
    setImportPart(importPart);
  };

  const HEADER = [
    "No.",
    "Model",
    "Part Code",
    "Part Name",
    "Processes",
    "Price",
    "Type",
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
                  return (
                    <div className="space-y-4">
                      <SelectForm
                        label="Model"
                        options={modelList?.map((model) => ({
                          label: model?.model_name,
                          value: model?.model_id,
                        }))}
                        placeholder="Select Model"
                        name="model_id"
                        value={values.model_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.model_id}
                        required
                      />
                      <SelectForm
                        label="Type"
                        options={[
                          { label: "LOCAL", value: "LOCAL" },
                          { label: "SKD", value: "SKD" },
                        ]}
                        placeholder="Select Type"
                        name="type"
                        value={values.type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.type}
                        required
                      />
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
                  <TableCell>{modelList?.find((model) => model?.model_id === part?.model_id)?.model_name}</TableCell>
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
                    <select
                      value={part?.type}
                      onChange={(e) => {
                        const newPart = [...importPart];
                        newPart[index].type = e.target.value as "LOCAL" | "SKD";
                        setImportPart(newPart);
                      }}
                      className="w-[5rem] rounded-none border-none bg-transparent outline-none"
                    >
                      <option value="LOCAL">LOCAL</option>
                      <option value="SKD">SKD</option>
                    </select>
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
        onChange={async (e) => {
          await handleChange(e);
        }}
      />
    </div>
  );
};
