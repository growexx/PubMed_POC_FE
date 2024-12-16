import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
// ant design
import { Dropdown, notification, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
// redux
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// utils
import request from 'utils/request';
import { API_ENDPOINTS } from '../../containers/constants';
// redux selectors
import { setDatabaseName } from '../../containers/Chat/actions';
import { selectDatabaseName } from '../../containers/Chat/selectors';
// components
import { StyledMenu } from './StyledMenu';
import { StyledButton } from './StyledButton';
import { StyledMenuItem } from './StyledMenuItem';

// -------------------------
const DatabaseDropdown = ({ dbName, setDBName }) => {
  const [selected, setSelected] = useState('');
  const [data, setData] = useState({ isLoading: true, options: {} });

  const getDatabaseOptions = async () => {
    try {
      const response = await request(API_ENDPOINTS.DATABASE_OPTIONS, {
        method: 'GET',
      });
      if (!response.status) {
        throw new Error(response.message);
      }

      const optionData = response.models;

      setData({ isLoading: false, options: optionData || {} });
      setSelected(optionData.Paid[0]); // Select the first paid option by default
    } catch (error) {
      setData(prev => ({ ...prev, isLoading: false }));
      notification.error({ message: error.message });
    }
  };

  useEffect(() => {
    if (selected !== dbName) {
      setDBName(selected);
    }
  }, [selected]);

  useEffect(() => {
    getDatabaseOptions();
  }, []);

  const menu = (
    <StyledMenu onClick={e => setSelected(e.key)}>
      {Object.keys(data.options).map(category => (
        <Menu.ItemGroup key={category} title={category.charAt(0).toUpperCase() + category.slice(1)}>
          {data.options[category].map(item => (
            <StyledMenuItem key={item}>{item}</StyledMenuItem>
          ))}
        </Menu.ItemGroup>
      ))}
    </StyledMenu>
  );

  return (
    <div style={{ marginRight: '20px' }}>
      <Dropdown
        overlay={menu}
        trigger={['click']}
        disabled={data.isLoading || !Object.keys(data.options).length}
      >
        <StyledButton>
          {selected || 'Select'}
          <DownOutlined />
        </StyledButton>
      </Dropdown>
    </div>
  );
};

DatabaseDropdown.propTypes = {
  dbName: PropTypes.string,
  setDBName: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  dbName: selectDatabaseName,
});

export function mapDispatchToProps(dispatch) {
  return { setDBName: data => dispatch(setDatabaseName(data)) };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(DatabaseDropdown);
