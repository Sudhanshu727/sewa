import { createFileRoute } from "@tanstack/react-router";
import { FileText, MapPin, UsersRound } from "lucide-react";
import { Footer, Header } from "../components/SewaSite";
import registrationProcessImage from "../assets/reg_process.png";

export const Route = createFileRoute("/guidelines")({
  head: () => ({
    meta: [
      { title: "Guidelines | SEWA 2026" },
      {
        name: "description",
        content: "Eligibility, registration, submission, and regional coordination guidelines for SEWA 2026.",
      },
    ],
  }),
  component: GuidelinesPage,
});

const eligibilityRows = [
  {
    number: "I",
    category: "School & Vocational",
    participants: <>Students from <strong>Class X onwards up to ITI level</strong>, participating individually or in teams, with appropriate institutional support.</>,
    color: "bg-[#4d9bea]",
    background: "bg-[#edf5fc]",
  },
  {
    number: "II",
    category: "Diploma & Higher Education",
    participants: <>Students/teams from <strong>Diploma, Undergraduate, Postgraduate and Ph.D. programmes</strong>, including technical and non-technical institutions.</>,
    color: "bg-[#4eb27c]",
    background: "bg-[#edf9f1]",
  },
  {
    number: "III",
    category: "Industry & Government",
    participants: <><strong>Urban/Rural industries, MSMEs, startups, R&amp;D organisations and Government laboratories,</strong> participating individually or through collaborative teams.</>,
    color: "bg-[#f0a23d]",
    background: "bg-[#fff8ed]",
  },
];

const eligibilityDetails = [
  {
    number: "IV",
    category: "Participation",
    participants: <>Individuals, groups/teams and eligible organisations may participate, subject to the specific requirements of each challenge.</>,
    color: "bg-[#7776c9]",
    background: "bg-[#f2f1fc]",
  },
  {
    number: "V",
    category: "Applicability",
    participants: <>In general, the same three participant categories will be applicable to both <strong>National-Level</strong> and <strong>Local-Level Challenges</strong>, however, may vary depending upon the problem statement.</>,
    color: "bg-[#45a77d]",
    background: "bg-[#edf9f4]",
  },
  {
    number: "VI",
    category: "Northern Region COORDINATION",
    participants: <>Participants from Jammu &amp; Kashmir, Ladakh, Himachal Pradesh, Uttarakhand, Chandigarh, NCT of Delhi, Punjab, Haryana and Uttar Pradesh are eligible to participate under the Northern Region coordinated by DTU.</>,
    color: "bg-[#e8a1a8] text-[#8d2535]",
    background: "bg-[#fff2f2]",
  },
];

const sectionHeadingClass = "t-main-heading uppercase text-[#172554]";

function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header activeNav="guidelines" />

      <main className="t-section-stack site-shell max-w-[1200px] py-10 sm:py-16">
        <section aria-labelledby="eligibility-heading">
          <h1 id="eligibility-heading" className={sectionHeadingClass}>Eligibility</h1>
          <div className="overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-[11px] leading-[1.35] sm:text-xs">
                <thead className="bg-[#f2f6fb] font-bold text-[#15213a]">
                  <tr>
                    <th className="w-14 px-3 py-2 text-center">#</th>
                    <th className="w-[27%] px-3 py-2">Category</th>
                    <th className="px-3 py-2">Eligible Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibilityRows.map((row) => (
                    <tr key={row.number} className={`${row.background} border-t-4 border-white`}>
                      <td className="px-3 py-3 text-center"><span className={`inline-flex size-5 items-center justify-center rounded-full text-[8px] font-bold text-white ${row.color}`}>{row.number}</span></td>
                      <th scope="row" className="px-3 py-3 font-bold text-[#15213a]">{row.category}</th>
                      <td className="px-3 py-3 text-[#33415c]">{row.participants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {eligibilityDetails.map((detail) => (
              <article key={detail.number} className={`flex items-start gap-4 rounded-2xl px-5 py-5 sm:gap-6 sm:px-8 sm:py-6 ${detail.background}`}>
                <span className={`mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${detail.color}`}>
                  {detail.number === "IV" ? <UsersRound size={21} strokeWidth={2.4} /> : detail.number === "V" ? <FileText size={21} strokeWidth={2.4} /> : <MapPin size={21} strokeWidth={2.4} />}
                </span>
                <div className="min-w-0 border-l border-[#dce3ef] pl-5 sm:pl-6">
                  <h3 className={`text-base font-extrabold ${detail.number === "VI" ? "text-[#e12d43]" : detail.number === "V" ? "text-[#087346]" : "text-[#172554]"}`}>{detail.category}</h3>
                  <p className="mt-1 text-sm leading-[1.45] text-[#465875]">{detail.participants}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="participate-heading">
          <h2 id="participate-heading" className={sectionHeadingClass}>How to participate</h2>
          <p className="t-content w-full text-justify text-black">
  Eligible participants can take part in the SEWA First RYIC 2026 through the structured registration journey, designed to guide them from identifying a challenge to presenting their innovation.<br />
  The registration process and key steps are outlined below:
</p>
          <div className="mt-6 overflow-hidden rounded-xl bg-white p-3 shadow-[0_8px_28px_rgba(27,44,79,0.08)] sm:mt-8 sm:p-7">
            <img src={registrationProcessImage} alt="SEWA 2026 registration process" className="mx-auto h-auto w-full" />
          </div>
        </section>

        <section aria-labelledby="submission-heading">
          <h2 id="submission-heading" className={sectionHeadingClass}>Submission format</h2>
          <p className="t-content w-full text-justify text-black">Participants are required to submit their innovation proposal in the prescribed 15-slide presentation format. The presentation should be concise, structured and focused on demonstrating the journey from problem identification to innovation, prototype development and potential impact. The prescribed slide format is appended for reference</p>
          <div className="mt-12 grid gap-8 text-base font-bold text-[#172554] sm:grid-cols-2 sm:gap-12 sm:pt-4">
            <h3>PPT FOR NATIONAL THEME</h3>
            <h3>PPT FOR REGIONAL THEME</h3>
          </div>
        </section>

        <section aria-labelledby="execution-heading">
          <h2 id="execution-heading" className={sectionHeadingClass}>Execution</h2>
          <p className="t-content w-full text-justify text-black"><strong>Delhi Technological University (DTU)</strong> is the designated Regional Coordinator for the Northern Region for the SEWA FIRST – Rashtriya Youth Innovation Challenge 2026. DTU will facilitate and coordinate participation, innovation activities and engagement of educational institutions, innovators, mentors and other stakeholders across the region, supporting the journey from problem identification and ideation to prototyping, validation and impact. Participants from <strong>Jammu &amp; Kashmir, Ladakh, Himachal Pradesh, Uttarakhand, Chandigarh, NCT of Delhi, Punjab, Haryana and Uttar Pradesh</strong> are eligible to participate under the Northern Region coordinated by DTU.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}