'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Tooltip } from 'react-tooltip';
import Confetti from 'react-confetti';

import { logoFullSvg } from '../../../assets/img/logo';
import {
  businessIcon,
  chevronLeftIcon,
  mapIcon,
  pdfIcon,
  uploadDocumentIcon,
  leftArrowIcon,
} from '../../../assets/img/icons';
import { Button, CheckBox, Icon, InputRow, Modal, ErrorInfo, Alerts, IsOffline } from '../../../components';
import { numberFormatter, validateEmail, validatePhone, convertHexToRgba, returnColorLum } from '../../../assets/utils';
import jobBoardService from '../../../features/jobBoard/jobBoardService';
import { toast } from 'react-toastify';

function RespondToInterview({ item }) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        await jobBoardService.respondToInterview({
          _id: item._id,
          token: searchParams.get('token'),
          response: searchParams.get('response'),
        });
        if (!cancelled) {
          setMsg('interview-responded');
        }
      } catch (e) {
        if (!cancelled) {
          setMsg(e?.message || 'There was an issue with your request. Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [item._id, searchParams]);

  return (
    <Modal modalIsOpen disableClose smallWindowCenter headerNone noTitle noAction dialogWindow>
      <div className="animation-fade-in overflow-hidden flex flex-col align-center justify-center">
        {loading ? (
          <ErrorInfo isLoading />
        ) : msg === 'interview-responded' ? (
          <>
            <div className="fs-24 weight-500 my-3 px-3 text-center">Thank you for confirmation!</div>
            <div className="fs-14 weight-400 text-secondary-light text-center py-5">
              We have {searchParams.get('response')} your interview invitation.
            </div>
            <Button
              label="OK"
              variant="filled"
              size={'lg'}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('token');
                url.searchParams.delete('response');
                window.history.replaceState({}, '', url.toString());
              }}
              className="px-6 fs-16 weight-500 mt-5 w-100"
              type="brand"
            />
          </>
        ) : (
          <>
            <div className="fs-14 weight-400 text-secondary-light text-center py-5">
              {msg || 'There was an issue with your request. Please try again.'}
            </div>
            <Button
              label="OK"
              variant="filled"
              size={'lg'}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('token');
                url.searchParams.delete('response');
                window.history.replaceState({}, '', url.toString());
              }}
              className="px-6 fs-16 weight-500 mt-5 w-100"
              type="brand"
            />
          </>
        )}
      </div>
    </Modal>
  );
}

