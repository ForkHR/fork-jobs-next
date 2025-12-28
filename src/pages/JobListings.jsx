import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getCompanyJobs } from "../features/jobBoard/jobBoardSlice"
import { logoFullSvg } from "../assets/img/logo"
import { Avatar, Button, CheckBox, Icon, Input, InputSearch } from "../components"
import { arrowDownShortIcon, chevronDownIcon, chevronLeftIcon, chevronRightIcon, leftArrowIcon, locationIcon, rightArrowPointIcon } from "../assets/img/icons"
import { convertHexToRgba, numberFormatter, returnColorLum } from "../assets/utils"
import ListingDetailed from "./ListingDetailed"
import FilterDropdown from "../components/ui/FilterDropdown"
import { DateTime } from "luxon"


const JobListing = ({item}) => {
    const { companyPublicUrl } = useParams()

    const { company } = useSelector((state) => state.jobBoard)

    return (
        <>
        <Link
            to={`/${companyPublicUrl}/${item._id}`}
        >
            <div className="border-bottom py-5 transition-shadow pointer display-on-hover-parent transition-slide-right-hover-parent animation-slide-in">
                <div className="flex justify-between">
                    <div>
                        <div className="fs-12 weight-00 flex gap-1 mt-1 text-capitalize">{item?.employmentType ? `${item?.employmentType}` : ''}</div>
                        <div className="fs-20 weight-500 flex-1 align-center flex py-3">
                            {item.title}
                            {/* check if it was created 4 days ago */}
                            {DateTime.fromISO(item.createdAt) >= DateTime.now().minus({ days: 4 }) ?
                                <span className="fs-12 tag-brand ms-2 px-2 p-xs border-radius-sm">
                                    New
                                </span>
                            : null}
                        </div>
                        <div className="fs-12 weight-400 flex gap-1 mt-1 text-capitalize">
                            {item?.location ?
                                `${item?.location?.address}, ${item?.location?.city}${item?.location?.state ? `, ${item?.location?.state}` : ''}`
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
        </>
    )
}

const Jobs = ({items}) => {

    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [type, setType] = useState("")
    const [selectedLocation, setSelectedLocation] = useState(null)

    const availableLocations = useMemo(() => {
        const locs = []
        items.forEach(item => {
            if (item.location && !locs.find(l => l._id === item.location._id)) {
                locs.push(item.location)
            }
        })
        return locs
    }, [items])

    const availableCategories = useMemo(() => {
        const cats = []
        items.forEach(item => {
            const cat = item.category
            if (cat && !cats.find(c => c._id === cat._id)) {
                cats.push(cat)
            }
        })
        return cats
    }, [items])

    const filteredItems = useMemo(() => {
        let cats = items
        if (search) {
            cats = cats.filter(item => item.title.toLowerCase().includes(search.toLowerCase()) || (item.description && item.description.toLowerCase().includes(search.toLowerCase())))
        }
        if (category) {
            cats = cats.filter(item => item.category === category)
        }
        if (type) {
            cats = cats.filter(item => item.type === type)
        }
        if (selectedLocation) {
            cats = cats.filter(item => item.location && item.location._id === selectedLocation._id)
        }
        return cats
    }, [items, search, category, type, selectedLocation])


    return (
        <>
            <div className="bg-secondary">
                <div className="flex-1 w-max-600-px mx-auto w-100">
                    <div className="flex container pt-3 pb-4 gap-2 flex-col align-start animation-slide-in">
                        <div className="flex justify-between w-100">
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
                                            setSearch("")
                                            setCategory("")
                                            setSelectedLocation(null)
                                            setType("")
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
                                    appliedText={selectedLocation ? selectedLocation.name : "Locations"}
                                    showFilteredLabel
                                    applied={selectedLocation ? [selectedLocation.name] : []}
                                    closeOnSelect
                                    classNameParent="flex-1 flex-shrink-0 p-0"
                                >
                                    {availableLocations
                                    .map((location) => (
                                    <div key={location._id} className={`flex align-center justify-between pointer text-brand-hover bg-secondary-hover flex-shrink-0${selectedLocation?._id === location._id ? ' text-brand' : ''}`}
                                        onClick={() => {
                                            if (selectedLocation?._id === location._id) {
                                                setSelectedLocation(null)
                                            } else {
                                                setSelectedLocation(location)
                                            }
                                        }}
                                    >
                                        <span className="text-ellipsis-1 fs-sm-14 fs-12 weight-500 py-2 px-3 w-100">{location.address}</span>
                                        <CheckBox
                                            checked={selectedLocation?._id === location._id}
                                            rounded
                                            radio
                                            type="brand"
                                        />
                                    </div>
                                    ))}
                                </FilterDropdown>
                                <FilterDropdown
                                    hideAppliedText
                                    label="Category"
                                    hideLabel
                                    showFilteredLabel
                                    appliedText={category ? category : "Category"}
                                    applied={category ? [category] : []}
                                    closeOnSelect
                                    classNameParent="flex-1 flex-shrink-0 text-capitalize"
                                >
                                    {availableCategories
                                    .map((t) => (
                                    <div className={`flex align-center justify-between pointer text-brand-hover bg-secondary-hover text-capitalize flex-shrink-0${category === t  ? ' text-brand' : ''}`}
                                        onClick={() => {
                                            if (category === t) {
                                                setCategory("")
                                            } else {
                                                setCategory(t)
                                            }
                                        }}
                                        key={t}
                                    >
                                        <span className="text-ellipsis-1 fs-sm-14 fs-12 weight-500 py-2 px-3 w-100">{t}</span>
                                        <CheckBox
                                            checked={t === category}
                                            rounded
                                            radio
                                            type="brand"
                                        />
                                    </div>
                                    ))}
                                </FilterDropdown>
                                <FilterDropdown
                                    hideAppliedText
                                    label="Type"
                                    hideLabel
                                    showFilteredLabel
                                    appliedText={type ? type : "Employment"}
                                    applied={type ? [type] : []}
                                    closeOnSelect
                                    classNameParent="flex-1 flex-shrink-0"
                                >
                                    {['Full-time', 'Part-time']
                                    .map((t) => (
                                    <div className={`flex align-center justify-between pointer text-brand-hover bg-secondary-hover flex-shrink-0${type === t  ? ' text-brand' : ''}`}
                                        onClick={() => {
                                            if (type === t) {
                                                setType("")
                                            } else {
                                                setType(t)
                                            }
                                        }}
                                        key={t}
                                    >
                                        <span className="text-ellipsis-1 fs-sm-14 fs-12 weight-500 py-2 px-3 w-100">{t}</span>
                                        <CheckBox
                                            checked={t === type}
                                            rounded
                                            radio
                                            type="brand"
                                        />
                                    </div>
                                    ))}
                                </FilterDropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" flex-1"
                id="job-listings"
            >
                <div
                    className="w-max-600-px mx-auto w-100 h-min-400-px"
                >
                    {filteredItems && filteredItems.length > 0 ?
                        <div className="flex flex-col gap-3 container">
                            {filteredItems.map((item) => (
                                <JobListing
                                    key={item._id}
                                    item={item}
                                />
                            ))}
                        </div>
                    : <div className="fs-14 mt-4 text-center py-6 container">
                        No results found.
                    </div>}
                </div>
            </div>
        </>
    )
}

const JobListings = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { companyPublicUrl, listingId } = useParams()

    const { company, msg, listings } = useSelector((state) => state.jobBoard)

    useEffect(() => {
        if (companyPublicUrl) {
            dispatch(getCompanyJobs(companyPublicUrl))
        }
    }, [companyPublicUrl])

    useEffect(() => {
        if (company) {
            document.title = `Jobs at ${company.name}`;
            window.scrollTo(0, 0);
            
            // Set the brand color CSS custom property
            if (company.brandColor) {
                document.documentElement.style.setProperty('--color-brand', company.brandColor);
                document.documentElement.style.setProperty('--color-brand-text', company.brandColor);
                document.documentElement.style.setProperty('--color-brand-bg', convertHexToRgba(company.brandColor, 0.1));
                document?.body?.setAttribute('data-theme', returnColorLum(company?.brandColor) <= 0.5 ? 'light' : 'dark');
            }
        }
    }, [company])

    return (
        <section className="page-body h-100">
            <div className="animation-fade-in flex flex-col h-100">
                {msg == '404' ? 
                    <div className="container">
                        <div className="sticky top-0 z-10 bg-main w-max-600-px mx-auto"
                        >
                            <div className="py-4 px-3 flex justify-between align-center">
                                <div className="flex-1 flex flex-col justify-center">
                                    <Link className="flex" style={{
                                        maxWidth: "100px",
                                    }}
                                        to="https://forkhr.com"
                                    >
                                        {logoFullSvg}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex pt-6 mt-6 justify-center">
                            <div className="title-2 border-right px-4 weight-500">
                                404
                            </div>
                            <div className="flex flex-col justify-center px-4">
                                <div className="fs-12">
                                    Page not found
                                </div>
                            </div>
                        </div>
                        <div className="fs-12 text-center mt-4 px-3">
                            The job board you were viewing is no longer active.
                        </div>
                    </div>
                : company ?
                    <div className="flex-1 flex flex-col">
                        <div className="bg-brand text-light container py-6 flex flex-col justify-center align-center h-min-400-px">
                            <div className="weight-400 fs-sm-48 text-center weight-500 pb-6 w-max-sm py-sm-4 line-height-1-3 animation-slide-in w-max-md"
                                style={{
                                    fontSize: "clamp(32px, 8vw, 96px)",
                                }}
                            >
                                Work at {company?.name}
                            </div>
                            <div
                                className="pointer clickable px-5 py-2 fs-20 weight-500 hover-opacity-75 border-radius-rounded animation-slide-in"
                                style={{
                                    background: "white",
                                    color: "#333",
                                }}
                                onClick={() => {
                                    if (listingId) {
                                        navigate(`/${companyPublicUrl}`)
                                    } else {
                                        const element = document.getElementById("job-listings");
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" });
                                        }
                                    }
                                }}
                            >
                                <div className="flex align-center justify-between gap-2 text-brand">
                                    {listingId ? 
                                        <Icon
                                            icon={leftArrowIcon}
                                            className="fs-24 weight-500 fill-brand"
                                        />
                                    : null }
                                    {listingId ?
                                        'VIEW ALL JOBS'
                                    :
                                        `${numberFormatter(listings?.length)} OPEN ${listings?.length === 1 ? 'JOB' : 'JOBS'}`
                                    }
                                    {listingId ? null :
                                        <Icon
                                            icon={arrowDownShortIcon}
                                            className="fs-24 weight-500 fill-brand"
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                        {listingId ?
                            <div className="container flex-1">
                                <div className="w-max-600-px mx-auto w-100">
                                    <ListingDetailed/>
                                </div>
                            </div>
                        :
                            <>
                                <div className="w-max-600-px mx-auto w-100 py-5 animation-slide-in">
                                    <div className="container">
                                        <Avatar
                                            img={company?.logo ? `${process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL}/${company?.logo}` : `https://ui-avatars.com/api/?name=${company?.name?.slice(0,2)}&bold=true`}
                                            name={company?.name}
                                            alt={company?.name}
                                            width={60}
                                            height={60}
                                            avatarColor={company.name.length}
                                            len={2}
                                            borderRadiusNone
                                        />
                                        <div className="fs-24 py-3">
                                            {company?.name}
                                        </div>
                                        <div className="flex align-center gap-1 fs-14">
                                            {company?.description}
                                        </div>
                                    </div>
                                </div>
                                {listings && listings.length === 0 ?
                                    <div className="flex-1 w-max-600-px mx-auto w-100">
                                        <div className="container fs-14 mt-4">
                                            There are currently no job openings.
                                        </div>
                                    </div>
                                : listings && listings.length > 0 ?
                                    <Jobs
                                        items={listings}
                                    />
                                : null }
                            </>
                        }
                        <div className="mt-6 py-2">
                                <div className="flex align-center justify-center gap-3">
                                    <div className="fs-12 text-brand weight-500">
                                        Powered by
                                    </div>
                                    <Link className="flex flex-col justify-center"
                                        to="https://forkhr.com" target="_blank"
                                    >
                                        <div className="flex bg-white p-2 border-radius" style={{
                                            maxWidth: "60px",
                                            minWidth: "60px",
                                            width: "100%",
                                        }}>
                                            {logoFullSvg}
                                        </div>
                                    </Link>
                                </div>
                                <div className="flex align-center justify-center gap-1 pt-2 bg-sm-main">
                                    <Link
                                        to="https://forkhr.com/privacy-policy"
                                        className="text-dark fs-12 text-underlined-hover weight-500"
                                        target="_blank"
                                    >
                                        Privacy Policy
                                    </Link>
                                    <span className="fs-12  opacity-50">
                                        •
                                    </span>
                                    <Link
                                        to="https://forkhr.com/terms-of-service"
                                        className="text-dark fs-12 text-underlined-hover weight-500"
                                        target="_blank"
                                    >
                                        Terms of Service
                                    </Link>
                                </div>
                            </div>
                        </div>
                : null }
            </div>
        </section>
    )
}

export default JobListings