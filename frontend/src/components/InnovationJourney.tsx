/**
 * The Innovation Journey — eight-step horizontal infographic.
 *
 * Sits under the PHILOSOPHY heading on the About page. The step row and the
 * phase ribbons below it share one 8-column grid so the ribbons line up with
 * the steps they span. The grid has a min width and scrolls horizontally on
 * narrow screens rather than reflowing, since the left-to-right sequence is
 * the whole point of the graphic.
 */

type Step = {
  number: string;
  title: string;
  body: string;
  /** Circle background. */
  surface: string;
  /** Number colour. */
  ink: string;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Observe",
    body: "Look around, explore real-world challenges and opportunities.",
    surface: "#dbeefe",
    ink: "#0369a1",
  },
  {
    number: "02",
    title: "Identify",
    body: "Pinpoint key problems that need solutions.",
    surface: "#dcfce7",
    ink: "#15803d",
  },
  {
    number: "03",
    title: "Understand",
    body: "Analyse, learn and gain deeper insights.",
    surface: "#fef3c7",
    ink: "#b45309",
  },
  {
    number: "04",
    title: "Innovate",
    body: "Think differently and explore new possibilities.",
    surface: "#ffe4e6",
    ink: "#be123c",
  },
  {
    number: "05",
    title: "Create",
    body: "Develop prototypes, solutions or models.",
    surface: "#ede9fe",
    ink: "#6d28d9",
  },
  {
    number: "06",
    title: "Demonstrate",
    body: "Test, validate and showcase your solution.",
    surface: "#e0f2fe",
    ink: "#0284c7",
  },
  {
    number: "07",
    title: "Implement",
    body: "Scale and deploy for real-world use.",
    surface: "#dcfce7",
    ink: "#16a34a",
  },
  {
    number: "08",
    title: "Benefit",
    body: "Create lasting impact for society, economy and the nation.",
    surface: "#ffedd5",
    ink: "#ea580c",
  },
];

type Phase = {
  label: string;
  /** How many of the eight steps this phase covers. */
  span: string;
  surface: string;
  ink: string;
  /** Which chevron notch treatment to use. */
  shape: string;
};

const phases: Phase[] = [
  {
    label: "Explore & Understand",
    span: "col-span-3",
    surface: "#e0f0fe",
    ink: "#0284c7",
    shape: "chevron-start pr-3",
  },
  {
    label: "Ideate & Build",
    span: "col-span-2",
    surface: "#fde8ec",
    ink: "#e11d48",
    shape: "chevron-middle pl-2 pr-3",
  },
  {
    label: "Validate & Create Impact",
    span: "col-span-3",
    surface: "#def5e5",
    ink: "#166534",
    shape: "chevron-end pl-2",
  },
];

const phaseGroups = [
  {
    label: "Explore & Understand",
    surface: "#e0f0fe",
    ink: "#0284c7",
    steps: steps.slice(0, 3),
  },
  {
    label: "Ideate & Build",
    surface: "#fde8ec",
    ink: "#e11d48",
    steps: steps.slice(3, 5),
  },
  {
    label: "Validate & Create Impact",
    surface: "#def5e5",
    ink: "#166534",
    steps: steps.slice(5, 8),
  },
];

const arrow = (
  <div
    aria-hidden="true"
    className="absolute -right-3 top-7 pointer-events-none z-10 text-slate-400"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export function InnovationJourney() {
  return (
    <div className="w-full">
      {/* Mobile / Tablet Responsive View (< 1024px) — No horizontal scrolling */}
      <div className="block lg:hidden space-y-4 sm:space-y-6">
        {phaseGroups.map((phase) => (
          <div
            key={phase.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs"
          >
            {/* Phase Header Badge */}
            <div
              className="mb-4 inline-flex items-center rounded-lg px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xs"
              style={{ backgroundColor: phase.surface, color: phase.ink }}
            >
              <span>{phase.label}</span>
            </div>

            {/* Steps in this Phase */}
            <div className="relative border-l-2 border-slate-200/80 ml-3.5 space-y-3.5 pl-4 sm:pl-5">
              {phase.steps.map((step) => (
                <div key={step.number} className="relative">
                  {/* Step circle on the vertical spine */}
                  <div
                    className="absolute -left-[27px] top-1 size-6.5 rounded-full flex items-center justify-center font-extrabold text-[11px] shadow-2xs ring-2 ring-white"
                    style={{ backgroundColor: step.surface, color: step.ink }}
                  >
                    {step.number}
                  </div>

                  {/* Step content card */}
                  <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-3 sm:p-3.5">
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-900 mb-1 [hyphens:none]">
                      {step.title}
                    </h4>
                    <p className="text-[12px] sm:text-xs text-slate-600 leading-relaxed [hyphens:none]">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Infographic (>= 1024px) */}
      <div className="hidden lg:block overflow-x-auto pb-4 scroll-smooth">
        <div className="flex min-w-[1000px] xl:min-w-[1180px] flex-col gap-10 lg:gap-12">
          {/* Eight sequential steps */}
          <div className="relative grid grid-cols-8 items-start" aria-label="Eight steps of innovation">
            {steps.map((step, i) => (
              <div key={step.number} className="group relative flex flex-col items-center px-2.5 text-center">
                <div
                  className="mb-5 flex size-20 shrink-0 items-center justify-center rounded-full shadow-sm transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: step.surface }}
                >
                  <span className="text-2xl font-extrabold tracking-tight" style={{ color: step.ink }}>
                    {step.number}
                  </span>
                </div>
                <p className="mb-2 text-center text-[15px] font-bold uppercase tracking-wider text-slate-900 [hyphens:none]">
                  {step.title}
                </p>
                <p className="text-center text-[14px] font-normal leading-relaxed text-slate-500 [hyphens:none]">
                  {step.body}
                </p>
                {i < steps.length - 1 && arrow}
              </div>
            ))}
          </div>

          {/* Phase ribbons, aligned to the same eight columns */}
          <div className="grid w-full grid-cols-8 items-center gap-0" aria-label="Innovation phases">
            {phases.map((phase) => (
              <div key={phase.label} className={phase.span}>
                <div
                  className={`flex h-12 items-center justify-center ${phase.shape}`}
                  style={{ backgroundColor: phase.surface }}
                >
                  <span
                    className="text-[14px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: phase.ink }}
                  >
                    {phase.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
