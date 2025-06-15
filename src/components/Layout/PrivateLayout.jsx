import { useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext"
import { Sidebar } from "../Sidebar"
import { Loader } from "../Loader";
import { Watermark } from "../Watermark";

export const PrivateLayout = ({ children, loading }) => {

  const { setUser } = useAuth();
  const location = useLocation();

  const pageMap = {
    '/home': 'Home',
    '/baby': 'Your Baby',
    '/appointments': 'Your Appointments',
    '/records': 'Your Records',
    '/journey': 'Your Journey',
    '/': 'Page Title'
  }

  return (
    <div className="flex flex-row max-w-screen overflow-hidden box-border min-h-screen">
      {loading && <Loader />}
      <Sidebar handleLogoutUser={() => setUser(null)} />
      <main className="flex-1 md:ml-16 p-4 box-content min-w-0 overflow-x-auto">
        <div>
          <h1 className="font-[Inter] text-2xl md:text-4xl font-bold tracking-tight">{pageMap[location.pathname || '/']}</h1>
        </div>
        {children}
        <Watermark />
      </main>
    </div>
  )
}