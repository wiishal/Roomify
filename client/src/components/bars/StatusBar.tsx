import { Link } from "react-router-dom";
import notification from "../../assets/notification.png"; 

export default function StatusBar() {
  return (
    <div className="flex px-2 border-b h-[4%] items-center">
      <Link to="/notifications">
        <img src={notification} alt="notification" className="w-5 h-5" />
      </Link>
    </div>
  );
}
