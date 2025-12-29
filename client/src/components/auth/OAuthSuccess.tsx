import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return <p>Logging you in...</p>;
}
