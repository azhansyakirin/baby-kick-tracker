import { useEffect, useState } from 'react'
import { Button } from './components/Button'
import { Table } from './components/Table'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import CookieConsent from './components/CookieConsent'
import KickChart from './components/KickChart'
import { logEvent, setUserProperties } from 'firebase/analytics'
import { analytics, db } from './config/firebase'
import GoogleLogin from './components/GoogleLogin'
import { getDeviceType } from './utils/getDeviceType'
import { doc, setDoc, getDoc } from 'firebase/firestore'

import './App.css'

function App() {
  const [deviceType, setDeviceType] = useState('')
  const [currentTime, setCurrentTime] = useState(dayjs())
  const [count, setCount] = useState(0)
  const [babyName, setBabyName] = useState('')
  const [kicks, setKicks] = useState([])
  const [user, setUser] = useState(() => {
    const userCookie = Cookies.get('user')
    return userCookie ? JSON.parse(userCookie) : null
  })

  const today = dayjs().format('DD-MM-YYYY')

  // DEVICE & ANALYTICS
  useEffect(() => {
    const type = getDeviceType()
    setDeviceType(type)
    logEvent(analytics, 'app_open', { device_type: type })
    setUserProperties(analytics, { device_type: type })
  }, [])

  // CLOCK
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(dayjs()), 1000)
    return () => clearInterval(interval)
  }, [])

  // INITIAL COOKIE LOAD
  useEffect(() => {
    const kicksFromCookie = Cookies.get('kicks')
    const countCookie = Cookies.get('count')
    const babyNameCookie = Cookies.get('babyName')

    if (kicksFromCookie) setKicks(JSON.parse(kicksFromCookie))
    if (countCookie) setCount(JSON.parse(countCookie))
    if (babyNameCookie) setBabyName(JSON.parse(babyNameCookie))
  }, [])

  // FIREBASE LOAD ON LOGIN
  useEffect(() => {
    if (user) {
      // When the user logs in, check if we have data in cookies and save to Firestore
      const loadAndSaveUserData = async () => {
        const userId = user.uid; // Firebase user UID

        // Check if there's data in cookies to save to Firestore
        const babyNameFromCookie = Cookies.get('babyName');
        const kicksFromCookie = Cookies.get('kicks');

        const parsedBabyName = babyNameFromCookie ? JSON.parse(babyNameFromCookie) : '';
        if ((parsedBabyName && parsedBabyName.trim() !== '') || kicksFromCookie) {
          await saveUserData(
            userId,
            kicksFromCookie ? JSON.parse(kicksFromCookie) : [],
            parsedBabyName
          );
        }

        // Load user data from Firestore to ensure the app is up-to-date
        const userData = await loadUserData(userId);

        // Only set baby name if it's non-empty
        if (userData.babyName && userData.babyName.trim() !== '') {
          setBabyName(userData.babyName);
        }

        setKicks(userData.kicks);
      };

      loadAndSaveUserData();
    }
  }, [user]); // Dependency on `user` to run when the user logs in  

  const saveUserData = async (userId, kicks, babyName) => {
    if (!babyName || babyName.trim() === '') {
      alert('Please enter your baby name!');
      return;
    }

    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { babyName, kicks }, { merge: true });
  }

  const loadUserData = async (userId) => {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      return {
        babyName: userData.babyName || '',
        kicks: userData.kicks || [],
      }
    } else {
      return { babyName: '', kicks: [] }
    }
  }

  // CLICK HANDLER
  const handleClick = () => {
    let nameToUse = babyName.trim() || 'Baby'

    if (!babyName.trim()) {
      setBabyName(nameToUse)
      Cookies.set('babyName', JSON.stringify(nameToUse), { expires: 7 })
    }

    const newKick = {
      id: Date.now(),
      date: today,
      time: dayjs().format('hh:mm:ss A'),
      day: dayjs().format('dddd'),
    }

    const updatedKicks = [...kicks, newKick]
    const updatedCount = count + 1

    setKicks(updatedKicks)
    setCount(updatedCount)

    Cookies.set('count', JSON.stringify(updatedCount), { expires: 7 })
    Cookies.set('kicks', JSON.stringify(updatedKicks), { expires: 7 })

    const countsCookie = Cookies.get('countsByDate')
    const countsByDate = countsCookie ? JSON.parse(countsCookie) : {}
    countsByDate[today] = (countsByDate[today] || 0) + 1
    Cookies.set('countsByDate', JSON.stringify(countsByDate), { expires: 7 })

    if (user) {
      saveUserData(user.id, updatedKicks, nameToUse)
    }

    logEvent(analytics, 'kick_count', {
      user_name: nameToUse,
      time: dayjs().format('hh:mm:ss A'),
    })
  }


  const handleBabyNameChange = (e) => {
    setBabyName(e.target.value)
    Cookies.set('babyName', JSON.stringify(e.target.value), { expires: 7 })
  }

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Time']
    const rows = kicks.map((k) => [k.date, k.time])
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${babyName || 'baby'}-kick-records.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const summaryMap = {}
  kicks.forEach(({ date, day }) => {
    if (!summaryMap[date]) summaryMap[date] = { count: 0, day }
    summaryMap[date].count++
  })

  const handleDownloadSummaryCSV = () => {
    const headers = ['Date', 'Day', 'Number of Kicks']
    const rows = Object.entries(summaryMap).map(([date, { day, count }]) => [date, day, count])
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${babyName || 'baby'}-kick-summary.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset all data?')) return
    Cookies.remove('babyName')
    Cookies.remove('count')
    Cookies.remove('kicks')
    setBabyName('')
    setCount(0)
    setKicks([])
  }

  const yesterday = dayjs().subtract(1, 'day').format('DD-MM-YYYY')
  const dailyCount = kicks.filter((k) => k.date === today).length
  const yesterdayCount = kicks.filter((k) => k.date === yesterday).length

  const percentChange = yesterdayCount === 0
    ? 100
    : Math.round(((dailyCount - yesterdayCount) / yesterdayCount) * 100)

  const trend = dailyCount === yesterdayCount
    ? 'same as'
    : dailyCount > yesterdayCount
      ? `${percentChange}% more than`
      : `${Math.abs(percentChange)}% less than`

  const allCookies = Cookies.get()

  if (!user) {
    return (
      <div className="p-4 flex flex-col gap-4 justify-center items-center h-screen w-full">
        <img className="size-24 border border-[var(--primary)] rounded-full" src="/app-icon.png" alt="Logo" />
        <h1 className="text-xl md:text-3xl font-bold text-center">Welcome to Baby Kick Tracker</h1>
        <GoogleLogin onLogin={setUser} />
        <p className="text-xs text-center p-4">It's 100% free! Please enable cookies to continue. Free Palestine!</p>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--text-primary)] shadow-md mb-4 flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-4">
          <img className="size-8 border border-[var(--primary)] rounded-full" src={user.photo} alt={user.name} />
          <h1 className="text-sm font-bold text-white">Hello, {user.name}</h1>
        </div>
        <button
          onClick={() => {
            Cookies.remove('user')
            setUser(null)
          }}
          className="text-sm font-semibold text-[var(--primary)] border border-[var(--primary)] px-3 py-1 rounded hover:bg-[var(--primary)] hover:text-[var(--text-primary)] transition"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="text-textDark px-4 py-8">
        <div className="p-4 md:p-16 flex flex-col gap-4 items-center justify-center w-full">
          <p className="text-sm tracking-tight text-center">{currentTime.format('dddd DD-MMMM-YYYY hh:mm:ss A')}</p>

          <input
            type="text"
            value={babyName}
            onChange={handleBabyNameChange}
            placeholder="Enter your baby name"
            className="w-full px-4 py-2 uppercase tracking-widest text-3xl text-center border-none outline-none"
          />

          <Button onClick={handleClick} />

          <p className="text-2xl text-center">
            Your baby kick{dailyCount !== 1 ? 's' : ''} {dailyCount} times today — {trend} yesterday!
          </p>

          <div className="sm:w-full md:w-3/4">
            <Table kicks={kicks} />
          </div>

          {kicks.length > 0 && (
            <div className="text-center">
              <p>You can choose to download by time or daily summary</p>
              <div className="mt-4 flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={handleDownloadCSV} className="border px-4 py-2 rounded hover:bg-[var(--primary)] transition">
                  Download Kick Records in CSV
                </button>
                <button onClick={handleDownloadSummaryCSV} className="border px-4 py-2 rounded hover:bg-[var(--primary)] transition">
                  Download Daily Summary CSV
                </button>
              </div>
            </div>
          )}
        </div>

        {Object.keys(summaryMap).length > 0 && (
          <div className="border rounded-md p-1 mt-8 text-center">
            <p className="mt-8 text-[var(--text-primary)] text-lg">Daily Kick Summary</p>
            <KickChart summaryMap={summaryMap} />
          </div>
        )}

        <CookieConsent />

        {Object.keys(allCookies).length > 1 && (
          <div className="text-center mt-8">
            <button
              onClick={handleReset}
              className="border px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
            >
              Reset All Data
            </button>
          </div>
        )}

        <p className="my-12 text-sm text-center text-[var(--text-primary)]">
          Designed with ❤️ for all parents by{' '}
          <a href="https://azhansyakirin.dev/" target="_blank" className="text-[var(--primary)]">
            Azhan Syakirin
          </a>
          .
        </p>
      </div>
    </>
  )
}

export default App
