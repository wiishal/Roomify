import { JSX, MouseEventHandler, ReactNode } from "react";

export default function Button({
  children,
  onClick,
  className,
}: {
  children: ReactNode | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}): JSX.Element {
  return (
    <button onClick={onClick} className={`${className} font-medium`}>
      {children}
    </button>
  );
}
