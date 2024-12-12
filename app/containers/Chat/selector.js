import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectData = state => state.chat || initialState;

const selectChatHistory = () =>
  createSelector(
    selectData,
    dataState => dataState.chatHistory,
  );

const selectSearchValue = () =>
  createSelector(
    selectData,
    dataState => dataState.searchValue,
  );

const selectDatabaseName = () =>
  createSelector(
    selectData,
    dataState => dataState.databaseName,
  );

export { selectChatHistory, selectSearchValue, selectData, selectDatabaseName };