function Listing({ item }) {
  const searchParams = useSearchParams();

  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [captchaFailed, setCaptchaFailed] = useState(false);

  const [documentFile, setDocumentFile] = useState(null);
  const inputRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [openModel, setOpenModal] = useState(true);

  const [loadingId, setLoadingId] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [answers, setAnswers] = useState([]);

  const handleAnswerChange = (questionId, value, isMultipleChoice = false) => {
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((answer) => answer.questionId === questionId);
      const answerObj = { questionId };

      if (isMultipleChoice) {
        answerObj.options = value;
      } else {
        answerObj.answer = value;
      }

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = answerObj;
        return updated;
      }

      return [...prev, answerObj];
    });
  };

  const handleSubmit = async () => {
    if (!captchaPassed) {
      alert('Please complete the CAPTCHA challenge.');
      return;
    }

    setLoadingId('apply');
    try {
      const res = await jobBoardService.applyToListing({
        _id: item._id,
        firstName,
        lastName,
        email,
        phone,
        file: documentFile,
        answers,
      });
      if (res?.msg === 'ok' || res?.payload?.msg === 'ok') {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch (e) {
      toast.error(e?.message || 'Could not submit application.', { toastId: 'toastDanger', closeButton: true });
    } finally {
      setLoadingId('');
    }
  };

  useEffect(() => {
    if (!document.getElementById('turnstile-container')) return;

    const sitekey = process.env.NEXT_PUBLIC_CLOUDFLARE_WIDGET_KEY;
    if (!sitekey) {
      setCaptchaFailed(true);
      return;
    }

    let widgetId;
    let cancelled = false;

    const tryRender = () => {
      if (cancelled) return;
      if (!window.turnstile) {
        setTimeout(tryRender, 50);
        return;
      }

      widgetId = window.turnstile.render('#turnstile-container', {
        sitekey: `${sitekey}`,
        callback: function () {
          setCaptchaPassed(true);
          setCaptchaFailed(false);
        },
        'error-callback': function () {
          setCaptchaFailed(true);
          setCaptchaPassed(false);
        },
        'expired-callback': function () {
          setCaptchaPassed(false);
          setCaptchaFailed(false);
        },
        theme: 'light',
      });
    };

    tryRender();

    return () => {
      cancelled = true;
      setCaptchaPassed(false);
      if (window.turnstile && widgetId != null) {
        window.turnstile.remove(widgetId);
      }
    };
  }, []);

  const isInterviewResponse = searchParams?.get('token') && searchParams?.get('response') && item._id;

  return (
    <>
      <div className="flex-2 animation-slide-in">
        <div className="flex justify-between flex-sm-col mb-6">
          <div>
            <div className="fs-38 weight-500">{item.title}</div>
            <div className="fs-24 weight-500 text-brand">
              {item?.payRateFrom && item?.payRateFrom !== item?.payRateTo
                ? `$${numberFormatter(item?.payRateFrom)}-${numberFormatter(item?.payRateTo)}`
                : item?.payRateFrom
                  ? `$${numberFormatter(item?.payRateFrom)}`
                  : 'N/A'}
              {item?.payType ? (
                <span className="text-dark opacity-50 weight-400 fs-14">/{item?.payType === 'hourly' ? 'h' : item?.payType === 'salary' ? 'y' : ''}</span>
              ) : null}
            </div>
            <div className="fs-14 weight-400 flex flex-col gap-2 mt-2">
              <div className="flex gap-2 align-center">
                {item.employmentType ? (
                  <>
                    <Icon icon={businessIcon} size="sm" />
                    {item.employmentType === 'full-time' ? 'Full time' : item.employmentType === 'part-time' ? 'Part time' : null}
                  </>
                ) : null}
              </div>
              <a
                className={`flex gap-2 align-center pointer text-underlined-hover`}
                href={
                  item.location
                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.location.address}, ${item.location.city}${item.location.state ? `, ${item.location.state}` : ''}`)}`
                    : '#'
                }
                target="_blank"
                rel="noreferrer"
              >
                <Icon icon={mapIcon} size="sm" />
                <>{item?.location ? `${item?.location?.address}, ${item?.location?.city}${item?.location?.state ? `, ${item?.location?.state}` : ''}` : 'Location not specified'}</>
              </a>
            </div>
          </div>
          {submitted ? null : (
          <Button
            label="Apply"
            variant="filled"
            className="mt-4 px-6 fs-16 weight-600 w-min-100-px"
            size="lg"
            type="brand"
            onClick={() => {
              const element = document.getElementById('application-form');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        )}
        </div>

        <div className="fs-14 weight-500 text-dark mt-4 reset-parent" dangerouslySetInnerHTML={{ __html: item.description || '<p>Job description will appear here.</p>' }} />

        {isInterviewResponse ? <RespondToInterview item={item} /> : null}

        {submitted ? (
          <>
            <Modal modalIsOpen={openModel} disableClose smallWindowCenter headerNone noTitle noAction dialogWindow>
              <div className="animation-fade-in overflow-hidden flex flex-col align-center justify-center">
                <div className="fs-24 weight-500 my-3 text-center">Thank you for applying!</div>
                <div className="fs-14 weight-400 text-secondary-light text-center">
                  We received your information and will contact you after looking over your application.
                </div>
                <Button
                  label="OK"
                  variant="filled"
                  size={'lg'}
                  onClick={() => setOpenModal(false)}
                  className="px-6 fs-16 weight-500 mt-5 w-100"
                  type="brand"
                />
              </div>
            </Modal>
          </>
        ) : (
          <>
            <div className="border-top border-secondary-bg mt-6 pt-6" id="application-form">
              <div className="fs-24 weight-500 mb-3">Apply for this job</div>
              <div className="fs-12 weight-400 text-secondary mb-3">
                <span className="text-danger me-2">*</span>
                indicates a required field
              </div>
            </div>

            <div className="flex gap-4 flex-col">
              <InputRow
                column
                label={
                  <>
                    First Name <span className="text-danger">*</span>
                  </>
                }
                required
                value={firstName}
                success={firstName ? true : false}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <InputRow
                column
                label={
                  <>
                    Last Name <span className="text-danger">*</span>
                  </>
                }
                required
                success={lastName ? true : false}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <InputRow
                column
                label={
                  <>
                    Email <span className="text-danger">*</span>
                  </>
                }
                required
                value={email}
                success={email ? validateEmail(email) : false}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputRow
                column
                label={
                  <>
                    Phone <span className="text-danger">*</span>
                  </>
                }
                required
                success={phone ? validatePhone(phone) : false}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <InputRow label="Resume/CV" column info="Upload a PDF file, max 5MB" required>
                <div
                  className={`border border-radius h-set-200-px overflow-hidden h-100 flex flex-col bg-contain${documentFile ? ' bg-secondary tag-success outline outline-w-1 outline-success' : ' border-dashed border border-w-2 border-secondary color-border-on-hover-brand pointer'}`}
                  onClick={() => {
                    if (!documentFile) {
                      inputRef.current.click();
                    }
                  }}
                >
                  {documentFile ? (
                    <div className="flex align-center justify-between px-3 py-2 overflow-hidden gap-2 bg-success border-top-radius">
                      <div className="fs-12 text-ellipsis-1 weight-500">{documentFile?.name}</div>
                      <Button
                        label="Remove"
                        type="secondary"
                        variant="text"
                        onClick={() => {
                          setDocumentFile(null);
                        }}
                      />
                    </div>
                  ) : null}
                  <div className={`flex justify-center align-center flex-1 bg-no-repeat bg-center bg-contain${documentFile ? ' bg-success' : ''}`}>
                    {documentFile?.type === 'application/pdf' ? <Icon icon={pdfIcon} size="xl" className="fill-danger" /> : null}
                    <input
                      type="file"
                      ref={inputRef}
                      style={{ display: 'none' }}
                      accept="application/pdf"
                      onChange={(e) => {
                        const validImageTypes = ['application/pdf'];
                        if (e.target.files[0] && validImageTypes.includes(e.target.files[0].type)) {
                          if (e.target.files[0].size > 5 * 1024 * 1024) {
                            alert('File size exceeds 5MB limit');
                            return;
                          }
                          setDocumentFile(e.target.files[0]);
                        } else {
                          setDocumentFile(null);
                        }
                      }}
                    />
                    {!documentFile ? (
                      <div className="text-center flex justify-center align-center flex-col">
                        <Icon icon={uploadDocumentIcon} size="xl" className="mb-3 fill-secondary" />
                        <div className="fs-12 text-brand weight-500 mb-1">Upload a file</div>
                        <div className="text-secondary fs-12 weight-400">PDF file only, max 5MB</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </InputRow>

              {item.screening?.map((q) => (
                <div key={q._id}>
                  {q.questionType === 'multiple-choice' ? (
                    <div>
                      <div className="fs-14 weight-500 py-2">
                        {q.question || 'No question'} {q.required ? <span className="text-danger">*</span> : null}
                      </div>
                      {q.metadata.options.length === 0 ? (
                        <div className="text-secondary">No options provided</div>
                      ) : (
                        q.metadata.options.map((option, i) => (
                          <div className="flex align-center border-secondary gap-2 mt-2" key={i}>
                            <CheckBox
                              type="brand"
                              onClick={() => {
                                const existingAnswer = answers.find((ans) => ans.questionId === q._id);
                                let currentAnswers = existingAnswer ? existingAnswer.options : [];
                                if (currentAnswers.includes(option)) {
                                  currentAnswers = currentAnswers.filter((ans) => ans !== option);
                                } else {
                                  currentAnswers = [...currentAnswers, option];
                                }
                                handleAnswerChange(q._id, currentAnswers, true);
                              }}
                              label={option || 'No option'}
                              checked={(() => {
                                const existingAnswer = answers.find((ans) => ans.questionId === q._id);
                                return existingAnswer ? existingAnswer.options?.includes(option) : false;
                              })()}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <InputRow
                      column
                      closeOnSelect
                      placeholder={q.questionType === 'text' ? '' : q.questionType === 'one-choice' ? 'Select...' : ''}
                      label={
                        <>
                          {' '}
                          {q.question || 'No question'} {q.required ? <span className="text-danger">*</span> : null}{' '}
                        </>
                      }
                      required={q.required}
                      dropdown={q.questionType === 'one-choice'}
                      dropdownOptions={
                        q.questionType === 'one-choice'
                          ? q.metadata.options.map((option, i) => ({ label: option || `Option ${i + 1}`, value: option || `option-${i + 1}` }))
                          : []
                      }
                      type={q.questionType === 'text' ? 'textarea' : 'dropdown'}
                      value={(() => {
                        const existingAnswer = answers.find((ans) => ans.questionId === q._id);
                        return existingAnswer ? existingAnswer.answer : '';
                      })()}
                      success={(() => {
                        const existingAnswer = answers.find((ans) => ans.questionId === q._id);
                        const answerValue = existingAnswer ? existingAnswer.answer : '';
                        return q.questionType === 'one-choice' ? answerValue.length > 0 : q.questionType === 'text' ? answerValue.length > 0 : false;
                      })()}
                      onChange={(e) => handleAnswerChange(q._id, q.questionType === 'text' ? e.target.value : e.value, false)}
                    />
                  )}
                </div>
              ))}

              <div id="turnstile-container" data-size="flexible" data-theme="light"></div>
              {captchaFailed ? (
                <div className="flex justify-center">
                  <div className="text-center tag-danger border-radius px-2 weight-500 text-danger fs-12 w-100 p-3">
                    CAPTCHA verification failed. Please try again.
                  </div>
                </div>
              ) : null}
              <div className="flex">
                <Button
                  label="Submit application"
                  variant="filled"
                  className="px-5 fs-14 w-100"
                  size="lg"
                  disabled={
                    !documentFile ||
                    !firstName ||
                    !lastName ||
                    !email ||
                    !validateEmail(email) ||
                    (phone && !validatePhone(phone)) ||
                    loadingId === 'apply' ||
                    item.screening.some((question) => {
                      if (!question.required) return false;
                      const existingAnswer = answers.find((ans) => ans.questionId === question._id);
                      if (!existingAnswer) return true;

                      if (question.questionType === 'multiple-choice') {
                        return !existingAnswer.options || existingAnswer.options.length === 0;
                      }

                      return !existingAnswer.answer || existingAnswer.answer.length === 0;
                    }) ||
                    !captchaPassed
                  }
                  isLoading={loadingId === 'apply'}
                  type="brand"
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const normalizeJobBoardPayload = (payload) => {
  if (!payload) return { company: null, listings: [] };

  if (payload.company && Array.isArray(payload.listings)) return payload;
  if (payload.data && payload.data.company && Array.isArray(payload.data.listings)) return payload.data;

  return payload;
};


export default function ListingPageClient({ companyPublicUrl, listingId, company: initialCompany, listing: initialListing }) {
  const [company, setCompany] = useState(initialCompany ?? null);
  const [listing, setListing] = useState(initialListing ?? null);
  const [isLoading, setIsLoading] = useState(!initialCompany || !initialListing);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    setCompany(initialCompany ?? null);
    setListing(initialListing ?? null);
    setIsLoading(!initialCompany || !initialListing);
  }, [initialCompany, initialListing]);

  useEffect(() => {
    setLoadError(null);
  }, [companyPublicUrl, listingId]);

  useEffect(() => {
    if (!companyPublicUrl || !listingId) return;
    if (company && listing) return;

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    jobBoardService
      .getCompanyJobs(companyPublicUrl)
      .then((payload) => {
        if (cancelled) return;
        const normalized = normalizeJobBoardPayload(payload);
        const nextCompany = normalized?.company ?? null;
        const nextListings = Array.isArray(normalized?.listings) ? normalized.listings : [];
        const nextListing = nextListings.find((l) => String(l?._id) === String(listingId)) ?? null;

        setCompany(nextCompany);
        setListing(nextListing);
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
  }, [companyPublicUrl, listingId, company, listing]);

  useEffect(() => {
    if (!company) return;

    try {
      const companyName = company?.name || 'Company';
      if (listing?.title) {
        document.title = `Apply for ${listing.title} position at ${companyName} | Fork Jobs`;
      } else {
        document.title = `Apply for a job at ${companyName} | Fork Jobs`;
      }
    } catch {
      // ignore title errors
    }

    if (company.brandColor) {
      document.documentElement.style.setProperty('--color-brand', company.brandColor);
      document.documentElement.style.setProperty('--color-brand-text', company.brandColor);
      document.documentElement.style.setProperty('--color-brand-bg', convertHexToRgba(company.brandColor, 0.1));
      document?.body?.setAttribute('data-theme', returnColorLum(company?.brandColor) <= 0.5 ? 'light' : 'dark');
    }

    const element = document.getElementById('listing-detailed');
    if (element) {
      element.scrollIntoView({ behavior: 'instant' });
    }
  }, [company, listing]);

  if ((!company || !listing) && isLoading) {
    return (
      <section className="page-body h-100">
        <div className="animation-fade-in flex flex-col h-100">
          <Alerts />
          <IsOffline />
          <div className="flex-1 flex align-center justify-center container fs-14 py-6">Loading job…</div>
        </div>
      </section>
    );
  }

  if ((!company || !listing) && loadError) {
    return (
      <section className="page-body h-100">
        <div className="animation-fade-in flex flex-col h-100">
          <Alerts />
          <IsOffline />
          <div className="flex-1 flex flex-col align-center justify-center container fs-14 py-6 text-center">
            <div className="weight-600 pb-2">Unable to load this job.</div>
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
            <h1
              className="weight-400 fs-sm-48 text-center weight-500 pb-6 w-max-sm py-sm-4 line-height-1-3 animation-slide-in w-max-md"
              style={{
                fontSize: 'clamp(32px, 7vw, 58px)',
              }}
            >
              Work at {company?.name}
            </h1>
            <Link
              className="pointer clickable px-5 py-2 fs-20 weight-500 hover-opacity-75 border-radius-rounded animation-slide-in"
              style={{
                background: 'white',
                color: '#333',
              }}
              href={`/${companyPublicUrl}`}
            >
              <div className="flex align-center justify-between gap-2 text-brand">
                <Icon icon={leftArrowIcon} className="fs-24 weight-500 fill-brand" />
                VIEW ALL JOBS
              </div>
            </Link>
          </div>

          <div className="container flex-1">
            <div className="w-max-600-px mx-auto w-100" id="listing-detailed">
              <Link className="flex align-center py-5 hover-opacity-50" href={`/${companyPublicUrl}`}>
                <Icon icon={chevronLeftIcon} size="sm" />
                <span className="fs-14 weight-500 text-underlined">Back to all listings</span>
              </Link>

              <Listing item={listing} />
            </div>
          </div>

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
