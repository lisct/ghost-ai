import { BrainCircuit, Users, ScrollText } from "lucide-react"

const features = [
  {
    icon: BrainCircuit,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: ScrollText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

export function AuthPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col bg-surface border-r border-surface-border px-14 py-10">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand">
          <span className="text-xs font-bold text-[#080809]">G</span>
        </div>
        <span className="text-copy-primary font-medium text-sm">Ghost AI</span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-10 py-12">
        <div className="space-y-4 max-w-sm">
          <h1 className="font-sans text-copy-primary text-4xl font-bold leading-tight tracking-tight">
            Design systems at the speed of thought.
          </h1>
          <p className="font-sans text-copy-secondary text-sm leading-relaxed max-w-[320px]">
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>
        </div>

        <div className="space-y-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-dim border border-surface-border">
                <Icon className="h-4 w-4 text-brand" strokeWidth={1.5} />
              </div>
              <div className="pt-0.5">
                <p className="font-sans text-copy-primary font-medium text-sm leading-snug">
                  {title}
                </p>
                <p className="font-sans text-copy-muted text-sm mt-1 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
