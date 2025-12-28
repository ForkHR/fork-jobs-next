import imgPlaceholder from './img/img_error_placeholder.png';
import { settingsFillIcon, bellFillIcon, timeOffFillIcon, newsFillIcon, folderFillIcon, userCardFillIcon, teamFillIcon, calendarFillIcon, onboardingFillIcon, surveyFillIcon, historyFillIcon, starFillIcon, resourcesFillIcon, trainingFillIcon, hiringFillIcon } from './img/icons';

const daysEnum = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const statesEnum = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
const roleEnum = ['owner', 'manager', 'employee'];

const appsConst = [
    {
        title: "Schedule",
        name: "schedule",
        description: "Schedule shifts, add breaks, tasks, notes, and more. Manage your team availability and more.",
        icon: calendarFillIcon,
        permanent: true,
        link: "/settings/apps/schedule",
    },
    {
        title: "Time tracking",
        name: "timecards",
        description: "Time cards are used to track the hours worked by employees. They can be used to calculate payroll, overtime, and other time-related calculations.",
        icon: historyFillIcon,
        link: "/settings/apps/timecards",
    },
    {
        title: "Time off requests",
        name: "time-off-requests",
        description: "Time off requests are used to track the time that employees request off from work. This can include vacation, sick leave, and other types of leave.",
        icon: timeOffFillIcon,
        link: "/settings/apps/time-off-requests",
    },
    {
        title: "Onboarding",
        name: "onboarding",
        description: "Onboarding provides legal forms for new hires, including W-4 and I-9 forms.",
        icon: onboardingFillIcon,
        link: "/settings/apps/onboarding",
    },
    {
        title: "Documents",
        name: "documents",
        description: "Documents are used to track the documents that employees are required to provide. This can include I-9 forms, W-4 forms, and other legal documents.",
        icon: folderFillIcon,
        link: "/settings/apps/documents",
    },
    {
        title: "Training",
        name: "training",
        description: "Create training modules for your employees. Training modules can include items like videos, documents, and quizzes to assess knowledge.",
        icon: trainingFillIcon,
    },
    {
        title: "Surveys",
        name: "surveys",
        description: "Surveys are used to collect feedback from employees. This can include employee satisfaction surveys, exit surveys, and other types of surveys.",
        icon: surveyFillIcon,
    },
    {
        title: "News",
        name: "news",
        description: "News are used to communicate important information to employees. This can include company news, policy changes, and other important updates.",
        icon: newsFillIcon,
    },
    {
        title: "Resources",
        name: "resources",
        description: "Store resources for your employees. Like training materials, company policies, etc.",
        icon: resourcesFillIcon,
    },
    {
        title: "Reviews",
        name: "reviews",
        description: "Reviews are used to track employee performance. This can include performance reviews, feedback, and other types of performance-related information.",
        icon: starFillIcon,
        link: "/settings/apps/reviews",
    },
    {
        title: "Hiring",
        name: "hiring",
        description: "Manage job listings and applications directly from the platform.",
        icon: hiringFillIcon,
        link: "/settings/apps/hiring",
    },
]

const formEnum = [
    {
        name: 'Personal information',
        description: 'Personal information is used to fill out the employee’s personal profile.',
        type: "other",
    },
    {
        name: 'I-9',
        description: 'I-9 is used for verifying the identity and Documents that Establish Employment Authorization of individuals hired for employment in the United States.',
        type: "Federal"
    },
    {
        name: 'W-4',
        description: 'W-4 is used to determine how much federal income tax to withhold from the employee’s paycheck.',
        type: "Federal"
    },
    {
        name: 'IT-2104',
        description: 'IT-2104 is used to determine how much state income tax to withhold from the employee’s paycheck.',
        type: "NY State"
    },
    {
        name: 'Direct deposit',
        type: "other",
    }
]

const breakLengthEnum = ['0', '10', '15', '20', '25', '30', '45', '60', '75', '90', '105', '120'];
const hoursEnum = ['00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45'];

