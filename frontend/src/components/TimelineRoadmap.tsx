import { useEffect, useRef, useState } from "react";

/**
 * Timeline of the 100 Day Journey — six-step roadmap.
 *
 * Like the Participation Benefits diagram, this is laid out on a fixed
 * coordinate space (1400x720) because the pins, stems, node dots, display
 * numbers and text blocks are all positioned against the horizontal bar and
 * must stay registered to each other. The whole stage is scaled as a unit by
 * a ResizeObserver rather than reflowed.
 *
 * Steps alternate: odd steps hang below the bar, even steps sit above it.
 * Each step's text block is offset from its own pin so the six blocks
 * interleave — hence the explicit coordinates. Every block is positioned to
 * sit in the horizontal gap between the two pins on ITS OWN row (pins are
 * 176px wide, centred on nodeLeft), so widths and lefts here are not free
 * parameters: widening a block will push it under a pin.
 */

const STAGE_WIDTH = 1400;
const STAGE_HEIGHT = 760;

/*
 * Pin geometry in plain pixels. Tailwind's rem-based sizes are NOT safe here:
 * the site sets html{font-size:18px}, so w-44 resolves to 198px, not the 176px
 * the source markup assumed. Inside a fixed coordinate stage that silently
 * breaks the collision math, so everything below is sized in px.
 */
const PIN = 176;
const PIN_INNER = 128;
const STEM_H = 144;
const STEM_W = 18;

/** y of the top of the horizontal bar. */
const BAR_TOP = 345;

type Step = {
  number: string;
  title: string;
  dates: string;
  body: string;
  color: string;
  /** Share of the bar's width this step's colour segment occupies. */
  segment: number;
  /** Horizontal position of the node dot on the bar. */
  nodeLeft: string;
  /** Whether the pin hangs below the bar or sits above it. */
  side: "below" | "above";
  /** Position of the large display number. */
  numberLeft: string;
  numberTop: number;
  /** Position of the text block. */
  textLeft: string;
  textTop: number;
  textWidth: number;
  icon: React.ReactNode;
};

const stroke = {
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  className: "text-black stroke-[2.2]",
  width: 64,
  height: 64,
};

