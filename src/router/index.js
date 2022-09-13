import Vue from 'vue'
import Router from "vue-router";

import Body from '../components/body'
import AuthBody from '../components/auth_body'
import AuthBodyPatient from '../components/auth_body_patient'

import Profile from '../pages/user/user-profile'

import Dashboard from '../pages/dashboard'
import Iframe from '../pages/iframe'

import AppointmentModule from '../pages/appointment'
import BookAppointment from '../pages/appointment/book-appointment'
import UpcomingAppointment from '../pages/appointment/upcoming-appointment'
import appointmentDetail from '../pages/appointment/appointment-detail'
import findSpecialist from '../pages/appointment/find-specialist'
import doctorList from '../pages/appointment/doctor-list'
import doctorDetails from '../pages/appointment/doctor-details'
import selectPaymentMethod from '../pages/appointment/select-payment-method'
import payNow from '../pages/appointment/pay-now'

import paymentSuccess from '../pages/payment-success'
import paymentFailure from '../pages/payment-failure'

import promotionsModule from '../pages/promotions'
import promotionsList from '../pages/promotions/promotions-list'
import promotionsDetails from '../pages/promotions/promotions-details'

import labWorksModule from '../pages/lab-works'
import labWorksDoctors from '../pages/lab-works/doctor-list'
import labWorksReports from '../pages/lab-works/report-list'

import radiologyReportModule from '../pages/radiology-reports'
import radiologyReportDoctors from '../pages/radiology-reports/doctor-list'
import radiologyReportReports from '../pages/radiology-reports/report-list'

import Login from '../pages/authentication/login';
import OTP from '../pages/authentication/otp';
import ForgotPassword from '../pages/authentication/forgot_password';
import NewPassword from '../pages/authentication/new_password';
import Register from '../pages/authentication/register';
import LoginDashboard from '../pages/authentication/login_dashboard';

import { userService } from '../services';

// component

Vue.use(Router)

const routes = [
  { path: '', redirect: { name: 'default' } },
  {
    path: '/',
    component: Body,
    children: [
      {
        path: 'dashboard',
        name: 'default',
        component: Dashboard,
        meta: {
          title: 'Dashboard | Almoosa Specialist Hospital',
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: {
          title: 'View Profile | Almoosa Specialist Hospital',
        }
      },
      {
        path: 'appointment',
        component: AppointmentModule,
        children: [
          {
            path: 'book',
            name: 'Book Appointment',
            component: BookAppointment,
            meta: {
              title: 'Book Appointment | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'upcoming',
            name: 'Upcoming Appointment',
            component: UpcomingAppointment,
            meta: {
              title: 'Upcoming Appointment | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'detail',
            name: 'Appointment Detail',
            component: appointmentDetail,
            meta: {
              title: 'Appointment Detail | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'find-specialist/:method',
            name: 'Find Specialist',
            component: findSpecialist,
            meta: {
              title: 'Find Specialist | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'doctors',
            name: 'Doctor List',
            component: doctorList,
            meta: {
              title: 'Find Specialist | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'doctor-details',
            name: 'Doctor Details',
            component: doctorDetails,
            meta: {
              title: 'Doctor Details | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'select-payment-method',
            name: 'Select Payment Method',
            component: selectPaymentMethod,
            meta: {
              title: 'Select Payment Method | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'pay-now',
            name: 'Pay Now',
            component: payNow,
            meta: {
              title: 'Pay Now | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'payment/success',
            name: 'Payment Success',
            component: paymentSuccess,
            meta: {
              title: 'Payment Success | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'payment/failure',
            name: 'Payment Failure',
            component: paymentFailure,
            meta: {
              title: 'Payment Failure | Almoosa Specialist Hospital',
            }
          },
          {
            path: 'connect',
            component: Iframe,
            name: 'Connect',
            meta: {
              title: 'Connect | Almoosa Specialist Hospital',
            }
          },
        ]
      },
      {
        path: 'promotions',
        component: promotionsModule,
        children: [
          {
            path: "/",
            name: 'Promotions',
            component: promotionsList,
            meta: {
              title: 'Promotions | Almoosa Specialist Hospital',
            },
          },
          {
            path: "details",
            name: 'Promotion Details',
            component: promotionsDetails,
            meta: {
              title: 'Promotion Details | Almoosa Specialist Hospital',
            },
          }
        ]
      },
      {
        path: 'lab-works',
        component: labWorksModule,
        children: [
          { path: '', name: "Lab Works", redirect: { name: 'Lab Work Doctors' } },
          {
            path: "doctors",
            name: 'Lab Work Doctors',
            component: labWorksDoctors,
            meta: {
              title: 'Lab Work - Select Doctor | Almoosa Specialist Hospital',
            },
          },
          {
            path: "reports",
            name: 'Lab Work Reports',
            component: labWorksReports,
            meta: {
              title: 'Lab Work - Reports | Almoosa Specialist Hospital',
            },
          },
        ]
      },
      {
        path: 'radiology-report',
        component: radiologyReportModule,
        children: [
          { path: '', name: "Radiology Report", redirect: { name: 'Radiology Report Doctors' } },
          {
            path: "doctors",
            name: 'Radiology Report Doctors',
            component: radiologyReportDoctors,
            meta: {
              title: 'Radiology Report - Select Doctor | Almoosa Specialist Hospital',
            },
          },
          {
            path: "reports",
            name: 'Radiology Reports',
            component: radiologyReportReports,
            meta: {
              title: 'Radiology Report - Reports | Almoosa Specialist Hospital',
            },
          },
        ]
      }
    ]
  },
  {
    path: '/auth',
    component: AuthBody,
    children: [
      {
        path: 'patient',
        name: 'Patient Login',
        component: AuthBodyPatient,
        children: [
          {
            path: 'dashboard',
            name: 'Login Dashboard',
            component: LoginDashboard,
            meta: {
              title: 'Login Dashboard | Almoosa Specialist Hospital',
              public: true
            }
          },
          {
            path: 'login',
            name: 'Login',
            component: Login,
            meta: {
              title: 'Login | Almoosa Specialist Hospital',
              public: true
            }
          },
          {
            path: 'otp',
            name: 'OTP',
            component: OTP,
            meta: {
              title: 'OTP | Almoosa Specialist Hospital',
              public: true
            }
          },
          {
            path: 'forgot-password',
            name: 'Forgot Password',
            component: ForgotPassword,
            meta: {
              title: 'Forgot Password | Almoosa Specialist Hospital',
              public: true
            }
          },
          {
            path: 'new-password',
            name: 'New Password',
            component: NewPassword,
            meta: {
              title: 'New Password | Almoosa Specialist Hospital',
              public: true
            }
          },
          {
            path: 'register',
            name: 'Register',
            component: Register,
            meta: {
              title: 'Register | Almoosa Specialist Hospital',
              public: true
            }
          },
        ]
      },

    ]
  }
];

const router = new Router({
  routes,
  base: '/ashwebapp/',
  linkActiveClass: "active",
  mode: 'history',
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
});

router.beforeEach((to, from, next) => {
  if (to.meta.title)
    document.title = to.meta.title;
  if (process.env.NODE_ENV == "development" || to.meta.public || to.path === '/callback' || userService.isAuthenticatedUser()) {
    return next();
  }
  next({ name: "Login Dashboard" });
});



export default router
