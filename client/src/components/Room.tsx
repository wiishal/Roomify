import { useParams } from "react-router-dom";

export default function Room() {
  const params = useParams();
  console.log(params.roomid);

  return (
    <div className="w-full h-full flex flex-row ">
      <div className="flex-1">hii{params.roomid}</div>
    </div>
  );
}
