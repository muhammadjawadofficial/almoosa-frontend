import Vue from "vue";
import Router from "vue-router";

import ComingSoon from "../pages/coming-soon";
import ContactUs from "../pages/contact-us";

import Body from "../components/body";
import AuthBody from "../components/auth_body";
import AuthBodyPatient from "../components/auth_body_patient";

import GuestUserModule from "../components/guest-user";

import Profile from "../pages/user/user-profile";

import Dashboard from "../pages/dashboard";
import Iframe from "../pages/iframe";
import ZoomConnect from "../pages/zoom-connect";
import ZoomConnectNative from "../pages/zoom-connect-native";

import RouterViewModule from "../components/module";

import AppointmentModule from "../pages/appointment";
import AppointmentMethodModule from "../pages/appointment/appointment-method-module";
import BookAppointment from "../pages/appointment/book-appointment";
import UpcomingAppointment from "../pages/appointment/upcoming-appointment";
import appointmentDetail from "../pages/appointment/appointment-detail";
import appointmentHistory from "../pages/appointment/appointment-history-timeline";
import findSpecialist from "../pages/appointment/find-specialist";
import doctorList from "../pages/appointment/doctor-list";
import doctorDetails from "../pages/appointment/doctor-details";
import selectPaymentMethod from "../pages/appointment/select-payment-method";
import payNow from "../pages/appointment/pay-now";
import callEnd from "../pages/appointment/call-end";

import paymentSuccess from "../pages/payment-success";
import paymentFailure from "../pages/payment-failure";
import paymentCancelled from "../pages/payment-cancelled";

import promotionsModule from "../pages/promotions";
import promotionsList from "../pages/promotions/promotions-list";
import promotionsDetails from "../pages/promotions/promotions-details";

import labWorksModule from "../pages/lab-works";
import labWorksDoctors from "../pages/lab-works/doctor-list";
import labWorksReports from "../pages/lab-works/report-list";
import labWorksDetails from "../pages/lab-works/report-detail";

import radiologyReportModule from "../pages/radiology-reports";
import radiologyReportDoctors from "../pages/radiology-reports/doctor-list";
import radiologyReportReports from "../pages/radiology-reports/report-list";
import radiologyReportDetails from "../pages/radiology-reports/report-detail";

import healthEducationModule from "../pages/health-education";
import healthEducationList from "../pages/health-education/health-education-list";
import healthEducationDetails from "../pages/health-education/health-education-details";

import servicesPackagesModule from '../pages/services-packages'
import servicesPackagesList from '../pages/services-packages/services-packages-list'
import servicesPackagesDetails from '../pages/services-packages/services-packages-details'
import servicesPackagesDetailsBooked from '../pages/services-packages/services-packages-book-details'
import servicesPackagesDetailsTerms from '../pages/services-packages/services-packages-details-terms'

import insuranceModule from "../pages/insurance";
import insuranceMyMedical from "../pages/insurance/my-medical-insurance";
import addNewInsurance from "../pages/insurance/add-new-insurance";

import myTimelineModule from "../pages/my-timeline";
import myTimelineList from "../pages/my-timeline/timeline-list";
import myTimelineDetails from "../pages/my-timeline/timeline-details";

import myMedicationModule from "../pages/my-medication";
import myMedicationSessionList from "../pages/my-medication/medication-session-list";
import myMedicationList from "../pages/my-medication/medication-list";
import myMedicationDetails from "../pages/my-medication/medication-detail";

import Login from "../pages/authentication/login";
import OTP from "../pages/authentication/otp";
import ForgotPassword from "../pages/authentication/forgot_password";
import NewPassword from "../pages/authentication/new_password";
import Register from "../pages/authentication/register";
import RegisterMedicalFile from "../pages/authentication/registerMedicalFile";
import LoginDashboard from "../pages/authentication/login_dashboard";

import CriticalCare from "../pages/critical-care";
import InPatients from "../pages/in-patients";

import TermsAndCondition from "../pages/authentication/terms-and-condition";

import familyMembersModule from "../pages/family-members";
import familyMembersList from "../pages/family-members/family-member-list";
import familyMembersForm from "../pages/family-members/family-member-form";

import VirtualTour from "../pages/virtual-tour";

import seeAllNotifications from "../pages/see-all-notifications";
import notificationsSettings from "../pages/notifications-setting";
import { userService } from "../services";
import symptopChecker from "../pages/symptom-checker/symptoms-checker";
import survey from "../pages/symptom-checker/survey";
import confirmSurvey from "../pages/symptom-checker/confirm-survey";
// component

Vue.use(Router);

