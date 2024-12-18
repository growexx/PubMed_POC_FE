import styled from 'styled-components';
export const AvatarWrapper = styled.div`
  .ant-btn-group > .ant-btn:first-child {
    display: none;
  }
  .ant-dropdown-trigger,
  .ant-dropdown-trigger:hover {
    border-radius: 50% !important;
    border-color: @button-color;
    background-color: @button-color;
    color: @primary-font-color;
  }
`;
