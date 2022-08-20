import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

const Home = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to="/profile" /> : <Navigate to="/login" />;
};
export default Home;
