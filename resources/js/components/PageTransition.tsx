import { router } from '@inertiajs/react';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

/**
 * Wraps page content with a smooth morphing transition on navigation.
 * Uses View Transitions API when available (Chrome 111+, Edge 111+),
 * falls back to CSS opacity/translate animation on other browsers.
 */
export default function PageTransition({ children }: PropsWithChildren) {
    const [visible, setVisible] = useState(true);
    const [key, setKey] = useState(0);
    const supportsVT = useRef(typeof document !== 'undefined' && 'startViewTransition' in document);

    useEffect(() => {
        if (supportsVT.current) return; // CSS handles it via ::view-transition

        // Fallback: fade + slide on browsers without View Transitions
        const before = router.on('before', () => {
            setVisible(false);
        });

        const navigate = router.on('navigate', () => {
            setKey((k) => k + 1);
            // Small delay so the new page mounts before fading in
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setVisible(true));
            });
        });

        return () => {
            before();
            navigate();
        };
    }, []);

    if (supportsVT.current) {
        // View Transitions API: just render children, CSS does the animation
        return <div style={{ viewTransitionName: 'page' }}>{children}</div>;
    }

    // Fallback animation
    return (
        <div
            key={key}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 220ms ease, transform 220ms ease',
            }}
        >
            {children}
        </div>
    );
}
