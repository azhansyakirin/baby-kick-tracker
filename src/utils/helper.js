import dayjs from 'dayjs'

export const sortKicks = (kicks) => {
  return kicks.slice().sort((a, b) => {
    const timeA = dayjs(`${a.date} ${a.time}`, 'DD-MM-YYYY hh:mm:ss A')
    const timeB = dayjs(`${b.date} ${b.time}`, 'DD-MM-YYYY hh:mm:ss A')
    return timeB.valueOf() - timeA.valueOf()
  })
}

export const groupKicksByDate = (kicks) => {
  const grouped = kicks.reduce((acc, kick) => {
    if (!acc[kick.date]) acc[kick.date] = []
    acc[kick.date].push(kick)
    return acc
  }, {})

  console.log('groupKicksByDate', Object.entries(grouped).sort((a, b) =>
    dayjs(b[0], 'DD-MM-YYYY').diff(dayjs(a[0], 'DD-MM-YYYY'))
  ))

  return Object.entries(grouped).sort((a, b) =>
    dayjs(b[0], 'DD-MM-YYYY').diff(dayjs(a[0], 'DD-MM-YYYY'))
  )
}

export const generateSummaryMap = (kicks) => {
  return kicks.reduce((map, { date, day }) => {
    if (!map[date]) map[date] = { count: 0, day }
    map[date].count++

    console.log('generateSummaryMap', map)
    return map
  }, {})
}
