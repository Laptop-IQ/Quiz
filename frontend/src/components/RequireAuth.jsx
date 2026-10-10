
import { Navigate, useLocation } from "react-router-dom";

const hasToken = () =>
  !!(localStorage.getItem("token") || sessionStorage.getItem("token"));

// Guards routes like /dashboard/*: an unauthenticated visitor is sent to
// /login (their intended page is remembered so we can send them back),
// same as testbook.com hiding the dashboard behind login.
const RequireAuth = ({ children }) => {
  const location = useLocation();

  if (!hasToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default RequireAuth;
