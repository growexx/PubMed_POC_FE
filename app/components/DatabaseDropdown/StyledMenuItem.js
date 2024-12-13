import { Menu } from 'antd';
import styled from 'styled-components';

export const StyledMenuItem = styled(Menu.Item)`
  background-color: ${props =>
    props.disabled ? '@sidebar-bg;' : '@sidebar-bg;'};
  color: ${props => (props.disabled ? '@primary-font-color;' : '@primary-font-color;')};

  :hover{
    background-color: @chat-bot-bg;
  }
`;
