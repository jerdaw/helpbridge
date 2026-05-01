import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface StaticMarkdownProps {
  children: string
  className?: string
}

export function stripMarkdownDocumentHeader(content: string) {
  return content
    .replace(/^# .+\r?\n+/, "")
    .replace(/^\*\*(?:Last reviewed|Dernière révision)\s*:\*\*.*\r?\n+/i, "")
    .replace(/^\s*---\s*\r?\n+/, "")
    .trimStart()
}

export function StaticMarkdown({ children, className }: StaticMarkdownProps) {
  return (
    <div className={cn("max-w-none text-neutral-700 dark:text-neutral-300", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children, ...props }) => (
            <h2
              className="heading-display mt-10 border-b border-neutral-200/75 pb-3 text-2xl font-bold text-neutral-950 first:mt-0 dark:border-white/10 dark:text-white"
              {...props}
            >
              {children}
            </h2>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="heading-display mt-10 border-b border-neutral-200/75 pb-3 text-2xl font-bold text-neutral-950 first:mt-0 dark:border-white/10 dark:text-white"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="mt-8 text-lg font-bold text-neutral-950 first:mt-0 dark:text-white" {...props}>
              {children}
            </h3>
          ),
          p: ({ ...props }) => <p className="mt-4 leading-relaxed first:mt-0" {...props} />,
          ul: ({ ...props }) => <ul className="mt-4 list-disc space-y-2 pl-6 first:mt-0" {...props} />,
          ol: ({ ...props }) => <ol className="mt-4 list-decimal space-y-2 pl-6 first:mt-0" {...props} />,
          li: ({ ...props }) => <li className="pl-1 leading-relaxed" {...props} />,
          hr: ({ ...props }) => <hr className="my-8 border-neutral-200/75 dark:border-white/10" {...props} />,
          strong: ({ ...props }) => <strong className="font-semibold text-neutral-950 dark:text-white" {...props} />,
          a: ({ ...props }) => (
            <a
              className="text-accent-700 hover:text-accent-900 dark:text-accent-300 dark:hover:text-accent-200 font-semibold underline underline-offset-4"
              {...props}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
