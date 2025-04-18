import { useParams } from "react-router-dom";

export default function ChannelCtx() {
  const params = useParams();
  console.log(params);
  return <div>{JSON.stringify(params)}</div>;
}
