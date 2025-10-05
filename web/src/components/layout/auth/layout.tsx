import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import useAuth from '@/hooks/useAuth';
import { AnimatedGridPattern } from '../../ui/animated-grid-pattern';
import { cn } from '@/utils/cn';
import GradientText from '../../ui/gradient-text';
import { Toaster } from '../../ui/sonner';
import { protectedRoutes, unprotectedRoutes } from '@/config/routes';
import { useUserStore } from '@/stores/useUserStore';

const AuthLayout: React.FC = () => {

  const { validateToken } = useAuth();
  const { user } = useUserStore();
  const isAuthenticated = !!user;

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || protectedRoutes.ROOT;

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    } else if (location.pathname === unprotectedRoutes.ROOT) {
      navigate(unprotectedRoutes.LOGIN, { replace: true });
    }
  }, [isAuthenticated, navigate, from, location.pathname]);

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
      <main className='flex flex-col md:flex-row h-[90svh] items-center justify-center md:justify-around gap-8 md:gap-0 p-10'>
        <div className='text-center md:text-start'>
          <GradientText
            colors={["#c471ed", "#4079ff", "#c471ed", "#4079ff", "#c471ed"]}
            animationSpeed={8}
            showBorder={false}
            className="text-4xl"
          >
            Clarence's Inventory
          </GradientText>
          <span>Lorem ipsum Lorem ipsum Lorem ipsum Lorem</span>
        </div>
        <div className="w-100 h-fit bg-white text-black rounded-sm p-6 shadow-md border-1 border-gray-300">
          <div className="flex flex-col items-center">
            <Outlet />
          </div>
        </div>
      </main>
      <footer className='h-[10svh] flex items-center justify-center p-10'>
        <span className='text-sm text-gray-500'>&copy; 2025 Kenny. All rights reserved.</span>
      </footer>
      <Toaster
        richColors={true}
        position="bottom-right"
        duration={3000}
        closeButton
      />
    </>
  )
}

export default AuthLayout
