"use client"

import { useState, useEffect } from "react"
import { Service } from "@/types/service"
import { Scroll, Phone, MapPin, Clock, ArrowRight } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface PlainLanguageSummary {
  summary_en: string
  how_to_use_en: string
  summary_fr?: string
  how_to_use_fr?: string
  reviewed_at: string
}

interface SimplifiedServiceViewProps {
  service: Service
  locale: string
  translations: {
    standardView: string
    whatIsIt: string
    howToGetHelp: string
    callUs: string
    visitUs: string
    openHours: string
    summaryComingSoon: string
  }
}

export function SimplifiedServiceView({ service, locale, translations }: SimplifiedServiceViewProps) {
  const [summary, setSummary] = useState<PlainLanguageSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch(`/api/v1/services/${service.id}/summary`)
        const json = await res.json() as { success: boolean, data: PlainLanguageSummary }
        
        if (json.success && json.data) {
          setSummary(json.data)
        }
      } catch (err) {
        console.error("Failed to fetch summary", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [service.id])

  const handleToggle = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("view")
    router.push(`${pathname}?${params.toString()}`)
  }

  const description = locale === 'fr' 
    ? summary?.summary_fr || summary?.summary_en || (summary ? null : service.description)
    : summary?.summary_en || (summary ? null : service.description)

  const howToUse = locale === 'fr'
    ? summary?.how_to_use_fr || summary?.how_to_use_en || (summary ? null : service.application_process)
    : summary?.how_to_use_en || (summary ? null : service.application_process)

  const isMissing = !loading && !summary

  return (
    <div className="bg-[#FFFFF0] text-black min-h-screen p-6 md:p-12 font-sans">
        <div className="max-w-3xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex justify-between items-start gap-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{service.name}</h1>
                <button 
                    onClick={handleToggle}
                    className="flex shrink-0 items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full font-bold hover:bg-neutral-100 transition-colors"
                >
                    {translations.standardView}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-8">
                    <div className="space-y-4">
                        <div className="h-10 bg-neutral-200 rounded w-48"></div>
                        <div className="h-32 bg-neutral-200 rounded"></div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-10 bg-neutral-200 rounded w-48"></div>
                        <div className="h-32 bg-neutral-200 rounded"></div>
                    </div>
                </div>
            ) : isMissing ? (
                <div className="text-center py-20 bg-white/50 border-2 border-dashed border-neutral-300 rounded-2xl">
                    <p className="text-2xl font-medium text-neutral-600 italic">
                        {translations.summaryComingSoon}
                    </p>
                    <button onClick={handleToggle} className="mt-6 font-bold underline text-blue-700 text-xl">
                        {translations.standardView}
                    </button>
                </div>
            ) : (
                <>
                    {/* What is it? */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-2xl font-bold border-b-4 border-blue-600 pb-2 inline-block">
                            <Scroll className="w-8 h-8 text-blue-600" />
                            <h2>{translations.whatIsIt}</h2>
                        </div>
                        <p className="text-xl md:text-3xl leading-relaxed font-bold">
                            {description}
                        </p>
                    </section>

                    {/* How do I get help? */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-2xl font-bold border-b-4 border-green-600 pb-2 inline-block">
                            <ArrowRight className="w-8 h-8 text-green-600" />
                            <h2>{translations.howToGetHelp}</h2>
                        </div>
                        <div className="text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-bold bg-white p-8 rounded-2xl border-4 border-green-200 shadow-sm">
                            {howToUse}
                        </div>
                    </section>

                    {/* Contact Info (Simplified) */}
                    <section className="grid md:grid-cols-2 gap-8 pt-8">
                        {service.phone && (
                            <div className="space-y-4 bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    <Phone className="w-6 h-6" /> 
                                    {translations.callUs}
                                </h3>
                                <a href={`tel:${service.phone}`} className="text-3xl text-blue-700 underline font-black block">
                                    {service.phone}
                                </a>
                            </div>
                        )}
                        
                        {service.address && (
                            <div className="space-y-4 bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    <MapPin className="w-6 h-6" /> 
                                    {translations.visitUs}
                                </h3>
                                <p className="text-2xl font-bold">{service.address}</p>
                            </div>
                        )}

                        {service.hours_text && (
                            <div className="space-y-4 md:col-span-2 bg-white p-6 rounded-2xl border-2 border-black">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    <Clock className="w-6 h-6" /> 
                                    {translations.openHours}
                                </h3>
                                <p className="text-xl whitespace-pre-line font-medium">{service.hours_text}</p>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    </div>
  )
}