const myWorkSearchEnum = [
    {
        title: 'My profile',
        link: '/account/profile',
        icon: userCardFillIcon,
        extraSearchTerms: ['account', 'settings'],
        default: true
    },
    {
        title: 'My onboarding',
        link: '/account/onboarding',
        name: 'onboarding',
        extraSearchTerms: ['forms', 'documents', 'tasks'],
        icon: onboardingFillIcon
    },
    {
        title: 'My documents',
        link: '/account/documents',
        name: 'documents',
        extraSearchTerms: ['files', 'papers'],
        icon: folderFillIcon
    },
    {
        title: 'News',
        link: '/account/news',
        name: 'news',
        extraSearchTerms: ['updates', 'announcements'],
        icon: newsFillIcon
    },
    {
        title: 'Request time off',
        link: '/account/time-off-requests',
        name: 'time-off-requests',
        extraSearchTerms: ['leave', 'vacation', 'absence'],
        icon: timeOffFillIcon
    },
    {
        title: "Respond to surveys",
        link: '/account/surveys',
        name: 'surveys',
        extraSearchTerms: ['feedback', 'polls'],
        icon: surveyFillIcon
    },
    {
        title: 'Rate coworkers',
        link: '/account/reviews',
        name: 'reviews',
        extraSearchTerms: ['feedback', 'performance'],
        icon: starFillIcon
    },
    {
        title: 'Shared resources',
        link: '/account/resources',
        name: 'resources',
        extraSearchTerms: ['files', 'materials', 'links'],
        icon: resourcesFillIcon
    },
    {
        title: 'My training',
        link: '/account/training',
        name: 'training',
        extraSearchTerms: ['courses', 'modules', 'lessons'],
        icon: trainingFillIcon
    },
]

const createNewSearchEnum = [
    {
        title: 'Create employee',
        link: '/team?new=true',
        icon: teamFillIcon,
        permission: "employeeManagement.createEmployee",
        extraSearchTerms: ['add employee', 'new employee', 'hire'],
        default: true
    },
    {
        title: 'Create shift',
        link: '/schedule?new=true',
        icon: calendarFillIcon,
        permission: "schedule.manageShifts",
        extraSearchTerms: ['add shift', 'new shift', 'work shift'],
        default: true
    },
    {
        title: 'Add onboarding form',
        link: '/onboarding?new=true',
        name: 'onboarding',
        permission: "onboarding.manageOnboarding",
        extraSearchTerms: ['new form', 'new task', 'new document'],
        icon: onboardingFillIcon
    },
    {
        title: 'Create a document',
        link: '/documents?new-document=true',
        name: 'documents',
        permission: "documents.manageDocuments",
        extraSearchTerms: ['new file', 'upload file', 'add document'],
        icon: folderFillIcon
    },
    {
        title: 'Upload a document',
        link: '/documents?upload-document=true',
        name: 'documents',
        permission: "documents.manageDocuments",
        extraSearchTerms: ['new file', 'add file', 'add document'],
        icon: folderFillIcon
    },
    {
        title: 'Request a document',
        link: '/documents?request-document=true',
        name: 'documents',
        permission: "documents.manageDocuments",
        extraSearchTerms: ['new file', 'upload file', 'add document'],
        icon: folderFillIcon
    },
    {
        title: 'Create time off request',
        link: '/time-off-requests?new=true',
        name: 'time-off-requests',
        permission: "timeOffRequests.manageTimeOffRequest",
        extraSearchTerms: ['new request', 'add request', 'time off'],
        icon: timeOffFillIcon
    },
    {
        title: 'Create news',
        link: '/news?create-news=true',
        name: 'news',
        permission: "news.manageNews",
        extraSearchTerms: ['new post', 'add news', 'announcement'],
        icon: newsFillIcon
    },
    {
        title: 'Create survey',
        link: '/surveys?new-survey=true',
        name: 'surveys',
        permission: "surveys.manageSurveys",
        extraSearchTerms: ['new survey', 'add survey', 'create survey'],
        icon: surveyFillIcon
    },
    {
        title: 'Create resource',
        link: '/resource?new=true',
        name: 'resources',
        permission: "resource.manageResource",
        extraSearchTerms: ['new resource', 'add resource', 'upload resource'],
        icon: resourcesFillIcon
    },
    {
        title: 'Create training module',
        link: '/training?new-training-module=new',
        name: 'training',
        permission: "training.manageTrainingModules",
        extraSearchTerms: ['new module', 'add module', 'create module'],
        icon: trainingFillIcon
    },
    {
        title: 'Create job listing',
        link: '/hiring?new-listing=true',
        name: 'hiring',
        permission: "jobListing.manageJobListings",
        extraSearchTerms: ['new job', 'add job', 'create listing'],
        icon: hiringFillIcon
    },
]

