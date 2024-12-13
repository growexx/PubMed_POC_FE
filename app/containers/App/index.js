/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import UnauthorizedPage from 'containers/UnauthorizedPage/Loadable';
import Login from 'containers/Auth/Login/Loadable';
import Logout from 'containers/Auth/Logout/Loadable';
import { FAV_ICONS } from './constants';
import PrivateRoute from './PrivateRoute';
import AuthRoute from './AuthRoute';
import GlobalStyle from '../../global-styles';
import { ROUTES } from '../constants';
import { manageSession } from '../../utils/Helper';
import { initGA, recordPageViewGA } from '../../utils/googleAnalytics';
import Chat from '../Chat';
import Setting from 'components/Setting';
import UploadFiles from 'components/UploadFiles';
import axios from 'axios';
import { API_ENDPOINTS } from '../../containers/constants';

const AppWrapper = styled.div`
  display: flex;
  height: calc(100vh - 64px);
  flex-direction: column;
`;

export default function App() {
  const uniqueId = uuid().slice(0, 6);
  const origin = window.location.origin;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.GET_SETTINGS}?origin=${origin}`);
        const { data } = response;
        if (response.status === 200) {
          const root = document.documentElement;
          root.style.setProperty('--primary-bg-color', data?.primaryColor);
          root.style.setProperty('--secondary-bg-color', data?.secondaryColor);
          root.style.setProperty('--primary-font-color', data?.primaryFontColor);
          root.style.setProperty('--secondary-font-color', data?.secondaryFontColor);
          root.style.setProperty('--button-color', data?.buttonColor);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
  
    fetchSettings();
  
    initGA();
    recordPageViewGA(window.location.pathname);
  
    window.addEventListener('storage', manageSession);
  
    return () => {
      window.removeEventListener('storage', manageSession); 
    };
  }, []);
  

  useEffect(() => {
    recordPageViewGA(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <AppWrapper data-testid="AppRoutes">
      <Helmet titleTemplate="%s - PUBMED LLM BOT" defaultTitle="HR ">
        <meta name="description" content="A PUBMED LLM BOT Application" />
        {FAV_ICONS.map((favIcon, index) => (
          <link {...favIcon} key={index} />
        ))}
      </Helmet>
      <Routes>
        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route
            exact
            path={ROUTES.BASE}
            element={<Navigate to={`/new-chat/${uniqueId}`} />}
          />
          <Route path={ROUTES.CHAT} element={<Chat isNew={false} />} />
          <Route path={ROUTES.NEW_CHAT} element={<Chat isNew />} />
          <Route path={ROUTES.SETTING} element={<Setting />} />
          <Route path={ROUTES.UPLOAD_FILE} element={<UploadFiles />} />
          <Route path={ROUTES.LOGOUT} element={<Logout />} />
        </Route>
        {/* Auth Routes */}
        <Route element={<AuthRoute />}>
          <Route exact path={ROUTES.LOGIN} element={<Login />} />
        </Route>
        <Route exact path={ROUTES.UNAUTHORIZED} component={UnauthorizedPage} />
        <Route path="" component={NotFoundPage} />
      </Routes>
      <GlobalStyle />
    </AppWrapper>
  );
}
