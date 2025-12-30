import { Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
    query: string;
    setQuery: (query: string) => void;
    handleSaveSearch: () => void;
    placeholder: string;
    label: string;
}

export default function SearchBar({ query, setQuery, handleSaveSearch, placeholder, label }: SearchBarProps) {
    return (
        <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                <Search className="h-6 w-6 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
                type="text"
                className="block w-full rounded-2xl border-0 bg-transparent py-4 pl-14 pr-14 text-neutral-900 placeholder:text-neutral-400 focus:ring-0 sm:text-lg sm:leading-6 dark:text-white"
                placeholder={placeholder}
                aria-label={label}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query.length > 0 && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveSearch}
                    className="absolute inset-y-0 right-2 my-auto h-10 w-10 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Save this search"
                    aria-label="Save this search"
                >
                    <Heart className="h-5 w-5" />
                </Button>
            )}
        </div>
    );
}
