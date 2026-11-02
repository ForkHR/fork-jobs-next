// The home page's "How it works", told from the applicant's side in the drawings forkhr.com
// uses for its hiring story (illustrations/ in the website repo). Same hire: Jordan Lee, the
// weekend barista at Main St, from the sign in the window to the invite to Fork. Every step
// names only what the product does: the board's own form, the confirmation email, the
// interview invite with Accept and Decline, the hire sheet and the invite email.

const size = { width: 2800, height: 1576 };

export const HOW_IT_WORKS = [
  {
    src: '/illustrations/team-hiring.webp',
    ...size,
    step: 'Find',
    title: 'Every listing comes from the business itself',
    text: 'Cafés, restaurants and shops post to their own board on Fork. The QR code on the sign in the window and the search on this site open the same jobs.',
    alt: 'Illustration of a café window with a striped awning and a Now hiring sign for a barista with a QR code, beside the listing’s applicants on Fork',
  },
  {
    src: '/illustrations/hiring-apply.webp',
    ...size,
    step: 'Apply',
    title: 'Apply from your phone, no account needed',
    text: 'Your name, a resume and the listing’s own questions, then Submit. A confirmation lands in your inbox and the application goes straight to the hiring manager.',
    alt: 'Illustration of a barista listing on a phone, the Apply for this job form with a PDF resume and a shifts question, and a Thank you for applying message',
  },
  {
    src: '/illustrations/hiring-interview.webp',
    ...size,
    step: 'Interview',
    title: 'Accept the interview straight from the email',
    text: 'The invite arrives with Accept and Decline, for a visit or a video call. Your resume and answers are already in front of the hiring manager, who takes notes as you talk.',
    alt: 'Illustration of a café table with two coffees and a tablet, beside interview notes open on a question with a Strong rating',
  },
  {
    src: '/illustrations/hiring-hired.webp',
    ...size,
    step: 'Hired',
    title: 'The offer and your first day, on your phone',
    text: 'Hiring sets your pay and hours and sends your invite to the Fork app, where your schedule, timecards and onboarding paperwork live from day one.',
    alt: 'Illustration of the Hire sheet on a phone with the pay rate, the offer card marked Hired, and the invite email to Fork with a temporary password',
  },
];
