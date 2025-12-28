import { Link, useParams, useSearchParams } from "react-router-dom"
import { businessIcon, checkIcon, chevronLeftIcon, mapIcon, pdfIcon, uploadDocumentIcon } from "../assets/img/icons"
import { Button, InputRow, Icon, CheckBox, Avatar, Modal, ErrorInfo } from "../components"
import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { applyToListing, respondToInterview } from "../features/jobBoard/jobBoardSlice"
import Confetti from 'react-confetti'
import { numberFormatter, validateEmail, validatePhone } from "../assets/utils"


const RespondToInterview = ({ item }) => {
    const dispatch = useDispatch()

    const { loadingId, msg } = useSelector((state) => state.jobBoard)

    const [searchParams, setSearchParams] = useSearchParams()


    useEffect(() => {
        dispatch(respondToInterview({
            _id: item._id,
            token: searchParams.get("token"),
            response: searchParams.get("response")
        }))
    }, [])

    return (
        <Modal
            modalIsOpen
            disableClose
                    smallWindowCenter
                    headerNone
                    noTitle
                    noAction
                    dialogWindow
        >
            <div className="animation-fade-in overflow-hidden flex flex-col align-center justify-center">
                {loadingId === "respond-interview" ?
                    <ErrorInfo isLoading />
                : msg === "interview-responded" ?
                    <>
                        <div className="fs-24 weight-500 my-3 px-3 text-center">
                            Thank you for confirmation!
                        </div>
                        <div className="fs-14 weight-400 text-secondary-light text-center py-5">
                            We have {searchParams.get("response")} your interview invitation.
                        </div>
                        <Button
                            label="OK"
                            variant="filled"
                            size={"lg"}
                            onClick={() => setSearchParams({})}
                            isLoading={loadingId}
                            className="px-6 fs-16 weight-500 mt-5 w-100"
                            type="brand"
                        />
                    </>
                : 
                    <>
                        <div className="fs-14 weight-400 text-secondary-light text-center py-5">
                            {msg || "There was an issue with your request. Please try again."}
                        </div>
                        <Button
                            label="OK"
                            variant="filled"
                            size={"lg"}
                            onClick={() => setSearchParams({})}
                            isLoading={loadingId}
                            className="px-6 fs-16 weight-500 mt-5 w-100"
                            type="brand"
                        />
                    </>
                }
            </div>
        </Modal>
    )
}