const steps: Step[] = [
  {
    number: "01",
    title: "Ideate",
    dates: "Days 1–15 • 15 Sep – 1 Oct 2026",
    body: "Launch of 50 National Problem Statements, online orientation, team registrations, and idea submissions.",
    color: "#F25C22",
    segment: 20,
    nodeLeft: "14%",
    side: "below",
    numberLeft: "17%",
    numberTop: 385,
    textLeft: "21.14%",
    textTop: 540,
    textWidth: 210,
    icon: (
      <svg {...stroke}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Screen",
    dates: "Days 16–30 • 2 – 16 Oct 2026",
    body: "Preliminary eligibility scrutiny, regional screening, and announcement of shortlisted teams.",
    color: "#EFA00B",
    segment: 17,
    nodeLeft: "29%",
    side: "above",
    numberLeft: "32%",
    numberTop: 255,
    textLeft: "3%",
    textTop: 90,
    textWidth: 215,
    icon: (
      <svg {...stroke}>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Build",
    dates: "Days 31–60 • 17 Oct – 15 Nov 2026",
    body: "Expert bootcamps, laboratory/maker-space access, design reviews, and working prototype fabrication.",
    color: "#48BF43",
    segment: 21,
    nodeLeft: "43%",
    side: "below",
    numberLeft: "46%",
    numberTop: 385,
    textLeft: "50.14%",
    textTop: 540,
    textWidth: 200,
    icon: (
      <svg {...stroke}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Validate",
    dates: "Days 61–80 • 16 Nov – 5 Dec 2026",
    body: "Technical benchmarking, safety/reliability testing, and performance validation.",
    color: "#00B4D8",
    segment: 18,
    nodeLeft: "57.5%",
    side: "above",
    numberLeft: "60.5%",
    numberTop: 255,
    textLeft: "36.14%",
    textTop: 90,
    textWidth: 200,
    icon: (
      <svg {...stroke}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Test",
    dates: "Days 81–95 • 6 – 20 Dec 2026",
    body: "Field demonstrations in real environments, usability testing, and cost/sustainability reviews.",
    color: "#0077B6",
    segment: 13,
    nodeLeft: "71.5%",
    side: "below",
    numberLeft: "74.5%",
    numberTop: 385,
    textLeft: "79%",
    textTop: 540,
    textWidth: 235,
    icon: (
      <svg {...stroke}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Select",
    dates: "Days 96–100 • 21 – 25 Dec 2026",
    body: "Final report submissions and Regional Jury evaluations to nominate finalists for Delhi.",
    color: "#7B2CBF",
    segment: 11,
    nodeLeft: "85.5%",
    side: "above",
    numberLeft: "78.2%",
    numberTop: 255,
    textLeft: "64.29%",
    textTop: 90,
    textWidth: 195,
    icon: (
      <svg {...stroke}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
];

function Pin({ step }: { step: Step }) {
  const badge = (
    <div
      className="rounded-full flex items-center justify-center pin-shadow relative transition-transform duration-300 hover:scale-105"
      style={{ width: PIN, height: PIN, backgroundColor: step.color }}
    >
      <div
        className="rounded-full bg-white flex items-center justify-center inner-circle-shadow"
        style={{ width: PIN_INNER, height: PIN_INNER }}
      >
        {step.icon}
      </div>
    </div>
  );

  const stem = <div style={{ width: STEM_W, height: STEM_H, backgroundColor: step.color }} />;

  return (
    <div
      className="absolute -translate-x-1/2 z-20 flex flex-col items-center"
      style={{ left: step.nodeLeft, top: step.side === "below" ? 354 : 80 }}
    >
      {step.side === "below" ? (
        <>
          {stem}
          <div className="-mt-1">{badge}</div>
        </>
      ) : (
        <>
          <div className="-mb-1">{badge}</div>
          {stem}
        </>
      )}
    </div>
  );
}

export function TimelineRoadmap() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width > 0) setScale(width / STAGE_WIDTH);
    });

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full">
      {/* Mobile-Friendly Vertical Stepper Timeline (screens < 768px) */}
      <div className="block md:hidden py-3 px-1">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-5 sm:space-y-6 pl-5 sm:pl-6">
          {steps.map((step) => {
            const dateParts = step.dates.split("•");
            const dayRange = dateParts[0]?.trim();
            const dateSpan = dateParts[1]?.trim();

            return (
              <div key={step.number} className="relative">
                {/* Node circle on the vertical spine */}
                <div
                  className="absolute -left-[31px] top-1.5 size-7 rounded-full flex items-center justify-center shadow-xs ring-4 ring-white"
                  style={{ backgroundColor: step.color }}
                >
                  <span className="text-white text-[10px] font-black leading-none">
                    {step.number}
                  </span>
                </div>

                {/* Step Card */}
                <div className="rounded-2xl bg-[#fbfbfc] border border-slate-200/80 p-4 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <span
                      className="text-sm font-black uppercase tracking-tight"
                      style={{ color: step.color }}
                    >
                      {step.title}
                    </span>
                    {dayRange && (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {dayRange}
                      </span>
                    )}
                  </div>

                  {dateSpan && (
                    <div className="text-[11px] font-semibold text-slate-700 mb-2">
                      {dateSpan}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {step.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop / Tablet Scaled Graphic (screens >= 768px) */}
      <div
        ref={frameRef}
        className="hidden md:block w-full overflow-hidden"
        style={{ aspectRatio: `${STAGE_WIDTH} / ${STAGE_HEIGHT}` }}
        role="img"
        aria-label="Timeline of the 100 day journey: Ideate, Screen, Build, Validate, Test, Select"
      >
        <div
          className="relative select-none"
          style={{
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          {/* Continuous segmented bar */}
          <div className="absolute left-0 w-full h-[18px] flex z-10" style={{ top: BAR_TOP }}>
            {steps.map((step) => (
              <div
                key={step.number}
                className="h-full"
                style={{ width: `${step.segment}%`, backgroundColor: step.color }}
              />
            ))}
          </div>

          {/* Node dots on the bar */}
          {steps.map((step) => (
            <div
              key={`node-${step.number}`}
              className="absolute -translate-x-1/2 z-30 flex flex-col items-center"
              style={{ left: step.nodeLeft, top: BAR_TOP - 11 }}
            >
              <div
                className="rounded-full flex items-center justify-center shadow-md"
                style={{ width: 40, height: 40, backgroundColor: step.color }}
              >
                <div className="rounded-full bg-white node-dot-shadow" style={{ width: 20, height: 20 }} />
              </div>
            </div>
          ))}

          {/* Pins and stems */}
          {steps.map((step) => (
            <Pin key={`pin-${step.number}`} step={step} />
          ))}

          {/* Large display numbers */}
          {steps.map((step) => (
            <div
              key={`num-${step.number}`}
              className="absolute z-20 select-none pointer-events-none"
              style={{ left: step.numberLeft, top: step.numberTop }}
            >
              <span
                className="font-black tracking-tight"
                style={{ color: step.color, fontSize: 44, lineHeight: 1 }}
              >
                {step.number}
              </span>
            </div>
          ))}

          {/* Text blocks */}
          {steps.map((step) => (
            <div
              key={`text-${step.number}`}
              className="absolute z-40 text-left [hyphens:none]"
              style={{ left: step.textLeft, top: step.textTop, width: step.textWidth }}
            >
              <p
                className="flex items-center gap-2 text-left font-black tracking-tight text-[#0f172a] uppercase [hyphens:none]"
                style={{ fontSize: 22, lineHeight: 1.2 }}
              >
                <span style={{ color: step.color }}>{step.number}</span>
                {step.title}
              </p>
              <p
                className="mt-1 text-left font-bold text-slate-800 [hyphens:none]"
                style={{ fontSize: 12.5, lineHeight: 1.4 }}
              >
                {step.dates}
              </p>
              <p
                className="mt-1 text-left font-medium text-slate-700 [hyphens:none]"
                style={{ fontSize: 14, lineHeight: 1.5 }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