const routes = [
  { path: "", redirect: { name: "default" } },
  {
    path: "/",
    component: Body,
    children: [
      {
        path: "coming-soon",
        name: "Coming Soon",
        component: ComingSoon,
        meta: {
          title: "Coming Soon | Almoosa Health Group",
        },
      },
      {
        path: "contact-us",
        name: "Contact Us",
        component: ContactUs,
        meta: {
          title: "Contact Us | Almoosa Health Group",
          public: true,
          hideButtons: true,
        },
      },
      {
        path: "dashboard",
        name: "default",
        component: Dashboard,
        meta: {
          title: "Dashboard | Almoosa Health Group",
        },
      },
      {
        path: "symptom-checker",
        name: "Symptom Checker",
        component: symptopChecker,
        meta: {
          title: "Symptop Checker | Almoosa Health Group",
        },
      },
      {
        path: "confirm-survey",
        name: "Confirm Survey",
        component: confirmSurvey,
        meta: {
          title: "Confirm Survey | Almoosa Health Group",
        },
      },
      {
        path: "survey",
        name: "Survey",
        component: survey,
        meta: {
          title: "Survey | Almoosa Health Group",
        },
      },
      {
        path: "profile",
        name: "Profile",
        component: Profile,
        meta: {
          title: "View Profile | Almoosa Health Group",
        },
      },
      {
        path: "find-a-specialist",
        name: "Find A Specialist",
        component: doctorList,
        meta: {
          title: "Find A Specialist | Almoosa Health Group",
        },
      },
      {
        path: "find-a-specialist/details",
        name: "Specialist Details",
        component: doctorDetails,
        meta: {
          title: "Specialist Details | Almoosa Health Group",
        },
      },
      {
        path: "webview",
        component: RouterViewModule,
        children: [
          {
            path: "terms-and-condition",
            name: "Terms and Condition WebView",
            component: TermsAndCondition,
            meta: {
              title: "Terms and Condition | Almoosa Health Group",
              public: true,
              hideWhatsapp: true,
              webview: true,
            },
          },
          {
            path: "services-packages/:id",
            name: "Service and Package Terms WebView",
            component: TermsAndCondition,
            meta: {
              title: "Service and Package Terms | Almoosa Health Group",
              public: true,
              hideWhatsapp: true,
              webview: true,
            },
          },
          {
            path: "confirm-survey",
            name: "Confirm Survey WebView",
            component: confirmSurvey,
            meta: {
              title: "Confirm Survey | Almoosa Health Group",
              public: true,
              hideWhatsapp: true,
              webview: true,
            },
          },
          {
            path: "symptom-checker",
            name: "Symptom Checker WebView",
            component: symptopChecker,
            meta: {
              title: "Symptop Checker | Almoosa Health Group",
              public: true,
              hideWhatsapp: true,
              webview: true,
            },
          },
          {
            path: "survey",
            name: "Survey WebView",
            component: survey,
            meta: {
              title: "Survey | Almoosa Health Group",
              public: true,
              hideWhatsapp: true,
              webview: true,
            },
          },
        ],
      },
      {
        path: "appointment",
        component: AppointmentModule,
        children: [
          {
            path: "payment/success",
            name: "Payment Success",
            component: paymentSuccess,
            meta: {
              title: "Payment Success | Almoosa Health Group",
            },
          },
          {
            path: "payment/failure",
            name: "Payment Failure",
            component: paymentFailure,
            meta: {
              title: "Payment Failure | Almoosa Health Group",
            },
          },
          {
            path: "payment/cancelled",
            name: "Payment Cancel",
            component: paymentCancelled,
            meta: {
              title: "Payment Cancelled | Almoosa Health Group",
            },
          },
          {
            path: ":method",
            component: AppointmentMethodModule,
            children: [
              {
                path: "",
                name: "Create Appointment",
                redirect: { name: "Find Specialist" },
              },
              {
                path: "upcoming",
                name: "Upcoming Appointment",
                component: UpcomingAppointment,
                meta: {
                  title: "Upcoming Appointment | Almoosa Health Group",
                },
              },
              {
                path: "detail",
                name: "Appointment Detail",
                component: appointmentDetail,
                meta: {
                  title: "Appointment Detail | Almoosa Health Group",
                },
              },
              {
                path: "history",
                name: "Appointment History",
                component: appointmentHistory,
                meta: {
                  title: "Appointment History | Almoosa Health Group",
                },
              },
              {
                path: "find-specialist",
                name: "Find Specialist",
                component: findSpecialist,
                meta: {
                  title: "Find Specialist | Almoosa Health Group",
                },
              },
              {
                path: "doctors",
                name: "Doctor List",
                component: doctorList,
                meta: {
                  title: "Find Specialist | Almoosa Health Group",
                },
              },
              {
                path: "doctor-details",
                name: "Doctor Details",
                component: doctorDetails,
                meta: {
                  title: "Doctor Details | Almoosa Health Group",
                },
              },
              {
                path: "book",
                name: "Book Appointment",
                component: BookAppointment,
                meta: {
                  title: "Book Appointment | Almoosa Health Group",
                },
              },
              {
                path: "select-payment-method",
                name: "Select Payment Method",
                component: selectPaymentMethod,
                meta: {
                  title: "Select Payment Method | Almoosa Health Group",
                },
              },
              {
                path: "pay-now",
                name: "Pay Now",
                component: payNow,
                meta: {
                  title: "Pay Now | Almoosa Health Group",
                },
              },
            ],
          },
          {
            path: "connect/call/:connectId",
            component: Iframe,
            name: "Connect",
            meta: {
              title: "Connect | Almoosa Health Group",
            },
          },
          {
            path: "connect/zoom",
            component: ZoomConnect,
            name: "Connect Zoom",
            meta: {
              title: "Connect | Almoosa Health Group",
            },
          },
          {
            path: "connect/zoom-native",
            component: ZoomConnectNative,
            name: "Connect Zoom Native",
            meta: {
              title: "Connect | Almoosa Health Group",
            },
          },
          {
            path: "connect/rate",
            component: callEnd,
            name: "Rate Doctor",
            meta: {
              title: "Rate Doctor | Almoosa Health Group",
            },
          },
        ],
      },
      {
        path: "promotions",
        component: promotionsModule,
        children: [
          {
            path: "",
            name: "Promotions",
            component: promotionsList,
            meta: {
              title: "Promotions | Almoosa Health Group",
            },
          },
          {
            path: "details",
            name: "Promotion Details",
            component: promotionsDetails,
            meta: {
              title: "Promotion Details | Almoosa Health Group",
            },
          },
        ],
      },
      {
        path: "lab-works",
        component: labWorksModule,
        children: [
          {
            path: "",
            name: "Lab Works",
            redirect: { name: "Lab Work Doctors" },
          },
          {
            path: "doctors",
            name: "Lab Work Doctors",
            component: labWorksDoctors,
            meta: {
              title: "Lab Work - Select Doctor | Almoosa Health Group",
            },
          },
          {
            path: "reports",
            name: "Lab Work Reports",
            component: labWorksReports,
            meta: {
              title: "Lab Work - Reports | Almoosa Health Group",
            },
          },
          {
            path: "reports/details",
            name: "Lab Work Report Details",
            component: labWorksDetails,
            meta: {
              title: "Lab Work - Report Details | Almoosa Health Group",
            },
          },
        ],
      },
      {
        path: "radiology-report",
        component: radiologyReportModule,
        children: [
          {
            path: "",
            name: "Radiology Report",
            redirect: { name: "Radiology Report Doctors" },
          },
          {
            path: "doctors",
            name: "Radiology Report Doctors",
            component: radiologyReportDoctors,
            meta: {
              title: "Radiology Report - Select Doctor | Almoosa Health Group",
            },
          },
          {
            path: "reports",
            name: "Radiology Reports",
            component: radiologyReportReports,
            meta: {
              title: "Radiology Report - Reports | Almoosa Health Group",
            },
          },
          {
            path: "reports/details",
            name: "Radiology Report Details",
            component: radiologyReportDetails,
            meta: {
              title: "Radiology Report - Details | Almoosa Health Group",
            },
          },
        ],
      },
      {
        path: "critical-care",
        name: "Critical Results",
        component: CriticalCare,
        meta: {
          title: "Critical Results Patients - Reports | Almoosa Health Group",
        },
      },
      {
        path: "inpatients",
        name: "InPatients",
        component: InPatients,
        meta: {
          title: "View InPatients - Reports | Almoosa Health Group",
        },
      },
      {
        path: "health-education",
        component: healthEducationModule,
        children: [
          {
            path: "",
            name: "Health Education",
            redirect: { name: "Health Education List" },
          },
          {
            path: "list",
            name: "Health Education List",
            component: healthEducationList,
            meta: {
              title: "Health Education | Almoosa Health Group",
            },
          },
          {
            path: "details/:id",
            name: "Health Education Details",
            component: healthEducationDetails,
            meta: {
              title: "Health Education Details | Almoosa Health Group",
              public: true,
              hideWhatsapp: true,
            },
          },
        ],
      },
      {
        path: "services-packages",
        component: servicesPackagesModule,
        children: [
          {
            path: "",
            name: "Services Packages",
            redirect: { name: "Services Packages List" },
          },
          {
            path: "list",
            name: "Services Packages List",
            component: servicesPackagesList,
            meta: {
              title: "Services Packages | Almoosa Health Group",
            },
          },
          {
            path: "details/available",
            name: 'Services Packages Details',
            component: servicesPackagesDetails,
            meta: {
              title: "Services Packages Details | Almoosa Health Group",
              public: true,
            },
          },
          {
            path: "details/booked",
            name: 'Services Packages Details Booked',
            component: servicesPackagesDetailsBooked,
            meta: {
              title: 'Services Packages Details | Almoosa Health Group',
              public: true
            },
          },
          {
            path: "details/:method/terms-and-condition/:id",
            name: "Services Packages Details Terms",
            component: servicesPackagesDetailsTerms,
            meta: {
              title: "Services Packages Details | Almoosa Health Group",
              public: true,
            },
          },
        ],
      },
      {
        path: "insurance",
        component: insuranceModule,
        children: [
          {
            path: "",
            name: "Medical Insurance",
            redirect: { name: "Medical Insurance List" },
          },
          {
            path: "list",
            name: "Medical Insurance List",
            component: insuranceMyMedical,
            meta: {
              title: "Medical Insurance | Almoosa Health Group",
            },
          },
          {
            path: "add",
            name: "Add New Insurance",
            component: addNewInsurance,
            meta: {
              title: "Add New Insurance | Almoosa Health Group",
            },
          },
        ],
      },
      {
        path: "my-timeline",
        component: myTimelineModule,
        children: [
          {
            path: "",
            name: "My Timeline",
            redirect: { name: "My Timeline List" },
          },
          {
            path: "list",
            name: "My Timeline List",
            component: myTimelineList,
            meta: {
              title: "My Timeline | Almoosa Health Group",
            },
          },
          {
            path: "details",
            name: "My Timeline Details",
            component: myTimelineDetails,
            meta: {
              title: "My Timeline Details | Almoosa Health Group",
            },
          },
        ],
      },
      {
        path: "my-medication",
        component: myMedicationModule,
        children: [
          {
            path: "",
            name: "My Medication",
            redirect: { name: "My Medication Sessions" },
          },
          {
            path: "sessions",
            name: "My Medication Sessions",
            component: myMedicationSessionList,
            meta: {
              title: "My Medication Sessions | Almoosa Health Group",
            },
          },
          {
            path: "list",
            name: "My Medication List",
            component: myMedicationList,
            meta: {
              title: "My Medications | Almoosa Health Group",
            },
          },
          {
            path: "details",
            name: "My Medication Details",
            component: myMedicationDetails,
            meta: {
              title: "My Medication Details | Almoosa Health Group",
            },
          },
        ],
      },
      {
        path: "family-members",
        component: familyMembersModule,
        children: [
          {
            path: "",
            name: "Family Members",
            redirect: { name: "Family Members List" },
          },
          {
            path: "list",
            name: "Family Members List",
            component: familyMembersList,
            meta: {
              title: "Family Members | Almoosa Health Group",
            },
          },
          {
            path: "add",
            name: "Family Members Create",
            component: familyMembersForm,
            meta: {
              title: "Add Family Member | Almoosa Health Group",
            },
          },
        ],
      },
      {
        path: "virtual-tour",
        name: "Virtual Tour",
        component: VirtualTour,
        meta: {
          title: "Virtual Tour | Almoosa Health Group",
        },
      },
      {
        path: "see-all-notifications",
        name: "All Notifications",
        component: seeAllNotifications,
        meta: {
          title: "All Notifications | Almoosa Health Group",
        },
      },
      // notification-settings-route
      {
        path: "notifications-settings",
        name: "Notifications Settings",
        component: notificationsSettings,
        meta: {
          title: "Notifications Settings | Almoosa Health Group",
        },
      },
    ],
  },
  {
    path: "/auth",
    component: AuthBody,
    children: [
      {
        path: "user",
        name: "Patient Login",
        component: AuthBodyPatient,
        children: [
          {
            path: "dashboard",
            name: "Login Dashboard",
            component: LoginDashboard,
            meta: {
              title: "Login Dashboard | Almoosa Health Group",
              public: true,
            },
          },
          {
            path: "login",
            name: "Login",
            component: Login,
            meta: {
              title: "Login | Almoosa Health Group",
              public: true,
            },
          },
          {
            path: "otp",
            name: "OTP",
            component: OTP,
            meta: {
              title: "OTP | Almoosa Health Group",
              public: true,
              hideButtons: true,
            },
          },
          {
            path: "forgot-password",
            name: "Forgot Password",
            component: ForgotPassword,
            meta: {
              title: "Forgot Password | Almoosa Health Group",
              public: true,
            },
          },
          {
            path: "new-password",
            name: "New Password",
            component: NewPassword,
            meta: {
              title: "New Password | Almoosa Health Group",
              public: true,
            },
          },
          {
            path: "register",
            component: RouterViewModule,
            children: [
              {
                path: "",
                name: "Register",
                component: Register,
                meta: {
                  title: "Register | Almoosa Health Group",
                  public: true,
                },
              },
              {
                path: "medical-file",
                name: "Register Medical File",
                component: RegisterMedicalFile,
                meta: {
                  title: "Register via Medical File | Almoosa Health Group",
                  public: true,
                },
              },
            ],
          },
          {
            path: "terms-and-condition",
            name: "Terms and Condition",
            component: TermsAndCondition,
            meta: {
              title: "Terms and Condition | Almoosa Health Group",
              public: true,
              hideButtons: true,
            },
          },
          {
            path: "guest",
            component: GuestUserModule,
            children: [
              {
                path: "coming-soon",
                name: "Coming Soon Guest",
                component: ComingSoon,
                meta: {
                  title: "Coming Soon | Almoosa Health Group",
                  public: true,
                },
              },
              {
                path: "contact-us",
                name: "Contact Us Guest",
                component: ContactUs,
                meta: {
                  title: "Contact Us | Almoosa Health Group",
                  public: true,
                },
              },
              {
                path: "appointment",
                component: AppointmentModule,
                children: [
                  {
                    path: ":method",
                    component: AppointmentMethodModule,
                    children: [
                      {
                        path: "find-specialist",
                        name: "Find Specialist Guest",
                        component: findSpecialist,
                        meta: {
                          title: "Find Specialist | Almoosa Health Group",
                          public: true,
                        },
                      },
                      {
                        path: "doctors",
                        name: "Doctor List Guest",
                        component: doctorList,
                        meta: {
                          title: "Find Specialist | Almoosa Health Group",
                          public: true,
                        },
                      },
                      {
                        path: "doctor-details",
                        name: "Doctor Details Guest",
                        component: doctorDetails,
                        meta: {
                          title: "Doctor Details | Almoosa Health Group",
                          public: true,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                path: "find-a-specialist",
                name: "Find A Specialist Guest",
                component: doctorList,
                meta: {
                  title: "Find A Specialist | Almoosa Health Group",
                  public: true,
                },
              },
              {
                path: "find-a-specialist/details",
                name: "Specialist Details Guest",
                component: doctorDetails,
                meta: {
                  title: "Specialist Details | Almoosa Health Group",
                  public: true,
                },
              },
              {
                path: "health-education",
                component: healthEducationModule,
                children: [
                  {
                    path: "",
                    name: "Health Education Guest",
                    redirect: { name: "Health Education List Guest" },
                  },
                  {
                    path: "list",
                    name: "Health Education List Guest",
                    component: healthEducationList,
                    meta: {
                      title: "Health Education | Almoosa Health Group",
                      public: true,
                    },
                  },
                  {
                    path: "details/:id",
                    name: "Health Education Details Guest",
                    component: healthEducationDetails,
                    meta: {
                      title: "Health Education Details | Almoosa Health Group",
                      public: true,
                    },
                  },
                ],
              },
              {
                path: "virtual-tour",
                name: "Virtual Tour Guest",
                component: VirtualTour,
                meta: {
                  title: "Virtual Tour | Almoosa Health Group",
                  public: true,
                },
              },
              {
                path: "symptom-checker",
                name: "Symptom Checker Guest",
                component: symptopChecker,
                meta: {
                  title: "Symptom Checker | Almoosa Health Group",
                  public: true,
                },
              },
              {
                path: "survey",
                name: "Survey Guest",
                component: survey,
                meta: {
                  title: "Survey | Almoosa Health Group",
                  public: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    redirect: "/coming-soon",
  },
];

const router = new Router({
  routes,
  base: "/",
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active",
  mode: "history",
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

import { resetCancellation } from "../services/axios";

router.beforeEach((to, from, next) => {
  resetCancellation();
  if (to.meta.title) document.title = to.meta.title;
  if (
    to.meta.public ||
    to.path === "/callback" ||
    userService.isAuthenticatedUser()
  ) {
    return next();
  }
  next({ name: "Login Dashboard" });
});

export default router;
