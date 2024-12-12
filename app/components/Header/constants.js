import React from 'react';
import { LockOutlined, UploadOutlined, SettingOutlined, WechatWorkOutlined } from '@ant-design/icons';
import { ROUTES } from 'containers/constants';

export const MenuItems = [
  {
    to: ROUTES.SETTING,
    tabName: 'Setting',
    icon: <SettingOutlined />,
  },
  {
    to: ROUTES.UPLOAD_FILE,
    tabName: 'Upload Files',
    icon: <UploadOutlined />,
  },
  {
    to: ROUTES.LOGOUT,
    tabName: 'Logout',
    icon: <LockOutlined />,
  }
];
