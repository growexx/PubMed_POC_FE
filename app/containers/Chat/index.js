import React, { useState, useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Skeleton, notification } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useInjectReducer } from 'utils/injectReducer';
import request from 'utils/request';
import { StyledChat } from './StyledChat';
import ChatItem from '../../components/ChatItem';
import reducer from './reducer';
import { selectChatHistory, selectDatabaseName } from './selectors';
import { addChatAnswer, addChatQuestion, setChatHistory } from './actions';
import { addSidebarItem } from '../../components/SideBar/actions';
import { API_ENDPOINTS, ROUTES } from '../constants';

const key = 'chat';

export const getSources = sources => {
  const sourcesSet = new Set();
  sources.forEach(source => {
    const sourceArr = source.split('/');
    sourcesSet.add(sourceArr[sourceArr.length - 1]);
  });
  return Array.from(sourcesSet);
};

const Chat = ({
  isNew,
  chatHistory,
  addChatQue,
  setHistory,
  addChatAns,
  addNewSidebar,
  databaseName
}) => {
  useInjectReducer({ key, reducer });

  const { chatId } = useParams();

  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [userScrolling, setUserScrolling] = useState(false);

  const chatSectionRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatMessage(searchValue);
    }
  };

  const handleChatMessage = async message => {
    if (message.trim() === '') return;

    setLoading(true);
    setUserScrolling(false);

    try {
      if (firstRender && isNew) {
        window.history.pushState(null, '', `/chat/${chatId}`);
        addNewSidebar({ chatId, name: message.trim() });
        setFirstRender(false);
      }

      addChatQue(chatId, message.trim());

      setSearchValue('');

      const response = await request(API_ENDPOINTS.CHAT, {
        method: 'POST',
        body: { key: chatId, question: message.trim(), model: databaseName },
      });

      if (response.status === 1) {
        const answer = response.data.answer;
        const sources = getSources(response.data.sources);
        addChatAns(chatId, answer, sources);
      }
    } catch (error) {
      notification.error({ message: error.message });
    }

    setTyping(true);
    setLoading(false);
  };

  const loadChatHistory = async () => {
    setLoading(true);
    try {
      if (!chatHistory[chatId]) { 
        const response = await request(`${API_ENDPOINTS.CHAT}?id=${chatId}`, {
          method: 'GET',
        });

        if (response?.status === 1) {
          const chatHistoryData = [];

          // chatHistoryData.push({
          //   question: response.data.question,
          //   answer: response.data.answer,
          //   sources: getSources(response.data.sources),
          // });

          if (response.data.chat_history && Array.isArray(response.data.chat_history)) {
            response.data.chat_history.forEach(chat => {
              chatHistoryData.push({
                question: chat.question,
                answer: chat.answer,
                sources: getSources(chat.sources),
              });
            });
          }

          setHistory(chatId, chatHistoryData);
        } else {
          navigate(ROUTES.HOME);
        }
      }
    } catch (error) {
      notification.error({ message: error.message });
    }
    setLoading(false);
  };

  const shouldShowTyping = index => {
    if (typing && chatHistory[chatId]?.length - 1 === index) {
      return true;
    }
    return false;
  };

  const scrollToBottom = () => {
    const element = chatSectionRef.current;
    if (!userScrolling && element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  const handleScroll = () => {
    const element = chatSectionRef.current;
    if (element) {
      const isScrolledToBottom =
        element.scrollHeight - element.scrollTop === element.clientHeight;
      setUserScrolling(!isScrolledToBottom);
    }
  };

  useEffect(() => {
    if (!isNew) {
      loadChatHistory();
    } else {
      if (!chatHistory[chatId]) {
        setHistory(chatId, []);
      }
    }

    const chatElement = chatSectionRef.current;
    if (chatElement) {
      chatElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatElement) {
        chatElement.removeEventListener('scroll', handleScroll);
      }
      setTyping(false);
      setFirstRender(true);
      setSearchValue('');
      setLoading(false);
    };
  }, [chatId, isNew, chatHistory, setHistory, addNewSidebar, navigate]);

  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [chatHistory, loading]);

  return (
    <StyledChat>
      <div className="chat-section-wrapper" id="chat" ref={chatSectionRef}>
        {loading ? (
          <>
            <ChatItem skeleton content={<Skeleton active title={false} paragraph={{ rows: 1 }} />} />
            <ChatItem skeleton content={<Skeleton active />} bot />
          </>
        ) : chatHistory[chatId] && Array.isArray(chatHistory[chatId]) ? (
          chatHistory[chatId].map((chat, index) => (
            <div key={`${chatId}-${index}`}>
              <ChatItem content={chat.question} />
              {chat.answer ? (
                <ChatItem
                  content={chat.answer}
                  bot
                  typing={shouldShowTyping(index)}
                  sources={chat.sources}
                />
              ) : (
                <ChatItem
                  skeleton
                  content={<Skeleton active />}
                  bot
                />
              )}
            </div>
          ))
        ) : (
          <div>No chat history available.</div>
        )}
      </div>
      <div className="input-section-wrapper">
        <div className="input-wrapper">
          <Input.TextArea
            onPressEnter={handleSubmit}
            autoSize={{ minRows: 1, maxRows: 8 }}
            placeholder="Send a message"
            className="chat-input"
            value={searchValue}
            disabled={loading}
            onChange={e => setSearchValue(e.target.value)}
          />
          <Button
            className="send-btn"
            data-testid="SEND_CHAT_BTN"
            onClick={() => handleChatMessage(searchValue)}
            disabled={loading} 
          >
            <SendOutlined />
          </Button>
        </div>
      </div>
    </StyledChat>
  );
};

Chat.propTypes = {
  isNew: PropTypes.bool,
  chatHistory: PropTypes.object.isRequired,
  addChatQue: PropTypes.func.isRequired,
  setHistory: PropTypes.func.isRequired,
  addChatAns: PropTypes.func.isRequired,
  addNewSidebar: PropTypes.func.isRequired,
  databaseName: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  chatHistory: selectChatHistory(),
  databaseName: selectDatabaseName(),
});

const mapDispatchToProps = dispatch => ({
  addChatQue: (chatId, question) => dispatch(addChatQuestion(chatId, question)),
  addChatAns: (chatId, answer, sources) => dispatch(addChatAnswer(chatId, answer, sources)),
  setHistory: (chatId, history) => dispatch(setChatHistory(chatId, history)),
  addNewSidebar: data => dispatch(addSidebarItem(data)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Chat);
