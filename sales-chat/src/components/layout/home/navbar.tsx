import GradientText from "@/components/ui/gradient-text";
import { unprotectedRoutes } from "@/config/routes";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import useWebsocket from "@/hooks/useWebsocket";

const HomeNavbar: React.FC = () => {

  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  useWebsocket<string>({
    url: "/products/listen-product-quantity",
    method: {
      name: "invalidate"
    },
    listen: true
  });
 

  const handleLogout = () => {
    clearAuth();
    navigate(
      unprotectedRoutes.LOGIN,
      { replace: true }
    );
  }

  return (
    <div className="pt-7 p-10 w-full flex flex-row items-center justify-between">
      <GradientText
        colors={["#c471ed", "#4079ff", "#c471ed", "#4079ff", "#c471ed"]}
        animationSpeed={8}
        showBorder={false}
        className="text-2xl"
      >
        Clarence's Inventory
      </GradientText>
        <button 
          type="button" 
          className="hidden sm:block text-white rounded-md py-2 px-5 button-gradient cursor-pointer hover:opacity-70 duration-300"
          onClick={handleLogout}
        >
          Logout
      </button>
    </div>
  )
}

export default HomeNavbar;