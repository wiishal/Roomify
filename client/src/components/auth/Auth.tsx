import {  JSX, useState } from "react";
import Login from "./Login";
import SignIn from "./SignIn";

export default function Auth({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element {
  const [alreadyHasAcc, SetAlreadyHasAcc] = useState(true);
  
  if (alreadyHasAcc)
    return (
      <Login
        onClose={onClose}
        onAlreadyHasAcc={() => SetAlreadyHasAcc(false)}
      />
    );

  return (
    <SignIn
      onClose={onClose}
      onAlreadyHasAcc={() => SetAlreadyHasAcc(true)}
    />
  );
}
