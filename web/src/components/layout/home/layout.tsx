import { Outlet, useLocation, useNavigate } from "react-router"
import { Toaster } from "../../ui/sonner";
import { AnimatedGridPattern } from "../../ui/animated-grid-pattern";
import { cn } from "@/utils/cn";
import HomeNavbar from "./navbar";
import { protectedRoutes } from "@/config/routes";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import ChatRoom from "@/components/chat-room";

const HomeLayout: React.FC = () =>{ 

  const { validateToken } = useAuth();

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const navigate = useNavigate();
  const location = useLocation();

  if(location.pathname === protectedRoutes.ROOT) {
    navigate(protectedRoutes.INVENTORY);
  }

  return (
    <>
    <div className="fixed -z-10 flex h-svh w-full items-center justify-center overflow-hidden rounded-lg p-20">
      <AnimatedGridPattern
        width={60}
        height={60}
        opacity={.40}
        numSquares={10}
        duration={3}
        repeatDelay={1}
        className={cn(
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
    </div>
    <HomeNavbar />
    <main className='flex flex-row p-10 justify-center'>
      <Outlet />
    </main>
    <footer className='flex items-center justify-center py-4'>
      <span className='text-sm text-gray-500'>&copy; 2025 Kenny. All rights reserved.</span>
    </footer>
    <ChatRoom />
    <Toaster
      richColors={true}
      position="bottom-right"
      duration={3000}
      closeButton
    />
  </>
  )
}
export default HomeLayout;