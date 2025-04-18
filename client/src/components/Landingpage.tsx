import { Dispatch, JSX, SetStateAction } from "react";
import Login from "./auth/Login";

export default function Landingpage({setIsLogged}:{ setIsLogged: Dispatch<SetStateAction<boolean | null>>; }):JSX.Element{
    return (
      <div>
        <Login setIsLogged={setIsLogged} />
        <button>loing btn</button>
        landing page
      </div>
    );
}