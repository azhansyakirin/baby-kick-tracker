

export const Button = ({ label, onClick }) => {
    return (
        <button
            className="rounded-full size-64 border-[var(--primary)] border-2 cursor-pointer flex justify-center items-center p-8 hover:shadow-xl"
            onClick={onClick}
        >
            <img
                src="/feet.webp"
                className="w-full h-full object-contain"
                alt="Press Here"
            />
        </button>
    )
}