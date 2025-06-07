
import './App.css'
import { AuthProvider } from './Context/AuthContext'
import { BabyDataProvider } from './Context/BabyContext'
import RootRouter from './routes/RootRoute'

function App() {
  return <AuthProvider>
    <BabyDataProvider>
      <RootRouter />
    </BabyDataProvider>
  </AuthProvider>
};

export default App
