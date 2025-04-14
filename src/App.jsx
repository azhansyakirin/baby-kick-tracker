import { useEffect, useState } from 'react'
import { Button } from './components/Button'
import { Table } from './components/Table'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import CookieConsent from './components/CookieConsent'
import './App.css'

function App() {

  useEffect(() => {
    const babyNameCookie = Cookies.get('babyName');
    const countCookie = Cookies.get('count');

    if (babyNameCookie) {
      setBabyName(JSON.parse(babyNameCookie));
    }

    if (countCookie) {
      setCount(JSON.parse(countCookie));
    }
  }, []);

  const [count, setCount] = useState(0);
  const [babyName, setBabyName] = useState('');

  const [kicks, setKicks] = useState(() => {
    const kicksFromCookie = Cookies.get('kicks');
    return kicksFromCookie ? JSON.parse(kicksFromCookie) : [];
  });

  /** Cookies thingy starts here --> */
  const allCookies = Cookies.get();

  const handleClick = () => {
    const newKick = {
      id: Date.now(),
      date: dayjs().format('DD-MM-YYYY'),
      time: dayjs().format('hh:mm:ss A'),
      day: dayjs().format('dddd'),
    };

    const updatedKicks = [...kicks, newKick];
    setKicks(updatedKicks);
    setCount(prev => prev + 1);

    Cookies.set('count', JSON.stringify(count + 1), { expires: 7 });
    Cookies.set('kicks', JSON.stringify(updatedKicks), { expires: 7 });
  };

  const handleBabyNameChange = (e) => {
    setBabyName(e.target.value);
    Cookies.set('babyName', JSON.stringify(e.target.value), { expires: 7 });
  }

  /** Cookies thingy ends here <-- */

  const now = dayjs().format('dddd DD-MMMM-YYYY hh:mm:ss A');

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Time'];
    const rows = kicks.map(k => [k.date, k.time]);

    let csvContent = [headers, ...rows]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${babyName || 'baby'}-kick-records.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleDownloadSummaryCSV = () => {
    const summaryMap = {};

    kicks.forEach((kick) => {
      const { date, day } = kick;
      if (!summaryMap[date]) {
        summaryMap[date] = { count: 0, day };
      }
      summaryMap[date].count++;
    });

    const headers = ['Date', 'Day', 'Number of Kicks'];
    const rows = Object.entries(summaryMap).map(([date, { day, count }]) => [date, day, count]);

    const csvContent = [headers, ...rows]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${babyName || 'baby'}-kick-summary.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className='flex flex-col gap-4  items-center justify-center h-full w-full min-h-screen bg-gradient-to-r from-[#13547a] to-[#80d0c7]'>
        <div className='p-16 flex flex-col gap-4  items-center justify-center w-full'>
          <p className='text-xl tracking-tight text-center w-screen'>{now}</p>
          <input
            type="text"
            value={allCookies?.babyName ? JSON.parse(allCookies.babyName) : babyName}
            onChange={(e) => handleBabyNameChange(e)}
            placeholder='Enter your baby name'
            className='w-screen focus-visible:border-[#fed8b9] px-4 py-2 uppercase tracking-widest text-2xl text-center'
          />
          <Button onClick={handleClick} />
          <p className='text-2xl'>{allCookies?.count ? JSON.parse(allCookies.count) : count} kick{kicks.length > 1 && <span>s</span>} !</p>
          <div className='sm:w-full md:w-3/4'>
            <Table kicks={kicks} />
          </div>
          {kicks.length > 0 && <div className='font-[Poppins] text-center'>
            <p>You can choose to download by time or daily summary</p>
            <div className='mt-4 flex flex-col md:flex-row gap-4 w-full justify-center items-center'>
              <button
                onClick={handleDownloadCSV}
                className='cursor-pointer bg-white text-[#dd6291] border border-white px-4 py-2 rounded hover:bg-[#fed8b9] hover:text-black transition font-[Poppins] tracking-tight'
              >
                Download Kick Records in CSV
              </button>
              <button
                onClick={handleDownloadSummaryCSV}
                className='bg-white text-[#dd6291] border border-white px-4 py-2 rounded hover:bg-[#fed8b9] hover:text-black transition'
              >
                Download Daily Summary CSV
              </button>
            </div>
          </div>}

        </div>
        <CookieConsent />
        <p className='static w-full bottom-0 mt-12 py-1 flex justify-center items-center text-center'>Designed with ❤️ for all parents by <a href="https://azhansyakirin.dev/" target="_blank" className="ml-1 text-[var(--primary)]">Azhan Syakirin</a>.</p>
      </div>
    </>
  )
}

export default App
