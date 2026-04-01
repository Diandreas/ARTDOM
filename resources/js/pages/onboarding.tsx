
import { Head, router } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel';
import { useAppLocale } from '@/hooks/use-app-locale';
import { cn } from '@/lib/utils';
import { selection } from '@/routes/register';

export default function Onboarding() {
    const { t } = useAppLocale();
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap());

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const slides = [
        {
            title: t('Find a local artist'),
            description: t(
                'Discover talented artists near you for your events.',
            ),
            image: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop',
        },
        {
            title: t('Experience a unique emotion'),
            description: t(
                'Create unforgettable moments with personalized performances.',
            ),
            image: 'https://images.unsplash.com/photo-1514525253440-b393452e23f0?q=80&w=1974&auto=format&fit=crop',
        },
        {
            title: t('Support talented creators'),
            description: t(
                'Join a community that celebrates art and culture.',
            ),
            image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
        },
    ];

    const handleFinish = () => {
        router.visit(selection.url());
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Head title={t('Welcome')} />

            <div className="flex justify-end p-6">
                <Button
                    variant="ghost"
                    onClick={handleFinish}
                    className="text-muted-foreground"
                >
                    {t('Skip')}
                </Button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center p-6">
                <Carousel setApi={setApi} className="w-full max-w-sm">
                    <CarouselContent>
                        {slides.map((slide, index) => (
                            <CarouselItem key={index}>
                                <div className="flex flex-col items-center text-center gap-8">
                                    <div className="aspect-square w-full relative overflow-hidden rounded-2xl shadow-xl">
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-heading font-bold text-primary">
                                            {slide.title}
                                        </h2>
                                        <p className="px-4 text-lg text-muted-foreground">
                                            {slide.description}
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <div className="mt-8 flex justify-center gap-2">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'h-2 rounded-full transition-all duration-300',
                                    current === index
                                        ? 'w-8 bg-primary'
                                        : 'w-2 bg-muted-foreground/30',
                                )}
                            />
                        ))}
                    </div>
                </Carousel>
            </div>

            <div className="p-6 pb-12">
                <Button
                    className="h-12 w-full text-lg"
                    onClick={() => {
                        if (
                            current === slides.length - 1 ||
                            (api && !api.canScrollNext())
                        ) {
                            handleFinish();
                        } else {
                            api?.scrollNext();
                        }
                    }}
                >
                    {current === slides.length - 1
                        ? t('Get started')
                        : t('Next')}
                    <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
