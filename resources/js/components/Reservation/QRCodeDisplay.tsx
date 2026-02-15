import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';

interface QRCodeDisplayProps {
    reservationNumber: string;
    size?: number;
}

export default function QRCodeDisplay({ reservationNumber, size = 200 }: QRCodeDisplayProps) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="bg-white p-4 rounded-lg mb-4">
                    <QRCodeSVG
                        value={reservationNumber}
                        size={size}
                        level="H"
                        includeMargin
                    />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                    Présentez ce code QR le jour de la prestation
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {reservationNumber}
                </p>
            </CardContent>
        </Card>
    );
}
