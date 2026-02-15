import { Check, Circle } from 'lucide-react';

interface StatusTimelineProps {
    currentStatus: string;
}

const statuses = [
    { key: 'pending', label: 'En attente de confirmation' },
    { key: 'confirmed', label: 'Confirmée' },
    { key: 'in_progress', label: 'En cours' },
    { key: 'completed', label: 'Terminée' },
];

export default function StatusTimeline({ currentStatus }: StatusTimelineProps) {
    const currentIndex = statuses.findIndex((s) => s.key === currentStatus);
    const isCancelled = currentStatus === 'cancelled' || currentStatus === 'refunded';

    if (isCancelled) {
        return (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center flex-shrink-0">
                    <span className="text-destructive-foreground text-lg">✕</span>
                </div>
                <div>
                    <p className="font-medium text-destructive">
                        {currentStatus === 'refunded' ? 'Annulée et remboursée' : 'Annulée'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Cette réservation a été annulée
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-border">
                <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                        width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
                    }}
                />
            </div>

            {/* Status Steps */}
            <div className="relative flex justify-between">
                {statuses.map((status, index) => {
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={status.key} className="flex flex-col items-center gap-2 flex-1">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                    } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Circle className="w-3 h-3" />
                                )}
                            </div>
                            <p
                                className={`text-xs text-center max-w-[100px] ${isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'
                                    }`}
                            >
                                {status.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
