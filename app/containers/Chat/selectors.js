import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectData = state => state.chat || initialState;

const selectChatHistory = () =>
  createSelector(
    selectData,
    dataState => dataState.chatHistory,
  );

  const selectDatabaseName = () =>
    createSelector(
      selectData,
      dataState => dataState.databaseName,
    );

export { selectChatHistory, selectData, selectDatabaseName };
