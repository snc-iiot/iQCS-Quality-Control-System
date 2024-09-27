import React, { useCallback, useState } from "react";
import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Sector } from "recharts";

type Props = {
  data: {
    label: string;
    value: number | string;
  }[];
};

export const ColorPieChartUI = [
  "#ff6666",
  "#20b2aa",
  "#ffcc33",
  "#8470ff",
  "#33cc99",
  "#ff99cc",
  "#4ee578",
  "#6caf79",
  "#a9dc6c",
  "#786444",
  "#be2dbf",
  "#230640",
  "#22a771",
  "#49d99b",
  "#c69475",
  "#cfda6e",
  "#a122bd",
  "#5b64e1",
  "#ae3502",
  "#c7c70b",
  "#fb0a90",
  "#f636af",
  "#bda3b0",
  "#0d7ec8",
  "#443bc0",
  "#521b8f",
  "#374346",
  "#9a8365",
  "#bfada1",
  "#e207d7",
  "#7b2d2f",
  "#3e0a58",
  "#97020c",
  "#9883f6",
  "#3e5c23",
  "#2ae5bc",
  "#06bfe2",
  "#f6b50a",
  "#8e8ae0",
  "#ba7d9d",
  "#bc958b",
  "#a738a6",
  "#f79ef8",
  "#5a6449",
  "#3e8da0",
  "#895432",
  "#41f8e7",
  "#7c4bef",
  "#b9032e",
  "#819b9c",
  "#001f03",
  "#761cd2",
  "#515841",
  "#701ee1",
  "#8172df",
  "#9f00ab",
  "#444843",
  "#bb4703",
  "#3a6982",
  "#d69719",
  "#e4eea9",
  "#c43d24",
  "#5b5c80",
  "#daeeab",
  "#22fc25",
  "#e23246",
  "#7ad065",
  "#0dd10a",
  "#4abebd",
  "#8f048f",
  "#0a2e8b",
  "#92e497",
  "#b357fc",
  "#f0159f",
  "#f6e2ba",
  "#600299",
  "#d9b1d5",
  "#42f631",
  "#1a4cb3",
  "#a9b045",
  "#40ca2e",
  "#a1f2d4",
  "#ac7267",
  "#3473c6",
  "#5fca68",
  "#1f3e6d",
  "#2bed61",
  "#01e8f5",
  "#0119bc",
  "#70b778",
  "#e4f75e",
  "#f1c3e6",
  "#73b9b8",
  "#5bf87c",
  "#deabaa",
  "#2bae05",
  "#794ca5",
  "#7f80a8",
  "#baf58e",
  "#6d2531",
  "#38bf06",
  "#c8a1da",
  "#53f869",
  "#cf4973",
  "#d89008",
  "#13db7e",
  "#be5209",
];
const PieChartUI: React.FC<Props> = ({ data }) => {
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 5) * cos;
    const sy = cy + (outerRadius + 5) * sin;
    const mx = cx + (outerRadius + 15) * cos;
    const my = cy + (outerRadius + 10) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 12;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} fontSize="16px" textAnchor="middle" fill={fill}>
          {payload.label}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 4}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          className="shake" // เพิ่ม class ที่นี่
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 5} y={ey} textAnchor={textAnchor} fill={"#000000"} fontSize="12px">
          {`${value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })} part`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 5}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill={"#00000088"}
          fontSize="12px"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_: string, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RePieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          labelLine={false}
          data={data}
          cx={"50%"}
          cy={"50%"}
          innerRadius={"40%"} // Adjusted inner radius
          outerRadius={"54%"} // Adjusted outer radius
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data?.map((_, index) => <Cell key={`cell-${index}`} fill={ColorPieChartUI[index]} />)}
        </Pie>
      </RePieChart>
    </ResponsiveContainer>
  );
};

export default PieChartUI;
