import clsx from "clsx"

export const Container = ({ children, className = "" }) => {
  return (
    <div
      className={clsx(`
        min-h-screen 
        bg-[var(--background)] 
        text-[var(--text-primary)] 
        transition-all duration-300 ease
        mx-auto
        w-full
        max-w-screen-xs sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-[900px]
      `, className)}
    >
      {children}
    </div>
  )
}