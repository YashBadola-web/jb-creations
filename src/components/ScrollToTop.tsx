import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Disable standard browser scroll restoration to ensure we can manually control it
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        window.scrollTo(0, 0);

        // Optional: Re-enable auto restoration on unmount if needed, 
        // but usually better to keep it manual for SPA to avoid conflicts.
    }, [pathname]);

    return null;
};

export default ScrollToTop;
