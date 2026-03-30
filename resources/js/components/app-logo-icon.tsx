export default function AppLogoIcon({ className }: { className?: string }) {
    return (
        <img
            src="/artemo-logo.png"
            alt="Artemo"
            className={className}
            style={{ objectFit: 'contain' }}
        />
    );
}
