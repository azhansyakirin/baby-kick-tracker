
import GoogleLogin from "../../components/GoogleLogin";
import { Watermark } from "../../components/Watermark";

export const Login = ({ onLogin }) => {

  return (
    <div className="p-4 flex flex-col gap-4 justify-center items-center h-screen w-full">
      <img className="size-24 border border-[var(--primary)] rounded-full" src="/app-icon.png" alt="Logo" />
      <h1 className="text-xl md:text-3xl font-bold text-center">Welcome to Baby Kick Tracker</h1>
      <GoogleLogin onLogin={onLogin} />
      <p className="text-xs text-center p-4">It's 100% free! Please enable cookies to continue. Free Palestine!</p>
      <Watermark />
    </div>
  )
}