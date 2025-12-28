import Link from 'next/link';
import { logoFullSvg } from '../assets/img/logo';

export default function NotFound() {
  return (
    <div className="container h-100 flex flex-col">
      <div className="sticky top-0 z-10 bg-main w-max-600-px mx-auto w-100">
        <div className="py-4 px-3 flex justify-between align-center">
          <div className="flex-1 flex flex-col justify-center">
            <a
              className="flex"
              style={{
                maxWidth: '100px',
              }}
              href="https://forkhr.com"
            >
              {logoFullSvg}
            </a>
          </div>
        </div>
      </div>
      <div className="flex-1 align-center justify-center flex flex-col">
        <div className="flex pt-6 mt-6 justify-center">
            <div className="fs-38 border-right px-4 weight-500">404</div>
            <div className="flex flex-col justify-center px-4">
            <div className="fs-14 weight-500">Page not found</div>
            </div>
        </div>
        <div className="fs-12 text-center my-4 px-3">The job board you were viewing is no longer active.</div>
        <div className="text-center">
            <Link className="text-underlined fs-12 weight-600 p-3 border-radius bg-secondary-hover" href="https://forkhr.com">
            Go to Fork
            </Link>
        </div>
      </div>
    </div>
  );
}
