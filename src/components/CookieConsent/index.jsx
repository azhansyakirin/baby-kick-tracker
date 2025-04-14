import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);
    const [minimized, setMinimized] = useState(false);

    useEffect(() => {
        const consent = Cookies.get('cookieConsent');
        const minimizedState = Cookies.get('cookieMinimized');

        if (!consent) {
            setVisible(true);
        } else if (minimizedState === 'true') {
            setMinimized(true);
        }
    }, []);

    const handleAccept = () => {
        Cookies.set('cookieConsent', 'true', { expires: 365 });
        Cookies.set('cookieMinimized', 'true', { expires: 365 });
        setVisible(false);
        setMinimized(true);
    };

    const handleOpen = () => {
        setVisible(true);
        setMinimized(false);
    };

    // If minimized, show just the cookie icon
    if (minimized && !visible) {
        return (
            <button
                onClick={handleOpen}
                className="fixed bottom-4 left-4 z-50 bg-[var(--secondary)] p-2 rounded-full shadow-md hover:scale-105 transition"
            >
                <img className="size-6" src="/cookies.svg" alt="Cookies" />
            </button>
        );
    }

    // If not visible and not minimized, show nothing
    if (!visible) return null;

    return (
        <div className="fixed max-w-2/4 bottom-4 left-4 right-4 bg-[#26262B] text-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 z-50">
            <p className="text-sm font-[Poppins] flex items-start gap-2 text-left">
                <img className="size-6 mt-[2px] shrink-0" src="/cookies.svg" alt="cookie icon" />
                <span>
                    This site uses cookies to save <span className="text-[var(--primary)] font-semibold">baby name</span> and <span className="text-[var(--primary)] font-semibold">kick count</span> data locally. By continuing, you accept cookies.
                </span>
            </p>
            <button
                onClick={handleAccept}
                className="bg-white font-[Poppins] tracking-tight text-sm text-[#26262B] px-4 py-1 rounded hover:bg-gray-200 cursor-pointer transition"
            >
                Accept
            </button>
        </div>
    );
};

export default CookieConsent;
