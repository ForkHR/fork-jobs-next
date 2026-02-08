import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Legacy /company/:slug/jobs → redirect to /boards/:slug for SEO continuity
export default async function CompanyJobBoardPage({ params }) {
  const { companySlug } = await params;
  redirect(`/boards/${encodeURIComponent(companySlug || '')}`);
}
