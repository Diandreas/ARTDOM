
import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export default function Onboarding() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const slides = [
        {
            title: "Trouvez un artiste local",
            description: "Découvrez des talents près de chez vous pour vos événements.",
            image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Vivez une émotion unique",
            description: "Offrez des moments inoubliables avec des prestations personnalisées.",
            image: "https://images.unsplash.com/photo-1514525253440-b393452e23f0?q=80&w=1974&auto=format&fit=crop"
        },
        {
            title: "Soutenez les talents",
            description: "Rejoignez une communauté qui valorise l'art et la culture.",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    const handleFinish = () => {
        // @ts-ignore
        router.visit(route('register.selection'));
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Head title="Bienvenue" />

            <div className="flex justify-end p-6">
                <Button variant="ghost" onClick={handleFinish} className="text-muted-foreground">
                    Passer
                </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <Carousel setApi={setApi} className="w-full max-w-sm">
                    <CarouselContent>
                        {slides.map((slide, index) => (
                            <CarouselItem key={index}>
                                <div className="flex flex-col items-center text-center gap-8">
                                    <div className="aspect-square w-full relative overflow-hidden rounded-2xl shadow-xl">
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-heading font-bold text-primary">
                                            {slide.title}
                                        </h2>
                                        <p className="text-muted-foreground text-lg px-4">
                                            {slide.description}
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <div className="flex justify-center gap-2 mt-8">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    current === index ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                                )}
                            />
                        ))}
                    </div>
                </Carousel>
            </div>

            <div className="p-6 pb-12">
                <Button
                    className="w-full h-12 text-lg"
                    onClick={() => {
                        console.log('Current slide:', current);
                        // Check strictly if it is the last slide index (2)
                        if (current === slides.length - 1 || (api && !api.canScrollNext())) {
                            handleFinish();
                        } else {
                            api?.scrollNext();
                        }
                    }}
                >
                    {current === slides.length - 1 ? "Commencer" : "Suivant"}
                    <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
            </div>

            {/* Listen to API events */}
            {/* Note: We need to use useEffect to sync state, but JSX doesn't allow useEffect directly here.
                We can wrap this in a component or use an IIFE if needed, but better to put useEffect at top level.
                Wait, I cannot put useEffect inside the return. 
                I need to add the useEffect hook at the top.
            */}
        </div>
    );
}
