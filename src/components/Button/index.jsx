

export const Button = ({ onClick }) => {
    return (
        <button
            className="rounded-full size-48 md:size-64 active:scale-95 border-[var(--text-primary)] border-2 cursor-pointer flex justify-center items-center p-8 hover:shadow-xl transition-all ease-in-out duration-300"
            onClick={onClick}
        >
            <img
                src="/feet-a47148.webp"
                className="w-full h-full object-contain overflow-hidden"
                alt="Press Here"
                title="Kicking!"
                draggable="false"
                loading="lazy"
            />
        </button>
    )
}