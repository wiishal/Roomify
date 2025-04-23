import { ReactNode } from "react";

export default function Input({
  type,
  onChange,
  className,
}: {
  type: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className: string;
}) {
  return <input type={type} onChange={onChange} className={`${className} ` } />;
}
