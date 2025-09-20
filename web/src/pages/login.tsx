import CautionIcon from "@/components/ui/caution-icon";
import { protectedRoutes } from "@/config/routes";
import { toastr } from "@/utils/toast";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {

  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({ 
    email: "", 
    password: "" 
  });
  const [error, setError] = useState({
    email: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({
      email: false,
      password: false,
    });
    const { email, password } = loginData;
    if (!email || !password) {
      setError({
        email: !email,
        password: !password,
      });
      return;
    }
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Logged in!");
      navigate(protectedRoutes.INVENTORY, { replace: true })
    } catch (err) {
      toastr.error("Invalid credentials.");
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full items-center">
      <span className="text-2xl font-semibold">Login</span>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        {/* Email input */}
        <div className="flex flex-col gap-1">
          <input 
            type="email" 
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            className="border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 
              focus:ring-[#c471ed] focus:border-transparent transition duration-200"
          />
          {error.email ? (
            <div className="flex flex-row items-center gap-1">
              <CautionIcon color="red" />
              <p className="text-red-500 text-sm">Email is required</p>
            </div>
          ) : null}
        </div>
        {/* Password input */}
        <div className="flex flex-col gap-1">
          <input 
            type="password" 
            placeholder="Password" 
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            className="border border-gray-600 rounded-md p-2 focus:outline-none 
              focus:ring-2 focus:ring-[#c471ed] focus:border-transparent transition duration-200"
          />
          {error.password ? (
            <div className="flex flex-row items-center gap-1">
              <CautionIcon color="red" />
              <p className="text-red-500 text-sm">Password is required</p>
            </div>
          ) : null}
        </div>
        <button
          type="submit"
          className={`rounded-md p-2 button-gradient ${
            loading
              ? "opacity-30 cursor-not-allowed"
              : "text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c471ed] transition duration-200 cursor-pointer"
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="flex flex-row items-center gap-2 text-sm">
        <CautionIcon />
        <p className="text-gray-400">Click here to forgot password?</p>
        <p className="text-[#c471ed] hover:underline cursor-pointer">Here</p>
      </div>
    </div>
  )
}

export default Login;