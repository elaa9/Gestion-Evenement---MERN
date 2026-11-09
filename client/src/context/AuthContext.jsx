import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, logoutUser, fetchMe, updateLocalUser } from '../redux/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);

  // Verify / refresh session on app mount
  useEffect(() => {
    const storedToken = localStorage.getItem('eventhub_token');
    if (storedToken) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  // login — returns user data via .unwrap() so callers can read the role
  const login = (email, password) =>
    dispatch(loginUser({ email, password })).unwrap();

  // register — returns user data via .unwrap()
  const register = (userData) =>
    dispatch(registerUser(userData)).unwrap();

  // logout — clears Redux + localStorage
  const logout = () => dispatch(logoutUser());

  // updateUser — merge partial updates into user object
  const updateUser = (updatedData) => dispatch(updateLocalUser(updatedData));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