const Listing = ({ item }) => {
    const dispatch = useDispatch()

    const { loadingId } = useSelector((state) => state.jobBoard)
    const [searchParams, setSearchParams] = useSearchParams()

    const [captchaPassed, setCaptchaPassed] = useState(false);
    const [captchaFailed, setCaptchaFailed] = useState(false);

    const [documentFile, setDocumentFile] = useState(null)
    const inputRef = useRef(null)
    const [submitted, setSubmitted] = useState(false)
    const [openModel, setOpenModal] = useState(true)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [answers, setAnswers] = useState([])

    const handleAnswerChange = (questionId, value, isMultipleChoice = false) => {
        setAnswers(prev => {
            const existingIndex = prev.findIndex(answer => answer.questionId === questionId)
            const answerObj = { questionId }
            
            if (isMultipleChoice) {
                answerObj.options = value
            } else {
                answerObj.answer = value
            }
            
            if (existingIndex >= 0) {
                // Update existing answer
                const updated = [...prev]
                updated[existingIndex] = answerObj
                return updated
            } else {
                // Add new answer
                return [...prev, answerObj]
            }
        })
    }

    const handleSubmit = () => {
        if (!captchaPassed) {
            alert("Please complete the CAPTCHA challenge.");
            return;
        }
        dispatch(applyToListing({
            _id: item._id,
            firstName,
            lastName,
            email,
            phone,
            file: documentFile,
            answers
        }))
        .then((res) => {
            if (res?.payload?.msg == 'ok') {
                setSubmitted(true)
            }
        })
    }

    useEffect(() => {
        if (!document.getElementById("turnstile-container")) return;

        const widgetId = turnstile.render("#turnstile-container", {
        sitekey: `${process.env.NEXT_PUBLIC_CLOUDFLARE_WIDGET_KEY}`,
            callback: function (token) {
                console.log("Success:", token);
                setCaptchaPassed(true);
                setCaptchaFailed(false);
            },
            'error-callback': function () {
                console.log("Error");
                setCaptchaFailed(true);
                setCaptchaPassed(false);
            },
            'expired-callback': function () {
                console.log("Expired");
                setCaptchaPassed(false);
                setCaptchaFailed(false);
            },
            theme: "light",
        });

        return () => {
            setCaptchaPassed(false);
            turnstile.remove(widgetId);
        }
    }, [])

    return (
        <>
        <div className="flex-2 animation-slide-in">
            <div className="flex justify-between flex-sm-col mb-6">
                <div>
                    <div className="fs-38 weight-500">
                        {item.title}
                    </div>
                    <div className="fs-24 weight-500 text-brand">
                        {item?.payRateFrom && item?.payRateFrom !== item?.payRateTo ?
                            `$${numberFormatter(item?.payRateFrom)}-${numberFormatter(item?.payRateTo)}`
                        : item?.payRateFrom ?
                            `$${numberFormatter(item?.payRateFrom)}`
                        : 'N/A'} 
                        {item?.payType ?
                        <span className="text-dark opacity-50 weight-400 fs-14">
                            /{item?.payType === 'hourly' ? 'h' : item?.payType === 'salary' ? 'y' : ''}
                        </span>
                        : null}
                    </div>
                    <div className="fs-14 weight-400 flex flex-col gap-2 mt-2">
                        <div className="flex gap-2 align-center">
                        {item.employmentType ? <>
                            <Icon
                                icon={businessIcon}
                                size="sm"
                            />
                            {item.employmentType === 'full-time' ? 'Full time' : item.employmentType === 'part-time' ? 'Part time' : null}</> : null}
                        </div>
                        <Link className={`flex gap-2 align-center pointer text-underlined-hover`}
                            to={item.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.location.address}, ${item.location.city}${item.location.state ? `, ${item.location.state}` : ''}`)}` : '#'}
                            target="_blank"
                        >
                            <Icon
                                icon={mapIcon}
                                size="sm"
                            />
                            <>
                                {item?.location ?
                                <>
                                    {`${item?.location?.address}, ${item?.location?.city}${item?.location?.state ? `, ${item?.location?.state}` : ''}`}
                                </>
                                :  "Location not specified" }
                            </>
                        </Link>
                    </div>
                </div>
                <Button
                    label="Apply"
                    variant="filled"
                    className="mt-4 px-6 fs-16 weight-500"
                    size="lg"
                    type="brand"
                    onClick={() => {
                        const element = document.getElementById("application-form");
                        if(element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                />
            </div>
            <div className="fs-14 weight-500 text-dark mt-4 reset-parent"
                dangerouslySetInnerHTML={{ __html: item.description || "<p>Job description will appear here.</p>" }}
            />
            {searchParams?.get("token") && searchParams?.get("response") && item._id ?
            <>
                <RespondToInterview item={item} />
            </>
            :
            submitted ?
            <>
                <Modal
                    modalIsOpen={openModel}
                    disableClose
                    smallWindowCenter
                    headerNone
                    noTitle
                    noAction
                    dialogWindow
                >
                    <div className="animation-fade-in overflow-hidden flex flex-col align-center justify-center">
                        <div className="fs-24 weight-500 my-3 text-center">
                            Thank you for applying!
                        </div>
                        <div className="fs-14 weight-400 text-secondary-light text-center">
                            We received your information and will contact you after looking over your application.
                        </div>
                        <Button
                            label="OK"
                            variant="filled"
                            size={"lg"}
                            onClick={() => setOpenModal(false)}
                            className="px-6 fs-16 weight-500 mt-5 w-100"
                            type="brand"
                        />
                    </div>
                </Modal>
                </>
            :
            <>
            <div className="border-top border-secondary-bg mt-6 pt-6"
                id="application-form"
            >
                <div className="fs-24 weight-500 mb-3">
                    Apply for this job
                </div>
                <div className="fs-12 weight-400 text-secondary mb-3">
                    <span className="text-danger me-2">*</span>
                    indicates a required field
                </div>
            </div>
            <div className="flex gap-4 flex-col">
                <InputRow
                    column
                    label={<>First Name <span className="text-danger">*</span></>}
                    required
                    value={firstName}
                    success={firstName ? true : false}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <InputRow
                    column
                    label={<>Last Name <span className="text-danger">*</span></>}
                    required
                    success={lastName ? true : false}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <InputRow
                    column
                    label={<>Email <span className="text-danger">*</span></>}
                    required
                    value={email}
                    success={email ? validateEmail(email) : false}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputRow
                    column
                    label={<>Phone <span className="text-danger">*</span></>}
                    required
                    success={phone ? validatePhone(phone) : false}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <InputRow
                    label="Resume/CV"
                    column
                    info="Upload a PDF file, max 5MB"
                    required
                >
                    <div className={`border border-radius h-min-200-px h-100 flex flex-col bg-contain${documentFile ? ' bg-secondary tag-success outline outline-w-1 outline-success' : ' border-dashed btn btn-outline btn-secondary'}`}
                        onClick={() => {
                            if(!documentFile) {
                                inputRef.current.click()
                            }
                        }}
                    >
                        {documentFile ?
                            <div className="flex align-center justify-between px-3 py-2 overflow-hidden gap-2 bg-success border-top-radius">
                                <div className="fs-12 text-ellipsis-1 weight-500">
                                    {documentFile?.name}
                                </div>
                                <Button
                                    label="Remove"
                                    type="secondary"
                                    variant="text"
                                    onClick={() => {
                                        setDocumentFile(null)
                                    }}
                                />
                            </div>
                        : null}
                        <div className={`flex justify-center align-center flex-1 bg-no-repeat bg-center bg-contain${documentFile ? " bg-success" : ""}`}>
                            {documentFile?.type === "application/pdf" ?
                                <Icon icon={pdfIcon} size="xl" className="fill-danger" />
                            : null }
                            <input type="file" ref={inputRef} style={{display: 'none'}}
                                accept="application/pdf"
                                onChange={(e) => {
                                    // Image, pdf, doc
                                    const validImageTypes = ['application/pdf']
                                    if(e.target.files[0] && validImageTypes.includes(e.target.files[0].type)) {
                                        if (e.target.files[0].size > 5 * 1024 * 1024) { // 5MB limit
                                            alert('File size exceeds 5MB limit');
                                            return;
                                        }
                                        setDocumentFile(e.target.files[0])
                                    } else {
                                        setDocumentFile(null)
                                    }
                                }}
                            />
                            {!documentFile ?
                                <div className="text-center flex justify-center align-center flex-col">
                                    <Icon icon={uploadDocumentIcon} size="xl" className="mb-3 fill-secondary" />
                                    <div className="fs-12 text-brand weight-500 mb-1">Upload a file</div>
                                    <div className="text-secondary fs-12 weight-400">PDF file only, max 5MB</div>
                                </div>
                            : null}
                        </div>
                    </div>
                </InputRow>
                {item.screening?.map((item, index) => {
                    return (
                        <div key={item._id}>
                            { item.questionType === 'multiple-choice' ?
                                <div
                                >
                                    <div className="fs-14 weight-500 py-2">
                                        {item.question || "No question"} {item.required ? <span className="text-danger">*</span> : null}
                                    </div>
                                    {item.metadata.options.length === 0 ?
                                        <div className="text-secondary">
                                            No options provided
                                        </div>
                                    : item.metadata.options.map((option, i) => (
                                        <div className="flex align-center border-secondary gap-2 mb-2"
                                            key={i}
                                        >
                                            <CheckBox
                                                type="brand"
                                                onClick={() => {
                                                    const existingAnswer = answers.find(ans => ans.questionId === item._id)
                                                    let currentAnswers = existingAnswer ? existingAnswer.options : []
                                                    if (currentAnswers.includes(option)) {
                                                        currentAnswers = currentAnswers.filter(ans => ans !== option)
                                                    } else {
                                                        currentAnswers = [...currentAnswers, option]
                                                    }
                                                    handleAnswerChange(item._id, currentAnswers, true)
                                                }}
                                                label={option || "No option"}
                                                checked={(() => {
                                                    const existingAnswer = answers.find(ans => ans.questionId === item._id)
                                                    return existingAnswer ? existingAnswer.options?.includes(option) : false
                                                })()}
                                            />
                                        </div>
                                    )) }
                                </div>
                            :
                            <InputRow
                                column
                                closeOnSelect
                                placeholder={item.questionType === 'text' ? "" : item.questionType === 'one-choice' ? "Select..." : ""}
                                label={<> {item.question || "No question"} {item.required ? <span className="text-danger">*</span> : null} </>}
                                required={item.required}
                                dropdown={item.questionType === 'one-choice'}
                                dropdownOptions={item.questionType === 'one-choice' ? item.metadata.options.map((option, i) => ({ label: option || `Option ${i + 1}`, value: option || `option-${i + 1}` })) : []}
                                type={item.questionType === 'text' ? 'text' : 'dropdown'}
                                value={(() => {
                                    const existingAnswer = answers.find(ans => ans.questionId === item._id)
                                    return existingAnswer ? existingAnswer.answer : ''
                                })()}
                                success={(() => {
                                    const existingAnswer = answers.find(ans => ans.questionId === item._id)
                                    const answerValue = existingAnswer ? existingAnswer.answer : ''
                                    return item.questionType === 'one-choice' ? answerValue.length > 0 : item.questionType === 'text' ? answerValue.length > 0 : false
                                })()}
                                onChange={(e) => handleAnswerChange(item._id, item.questionType === 'text' ? e.target.value : e.value, false)}
                            />
                            }
                        </div>
                    )
                })}
                <div id="turnstile-container" data-size="flexible" data-theme="light"></div>
                { captchaFailed &&
                <div className="flex justify-center"><div className="text-center tag-danger border-radius px-2 weight-500 text-danger fs-12 w-100 p-3">
                    CAPTCHA verification failed. Please try again.
                </div></div> 
                }
                <div className="flex">
                    <Button
                        label="Submit application"
                        variant="filled"
                        className="px-5 fs-14 w-100"
                        size="lg"
                        disabled={!documentFile || !firstName || !lastName || !email || !validateEmail(email) || (phone && !validatePhone(phone)) || loadingId === "apply"
                            || item.screening.some((question) => {
                                if (!question.required) return false
                                const existingAnswer = answers.find(ans => ans.questionId === question._id)
                                if (!existingAnswer) return true
                                
                                if (question.questionType === 'multiple-choice') {
                                    return !existingAnswer.options || existingAnswer.options.length === 0
                                } else {
                                    return !existingAnswer.answer || existingAnswer.answer.length === 0
                                }
                            })
                            || !captchaPassed
                        }
                        isLoading={loadingId === "apply"}
                        type="brand"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
            </>
            }
        </div>
        </>
    )
}


const ListingDetailed = () => {
    const { listingId, companyPublicUrl } = useParams();

    const { listings } = useSelector((state) => state.jobBoard)

    const foundListing = useMemo(() => {
        return listings.find(listing => listing._id === listingId)
    }, [listings, listingId])

    useEffect(() => {
        const element = document.getElementById("listing-detailed");
        if(element) {
            element.scrollIntoView({ behavior: "instant"});
        }

    }, [listingId])

    return (
        <div
            id="listing-detailed"
        >
            <Link className="flex align-center py-5 hover-opacity-50"
                to={`/${companyPublicUrl}`}
            >
                <Icon icon={chevronLeftIcon} size="sm"/>
                <span className="fs-14 weight-500 text-underlined">Back to all listings</span>
            </Link>
            {foundListing ?
                <Listing item={foundListing}/>
            :
                <div className="fs-24 weight-500 py-6">
                    Listing not found.
                </div>
            }
        </div>
    )
}


export default ListingDetailed