import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import TrackComments from './TrackComments';

interface CommentsSidebarProps {
    trackId: string;
    comments: any[];
    trigger?: React.ReactNode;
}

export default function CommentsSidebar({ trackId, comments, trigger }: CommentsSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <MessageCircle className="w-5 h-5" />
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[450px] p-6 flex flex-col">
                <SheetHeader className="mb-4">
                    <SheetTitle>Espace Discussion</SheetTitle>
                    <SheetDescription>
                        Partagez votre avis sur ce titre
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-hidden">
                    <TrackComments trackId={trackId} comments={comments} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
