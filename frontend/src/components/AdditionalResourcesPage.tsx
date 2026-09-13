import { useEffect } from "react";
import { ChevronRight, ExternalLink, FileText } from "lucide-react";
import { Header, Footer } from "./SewaSite";

type TrlRow = {
  level: string;
  title: string;
  description: string;
};

const TRL_ROWS: TrlRow[] = [
  {
    level: "TRL 1",
    title: "Basic Principles Observed",
    description: "Basic scientific principles are identified and observed.",
  },
  {
    level: "TRL 2",
    title: "Technology Concept Formulated",
    description: "The basic concept and potential application of the technology are defined.",
  },
  {
    level: "TRL 3",
    title: "Experimental Proof of Concept",
    description:
      "Critical functions are demonstrated through experiments or initial proof-of-concept studies.",
  },
  {
    level: "TRL 4",
    title: "Technology Validated in Laboratory",
    description: "Components or systems are integrated and validated in a controlled laboratory environment.",
  },
  {
    level: "TRL 5",
    title: "Technology Validated in Relevant Environment",
    description: "The technology is tested and validated under conditions representative of the intended application.",
  },
  {
    level: "TRL 6",
    title: "Technology Demonstrated in Relevant Environment",
    description: "A representative prototype or system is demonstrated in a relevant environment.",
  },
  {
    level: "TRL 7",
    title: "System Prototype Demonstrated in Operational Environment",
    description: "A near-complete or fully functional prototype is demonstrated under actual or operational conditions.",
  },
  {
    level: "TRL 8",
    title: "System Complete and Qualified",
    description:
      "The technology is fully developed, tested and qualified, with the complete system demonstrated and ready for deployment.",
  },
  {
    level: "TRL 9",
    title: "Actual System Proven in Operational Environment",
    description: "The technology has been successfully deployed and proven through actual operation and real-world use.",
  },
];

/** Six-colour badge cycle, matching the reference design (repeats after TRL 6). */
const BADGE_STYLES = [
  { bg: "bg-[#eaf3fd]", text: "text-[#2e6fbf]" },
  { bg: "bg-[#eafaf1]", text: "text-[#1f9e63]" },
  { bg: "bg-[#fff6e0]", text: "text-[#c8930b]" },
  { bg: "bg-[#ffe9de]", text: "text-[#d6602c]" },
  { bg: "bg-[#ffe6e8]", text: "text-[#e0435a]" },
  { bg: "bg-[#f0eefb]", text: "text-[#6f5fc9]" },
];

const documentLinks = [
  {
    title: "SEWA 2026 Guidelines Handbook",
    description: "Consolidated eligibility, registration, and evaluation guidelines.",
    href: "/guidelines",
  },
  {
    title: "Problem Statement Directory",
    description: "Full national and community problem statement categories.",
    href: "/problem-statements",
  },
  {
    title: "100-Day Timeline",
    description: "Key dates from registration through the Grand Finale.",
    href: "/events",
  },
];

const externalLinks = [
  {
    title: "Delhi Technological University",
    description: "Official university website — campus, academics, and admissions.",
    href: "https://dtu.ac.in",
  },
  {
    title: "Ministry of Education, Government of India",
    description: "National policy context for youth innovation and skill-development initiatives.",
    href: "https://education.gov.in",
  },
  {
    title: "Startup India",
    description: "Support schemes and resources for early-stage innovators and founders.",
    href: "https://www.startupindia.gov.in",
  },
];

const sectionHeadingClass =
  "t-main-heading uppercase";

