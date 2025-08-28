
import './App.css'
import { AuthProvider } from './Context/AuthContext'
import { BabyDataProvider } from './Context/BabyContext'
import { AppointmentDataProvider } from './Context/AppointmentsContext'
import RootRouter from './routes/RootRoute'
import { Toaster } from 'react-hot-toast'

function App() {
  return (<AuthProvider>
    <BabyDataProvider>
      <AppointmentDataProvider>
        <Toaster position="bottom-right"
          reverseOrder={false} />
        <RootRouter />
      </AppointmentDataProvider>
    </BabyDataProvider>
  </AuthProvider >
  )
};

export default App
