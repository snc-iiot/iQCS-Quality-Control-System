import { cn } from "@/lib/utils";
// import { DollarSign } from "lucide-react";
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ICardProcessProps {
  title: string;
  value: string | number;
  percentage?: string;
  isActive?: boolean;
  onClick?: (process: string) => void;
  color: string;
}

export const CardProcess: FC<ICardProcessProps> = ({ title, value, percentage, isActive = false, onClick, color }) => {
  return (
    <Card
      x-chunk="dashboard-01-chunk-0"
      className={cn(isActive && "bg-muted", "cursor-pointer, min-h-max")}
      onClick={() => {
        onClick && onClick(title);
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className={`h-4 w-4 rounded-full`} style={{ backgroundColor: color }} />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value?.toLocaleString("en")}</div>
        {percentage && <p className="text-xs text-muted-foreground">{percentage}</p>}
      </CardContent>
    </Card>
  );
};
