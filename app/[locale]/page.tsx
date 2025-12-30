"use client"

import { useSemanticSearch } from '../../hooks/useSemanticSearch';
import { useSearch } from '../../hooks/useSearch';
import { useServices } from '../../hooks/useServices';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Section } from '@/components/ui/section';
import { motion } from 'framer-motion';

// Modular Components
import ModelStatus from '../../components/home/ModelStatus';
import SearchBar from '../../components/home/SearchBar';
import SearchControls from '../../components/home/SearchControls';
import SearchChips from '../../components/home/SearchChips';
import SearchResultsList from '../../components/home/SearchResultsList';

export default function Home() {
  const t = useTranslations();
  const {
    query, setQuery,
    category, setCategory,
    userLocation, toggleLocation, isLocating,
    results, setResults,
    hasSearched, setHasSearched,
    isLoading, setIsLoading,
    suggestion, setSuggestion,
    savedSearches, handleSaveSearch, removeSavedSearch
  } = useSearch();

  // Progressive Search Hook
  const { isReady, progress, generateEmbedding } = useSemanticSearch();

  // Perform Search Logic
  useServices({
    query,
    category,
    userLocation,
    isReady,
    generateEmbedding,
    setResults,
    setIsLoading,
    setHasSearched,
    setSuggestion
  });

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 dark:bg-primary-900/10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-200/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 dark:bg-accent-900/10" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-neutral-200 backdrop-blur-sm text-xs font-semibold text-primary-600 dark:bg-white/5 dark:border-white/10 dark:text-primary-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Pilot v1.0 Live
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white heading-display">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500">
                Kingston
              </span> Care Connect
            </h1>

            <p className="mx-auto max-w-2xl text-xl text-neutral-600 dark:text-neutral-300">
              {t('Footer.disclaimer')}
            </p>

            <ModelStatus isReady={isReady} progress={progress} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10"
          >
            <div className="glass p-2 rounded-3xl shadow-xl dark:shadow-primary-900/5 border border-white/50 dark:border-white/5">
              <SearchBar
                query={query}
                setQuery={setQuery}
                handleSaveSearch={handleSaveSearch}
                placeholder={t('Search.placeholder')}
                label={t('Search.label')}
              />
            </div>

            <div className="mt-6">
              <SearchControls
                userLocation={userLocation}
                toggleLocation={toggleLocation}
                isLocating={isLocating}
                category={category}
                setCategory={setCategory}
              />
            </div>

            {/* Suggestions & Chips */}
            {!hasSearched && query.length === 0 && (
              <div className="mt-8">
                <SearchChips
                  savedSearches={savedSearches}
                  removeSavedSearch={removeSavedSearch}
                  startSearch={(term) => setQuery(term)}
                />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <Section className={hasSearched || query.length > 0 ? "pt-0" : "opacity-0 h-0 overflow-hidden py-0"}>
        {suggestion && !isLoading && (
          <div className="mb-8 rounded-xl bg-primary-50/50 p-4 text-center dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/50">
            <p className="text-sm text-primary-700 dark:text-primary-300">
              {t('Search.didYouMean')} <button
                onClick={() => setQuery(suggestion)}
                className="font-bold underline decoration-primary-400 hover:text-primary-600 dark:hover:text-primary-200"
              >
                {suggestion}
              </button>?
            </p>
          </div>
        )}

        <SearchResultsList
          isLoading={isLoading}
          results={results}
          hasSearched={hasSearched}
          query={query}
          category={category}
          userLocation={userLocation}
        />
      </Section>

      <Footer />
    </main>
  );
}
