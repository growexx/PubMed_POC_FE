import styled from 'styled-components';
export const StyledLogin = styled.div`
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: @chat-bot-bg;
  .emailLogin {
    margin-bottom: 40px;
    color: @primary-font-color;
    font-weight: @font-weight-regular;
    font-size: @font-size-base;
  }
  .LoginSubContainer {
    width: 400px;
    flex-direction: column;
    display: flex;
    flex-wrap: wrap;
    @media only screen and (max-width: 767px) {
      width: 80%;
    }
    @media only screen and (max-width: 576px) {
      width: 80vw;
    }
  }
  .LoginSubContainer .logo {
    display: flex;
    height: 60px;
    margin-bottom: 20px;
  }
  .createAccount {
    margin: 0;
    font-weight: @font-weight-bold;
    font-size: @font-size-lg+26;
    color: @primary-font-color;
  }
  .socialIcons > span {
    border: 1px solid @border-color-base;
    padding: 10px;
    border-radius: 50%;
    margin: 10px;
  }
  .socialIcons {
    display: flex;
  }
  .site-form-item-icon {
    color: #19c37c;
    font-size: 14px;
  }
  .accountData {
    .ant-input:focus,
    .ant-input:focused,
    .ant-input:hover {
      border-color: #19c37c;
    }
    > span:hover,
    > span:focus > span:visited {
      border-color: @border-color-base;
    }
    > div:nth-child(2) {
      margin-top: 10px;
    }
    > input:first-child {
      margin-top: 10px;
    }
    input {
      width: 100%;
      height: 40px;
    }
    input[value] {
      color: @text-color-secondary;
      font-size: @font-size-base+1px;
    }
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px white inset !important;
    }
    .ant-input-affix-wrapper {
      padding: 0px 11px;
    }
  }
  button:hover {
    background: @button-color;
    border: 2px solid @white;
    color: @primary-font-color;
  }
  button {
    color: @primary-font-color;
    text-align: center;
    font-size: @font-size-base+1;
    font-weight: @font-weight-medium;
    height: 52px;
    width: 100%;
    margin-top: 30px;
    background: @button-color;
  }
  button:focus {
    background: @button-color;
    border: 2px solid @white;
    color: @primary-font-color;
  }
`;
