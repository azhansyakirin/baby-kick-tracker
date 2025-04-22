import { useEffect, useMemo, useState, useRef } from 'react'
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
import { Watermark } from './components/Watermark'
import { groupKicksByDate, sortKicks, generateSummaryMap } from './utils/helper'
import Modal from './components/Modal'

import './App.css'
import SummaryReport from './components/SummaryReport'

function App() {
  const [deviceType, setDeviceType] = useState('')
  const [currentTime, setCurrentTime] = useState(dayjs())
  const [count, setCount] = useState(0)
  const [babyName, setBabyName] = useState('')
  const [babyGender, setBabyGender] = useState('boy')
  const [kicks, setKicks] = useState([])
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('today')

  const today = useMemo(() => currentTime.format('DD-MM-YYYY'), [currentTime])

  useEffect(() => {
    const type = getDeviceType()
    setDeviceType(type)
    logEvent(analytics, 'app_open', { device_type: type })
    setUserProperties(analytics, { device_type: type })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(dayjs()), 1000)
    return () => clearInterval(interval)
  }, [])

  /* this is where user data loaded, and setup for new users */
  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      const userId = user.uid;
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setBabyName(data.babyName || '');
        setKicks(data.kicks || []);
        setCount(data.kicks?.length || 0);
      } else {
        await setDoc(userRef, {
          babyName: '',
          kicks: [],
          parentName: user.displayName || '',
          createdAt: Date.now(),
        });

        setBabyName('');
        setKicks([]);
        setCount(0);
      }

      Cookies.remove('babyName');
      Cookies.remove('kicks');
      Cookies.remove('count');
      Cookies.remove('countsByDate');
    };

    loadUserData();
  }, [user]);

  const saveUserData = async (newKicks = kicks, newName = babyName) => {
    if (!user) return
    const userRef = doc(db, 'users', user.uid)
    await setDoc(userRef, {
      babyName: newName,
      babyGender: babyGender,
      kicks: newKicks,
      parentName: user.displayName,
    }, { merge: true })
  }

  let lastTap = 0

  const handleClick = async () => {
    navigator.vibrate?.(50)

    const now = Date.now()
    if (now - lastTap < 500) return
    lastTap = now

    const nameToUse = babyName.trim() || 'Baby'
    setBabyName(nameToUse)

    const newKick = {
      id: Date.now(),
      date: today,
      time: dayjs().format('hh:mm:ss A'),
      day: dayjs().format('dddd'),
      remarks: '',
      deviceType: deviceType,
    }

    const updatedKicks = [...kicks, newKick]
    const updatedCount = count + 1

    setKicks(updatedKicks)
    setCount(updatedCount)

    await saveUserData(updatedKicks, nameToUse)

    logEvent(analytics, 'kick_count', {
      user_name: nameToUse,
      time: newKick.time,
    })
  }

  const nameDebounceTimer = useRef(null);

  const handleBabyNameChange = (e) => {
    const value = e.target.value
    setBabyName(value)

    if (nameDebounceTimer.current) clearTimeout(nameDebounceTimer.current)

    nameDebounceTimer.current = setTimeout(() => {
      saveUserData(kicks, value)
    }, 600)
  }

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Time', 'Remarks']
    const rows = kicks.map((k) => [k.date, k.time, k.remarks])
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

  const handleDownloadSummaryCSV = () => {
    const headers = ['Date', 'Day', 'Number of Kicks']
    const rows = Object.entries(generateSummaryMap(kicks)).map(([date, { day, count }]) => [date, day, count])
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

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all data?')) return
    setBabyName('')
    setCount(0)
    setKicks([])
    await saveUserData([], '')
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

  const userName = useMemo(() => user?.displayName || 'Parent', [user])
  const userPhoto = useMemo(() => user?.photoURL || '/app-icon.png', [user])

  const handleEditKick = async (updatedKick) => {
    const updatedList = kicks.map((k) => (k.id === updatedKick.id ? updatedKick : k))
    setKicks(updatedList)
    await saveUserData(updatedList, babyName)
  }

  const handleDeleteKick = async (kickId) => {
    const updatedKicks = kicks.filter((k) => k.id !== kickId)
    setKicks(updatedKicks)
    setCount(updatedKicks.length)
    await saveUserData(updatedKicks, babyName)
  }

  const sortedKicks = useMemo(() => sortKicks(kicks), [kicks])

  const filteredKicks = useMemo(() => {
    if (activeTab === 'today') {
      const groupedToday = groupKicksByDate(kicks).find(([date]) => date === today)
      return groupedToday ? groupedToday[1] : []
    } else {
      return sortedKicks
    }
  }, [activeTab, kicks, sortedKicks, today])


  const handleGenderChange = (event) => {
    setBabyGender(event.target.value);
  };

  return (
    <>
      {!user ? (
        <div className="p-4 flex flex-col gap-4 justify-center items-center h-screen w-full">
          <img className="size-24 border border-[var(--primary)] rounded-full" src="/app-icon.png" alt="Logo" />
          <h1 className="text-xl md:text-3xl font-bold text-center">Welcome to Baby Kick Tracker</h1>
          <GoogleLogin onLogin={setUser} />
          <p className="text-xs text-center p-4">It's 100% free! Please enable cookies to continue. Free Palestine!</p>
          <Watermark />
        </div>
      ) : (
        <>
          <header className="sticky top-0 z-10 bg-[var(--text-primary)] shadow-md mb-4 flex justify-between items-center px-4 py-2">
            <div className="flex items-center gap-4">
              <img className="size-8 border border-[var(--primary)] rounded-full" src={userPhoto} alt={userName} />
              <h1 className="text-sm font-bold text-white">Hello, {userName}</h1>
            </div>
            <button
              onClick={() => {
                Cookies.remove('user')
                setUser(null)
              }}
              className="text-sm cursor-pointer active:scale-95 font-semibold text-[var(--primary)] border border-[var(--primary)] px-3 py-1 rounded hover:bg-[var(--primary)] hover:text-[var(--text-primary)] transition"
            >
              Logout
            </button>
          </header>

          <main>

            <section id="action" className='flex flex-col items-center gap-8 justify-center'>
              <p className="text-sm tracking-tight text-center">{currentTime.format('dddd DD-MMMM-YYYY hh:mm:ss A')}</p>
              <input
                type="text"
                value={babyName}
                onChange={handleBabyNameChange}
                placeholder="Enter your baby name"
                className="w-full px-4 py-2 uppercase tracking-widest text-xl md:text-3xl text-center border-none outline-none"
              />
              <div className="flex items-center justify-center space-x-6">
                <label
                  htmlFor="boy"
                  className={`cursor-pointer inline-flex items-center justify-center px-12 pt-2 border rounded-lg text-3xl font-semibold transition-all duration-200 ${babyGender === 'boy' ? 'bg-[var(--text-primary)]' : ''
                    }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    id="boy"
                    value="boy"
                    checked={babyGender === 'boy'}
                    onChange={handleGenderChange}
                    className="hidden"
                  />
                  👦
                </label>
                <label
                  htmlFor="girl"
                  className={`cursor-pointer inline-flex items-center justify-center px-12 pt-2 border rounded-lg text-3xl font-semibold transition-all duration-200 ${babyGender === 'girl' ? 'bg-[var(--text-primary)]' : ''
                    }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    id="girl"
                    value="girl"
                    checked={babyGender === 'girl'}
                    onChange={handleGenderChange}
                    className="hidden"
                  />
                  👧
                </label>
              </div>
              <Button onClick={handleClick} />
              <p className="text-2xl text-center">
                Your baby kick {dailyCount} time{dailyCount !== 1 ? 's' : ''} today — {trend} yesterday!
              </p>
            </section>

            <section id="data-table">
              <div className="flex gap-4 justify-center mb-4">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`px-4 py-2 active:scale-95 min-w-40 rounded ${activeTab === 'today' ? 'bg-[var(--text-primary)] text-white' : 'border'}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 active:scale-95 min-w-40 rounded ${activeTab === 'history' ? 'bg-[var(--text-primary)] text-white' : 'border'}`}
                >
                  History
                </button>
              </div>
              <div className="table-none md:table-fixed rounded-md border-2 border-[var(--text-primary)] shadow-md overflow-x-scroll">
                <Table
                  kicks={filteredKicks}
                  onEditKick={handleEditKick}
                  onDeleteKick={handleDeleteKick}
                />
              </div>
            </section>

            <section id="download-in-csv">
              {kicks.length > 0 && (
                <div className="text-center">
                  <p>You can choose to download by time or daily summary</p>
                  <div className="mt-4 flex flex-col md:flex-row gap-4 justify-center">
                    <button onClick={handleDownloadCSV} className="border px-4 py-2 rounded hover:bg-[var(--primary)] transition active:scale-95">
                      Download Kick Records in CSV
                    </button>
                    <button onClick={handleDownloadSummaryCSV} className="border px-4 py-2 rounded hover:bg-[var(--primary)] transition active:scale-95">
                      Download Daily Summary CSV
                    </button>
                  </div>
                </div>
              )}
            </section>

            {kicks.length > 0 && (
              <section id="summary-report" className='flex flex-col items-center justify-center gap-4'>
                <p>View and share your summarize report to doctor instantly!</p>
                <Modal
                  trigger={<button className="border px-4 py-2 rounded hover:bg-[var(--primary)] transition active:scale-95">View Summary</button>}
                  title="Summary Report"
                >
                  <div id="summary">
                    <SummaryReport babyName={babyName} gender={babyGender} kickData={kicks} />
                  </div>
                </Modal>
              </section>
            )}

            <section>
              {Object.keys(generateSummaryMap(kicks)).length > 0 && (
                <div className="border rounded-md p-1 text-center">
                  <p className="mt-8 text-[var(--text-primary)] text-lg">Daily Kick Summary</p>
                  <KickChart summaryMap={generateSummaryMap(kicks)} />
                </div>
              )}
            </section>

            <CookieConsent />

            <section id="reset-data">
              {kicks.length > 0 && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleReset}
                    className="border px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
                  >
                    Reset All Data
                  </button>
                </div>
              )}
            </section>

            <Watermark />
          </main>
        </>
      )}
    </>
  )
}

export default App
