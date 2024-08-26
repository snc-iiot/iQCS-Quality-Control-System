import EmptyState from "@/components/common/empty-state";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const ChatbotPage: FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold">ยินดีต้อนรับสู่</h1>
        <h2 className="text-2xl font-semibold">ระบบตอบคำถามอัตโนมัติ</h2>
        <EmptyState
          title="คุณสามารถเริ่มต้นใช้งานได้เลย"
          description="กดปุ่มเริ่มต้นใช้งานเพื่อเริ่มต้นใช้งานระบบตอบคำถามอัตโนมัติ"
          image="https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg"
          primaryAction={{
            title: "เริ่มต้นใช้งาน",
            onClick: () => {
              navigate("/");
            },
          }}
        />
      </div>
    </div>
  );
};

export default ChatbotPage;
