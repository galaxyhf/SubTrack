"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      toastOptions={{
        style: {
          background: "#111111",
          border: "1px solid #1E1E1E",
          color: "#FFFFFF",
        },
      }}
      {...props}
    />
  );
};
