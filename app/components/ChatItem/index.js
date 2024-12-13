import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Typist from 'react-typist';
// import GrowExxLogo from '../../images/Growexx-Triangle.svg';
import GrowExxLogo from '../../images/Icon.png';
import ProfileLogo from '../../images/Profile.svg';
import { StyledChatItem } from './ChatItemStyled';
import axios from 'axios';
import { API_ENDPOINTS } from '../../containers/constants';
function ChatItem({
  bot,
  content,
  typing,
  skeleton = false,
  sources = [],
  scrollToBottom = () => {},
  setLoading = () => {},
}) {
  const origin = window.location.origin;
  const [logo, setLogo] = useState(GrowExxLogo);
  const [showButton, setShowButton] = useState(!typing);
  const [showPdfs, setShowPdfs] = useState(false);
  const [render, setRender] = useState(true);
  const pdfsPath = '../../../pdfs/';

  useEffect(() => {
    setShowButton(!typing);
    setShowPdfs(false);

    const fetchLogo = async () => {
      try {
        const logoResponse = await axios.get(`${API_ENDPOINTS.GET_LOGO}?origin=${origin}`);
        const { logo } = logoResponse.data;
        if (logo) {
          setLogo(logo);
        }
        
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [render]);

  return (
    <StyledChatItem>
      <div className={`chat-history-wrapper ${bot && 'bot'}`}>
        <div className="chat-wrapper">
          <div className="avatar-wrapper">
            {bot ? (
              <img src={logo} alt="avatar" />
            ) : (
              <img src={ProfileLogo} alt="avatar" />
            )}
          </div>
          <div className="chat-content-wrapper">
            {typing ? (
              <Typist
                avgTypingDelay={-20}
                cursor={{ show: false, hideWhenDone: true }}
                onCharacterTyped={() => {
                  scrollToBottom();
                }}
                onTypingDone={() => {
                  setShowButton(true);
                  setLoading(false);
                }}
              >
                <div>
                  {!skeleton ? (
                    content
                      .split('\n')
                      .map((line, index) => (
                        <p key={`${line[0]}${index.toString()}`}>{line}</p>
                      ))
                  ) : (
                    <>{content}</>
                  )}
                </div>
              </Typist>
            ) : (
              <div className="content-wrapper">
                {!skeleton ? (
                  content
                    ?.toString()
                    .split('\n')
                    .map((line, index) => (
                      <p key={`${line[0]}${index.toString()}`}>{line}</p>
                    ))
                ) : (
                  <>
                    {content}
                    {() => setRender(!render)}
                  </>
                )}
              </div>
            )}
            {showButton && bot && !skeleton && (
              <div className="source-wrapper">
                <Button
                  className="source-btn"
                  onClick={() => setShowPdfs(!showPdfs)}
                >
                  Sources
                </Button>
                {showPdfs &&
                  sources.map(source => (
                    <a target="_blank" href={`${process.env.REACT_APP_S3_LINK}/${source}`} key={source} download>
                      {source}
                    </a>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StyledChatItem>
  );
}

export default ChatItem;

ChatItem.propTypes = {
  bot: PropTypes.bool,
  content: PropTypes.any,
  typing: PropTypes.bool,
  sources: PropTypes.array,
};
