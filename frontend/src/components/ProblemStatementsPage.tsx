import { useEffect } from "react";
import { Header, Footer } from "./SewaSite";

type Category = { numeral: string; label: string };

type Theme = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  categories: Category[];
};

export const NATIONAL_CATEGORIES: Category[] = [
  { numeral: "I", label: "Defence, Intelligence, Space & National Security" },
  { numeral: "II", label: "Disaster Management & Resilience" },
  { numeral: "III", label: "Manufacturing & Electronics, AI, Robotics & Autonomous Systems" },
  { numeral: "IV", label: "Energy & Sustainable Technology & Environment" },
  { numeral: "V", label: "Advanced Engineering, Infrastructure, Future Mobility & Transportation" },
];

export const COMMUNITY_CATEGORIES: Category[] = [
  { numeral: "I", label: "Village & Panchayat Development, Agriculture & Rural Economy" },
  { numeral: "II", label: "Education & Skill Development" },
  { numeral: "III", label: "Healthcare & Community Well-Being" },
  { numeral: "IV", label: "City & Urban Problems" },
  { numeral: "V", label: "Environment & Natural Resources" },
  { numeral: "VI", label: "Sports (Khelo India)" },
  { numeral: "VII", label: "Employment & Livelihood" },
  { numeral: "VIII", label: "Women & Child Safety and Development" },
  { numeral: "IX", label: "Safety & Disaster Management" },
  { numeral: "X", label: "Transport, Energy & Tourism" },
  { numeral: "XI", label: "Miscellaneous" },
];

const THEMES: Theme[] = [
  {
    id: "national",
    eyebrow: "Theme 1",
    title: "National Level Innovation",
    description:
      "Participants will work on identified challenges and problem statements of national significance, developing innovative, sustainable and scalable solutions with the potential for adoption across India. Innovations should have a starting TRL of 4–6 and are expected to progress towards TRL 7–9 by the end of the Challenge, demonstrating a clear pathway from validated technology to an operational, deployable solution.",
    categories: NATIONAL_CATEGORIES,
  },
  {
    id: "community",
    eyebrow: "Theme 2",
    title: "Local Community Level Innovations – Village / District / State",
    description:
      "Participants will identify real problems and unmet needs within their own villages, districts or states and develop locally relevant, affordable, sustainable and implementable solutions that directly benefit the community and have the potential to be replicated or scaled in other regions. Innovations should have a starting TRL of 1–3 and are expected to progress towards TRL 6–7 by the end of the Challenge, demonstrating a clear journey from an initial concept or proof of concept to a validated and demonstrable solution.",
    categories: COMMUNITY_CATEGORIES,
  },
];

/** Five-colour palette that repeats down the rows, matching the reference design. */
const ROW_STYLES = [
  { row: "bg-[#eff6ff]", badge: "bg-[#3b82f6]" },
  { row: "bg-[#eefaf2]", badge: "bg-[#22a565]" },
  { row: "bg-[#fff5eb]", badge: "bg-[#f59436]" },
  { row: "bg-[#f1f2fd]", badge: "bg-[#8b8ff0]" },
  { row: "bg-[#fef1f1]", badge: "bg-[#f98d8d]" },
];

function CategoryTable({ categories }: { categories: Category[] }) {
  return (
    <div className="mt-8 sm:mt-10">
      {/* Column header */}
      <div className="grid grid-cols-[64px_1fr] sm:grid-cols-[92px_1fr] items-center rounded-xl bg-[#eef1f6] px-4 sm:px-6 py-3">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-gray-600">
          #
        </span>
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-gray-600">
          Problem Statement Categories
        </span>
      </div>

      <ul className="mt-3 space-y-3">
        {categories.map((category, index) => {
          const style = ROW_STYLES[index % ROW_STYLES.length];
          return (
            <li
              key={category.numeral}
              className={`grid grid-cols-[64px_1fr] sm:grid-cols-[92px_1fr] items-center rounded-xl ${style.row} px-4 sm:px-6 py-4 sm:py-5 transition-shadow hover:shadow-2xs`}
            >
              <span
                className={`flex size-9 sm:size-10 items-center justify-center rounded-full ${style.badge} text-[11px] sm:text-xs font-bold text-white shadow-2xs`}
                aria-hidden="true"
              >
                {category.numeral}
              </span>
              <p className="t-content border-l border-gray-300/70 pl-4 sm:pl-6 font-medium! text-gray-900">
                <span className="sr-only">Category {category.numeral}: </span>
                {category.label}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProblemStatementsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Header activeNav="problems" />

        <main className="pt-10 sm:pt-16 pb-20 sm:pb-28">
          <div className="site-shell max-w-5xl">
            <h1 className="t-main-heading uppercase text-[#172554]">
              Problem Statements
            </h1>
            <p className="t-content mx-auto mt-5 sm:mt-6 max-w-2xl text-center text-gray-500">
              The Rashtriya Youth Innovation Challenge 2026 invites solutions across two broad
              themes — national priorities and grassroots community needs.
            </p>

            <div className="t-section-stack mt-10 sm:mt-14">
              {THEMES.map((theme) => (
                <section
                  key={theme.id}
                  id={theme.id}
                  aria-labelledby={`${theme.id}-heading`}
                  className="scroll-mt-28 rounded-[28px] border border-[#eaecf0] bg-white px-5 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:px-10 sm:py-12"
                >
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    {theme.eyebrow}
                  </p>
                  <h2
                    id={`${theme.id}-heading`}
                    className="mt-2 text-2xl sm:text-3xl md:text-[34px] font-black leading-tight tracking-tight text-[#172554]"
                  >
                    {theme.title}
                  </h2>
                  <p className="t-content mt-5 text-gray-700 sm:text-justify">
                    {theme.description}
                  </p>

                  <CategoryTable categories={theme.categories} />
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}