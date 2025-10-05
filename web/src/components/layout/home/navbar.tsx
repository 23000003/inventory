import GradientText from "@/components/ui/gradient-text";
import { protectedRoutes, unprotectedRoutes } from "@/config/routes";
import useAuth from "@/hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";

const HomeNavbar: React.FC = () => {

  const location = useLocation()
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  
  const highlightPath = (path: string) => {
    if(location.pathname === path) {
      return "underline";
    }
    return ""
  }

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
      <div className="flex items-center gap-10">
        <Link 
          to={protectedRoutes.INVENTORY} 
          className={`${highlightPath(protectedRoutes.INVENTORY)}`}
        >
          Home
        </Link>
        <Link 
          to={protectedRoutes.CREATE_ITEM} 
          className={`${highlightPath(protectedRoutes.CREATE_ITEM)}`}
        >
          Create Item
        </Link>
        <button 
          type="button" 
          className="hidden sm:block text-white rounded-md py-2 px-5 button-gradient cursor-pointer hover:opacity-70 duration-300"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default HomeNavbar;