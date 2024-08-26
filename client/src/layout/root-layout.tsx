import { FC } from "react";

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return <div className="relative w-full">{children}</div>;
};

export default RootLayout;
