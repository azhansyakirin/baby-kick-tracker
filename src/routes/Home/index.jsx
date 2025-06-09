import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useBaby } from "../../Context/BabyContext";
import { analytics } from '../../config/firebase'
import { Button } from "../../components/Button";
import { Table } from "../../components/Table"
import { groupKicksByDate, sortKicks, generateSummaryMap } from '../../utils/helper'
import KickChart from "../../components/KickChart"
import dayjs from "dayjs";
import { Watermark } from "../../components/Watermark";
import { logEvent, setUserProperties } from 'firebase/analytics'

export const Home = () => {

  const { user, deviceType } = useAuth();

  const {
    babyName,
    setBabyName,
    babyGender,
    setBabyGender,
    kicks,
    setKicks,
    saveUserData,
    count,
    setCount,
  } = useBaby();

  const [currentTime, setCurrentTime] = useState(dayjs())
  const [activeTab, setActiveTab] = useState('today')

  if (!user) return null;

  useEffect(() => {
    logEvent(analytics, 'app_open', { device_type: deviceType })
    setUserProperties(analytics, { device_type: deviceType })
  }, [deviceType])

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(dayjs()), 1000)
    return () => clearInterval(interval)
  }, [])

  let lastTap = 0;

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

  const handleBabyNameChange = (e) => {
    const newName = e.target.value;
    setBabyName(newName);
  };

  const handleGenderChange = (e) => {
    const newGender = e.target.value;
    setBabyGender(newGender);
  };

  // Count stats
  const today = useMemo(() => currentTime.format('DD-MM-YYYY'), [currentTime])
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

  const sortedKicks = useMemo(() => sortKicks(kicks), [kicks])

  const filteredKicks = useMemo(() => {
    if (activeTab === 'today') {
      const groupedToday = groupKicksByDate(kicks).find(([date]) => date === today)
      return groupedToday ? groupedToday[1] : []
    } else {
      return sortedKicks
    }
  }, [activeTab, kicks, sortedKicks, today])

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

  return (
    <>
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
            className={`px-4 py-2 active:scale-95 md:min-w-40 rounded ${activeTab === 'today' ? 'bg-[var(--text-primary)] text-white' : 'border'}`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 active:scale-95 md:min-w-40 rounded ${activeTab === 'history' ? 'bg-[var(--text-primary)] text-white' : 'border'}`}
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

      <section>
        {Object.keys(generateSummaryMap(kicks)).length > 0 && (
          <div className="border rounded-md p-1 text-center">
            <p className="mt-8 text-[var(--text-primary)] text-lg">Daily Kick Summary</p>
            <KickChart summaryMap={generateSummaryMap(kicks)} />
          </div>
        )}
      </section>

      <Watermark />
    </>
  );
}
