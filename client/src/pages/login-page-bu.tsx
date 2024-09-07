import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage: FC = () => {
  const navigate = useNavigate();

  const [_, setEmployeeId] = useState<string>("");

  const login = async () => {
    try {
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const backgroundStyle = {
    backgroundImage: "url(https://snc-services.sncformer.com/snconeway/PDF%20File/snc-logo.png)",
    backgroundSize: "70%",
    backgroundPosition: "bottom right",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="bg-login relative grid h-[100dvh] w-full place-items-center" style={backgroundStyle}>
      <div className="w-[90%] rounded-xl border bg-white p-4 md:w-[60%] lg:w-[40%] xl:w-[30%] 2xl:w-[24%]">
        <img src="https://snc-services.sncformer.com/icmms/images/logo.webp" alt="logo" className="h-7 w-auto" />
        <p className="text-xs text-muted-foreground">บริษัท เอส เอ็น ซี ฟอร์เมอร์ จำกัด (มหาชน) สาขาระยอง</p>
        <div className="h-[1px] w-full bg-border" />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await login();
          }}
          className="w-full space-y-2 py-2"
        >
          <div className="flex flex-col text-center">
            <h3 className="text-center text-lg font-bold">กรุณาระบุรหัสพนักงาน</h3>
            <h3 className="text-center text-lg font-bold">(Please Identify ID)</h3>
            <p className="text-xs text-muted-foreground">รหัสพนักงาน 7 หลักสุดท้าย (Last 7 Digit of Employee ID)</p>
          </div>
          <div className="flex w-full items-center justify-center">
            <InputOTP
              maxLength={7}
              required
              autoFocus
              onChange={(value) => {
                setEmployeeId(value);
              }}
            >
              <InputOTPGroup placeholder=".">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button className="w-full" type="submit">
            เข้าสู่ระบบ / Sign In
          </Button>
        </form>
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
