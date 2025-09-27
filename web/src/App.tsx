import { HashRouter, Route, Routes } from "react-router"
import AuthLayout from "./components/layout/auth/layout"
import HomeLayout from "./components/layout/home/layout"
import Login from "./pages/login"
import { protectedRoutes, unprotectedRoutes } from "./config/routes"
import Inventory from "./pages/inventory"
import CreateItem from "./pages/create-item"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function App() {

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path={unprotectedRoutes.ROOT} element={<AuthLayout />}>
            <Route path={unprotectedRoutes.LOGIN} element={<Login />} />
          </Route>
          <Route path={protectedRoutes.ROOT} element={<HomeLayout />}>
            <Route path={protectedRoutes.INVENTORY} element={<Inventory />} />
            <Route path={protectedRoutes.CREATE_ITEM} element={<CreateItem />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  )
}

export default App
