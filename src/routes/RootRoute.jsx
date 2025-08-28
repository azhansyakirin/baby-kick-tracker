import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import { Suspense } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Home } from '../routes/Home';
import { Login } from './Login';
import { YourAppointments } from './YourAppointments';
import { YourBaby } from './YourBaby';
import { YourProfile } from './YourProfile';
import { YourJourney } from './YourJourney';
import { YourRecords } from './YourRecords';
import { Loader } from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { PrivateLayout } from '../components/Layout/PrivateLayout';
import { useBaby } from '../Context/BabyContext';
import PoopTracker from './YourBaby/PoopTracker';
import KickTracker from './YourBaby/KickTracker';
import FeedingTimeTracker from './YourBaby/FeedingTimeTracker';

const PrivateRoute = () => {
  const { user } = useAuth();
  const { loading: babyLoading } = useBaby();
  return user ?
    <PrivateLayout loading={babyLoading}>
      <Outlet />
    </PrivateLayout>
    : <Navigate to="/login" replace />;
};

const LoginWrapper = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogin = (userData) => {

    const parseUser = {
      uid: userData.uid,
      name: userData.displayName,
      email: userData.email,
      photo: userData.photoURL
    }
    setUser(parseUser);
    navigate('/home');
  };

  if (user) return <Navigate to="/home" replace />;

  return <Login onLogin={handleLogin} />;
};

const RootRouter = () => {
  const { user } = useAuth();
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>

          <Route
            path="/login"
            element={<LoginWrapper />}
          />

          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/baby" element={<Outlet />}>
              <Route index element={<YourBaby />} />
              <Route path="kicks" element={<KickTracker />} />
              <Route path="poops" element={<PoopTracker />} />
              <Route path="feeding-time" element={<FeedingTimeTracker />} />
            </Route>
            <Route path="/appointments" element={<YourAppointments />} />
            <Route path="/records" element={<YourRecords />} />
            <Route path="/journey" element={<YourJourney />} />
            <Route path="/profile" element={<YourProfile />} />
          </Route>

          {!user && <Route path="*" element={<Navigate to="/login" replace />} />}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default RootRouter;
