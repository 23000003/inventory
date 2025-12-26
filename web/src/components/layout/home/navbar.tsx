import GradientText from "@/components/ui/gradient-text";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { protectedRoutes, unprotectedRoutes } from "@/config/routes";
import useGetOutOfStock from "@/hooks/products/useGetOutOfStock";
import useAuth from "@/hooks/useAuth";
import { Bell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import useWebsocket from "@/hooks/useWebsocket";

const HomeNavbar: React.FC = () => {

  const location = useLocation()
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const { data: outOfStocks } = useGetOutOfStock();
  
  useWebsocket<string>({
    url: "/invalidate-changes",
    method: {
      name: "invalidate"
    },
    listen: true
  });
  
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
        <Popover>
          <PopoverTrigger asChild>
            <div>
              {outOfStocks && outOfStocks.length > 0 && (
                <span className="absolute -mt-2 -ml-2 bg-red-500 text-white p-[1px] px-[7px] rounded-2xl text-[10px]">
                  {outOfStocks.length}
                </span>
              )}
              <Bell className="h-5 w-5 cursor-pointer" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="leading-none font-medium">Notifications</h4>
                <p className="text-muted-foreground text-sm">
                  You have {outOfStocks?.length || 0} new notifications.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  {outOfStocks && outOfStocks.length > 0 ? (
                    outOfStocks.map((product) => (
                      <span className="text-sm col-span-2">
                        {product.name} is Out Of Stock
                      </span>
                    ))
                  ) : null}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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