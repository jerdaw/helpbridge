import { Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IntentCategory } from '@/types/service';

const CATEGORIES = Object.values(IntentCategory);

interface SearchControlsProps {
    userLocation: { lat: number; lng: number } | undefined;
    toggleLocation: () => void;
    isLocating: boolean;
    category: string | undefined;
    setCategory: (cat: string | undefined) => void;
}

export default function SearchControls({
    userLocation,
    toggleLocation,
    isLocating,
    category,
    setCategory
}: SearchControlsProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Location Toggle */}
            <Button
                variant={userLocation ? "default" : "pill"}
                size="pill"
                onClick={toggleLocation}
                aria-pressed={!!userLocation}
                aria-label={userLocation ? "Clear location filter" : "Filter by current location"}
                className={userLocation ? 'rounded-full' : ''}
            >
                {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                {userLocation ? 'Near Me' : 'Use Location'}
            </Button>

            {/* Category Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full" role="group" aria-label="Filter by category">
                <Button
                    variant={!category ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setCategory(undefined)}
                    aria-pressed={!category}
                    className="rounded-full"
                >
                    All
                </Button>
                {CATEGORIES.map(cat => (
                    <Button
                        key={cat}
                        variant={category === cat ? "default" : "secondary"}
                        size="sm"
                        onClick={() => setCategory(cat === category ? undefined : cat)}
                        aria-pressed={category === cat}
                        className="rounded-full whitespace-nowrap"
                    >
                        {cat}
                    </Button>
                ))}
            </div>
        </div>
    );
}
