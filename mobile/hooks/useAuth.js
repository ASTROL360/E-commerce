import { useDispatch, useSelector } from "react-redux";
import { login, logoutUser, register } from "../store/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  return {
    ...auth,
    signIn: (payload) => dispatch(login(payload)),
    signUp: (payload) => dispatch(register(payload)),
    signOut: () => dispatch(logoutUser()),
  };
}
