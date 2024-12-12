import React from 'react';
import 'jest-dom/extend-expect';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import history from 'utils/history';
import request from 'utils/request'; // Mock request module
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { setDatabaseName } from '../../../containers/Chat/actions'; // Adjust path as necessary
import DatabaseDropdown, { mapDispatchToProps } from '../index'; // Adjust path as necessary
import configureStore from '../../../configureStore'; // Adjust path as necessary

// Mock the request module
jest.mock('utils/request');

let globalStore;

const props = {
  dbName: 'testDB',
  setDBName: jest.fn(),
};

// Wrapper to include provider and store
const componentWrapper = Component =>
  render(
    <Provider store={globalStore}>
      <IntlProvider locale="en">
        <Router history={history}>
          <Component {...props} />
        </Router>
      </IntlProvider>
    </Provider>,
  );

describe('<DatabaseDropdown />', () => {
  beforeAll(() => {
    const { store } = configureStore({});
    globalStore = store;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render and match the snapshot', () => {
    const { asFragment } = componentWrapper(DatabaseDropdown);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render dropdown menu with database options', async () => {
    request.mockResolvedValueOnce({
      status: 1,
      data: ['db1', 'db2', 'db3'],
    });

    const { getByText, getAllByText } = componentWrapper(DatabaseDropdown);

    // Ensure initial state
    await waitFor(() => {
      expect(getByText('db1')).toBeInTheDocument();
    });

    // Open the dropdown menu
    fireEvent.click(getByText('db1'));

    // Verify that menu items are displayed
    await waitFor(() => {
      expect(getAllByText('db1')[0]).toBeInTheDocument();
      expect(getByText('db2')).toBeInTheDocument();
      expect(getByText('db3')).toBeInTheDocument();
    });
  });

  it('Handles button click interaction', async () => {
    request.mockResolvedValueOnce({
      status: 1,
      data: ['db1', 'db2', 'db3'],
    });

    const { getByText } = componentWrapper(DatabaseDropdown);

    // Open the dropdown menu
    fireEvent.click(getByText('Select'));

    // Check that dropdown is clickable
    await waitFor(() => {
      expect(getByText('db1')).toBeInTheDocument();
    });
  });

  it('Handles menu item selection', async () => {
    request.mockResolvedValueOnce({
      status: 1,
      data: ['db1', 'db2', 'db3'],
    });

    const { getByText, getAllByText } = componentWrapper(DatabaseDropdown);

    // Open the dropdown menu
    await waitFor(() => {
      expect(getByText('db1')).toBeInTheDocument();
    });

    fireEvent.click(getAllByText('db1')[0]);

    // Click on a menu item
    fireEvent.click(getByText('db2'));
  });

  it('Handles loading state properly', async () => {
    // Mock response as an empty array
    request.mockResolvedValueOnce({
      status: 1,
      data: [],
    });

    const { getByText } = componentWrapper(DatabaseDropdown);

    // Ensure dropdown is in a loading state
    await waitFor(() => {
      expect(getByText('Select')).toBeDisabled();
    });
  });

  it('mapDispatch to props', () => {
    const mockDispatch = jest.fn();
    const returnValue = mapDispatchToProps(mockDispatch);
    returnValue.setDBName('newDB');
    expect(mockDispatch).toHaveBeenCalledWith(setDatabaseName('newDB'));
  });
});
