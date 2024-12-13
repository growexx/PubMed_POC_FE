import styled from 'styled-components';

export const StyledChatItem = styled.div`
  .chat-history-wrapper {
    width: 100%;
    border-bottom: 1px solid rgba(32, 33, 35, 0.5);
  }

  .chat-history-wrapper.bot {
    background-color: @secondary-font-color;
  }

  .chat-wrapper {
    max-width: 50vw;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 1.5rem;
    margin: auto;
    padding: 24px 0px;
    color: @primary-font-color;
    font-size: 16px;
    @media only screen and (max-width: 1000px) {
      max-width: 90%;
      width: 90%;
    }
  }

  .avatar-wrapper img {
    width: 30px;
  }

  .chat-content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .source-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .source-btn {
    width: fit-content;
    background-color: @button-color;
    color: @primary-font-color;
  }

  .source-wrapper a {
    color: @primary-font-color;
    text-decoration: underline;
  }
`;
