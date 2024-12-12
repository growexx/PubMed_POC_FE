// Settings.js
import React, { useState, useEffect } from 'react';
import { Button, Form, Upload, message, Row, Col, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { 
  SettingsContainer,  
  FormItem, 
  StyledButton, 
  UploadPreview, 
  Title, 
  StyledSketchPicker,
  StyledRadioGroup
} from './StyledSetting';
import GrowexxLogo from '../../images/Icon.png';
import { API_ENDPOINTS } from '../../containers/constants';

const predefinedThemes = {
  theme1: {
    primaryColor: '#05151D',
    secondaryColor: '#041219',
    primaryFontColor: '#FFFFFF',
    secondaryFontColor: '#091B29',
    buttonColor: '#12D5E3',
  },
  theme2: {
    primaryColor: '#D6D9CF',
    secondaryColor: '#F6F9F0',
    primaryFontColor: '#000000',
    secondaryFontColor: '#E9ECE1',
    buttonColor: '#FFFFFF',
  },
};

const Settings = () => {
  const [form] = Form.useForm();
  const [selectedTheme, setSelectedTheme] = useState('theme1'); // Default to Theme 1
  const [primaryColor, setPrimaryColor] = useState(predefinedThemes.theme1.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(predefinedThemes.theme1.secondaryColor);
  const [primaryFontColor, setPrimaryFontColor] = useState(predefinedThemes.theme1.primaryFontColor);
  const [secondaryFontColor, setSecondaryFontColor] = useState(predefinedThemes.theme1.secondaryFontColor);
  const [buttonColor, setButtonColor] = useState(predefinedThemes.theme1.buttonColor);
  const [previewLogo, setPreviewLogo] = useState(GrowexxLogo);
  const [selectedLogo, setSelectedLogo] = useState(null); 
  const [loading, setLoading] = useState(false);
  const origin = window.location.origin;

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        // Fetch user settings
        const response = await axios.get(`${API_ENDPOINTS.GET_SETTINGS}?origin=${origin}`);
        const { data } = response;
        console.log(response.data, 'response');
        if (data) {
          // Check if a predefined theme is stored
          const theme = data.selectedTheme || 'theme1';
          setSelectedTheme(theme);
          if (theme in predefinedThemes) {
            const selected = predefinedThemes[theme];
            setPrimaryColor(selected.primaryColor);
            setSecondaryColor(selected.secondaryColor);
            setPrimaryFontColor(selected.primaryFontColor);
            setSecondaryFontColor(selected.secondaryFontColor);
            setButtonColor(selected.buttonColor);
            form.setFieldsValue({
              theme: theme,
              primaryColor: selected.primaryColor,
              secondaryColor: selected.secondaryColor,
              primaryFontColor: selected.primaryFontColor,
              secondaryFontColor: selected.secondaryFontColor,
              buttonColor: selected.buttonColor,
            });
          } else if (theme === 'custom') {
            // If custom, set the colors from data or defaults
            setPrimaryColor(data.primaryColor || '#1890ff');
            setSecondaryColor(data.secondaryColor || '#ff4d4f');
            setPrimaryFontColor(data.primaryFontColor || '#000000');
            setSecondaryFontColor(data.secondaryFontColor || '#ffffff');
            setButtonColor(data.buttonColor || '#ffffff');
            form.setFieldsValue({
              theme: 'custom',
              primaryColor: data.primaryColor || '#1890ff',
              secondaryColor: data.secondaryColor || '#ff4d4f',
              primaryFontColor: data.primaryFontColor || '#000000',
              secondaryFontColor: data.secondaryFontColor || '#ffffff',
              buttonColor: data.buttonColor || '#ffffff',
            });
          }
        }

        // Fetch logo from API
        const logoResponse = await axios.get(`${API_ENDPOINTS.GET_LOGO}?origin=${origin}`);
        const { logo } = logoResponse.data;
        if (logo) {
          setPreviewLogo(logo);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
        // message.error('Failed to load settings.');
      }
    };

    fetchPreferences();
  }, [form, origin]);

  const handleThemeChange = async (e) => {
    const theme = e.target.value;
    setSelectedTheme(theme);
    if (theme in predefinedThemes) {
      const selected = predefinedThemes[theme];
      setPrimaryColor(selected.primaryColor);
      setSecondaryColor(selected.secondaryColor);
      setPrimaryFontColor(selected.primaryFontColor);
      setSecondaryFontColor(selected.secondaryFontColor);
      setButtonColor(selected.buttonColor);
      form.setFieldsValue({
        primaryColor: selected.primaryColor,
        secondaryColor: selected.secondaryColor,
        primaryFontColor: selected.primaryFontColor,
        secondaryFontColor: selected.secondaryFontColor,
        buttonColor: selected.buttonColor,
      });

      const updatedTheme = {
        origin,
        selectedTheme: theme,
        primaryColor: selected.primaryColor,
        secondaryColor: selected.secondaryColor,
        primaryFontColor: selected.primaryFontColor,
        secondaryFontColor: selected.secondaryFontColor,
        buttonColor: selected.buttonColor,
      };

      await axios.post(`${API_ENDPOINTS.UPDATE_SETTINGS}`, updatedTheme );

      updateCSSVariables(updatedTheme);
      message.success('Theme applied successfully!');
    }
  };

  const handleColorChange = (color, setter) => {
    setter(color.hex);
  };

  const handleLogoChange = async(info) => {
    const { file, fileList } = info;

    if (file.status === 'removed') {
      setSelectedLogo(null);
      setPreviewLogo(GrowexxLogo);
      return;
    }

    const latestFile = fileList[fileList.length - 1];

    const fileObj = latestFile.originFileObj || latestFile;

    if (!(fileObj instanceof Blob)) {
      message.error('Invalid file. Please select a valid image file.');
      return;
    }

    const allowedExtensions = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/bmp'
    ];

    const isImage = allowedExtensions.includes(file.type);
    if (!isImage) {
      // message.error('You can only upload PNG, JPG, JPEG, GIF, WEBP and BMP files!');
      return;
    }

    const isLt2M = fileObj.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      // message.error('Image must be smaller than 2MB!');
      return;
    }

    setSelectedLogo(fileObj);

      const formData = new FormData();
      formData.append('file', fileObj);

      await axios.post(`${API_ENDPOINTS.UPLOAD_LOGO}?origin=${origin}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewLogo(reader.result);
    };
    reader.readAsDataURL(fileObj);
  };

  const beforeUpload = (file) => {
    const allowedExtensions = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/bmp'
    ];
  
    const isImage = allowedExtensions.includes(file.type);
    if (!isImage) {
      message.error('You can only upload PNG, JPG, JPEG, GIF, WEBP and BMP files!');
      return false;
    }
  
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
  
    return true;
  };
  

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedTheme = {
        origin,
        selectedTheme,
        primaryColor,
        secondaryColor,
        primaryFontColor,
        secondaryFontColor,
        buttonColor,
      };

      setLoading(true);
      await axios.post(`${API_ENDPOINTS.UPDATE_SETTINGS}`, updatedTheme );

      message.success('Theme customized successfully!');
      updateCSSVariables(updatedTheme);

      setLoading(false);
      setSelectedLogo(null);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Failed to save preferences.');
      }
      console.error('Failed to save preferences:', error);
      setLoading(false);
    }
  };

  const updateCSSVariables = (theme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-bg-color', theme.primaryColor);
    root.style.setProperty('--secondary-bg-color', theme.secondaryColor);
    root.style.setProperty('--primary-font-color', theme.primaryFontColor);
    root.style.setProperty('--secondary-font-color', theme.secondaryFontColor);
    root.style.setProperty('--button-color', theme.buttonColor);
  };

  return (
    <SettingsContainer>
      <Title>Customize Your Theme</Title>
      <Form form={form} layout="vertical">
        {/* Theme Selection */}
        <FormItem label="Select Theme" name="theme">
          <StyledRadioGroup onChange={handleThemeChange} value={selectedTheme}>
            <Radio.Button value="theme1">Dark theme</Radio.Button>
            <Radio.Button value="theme2">Light theme</Radio.Button>
            <Radio.Button value="custom">Custom Theme</Radio.Button>
          </StyledRadioGroup>
        </FormItem>

        {/* Conditionally Render Color Pickers for Custom Theme */}
        {selectedTheme === 'custom' && (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
              <FormItem label="Background Color" name="primaryColor">
                <StyledSketchPicker
                  color={primaryColor}
                  onChangeComplete={(color) => handleColorChange(color, setPrimaryColor)}
                />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
              <FormItem label="Answer Background Color" name="secondaryFontColor">
                <StyledSketchPicker
                  color={secondaryFontColor}
                  onChangeComplete={(color) => handleColorChange(color, setSecondaryFontColor)}
                />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
              <FormItem label="Sidebar/Header Color" name="secondaryColor">
                <StyledSketchPicker
                  color={secondaryColor}
                  onChangeComplete={(color) => handleColorChange(color, setSecondaryColor)}
                />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
              <FormItem label="Font Color" name="primaryFontColor">
                <StyledSketchPicker
                  color={primaryFontColor}
                  onChangeComplete={(color) => handleColorChange(color, setPrimaryFontColor)}
                />
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6}>
              <FormItem label="Button Color" name="buttonColor">
                <StyledSketchPicker
                  color={buttonColor}
                  onChangeComplete={(color) => handleColorChange(color, setButtonColor)}
                />
              </FormItem>
            </Col>
          </Row>
        )}
       {selectedTheme === 'custom' && <Row justify="end" gutter={[16, 16]}>
          <Col>
            <StyledButton onClick={handleSubmit} type="primary" loading={loading}>
              Save
            </StyledButton>
          </Col>
        </Row>}

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <FormItem label="Upload Logo">
              <Upload
                name="logo"
                listType="picture"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleLogoChange}
                accept=".png,.jpg,.jpeg,.gif,.bmp"
              >
                <Button className='upload-button' icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              {previewLogo && (
                <UploadPreview src={previewLogo} alt="Logo Preview" />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </SettingsContainer>
  );
};

export default Settings;
