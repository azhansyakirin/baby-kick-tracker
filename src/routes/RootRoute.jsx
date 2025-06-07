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
import { YourJourney} from './YourJourney';
import { YourRecords} from './YourRecords';
import { Loader } from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { PrivateLayout } from '../components/Layout/PrivateLayout';

const PrivateRoute = () => {
  const { user } = useAuth();
  return user ?
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
    : <Navigate to="/login" replace />;
};

const LoginWrapper = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) return <Navigate to="/home" replace />;
  const onLogin = () => navigate('/home');

  return <Login onLogin={onLogin} />;
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
            <Route path="/baby" element={<YourBaby />} />
            <Route path="/appointments" element={<YourAppointments />} />
            <Route path="/records" element={<YourRecords/>} />
            <Route path="/journey" element={<YourJourney/>} />
            <Route path="/profile" element={<YourProfile/>} />
          </Route>

          {!user && <Route path="*" element={<Navigate to="/login" replace />} />}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default RootRouter;
