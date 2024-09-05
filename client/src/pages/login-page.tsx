import { FormField } from "@/components/ui-pattern";
import { InputForm } from "@/components/ui-pattern/form-field/input-form";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth.service";
import { useCommon, useMutationWithToast } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TRequestSignIn } from "@/types";
import { Eye, EyeOff, LockKeyhole, User } from "lucide-react";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export const LoginPage: FC = () => {
  const { plantList } = useAtomStore();
  const navigate = useNavigate();
  const authService = new AuthService();
  const { useGetPlants } = useCommon();
  useGetPlants();

  const [view, setView] = useState<boolean>(false);

  const { mutateAsync: signIn } = useMutationWithToast(
    async (data: TRequestSignIn) => await authService.signIn(data),
    "Signing in..."
  );

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    const res = await signIn(values);
    setSubmitting(res?.status == "success" ? false : true);
    if (res.status === "success") {
      navigate("/");
    }
  };
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("โปรดระบุ ชื่อผู้ใช้งาน"),
    password: Yup.string().required("โปรดระบุ รหัสผ่าน"),
    plant_code: Yup.string().required("กรุณาเลือก Plant Code"),
  });

  const backgroundStyle = {
    backgroundImage: "url(https://snc-services.sncformer.com/snconeway/PDF%20File/snc-logo.png)",
    backgroundSize: "70%",
    backgroundPosition: "bottom right",
    backgroundRepeat: "no-repeat",
  };

  const dataTest = plantList?.map(({ plant_code }) => ({
    label: plant_code,
    value: plant_code,
  }));

  return (
    <div className="bg-login relative grid h-[100dvh] w-full place-items-center" style={backgroundStyle}>
      <div className="w-[90%] rounded-xl border bg-white p-4 md:w-[60%] lg:w-[40%] xl:w-[30%] 2xl:w-[24%]">
        <img src="https://snc-services.sncformer.com/icmms/images/logo.webp" alt="logo" className="h-7 w-auto" />
        <p className="text-xs text-muted-foreground">บริษัท เอส เอ็น ซี ฟอร์เมอร์ จำกัด (มหาชน) สาขาระยอง</p>
        <div className="h-[1px] w-full bg-border" />

        <div className="flex w-full flex-col justify-center py-2">
          <p className="text-xl font-semibold text-primary">iQCS Quality Control System</p>
          <p className="mt-[-2px] text-xs text-muted-foreground">ระบบบันทึกข้อมูลยอดงาน NG</p>
        </div>
        <FormField
          id="part-form"
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          initialValues={{
            username: "",
            password: "",
            plant_code: "",
          }}
        >
          {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <div className="space-y-5">
              <div className="relative">
                <User className=" absolute left-2 top-[2.1rem] text-gray-400" />
                <InputForm
                  label="Username"
                  required
                  placeholder="Username"
                  name="username"
                  className="pl-10"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.username}
                />
              </div>

              <div className="relative">
                <LockKeyhole className=" absolute left-2 top-[2.1rem] text-gray-400" />
                <InputForm
                  label="Password"
                  required
                  type={view ? "" : "password"}
                  placeholder="Password"
                  name="password"
                  className="pl-10"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                />
                {view ? (
                  <EyeOff
                    className=" absolute right-2 top-9 cursor-pointer text-gray-400 hover:text-black"
                    onClick={() => setView(false)}
                  />
                ) : (
                  <Eye
                    className=" absolute right-2 top-9 cursor-pointer text-gray-400 hover:text-black"
                    onClick={() => setView(true)}
                  />
                )}
              </div>

              <SelectForm
                label="Plant Code"
                required
                placeholder="Plant code all"
                name="plant_code"
                options={dataTest}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.plant_code ?? ""}
                error={errors.plant_code}
              />

              <div className="flex w-full gap-2">
                <Button className="w-full" type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                  เข้าสู่ระบบ / Sign In{" "}
                </Button>
              </div>
              <div className="h-[1px] w-full border-dashed bg-border" />
              <div>
                <Button variant="outline" className="w-full" type="button" onClick={() => navigate("/snc-overview")}>
                  ภาพรวมของระบบ / Overview
                </Button>
              </div>
            </div>
          )}
        </FormField>
      </div>
      <div className="absolute bottom-1 flex w-full flex-wrap justify-between px-2 text-xs text-muted-foreground">
        <p className="hidden md:flex">
          Quality Control System © 2024 99 Industrial Solutions Company Limited. All rights reserved.
        </p>
        <p className="flex md:hidden">iQRS © 2024 99IS. All rights reserved.</p>
        <p>1.0.0</p>
      </div>
    </div>
  );
};
