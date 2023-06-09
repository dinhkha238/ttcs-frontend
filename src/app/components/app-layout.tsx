import { Navigate, Outlet } from "react-router-dom";
import { AppHeader } from "./app-header";
import { AppFooter } from "./app-footer";
interface Props {
  isAuthenticated: any;
}
export const AppLayout: React.FC = () => {
  // const isAuthenticated = localStorage.getItem("token");
  const a = localStorage.getItem("token");
  return (
    <>
      {a == "true" ? (
        <>
          <AppHeader />
          <Outlet />
          <AppFooter />
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};
