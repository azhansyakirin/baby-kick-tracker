import dayjs from "dayjs"

export const Watermark = () => {
  return (
    <div>
      <p className="mt-12 text-sm text-center text-[var(--text-primary)]">
        Baby Kick Tracker | Copyright © {dayjs().format('YYYY')} | All rights reserved.
      </p>
      <p className="my-12 text-sm text-center text-[var(--text-primary)]">
        Designed with ❤️ for all parents by{' '}
        <a href="https://azhansyakirin.dev/" target="_blank" className="text-[var(--primary)]">
          Azhan Syakirin
        </a>
        .
      </p>
    </div>
  )
}