export function AdditionalResourcesPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Header activeNav="resources" />

        <main className="pt-10 sm:pt-16 pb-20 sm:pb-28">
          <div className="t-section-stack site-shell max-w-5xl">
            {/* ── Resources ── */}
            <section aria-labelledby="resources-heading">
              <h1 id="resources-heading" className={sectionHeadingClass}>
                Resources:
              </h1>

              <div className="mt-10 sm:mt-12 space-y-10 sm:space-y-12">
                <div>
                  <h2 className="mb-4 text-base font-bold text-gray-900 tracking-tight">
                    On This Site
                  </h2>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {documentLinks.map((doc) => (
                      <a
                        key={doc.title}
                        href={doc.href}
                        className="flex items-start gap-3 rounded-[18px] border border-[#eaecf0] bg-[#fbfbfb] px-5 py-4 transition-all hover:border-gray-300 hover:shadow-2xs"
                      >
                        <FileText size={18} className="mt-0.5 shrink-0 text-primary" strokeWidth={1.8} />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 leading-snug">{doc.title}</h3>
                          <p className="mt-1 text-xs text-gray-500 leading-relaxed">{doc.description}</p>
                        </div>
                        <ChevronRight size={16} className="ml-auto mt-0.5 shrink-0 text-gray-300" strokeWidth={1.8} />
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-base font-bold text-gray-900 tracking-tight">
                    External Links
                  </h2>
                  <div className="space-y-3">
                    {externalLinks.map((link) => (
                      <a
                        key={link.title}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start gap-3 rounded-[18px] border border-[#eaecf0] bg-[#fbfbfb] px-5 py-4 transition-all hover:border-gray-300 hover:shadow-2xs"
                      >
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 leading-snug">{link.title}</h3>
                          <p className="mt-1 text-xs text-gray-500 leading-relaxed">{link.description}</p>
                        </div>
                        <ExternalLink size={16} className="ml-auto mt-0.5 shrink-0 text-gray-300" strokeWidth={1.8} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Innovation Playbook ── */}
            <section id="innovation-playbook" aria-labelledby="playbook-heading" className="scroll-mt-28">
              <h2 id="playbook-heading" className={sectionHeadingClass}>
                Innovation Playbook
              </h2>
              <p className="t-content mt-6 max-w-2xl text-gray-700">
                A step-by-step field guide for teams moving from problem observation through
                ideation, prototyping and validation — structured around the same 100-day journey
                as the Challenge itself.
              </p>

              <a
                href="#"
                className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-[#eaecf0] bg-[#fbfbfb] px-6 py-4 transition-all hover:border-gray-300 hover:shadow-2xs"
              >
                <FileText size={20} className="shrink-0 text-primary" strokeWidth={1.8} />
                <div>
                  <p className="text-sm font-bold text-gray-900">Download Innovation Playbook (PDF)</p>
                  <p className="mt-0.5 text-xs text-gray-500">Coming soon</p>
                </div>
              </a>
            </section>

            {/* ── Technology Readiness Level (TRL) ── */}
            <section id="trl" aria-labelledby="trl-heading" className="scroll-mt-28">
              <h2 id="trl-heading" className={sectionHeadingClass}>
                Technology Readiness
                <br />
                Level (TRL)
              </h2>

              <div className="mt-10 sm:mt-12 overflow-hidden rounded-2xl border border-[#eaecf0]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-[#1c2b40] text-white">
                      <tr>
                        <th className="w-28 px-5 py-3.5 text-xs font-bold uppercase tracking-wide">TRL</th>
                        <th className="w-[30%] px-5 py-3.5 text-xs font-bold uppercase tracking-wide">Level</th>
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wide">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TRL_ROWS.map((row, index) => {
                        const badge = BADGE_STYLES[index % BADGE_STYLES.length];
                        return (
                          <tr
                            key={row.level}
                            className={index % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"}
                          >
                            <td className="px-5 py-4 align-top">
                              <span
                                className={`inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-bold ${badge.bg} ${badge.text}`}
                              >
                                {row.level}
                              </span>
                            </td>
                            <th scope="row" className="px-5 py-4 align-top text-sm font-bold text-gray-900">
                              {row.title}
                            </th>
                            <td className="px-5 py-4 align-top text-sm leading-relaxed text-gray-600">
                              {row.description}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
