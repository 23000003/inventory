import { HashRouter, Route, Routes } from "react-router"
import AuthLayout from "./components/layout/auth/layout"
import HomeLayout from "./components/layout/home/layout"
import Login from "./pages/login"
import { protectedRoutes, unprotectedRoutes } from "./config/routes"
import Inventory from "./pages/Inventory"
import CreateItem from "./pages/create-item"

function App() {

  return (
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
  )
}

export default App
