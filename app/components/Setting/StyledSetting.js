import { Button, Form, Upload, message, Row, Col, Radio } from 'antd';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
export const SettingsContainer = styled.div`
  padding: 16px;
  width: 100%;
  margin: 0 auto;
  background-color: @chat-bot-bg;
  min-height: 100vh; 
  overflow-y: auto; 

  .upload-button{
  background-color: @button-color;
  color: @primary-font-color;
  }
  
  @media (min-width: 768px) {
    padding: 24px;
  }
`;

export const FormItem = styled(Form.Item)`
  label {
    color: @primary-font-color;
  }
`;

export const StyledButton = styled(Button)`
    background-color: @button-color;
    color: @primary-font-color;
    bottom: 125px;
    border: none;
    :hover{
    background-color: @button-color;
    color: @primary-font-color;
  }

  :focus{
    background-color: @chat-bot-bg;
    color: @primary-font-color;
  }
`;

export const UploadPreview = styled.img`
  margin-top: 10px;
  max-width: 250px;
  max-height: 60px;
  display: block;
`;

export const Title = styled.h1`
  text-align: left;
  margin-bottom: 24px;
  color: @primary-font-color;
`;

export const StyledSketchPicker = styled(SketchPicker)`
  transform: scale(0.8); /* Adjust the scale as needed */
  transform-origin: top left;
  
  @media (max-width: 767px) {
    transform: scale(0.7); /* Smaller scale for mobile devices */
  }
`;

export const StyledRadioGroup = styled(Radio.Group)`
  margin-bottom: 20px;
  white-space: nowrap; /* Prevents wrapping to a new line */

  .ant-radio-button-wrapper {
    background-color: @primary-font-color;
    color: @chat-bot-bg;
    border: none;

    &.ant-radio-button-wrapper-checked {
      background-color: @button-color;
      color: @primary-font-color;
    }
  }
`;


