import styled from 'styled-components';

export const StyledChat = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: @chat-bot-bg;

  .chat-section-wrapper {
    overflow-y: auto;
    padding-bottom: 50px;
  }

  .input-section-wrapper {
    width: 50vw;
    margin: 30px auto;
    margin-top: 10px;
    @media only screen and (max-width: 1000px) {
      width: 90%;
    }
  }

  .chat-input {
    color: @primary-font-color;
    background-color: @sidebar-bg;
    border-color: @sidebar-bg;
    border-radius: 0.75rem;
    padding: 16px;
    padding-right: 64px;

    &::placeholder {
    color: @primary-font-color; 
    opacity: 1;
  }
  }

  .chat-input:focus {
    box-shadow: none;
  }

  .default-option-container {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-auto-flow: row;
    width: 100%;
    padding: 0rem 0.5rem;
  }

  .default-options {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    gap: 0.75rem;
  }

  .default-options .option-card {
    font-weight: 600;
    width: 100%;
    height: 100%;
    text-align: left;
    overflow: hidden;
    color: @secondary-font-color;
    background-color: @sidebar-bg;
    padding: 8px 12px;
    margin: 5px 10px;
    border: 1px solid rgb(86, 88, 105);
    border-radius: 0.75rem;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .default-options .option-card .card-content {
    font-weight: 500;
    opacity: 0.5;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .option-card:hover {
    cursor: pointer;
    background-color: @chat-bot-bg;
  }

  .send-btn {
    bottom: 44px;
    left: calc(50vw - 60px);
    background-color: @button-color !important;
    border: none;
    color: @primary-font-color !important;
    padding: 0px 14px;

    @media only screen and (max-width: 1000px) {
      left: calc(100% - 60px);
    }
  }

  @media only screen and (max-width: 576px) {
    .default-options {
      flex-direction: column;
    }

    .default-options.options-1 {
      display: none;
    }
  }
`;
