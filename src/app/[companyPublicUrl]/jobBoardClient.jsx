'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Tooltip } from 'react-tooltip';

import { logoFullSvg } from '../../assets/img/logo';
import { Avatar, Button, CheckBox, Icon, InputSearch, Alerts, IsOffline } from '../../components';
import { arrowDownShortIcon, leftArrowIcon, rightArrowPointIcon } from '../../assets/img/icons';
import { convertHexToRgba, numberFormatter, returnColorLum } from '../../assets/utils';
import FilterDropdown from '../../components/ui/FilterDropdown';
import { DateTime } from 'luxon';
import jobBoardService from '../../features/jobBoard/jobBoardService';

const normalizeJobBoardPayload = (payload) => {
  if (!payload) return { company: null, listings: [] };

  if (payload.company && Array.isArray(payload.listings)) return payload;
  if (payload.data && payload.data.company && Array.isArray(payload.data.listings)) return payload.data;

  return payload;
};


function JobListing({ item, companyPublicUrl }) {
  return (
    <Link href={`/${companyPublicUrl}/${item._id}`}>
      <div className="border-bottom py-5 transition-shadow pointer display-on-hover-parent transition-slide-right-hover-parent animation-slide-in">
        <div className="flex justify-between">
          <div>
            <div className="fs-12 weight-00 flex gap-1 mt-1 text-capitalize">{item?.employmentType ? `${item?.employmentType}` : ''}</div>
            <div className="fs-20 weight-500 flex-1 align-center flex py-3">
              {item.title}
              {DateTime.fromISO(item.updatedAt) >= DateTime.now().minus({ days: 4 }) ? (
                <span className="fs-12 tag-brand ms-2 px-2 p-xs border-radius-sm">New</span>
              ) : null}
            </div>
            <div className="fs-12 weight-400 flex gap-1 mt-1 text-capitalize">
              {item?.location
                ? `${item?.location?.address}, ${item?.location?.city}${item?.location?.state ? `, ${item?.location?.state}` : ''}`
                : 'N/A'}
            </div>
          </div>
          <div className="flex flex-col flex-no-wrap justify-end">
            <div className="bg-secondary border-radius-50 p-2 display-on-hover transition-slide-right-hover">
              <Icon icon={rightArrowPointIcon} size={'sm'} className="" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Jobs({ items, companyPublicUrl }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const availableLocations = useMemo(() => {
    const locs = [];
    items.forEach((item) => {
      if (item.location && !locs.find((l) => l._id === item.location._id)) {
        locs.push(item.location);
      }
    });
    return locs;
  }, [items]);

  const availableCategories = useMemo(() => {
    const cats = [];
    items.forEach((item) => {
      const cat = item.category;
      if (cat && !cats.find((c) => c._id === cat._id)) {
        cats.push(cat);
      }
    });
    return cats;
  }, [items]);

  const filteredItems = useMemo(() => {
    let out = items;
    if (search) {
      out = out.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (category) {
      out = out.filter((item) => item?.category?.toLowerCase() === category?.toLowerCase());
    }
    if (type) {
      out = out.filter((item) => item?.employmentType?.toLowerCase() === type?.toLowerCase());
    }
    if (selectedLocation) {
      out = out.filter((item) => item.location && item.location._id === selectedLocation._id);
    }
    return out;
  }, [items, search, category, type, selectedLocation]);

  return (
    <>
      <div className="bg-secondary">
        <div className="flex-1 w-max-600-px mx-auto w-100">
          <div className="flex container pt-3 pb-4 gap-2 flex-col align-start animation-slide-in">
            <div className="flex justify-between w-100"
                style={{
                    minHeight: "16px"
                }}
            >
              <div className="fs-12 px-2">
                {filteredItems.length} {filteredItems.length === 1 ? 'job' : 'jobs'} found
              </div>
              {(search || selectedLocation || type || category) && (
                <Button
                  label="RESET FILTERS"
                  variant="link"
                  type="brand"
                  className="flex-shrink-0 fs-12 weight-600"
                  onClick={() => {
                    setSearch('');
                    setCategory('');
                    setSelectedLocation(null);
                    setType('');
                  }}
                />
              )}
            </div>
            <InputSearch
              placeholder="Search"
              className="w-100"
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              clearable
            />
            <div className="flex justify-between gap-2 align-center flex-1 w-sm-100">
              <div className="flex gap-2 align-center flex-wrap">
                <FilterDropdown
                  hideAppliedText
                  label="Location"
                  hideLabel
                  appliedText={selectedLocation ? selectedLocation.name : 'Locations'}
                  showFilteredLabel
                  applied={selectedLocation ? [selectedLocation.name] : []}
                  closeOnSelect
                  classNameParent="flex-1 flex-shrink-0 p-0"
                >
                  {availableLocations.map((location) => (
                    <div
                      key={location._id}
                      className={`flex align-center justify-between pointer text-brand-hover bg-secondary-hover flex-shrink-0${selectedLocation?._id === location._id ? ' text-brand' : ''}`}
                      onClick={() => {
                        if (selectedLocation?._id === location._id) {
                          setSelectedLocation(null);
                        } else {
                          setSelectedLocation(location);
                        }
                      }}
                    >
                      <span className="text-ellipsis-1 fs-sm-14 fs-12 weight-500 py-2 px-3 w-100">{location.address}</span>
                      <CheckBox checked={selectedLocation?._id === location._id} rounded radio type="brand" />
                    </div>
                  ))}
                </FilterDropdown>

                <FilterDropdown
                  hideAppliedText
                  label="Category"
                  hideLabel
                  showFilteredLabel
                  appliedText={category ? category : 'Category'}
                  applied={category ? [category] : []}
                  closeOnSelect
                  classNameParent="flex-1 flex-shrink-0 text-capitalize"
                >
                  {availableCategories.map((t) => (
                    <div
                      className={`flex align-center justify-between pointer text-brand-hover bg-secondary-hover text-capitalize flex-shrink-0${category === t ? ' text-brand' : ''}`}
                      onClick={() => {
                        if (category === t) {
                          setCategory('');
                        } else {
                          setCategory(t);
                        }
                      }}
                      key={t}
                    >
                      <span className="text-ellipsis-1 fs-sm-14 fs-12 weight-500 py-2 px-3 w-100">{t}</span>
                      <CheckBox checked={t === category} rounded radio type="brand" />
                    </div>
                  ))}
                </FilterDropdown>

                <FilterDropdown
                  hideAppliedText
                  label="Type"
                  hideLabel
                  showFilteredLabel
                  appliedText={type ? type : 'Employment'}
                  applied={type ? [type] : []}
                  closeOnSelect
                  classNameParent="flex-1 flex-shrink-0"
                >
                  {['Full-time', 'Part-time'].map((t) => (
                    <div
                      className={`flex align-center justify-between pointer text-brand-hover bg-secondary-hover flex-shrink-0${type === t ? ' text-brand' : ''}`}
                      onClick={() => {
                        if (type === t) {
                          setType('');
                        } else {
                          setType(t);
                        }
                      }}
                      key={t}
                    >
                      <span className="text-ellipsis-1 fs-sm-14 fs-12 weight-500 py-2 px-3 w-100">{t}</span>
                      <CheckBox checked={t === type} rounded radio type="brand" />
                    </div>
                  ))}
                </FilterDropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex-1" id="job-listings">
        <div className="w-max-600-px mx-auto w-100 h-min-400-px">
          {filteredItems && filteredItems.length > 0 ? (
            <div className="flex flex-col gap-3 container">
              {filteredItems.map((item) => (
                <JobListing key={item._id} item={item} companyPublicUrl={companyPublicUrl} />
              ))}
            </div>
          ) : (
            <div className="fs-14 mt-4 text-center py-6 container">No results found.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default function JobBoardClient({ companyPublicUrl, company: initialCompany, listings: initialListings }) {
  const [company, setCompany] = useState(initialCompany ?? null);
  const [listings, setListings] = useState(Array.isArray(initialListings) ? initialListings : []);
  const [isLoading, setIsLoading] = useState(!initialCompany);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    setCompany(initialCompany ?? null);
    setListings(Array.isArray(initialListings) ? initialListings : []);
    setIsLoading(!initialCompany);
  }, [initialCompany, initialListings]);

  useEffect(() => {
    setLoadError(null);
  }, [companyPublicUrl]);

  useEffect(() => {
    if (!companyPublicUrl) return;
    if (company) return;

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    jobBoardService
      .getCompanyJobs(companyPublicUrl)
      .then((payload) => {
        if (cancelled) return;
        const normalized = normalizeJobBoardPayload(payload);
        setCompany(normalized?.company ?? null);
        setListings(Array.isArray(normalized?.listings) ? normalized.listings : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [companyPublicUrl, company]);

  useEffect(() => {
    if (!company) return;

    try {
      const jobsQty = Array.isArray(listings) ? listings.length : 0;
      const companyName = company?.name || 'Company';
      document.title = `Work at ${companyName} - ${jobsQty} open jobs | Fork Jobs`;
    } catch {
      // ignore title errors
    }

    // Set the brand color CSS custom property
    if (company.brandColor) {
      document.documentElement.style.setProperty('--color-brand', company.brandColor);
      document.documentElement.style.setProperty('--color-brand-text', company.brandColor);
      document.documentElement.style.setProperty('--color-brand-bg', convertHexToRgba(company.brandColor, 0.1));
      document?.body?.setAttribute('data-theme', returnColorLum(company?.brandColor) <= 0.5 ? 'light' : 'dark');
    }

    window.scrollTo(0, 0);
  }, [company, listings]);

  const publicS3 = process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL;

  if (!company && isLoading) {
    return (
      <section className="page-body h-100">
        <div className="animation-fade-in flex flex-col h-100">
          <Alerts />
          <IsOffline />
          <div className="flex-1 flex align-center justify-center container fs-14 py-6">Loading job board…</div>
        </div>
      </section>
    );
  }

  if (!company && loadError) {
    return (
      <section className="page-body h-100">
        <div className="animation-fade-in flex flex-col h-100">
          <Alerts />
          <IsOffline />
          <div className="flex-1 flex flex-col align-center justify-center container fs-14 py-6 text-center">
            <div className="weight-600 pb-2">Unable to load this job board.</div>
            <div className="opacity-75">Please refresh the page and try again.</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-body h-100">
      <div className="animation-fade-in flex flex-col h-100">
        <Alerts />
        <IsOffline />

        <Tooltip
          id="tooltip-default"
          className="z-999 w-max-200-px d-sm-none"
          place="bottom"
          closeOnEsc
          closeOnScroll
          globalCloseEvents="click"
          positionStrategy="fixed"
          opacity="0.95"
          noArrow
        />
        <Tooltip
          id="tooltip-hover"
          className="z-999 w-max-200-px d-sm-none"
          place="bottom"
          closeOnEsc
          closeOnScroll
          globalCloseEvents="click"
          positionStrategy="fixed"
          opacity="0.95"
          noArrow
        />

        <div className="flex-1 flex flex-col">
          <div className="bg-brand text-light container py-6 flex flex-col justify-center align-center h-min-400-px">
            <div
              className="weight-400 fs-sm-48 text-center weight-500 pb-6 w-max-sm py-sm-4 line-height-1-3 animation-slide-in w-max-md"
              style={{
                fontSize: 'clamp(32px, 8vw, 96px)',
              }}
            >
              Work at {company?.name}
            </div>
            <div
              className="pointer clickable px-5 py-2 fs-20 weight-500 hover-opacity-75 border-radius-rounded animation-slide-in"
              style={{
                background: 'white',
                color: '#333',
              }}
              onClick={() => {
                const element = document.getElementById('job-listings');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <div className="flex align-center justify-between gap-2 text-brand">
                {`${numberFormatter(listings?.length)} OPEN ${listings?.length === 1 ? 'JOB' : 'JOBS'}`}
                <Icon icon={arrowDownShortIcon} className="fs-24 weight-500 fill-brand" />
              </div>
            </div>
          </div>

          <div className="w-max-600-px mx-auto w-100 py-5 animation-slide-in">
            <div className="container">
              <Avatar
                img={
                  company?.logo && publicS3
                    ? `${publicS3}/${company?.logo}`
                    : `https://ui-avatars.com/api/?name=${company?.name?.slice(0, 2)}&bold=true`
                }
                name={company?.name}
                alt={company?.name}
                width={60}
                height={60}
                avatarColor={company.name.length}
                len={2}
                borderRadiusNone
              />
              <div className="fs-24 py-3">{company?.name}</div>
              <div className="flex align-center gap-1 fs-14">{company?.description}</div>
            </div>
          </div>

          {listings && listings.length === 0 ? (
            <div className="flex-1 w-max-600-px mx-auto w-100">
              <div className="container fs-14 mt-4">There are currently no job openings.</div>
            </div>
          ) : listings && listings.length > 0 ? (
            <Jobs items={listings} companyPublicUrl={companyPublicUrl} />
          ) : null}

          <div className="mt-6 py-2">
            <div className="flex align-center justify-center gap-3">
              <div className="fs-12 text-brand weight-500">Powered by</div>
              <a className="flex flex-col justify-center" href="https://forkhr.com" target="_blank" rel="noreferrer">
                <div
                  className="flex bg-white p-2 border-radius"
                  style={{
                    maxWidth: '60px',
                    minWidth: '60px',
                    width: '100%',
                  }}
                >
                  {logoFullSvg}
                </div>
              </a>
            </div>
            <div className="flex align-center justify-center gap-1 pt-2 bg-sm-main">
              <a
                href="https://forkhr.com/privacy-policy"
                className="text-dark fs-12 text-underlined-hover weight-500"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </a>
              <span className="fs-12  opacity-50">•</span>
              <a
                href="https://forkhr.com/terms-of-service"
                className="text-dark fs-12 text-underlined-hover weight-500"
                target="_blank"
                rel="noreferrer"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <Tooltip
          id="tooltip-click"
          className="z-999 w-max-200-px text-wrap-anywhere"
          place="bottom"
          closeOnEsc
          openOnClick
          closeOnScroll
          positionStrategy="fixed"
          opacity="0.95"
          noArrow
        />
      </div>
    </section>
  );
}
