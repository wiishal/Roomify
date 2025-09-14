import { Dispatch, JSX, SetStateAction, useState } from "react";
import Login from "./Login";
import SignIn from "./SignIn";

export default function Auth({
  setIsLogged,
  onClose,
}: {
  setIsLogged: Dispatch<SetStateAction<boolean | null>>;
  onClose: () => void;
}): JSX.Element {
  const [alreadyHasAcc, SetAlreadyHasAcc] = useState(true);
  
  if (alreadyHasAcc)
    return (
      <Login
        onClose={onClose}
        setIsLogged={setIsLogged}
        onAlreadyHasAcc={() => SetAlreadyHasAcc(false)}
      />
    );

  return (
    <SignIn
      onClose={onClose}
      setIsLogged={setIsLogged}
      onAlreadyHasAcc={() => SetAlreadyHasAcc(true)}
    />
  );
}
