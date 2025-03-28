import { Outlet } from "react-router-dom";
import TopBar from "./components/top-bar";  
import MainNav from "./components/main-nav"; 
import Footer from "./components/footer";
import { useLocation} from "react-router-dom"

export default function App() {
  const location = useLocation()
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup"
  const isDashboardPage = location.pathname.startsWith("/dashboard")

  return (
    <main className="min-h-screen bg-[#f5f5f5] relative">
      {!isAuthPage && !isDashboardPage && <TopBar />}
      {!isAuthPage && !isDashboardPage && <MainNav />}
      <Outlet />
      {!isAuthPage && !isDashboardPage && <Footer />}
    </main>
  )
}

