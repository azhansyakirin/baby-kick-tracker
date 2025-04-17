

export const Button = ({ onClick }) => {
    return (
        <button
            className="rounded-full size-64 border-[var(--primary)] border-2 cursor-pointer flex justify-center items-center p-8 hover:shadow-xl transition-all ease-in-out duration-300"
            onClick={onClick}
        >
            <img
                src="/feet.webp"
                className="w-full h-full object-contain overflow-hidden"
                alt="Press Here"
            />
        </button>
    )
}