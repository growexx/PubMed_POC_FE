import { Button } from 'antd';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  background-color: @sidebar-bg;
  color: @primary-font-color;
  border-color: @sidebar-bg;

  :hover{
    background-color: @chat-bot-bg;
    color: @primary-font-color;
    border-color: @sidebar-bg;
  }

  :focus{
    background-color: @chat-bot-bg;
    color: @primary-font-color;
    border-color: @sidebar-bg;
  }
`;
