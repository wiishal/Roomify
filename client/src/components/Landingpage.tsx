import { Dispatch, JSX, SetStateAction, useState } from "react";
import Auth from "./auth/Auth";

export default function Landingpage({
  setIsLogged,
}: {
  setIsLogged: Dispatch<SetStateAction<boolean | null>>;
}): JSX.Element {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="w-2/3">
        <div className="w-full flex flex-row items-center justify-between py-2 h-fit ">
          <h1>Roomify</h1>
          <div className="flex flex-row gap-4 items-center">
            <h1>Docs</h1>
            <button onClick={()=>setIsLoginOpen(true)} className="bg-blue-600 px-4 py-1 text-white font-medium rounded-md">
              Login
            </button>
          </div>
        </div>
        {isLoginOpen && (
          <div className="fixed inset-0 z-10 bg-black bg-opacity-20 flex justify-center items-center">
            hii
            <Auth onClose={()=>setIsLoginOpen(false)} setIsLogged={setIsLogged} />
          </div>
        )}
      </div>
    </div>
  );
}
