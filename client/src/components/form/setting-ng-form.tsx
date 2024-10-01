import { InputForm, TextAreaForm } from "@/components/ui-pattern/form-field/input-form";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import { Button } from "@/components/ui/button";

export const SettingNGForm = () => {
  return (
    <div className="relative flex w-full flex-col gap-2 px-4">
      <SelectForm
        label="กระบวนการผลิต / Process"
        placeholder="เลือกกระบวนการผลิต"
        required
        options={[{ label: "Spot", value: "Spot" }]}
      />

      <InputForm
        label="อาการของเสีย / Symptom of NG"
        required
        // maxLength={100}
        // value="demo"
        // type="date"
      />

      <TextAreaForm
        label="รายละเอียด / Description"
        required
        // maxLength={100}
        // value="demo"
        // type="date"
      />
      <div className="flex w-full gap-2">
        <Button className="w-full" type="submit">
          Save
        </Button>
        <Button variant="secondary" className="w-full" type="reset">
          Reset
        </Button>
      </div>
    </div>
  );
};
