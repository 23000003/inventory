import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginSchemaType } from "@/schemas/login.schema";
import CautionIcon from "@/components/ui/caution-icon";
import { useNavigate } from "react-router";
import { protectedRoutes } from "@/config/routes";
import { toastr } from "@/utils/toast";
import useLogin from "@/hooks/useLogin";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const { mutate: login, isPending } = useLogin({
    onSuccess: (message) => {
      toastr.success(message);
      navigate(protectedRoutes.INVENTORY, { replace: true });
    },
    onError: (message) => {
      toastr.error(message || "Invalid credentials.");
    },
  });

  const onSubmit = (data: LoginSchemaType) => {
    login(data);
  };

  return (
    <div className="flex flex-col gap-5 w-full items-center">
      <span className="text-2xl font-semibold">Login</span>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#c471ed] focus:border-transparent transition duration-200 ${
              errors.username ? "border-red-500" : "border-gray-400"
            }`}
          />
          {errors.username && (
            <div className="flex flex-row items-center gap-1 text-red-500 text-sm">
              <CautionIcon color="red" />
              <p>{errors.username.message}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#c471ed] focus:border-transparent transition duration-200 ${
              errors.password ? "border-red-500" : "border-gray-400"
            }`}
          />
          {errors.password && (
            <div className="flex flex-row items-center gap-1 text-red-500 text-sm">
              <CautionIcon color="red" />
              <p>{errors.password.message}</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`rounded-md p-2 button-gradient ${
            isPending
              ? "opacity-30 cursor-not-allowed"
              : "text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c471ed] transition duration-200 cursor-pointer"
          }`}
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex flex-row items-center gap-2 text-sm">
        <CautionIcon />
        <p className="text-gray-400">Click here to forgot password?</p>
        <p className="text-[#c471ed] hover:underline cursor-pointer">Here</p>
      </div>
    </div>
  );
};

export default Login;
