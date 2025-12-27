import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Button from "../ui/Button"; // Removed custom Button import
import { signIn } from "../../services/services.user";
import { useAuth } from "../../hooks/useAuth";

// Helper component for loading spinner
const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

export default function SignIn({
  onClose,
  onAlreadyHasAcc,
}: {
  onClose: () => void;
  onAlreadyHasAcc: () => void;
}): JSX.Element {
  const [userdetails, setuserdetails] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [isloading, setIsLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();
  const setLogin = auth.login;
  const handleSignIn = async () => {
    if (!userdetails.username || !userdetails.email || !userdetails.password) {
      setSignInError("All fields are required for registration.");
      return;
    }

    setIsLoading(true);
    setSignInError(null);

    try {
      const res = await signIn(userdetails);

      if (!res || !res.success) {
        setSignInError(
          res?.message ||
            "Registration failed. Please try a different username/email."
        );
        return;
      }

      if (!res.token) {
        setSignInError(
          "Registration succeeded but session token was not received."
        );
        return;
      }

      setLogin(res.token);
      onClose();
      navigate("/");
    } catch (error) {
      console.error("Sign-in error : ", error);
      setSignInError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100 mx-auto transition-all duration-300">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        Create Your Account
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Join the community in a few simple steps.
      </p>

      {signInError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
          role="alert"
        >
          {signInError}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 outline-none"
            type="text"
            placeholder="Choose a username"
            value={userdetails.username}
            onChange={(e) => {
              setuserdetails((prev) => ({ ...prev, username: e.target.value }));
            }}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 outline-none"
            type="email"
            placeholder="Enter your email address"
            value={userdetails.email}
            onChange={(e) => {
              setuserdetails((prev) => ({ ...prev, email: e.target.value }));
            }}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 outline-none"
            type="password"
            placeholder="Create a password"
            value={userdetails.password}
            onChange={(e) => {
              setuserdetails((prev) => ({ ...prev, password: e.target.value }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSignIn();
            }}
          />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          className="w-full flex justify-center items-center px-4 py-2.5 text-lg font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition duration-200 disabled:bg-purple-400 disabled:cursor-not-allowed"
          onClick={handleSignIn}
          disabled={isloading}
        >
          {isloading ? <Spinner /> : "Sign Up"}
        </button>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-red-600 transition duration-150"
          >
            Cancel
          </button>

          <button
            onClick={onAlreadyHasAcc}
            className="text-sm font-medium text-purple-600 hover:text-purple-800 transition duration-150"
          >
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
  );
}
