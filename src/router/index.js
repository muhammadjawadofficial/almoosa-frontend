import Vue from 'vue'
import Router from "vue-router";

import Body from '../components/body'
import AuthBody from '../components/auth_body'
import AuthBodyPatient from '../components/auth_body_patient'

import Dashboard from '../pages/dashboard'
import Iframe from '../pages/iframe'

import AppointmentModule from '../pages/appointment'
import BookAppointment from '../pages/appointment/book-appointment'
import UpcomingAppointment from '../pages/appointment/upcoming-appointment'
import appointmentDetail from '../pages/appointment/appointment-detail'
import findSpecialist from '../pages/appointment/find-specialist'
import doctorList from '../pages/appointment/doctor-list'
import doctorDetails from '../pages/appointment/doctor-details'

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
            path: 'find-specialist',
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
            path: 'connect',
            component: Iframe,
            name: 'Connect',
            meta: {
              title: 'Connect | Almoosa Specialist Hospital',
            }
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