const navigationSearchEnum = [
    {
        title: 'Team',
        link: '/team',
        icon: teamFillIcon,
        extraSearchTerms: ['employees', 'staff', 'members'],
        default: true
    },
    {
        title: 'Schedule',
        link: '/schedule',
        icon: calendarFillIcon,
        extraSearchTerms: ['shifts', 'calendar', 'rota'],
        default: true
    },
    {
        title: 'Time tracking',
        link: '/timecards',
        icon: historyFillIcon,
        permission: "timeCards.viewTimecards",
        extraSearchTerms: ['time cards', 'hours', 'clock in', 'clock out'],
        default: true,
    },
    {
        title: 'Onboarding',
        link: '/onboarding',
        name: 'onboarding',
        permission: "onboarding.viewOnboarding",
        extraSearchTerms: ['forms', 'documents', 'tasks'],
        icon: userCardFillIcon
    },
    {
        title: 'Documents',
        link: '/documents',
        name: 'documents',
        permission: "documents.viewDocuments",
        extraSearchTerms: ['files', 'papers'],
        icon: folderFillIcon
    },
    {
        title: 'News',
        link: '/news',
        name: 'news',
        permission: "news.viewNews",
        extraSearchTerms: ['updates', 'announcements'],
        icon: newsFillIcon
    },
    {
        title: 'Time off requests',
        link: '/time-off-requests',
        name: 'time-off-requests',
        permission: "timeOffRequests.viewTimeOffRequests",
        extraSearchTerms: ['leave', 'vacation', 'absence'],
        icon: timeOffFillIcon
    },
    {
        title: 'Surveys',
        link: '/surveys',
        name: 'surveys',
        permission: "surveys.viewSurveys",
        extraSearchTerms: ['feedback', 'polls'],
        icon: surveyFillIcon
    },
    {
        title: 'Training',
        link: '/training',
        name: 'training',
        permission: "training.viewTrainings",
        extraSearchTerms: ['courses', 'modules', 'lessons'],
        icon: trainingFillIcon
    },
    {
        title: 'Resources',
        link: '/resource',
        name: 'resources',
        permission: "resource.viewResource",
        extraSearchTerms: ['files', 'materials', 'links'],
        icon: resourcesFillIcon
    },
    {
        title: 'Hiring',
        link: '/hiring',
        name: 'hiring',
        permission: "hiring.viewJobListings",
        extraSearchTerms: ['jobs', 'applications', 'candidates'],
        icon: hiringFillIcon
    },
    {
        title: 'Settings',
        link: '/settings',
        icon: settingsFillIcon,
        extraSearchTerms: ['preferences', 'company', 'plan', 'billing', 'users', 'locations', 'jobs', 'permissions', 'apps'],
        default: true
    },
    {
        title: 'Notifications',
        link: '/notifications',
        icon: bellFillIcon,
        extraSearchTerms: ['alerts', 'messages'],
        default: true
    },
]

const settingsSearchEnum = [
    {
        title: 'Preferences',
        link: '/settings/preferences',
        extraSearchTerms: ['profile', 'account'],
        icon: settingsFillIcon
    },
    {
        title: "Authentication",
        link: '/settings/authentication',
        extraSearchTerms: ['password', '2fa', 'two-factor', 'login', 'security'],
        icon: settingsFillIcon
    },
    {
        title: "Company",
        link: '/settings/general',
        permission: "isOwner",
        extraSearchTerms: ['business', 'details', 'information'],
        icon: settingsFillIcon
    },
    {
        title: "Users",
        link: '/settings/users',
        permission: "isOwner",
        extraSearchTerms: ['team', 'employees', 'managers'],
        icon: settingsFillIcon
    },
    {
        title: "Locations",
        link: '/settings/locations',
        permission: "isOwner",
        extraSearchTerms: ['branches', 'offices', 'stores'],
        icon: settingsFillIcon
    },
    {
        title: "Jobs & Permissions",
        link: '/settings/jobs-&-permissions',
        permission: "isOwner",
        extraSearchTerms: ['roles', 'access', 'rights'],
        icon: settingsFillIcon
    },
    {
        title: "Plan & Billing",
        link: '/settings/plan-&-billing',
        permission: "isOwner",
        extraSearchTerms: ['subscription', 'payment', 'invoice'],
        icon: settingsFillIcon
    },
    {
        title: "Apps",
        link: '/settings/apps',
        permission: "isOwner",
        extraSearchTerms: ['modules', 'features', 'integrations'],
        icon: settingsFillIcon
    },
]

const settingsEmployeeSearchEnum = [
    {
        title: 'Preferences',
        link: '/settings/preferences',
        extraSearchTerms: ['profile', 'account'],
        icon: settingsFillIcon
    },
    {
        title: "Authentication",
        link: '/settings/authentication',
        extraSearchTerms: ['password', '2fa', 'two-factor', 'login', 'security'],
        icon: settingsFillIcon
    },
]

export {
    daysEnum,
    statesEnum,
    roleEnum,
    appsConst,
    formEnum,
    imgPlaceholder,
    breakLengthEnum,
    hoursEnum,
    createNewSearchEnum,
    myWorkSearchEnum,
    navigationSearchEnum,
    settingsSearchEnum,
    settingsEmployeeSearchEnum
}