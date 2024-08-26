import EmptyState from "@/components/common/empty-state";
import { AuthService } from "@/services/auth.service";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: FC = () => {
  const authService = new AuthService();
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <EmptyState
        title="ขออภัย ไม่พบข้อมูล"
        description="ไม่พบข้อมูลที่คุณต้องการ"
        image="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        primaryAction={{
          title: "กลับไปหน้าแรก",
          onClick: () => {
            authService.setAccessToken(
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWE4M2UyYjItM2MyOS00ODE5LTgzNzItZmRiNzNlZTFlMzYyIiwibmFtZSI6IklvVCBDZW50ZXIiLCJlbWFpbCI6ImlvdC1jZW50ZXJAc25jZm9ybWVyLmNvbSIsInJvbGUiOlsiSU5GT1JNQU5UUyJdLCJpYXQiOjE3MjMwMTI5MDksImV4cCI6MTgwOTQxMjkwOX0.5VGKAet2zt26e0JnO0apWVu_90BkkESJtt7Z11Cn49s"
            );
            navigate("/");
          },
        }}
      />
    </div>
  );
};

export default NotFoundPage;
