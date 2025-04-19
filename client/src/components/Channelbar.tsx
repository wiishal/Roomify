import { JSX, useEffect, useState } from "react";
import { Channel, Server } from "../type/type";
import { Link } from "react-router-dom";
type Sorted = { [category: string]: Channel[] };
export default function Channelbar({
  server,
}: {
  server: Server | null;
}): JSX.Element {
  const [sorted, setSorted] = useState<Sorted>({});
  console.log(server);
  useEffect(() => {
    sort();
  }, [server]);
  function sort() {
    let sorted: Sorted = {};
    server?.channel.forEach((c) => {
      if (!sorted[c.category]) {
        sorted[c.category] = [];
      }
      sorted[c.category].push(c);
    });
    console.log("sorted arrau", sorted);
    setSorted(sorted);
    console.log(Object.entries(sorted));
  }
  return (
    <div className="w-full h-full shadow-md p-2 font-mono">
      <Link to={`/room/${server?.roomid}/`}>
        <div className="border font-semibold p-2">{server?.name}</div>
      </Link>
      {}
      {server && server.channel.length > 0 ? (
        <div className="p-2">
          {Object.entries(sorted).map(([category, channel]) => (
            <div>
              <div className="text-sm font-bold text-neutral-500">
                {category}
              </div>
              {channel.map((c) => (
                <div
                  key={c.channelid}
                  className="font-medium text-lg px-2 py-1"
                >
                  <Link to={`/room/${server.roomid}/${c.channelid}`}>
                    #{c.name}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div>no channels</div>
      )}
    </div>
  );
}
