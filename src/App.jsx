/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

// project imports
import config from './config';
import themes from 'themes';
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import MainLayout from 'layout/MainLayout';
import AdminBingoLayout from 'layout/AdminBingoLayout';
import HomeLayout from 'layout/HomeLayout';
import DefaultLayout from 'layout/DefaultLayout';
import { genConst } from 'store/constant';

// Firebase
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
import { getProfileUser } from 'modules/shared/services/firebaseCommon';

// Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Main Portal
const Home = Loadable(lazy(() => import('views/home/Home')));

// Error
const NotFound = Loadable(lazy(() => import('views/pages/error/NotFound')));

// dashboard Admin
const AdminUsers = Loadable(lazy(() => import('views/dashboard/Admin/AdminUsers/AdminUsers')));
const DashboardAdmin = Loadable(lazy(() => import('views/dashboard/Admin')));
const Logs = Loadable(lazy(() => import('views/dashboard/Admin/Logs/Logs')));
const Notifications = Loadable(lazy(() => import('views/dashboard/Admin/Notifications/Notifications')));
const Payments = Loadable(lazy(() => import('views/dashboard/Admin/Payments/Payments')));
const Settings = Loadable(lazy(() => import('views/dashboard/Admin/Settings/Settings')));
const Share = Loadable(lazy(() => import('views/dashboard/Admin/Share/Share')));
const UserProfile = Loadable(lazy(() => import('views/dashboard/Admin/Profile/UserProfile')));
const UserSecurity = Loadable(lazy(() => import('views/dashboard/Admin/Profile/UserSecurity')));
const Users = Loadable(lazy(() => import('views/dashboard/Admin/Users/Users')));
const UsersCards = Loadable(lazy(() => import('views/dashboard/Admin/Users/UsersCards')));

// Game
const CardGame = Loadable(lazy(() => import('modules/features/admin/cards').then(module => ({ default: module.CardGame }))));
const CardsByGame = Loadable(lazy(() => import('modules/features/admin/cards').then(module => ({ default: module.CardsByGame }))));
const CardsUser = Loadable(lazy(() => import('modules/features/admin/card-assignment').then(module => ({ default: module.CardsUser }))));
const Game = Loadable(lazy(() => import('modules/features/admin/game').then(module => ({ default: module.Game }))));
const GameUsers = Loadable(lazy(() => import('modules/features/admin/events').then(module => ({ default: module.GameUsers }))));
const NewGame = Loadable(lazy(() => import('modules/features/admin/events').then(module => ({ default: module.NewGame }))));
const StatsCardGame = Loadable(lazy(() => import('modules/features/admin/cards').then(module => ({ default: module.StatsCardGame }))));

// default Login
const AuthRecovery = Loadable(lazy(() => import('views/pages/login/login/PasswordRecover')));
const AuthSignin = Loadable(lazy(() => import('views/pages/login/login/Signin')));
const AuthSignup = Loadable(lazy(() => import('views/pages/login/login/Signup')));

// dashboard Default
const CardSelectorDefault = Loadable(lazy(() => import('modules/features/default/main/components/CardSelector')));
const ConfirmationBuy = Loadable(lazy(() => import('modules/features/default/payment')));
const DashboardDefault = Loadable(lazy(() => import('modules/features/default/dashboard/components/Dashboard')));
const Failure = Loadable(lazy(() => import('modules/features/default/response/components/Failure')));
const MyTickets = Loadable(lazy(() => import('modules/features/default/tickets/components/MyTickets')));
const NotificationsDefault = Loadable(lazy(() => import('modules/features/default/notifications/components/Notifications')));
const PaymentResponse = Loadable(lazy(() => import('modules/features/default/payment/common/components/PaymentResponse')));
const PlayBingo = Loadable(lazy(() => import('modules/features/default/main/components/PlayBingo')));
const ShareDefault = Loadable(lazy(() => import('modules/features/default/share/components/Share')));
const Success = Loadable(lazy(() => import('modules/features/default/response/components/Success')));
const UserProfileDefault = Loadable(lazy(() => import('modules/features/default/profile/components/UserProfile')));
const UserSecurityDefault = Loadable(lazy(() => import('modules/features/default/profile/components/UserSecurity')));

const App = () => {
  const customization = useSelector((state) => state.customization);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        getProfileUser(user.uid).then((pro) => {
          setProfile(pro);
        });
      }
    });
  }, [profile]);

  return (
    <ThemeProvider theme={themes(customization)}>
      <ToastContainer />
      <Router basename={config.basename}>
        <Routes>
          <Route element={<HomeLayout />} path="/" exact>
            <Route element={<Home />} path="/" exact />
          </Route>
          <Route element={<MinimalLayout />} path="/auth" exact>
            <Route element={<AuthSignin />} path="signin" exact />
            <Route element={<AuthSignup />} path="signup" exact />
            <Route element={<AuthRecovery />} path="password-recovery" exact />
            <Route element={<NotFound />} path="404" exact />
            <Route path="*" element={<Navigate to="404" />} />
          </Route>
          {profile == genConst.CONST_PRO_ADM ? (
            <Route element={<MainLayout />} path="/main" exact>
              <Route element={<DashboardAdmin />} path="dashboard" exact />
              <Route element={<AdminUsers />} path="admin-users" exact />
              <Route element={<Users />} path="users" exact />
              <Route element={<UsersCards />} path="users-cards/:userId" />
              <Route element={<Payments />} path="payments" exact />
              <Route element={<Game />} path="game" exact />
              <Route element={<NewGame />} path="new-game" exact />
              <Route element={<GameUsers />} path="game-users" exact />
              <Route element={<CardGame />} path="card-game" exact />
              <Route element={<CardsByGame />} path="cards-game/:gameId" />
              <Route element={<StatsCardGame />} path="cards-stats/:gameId" />
              <Route element={<CardsUser />} path="cards-user" exact />
              <Route element={<Share />} path="share" exact />
              <Route element={<Settings />} path="settings" exact />
              <Route element={<Logs />} path="logs" exact />
              <Route element={<Notifications />} path="notifications" exact />
              <Route element={<UserProfile />} path="user-profile" exact />
              <Route element={<UserSecurity />} path="user-security" exact />
            </Route>
          ) : profile == genConst.CONST_PRO_ADM_BING ? (
            <Route element={<AdminBingoLayout />} path="/main" exact>
              <Route element={<DashboardAdmin />} path="dashboard" exact />
              <Route element={<CardsUser />} path="cards-user" exact />
            </Route>
          ) : (
            <Route element={<DefaultLayout />} path="/app" exact>
              <Route element={<DashboardDefault />} path="dashboard" exact />
              <Route element={<CardSelectorDefault />} path="card-selector" exact />
              <Route element={<PlayBingo />} path="play-bingo" exact />
              <Route element={<MyTickets />} path="my-tickets" exact />
              <Route element={<ConfirmationBuy />} path="confirmation" exact />
              <Route element={<ShareDefault />} path="share" exact />
              <Route element={<NotificationsDefault />} path="notifications" exact />
              <Route element={<UserProfileDefault />} path="user-profile" exact />
              <Route element={<UserSecurityDefault />} path="user-security" exact />
              <Route element={<Success />} path="success" exact />
              <Route element={<Failure />} path="failure" exact />
              <Route element={<PaymentResponse />} path="payment-response" exact />
            </Route>
          )}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
