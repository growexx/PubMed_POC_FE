/**
 *
 * Tests for UploadFiles
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */
import React from 'react';
import { render ,screen} from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { createMemoryHistory } from 'history';
import configureStore from '../../../configureStore';
import { mockFetch } from "../mockFetch";
import '@testing-library/jest-dom'
// import 'jest-dom/extend-expect'; // add some helpful assertions

import UploadFiles from "../index";

describe("<UploadFiles />", () => {
  beforeAll(()=>{
    window.fetch = mockFetch({'success': true });
    render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <Router history={history}>
            <UploadFiles/>
          </Router>
        </IntlProvider>
      </Provider>,
    );
  })
  

  const history = createMemoryHistory();
  const { store } = configureStore({});
  // it('should  display the files upload div', async () => {
    
  //   const element = screen.getByTestId('upload-files');
  //   console.log(element);
  //   expect(element).toBeInTheDocument()
  // });
  it('should display the selected files button', async () => {
    
    const fileInputLabel = screen.getByText(/Selected Files/i);
    expect(fileInputLabel).toBeInTheDocument()

});


  // it("Expect to have additional unit tests specified", () => {
  //   expect(true).toEqual(false);
  // });

  // /**
  //  * Unskip this test to use it
  //  *
  //  * @see {@link https://jestjs.io/docs/en/api#testskipname-fn}
  //  */
  // it.skip("Should render and match the snapshot", () => {
  //   const {
  //     container: { firstChild }
  //   } = render(
  //     <IntlProvider locale={DEFAULT_LOCALE}>
  //       <UploadFiles />
  //     </IntlProvider>
  //   );
  //   expect(firstChild).toMatchSnapshot();
  // });
});
