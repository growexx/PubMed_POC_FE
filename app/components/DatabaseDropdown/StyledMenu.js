import { Menu } from 'antd';
import styled from 'styled-components';

export const StyledMenu = styled(Menu)`
  color: @primary-font-color;
  border-color: @sidebar-bg;
  background-color: @sidebar-bg;

   .ant-dropdown-menu-item-group-title{
   color: @primary-font-color;
  }
`;
