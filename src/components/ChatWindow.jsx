import React, { useContext, useEffect, useRef, useState } from "react";
import "./../styles/styles.css";
import { IoMdClose } from "react-icons/io";
import bgEclipseImg from "./../assets/images/merchant_list_bg_eclipse.png";
import { BsSendFill } from "react-icons/bs";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import { AppContext } from "../utils/context";
import PreLoader from "../components/PreLoader";
import { trackActivity } from "../utils/activityTracker";

const ChatWindow = ({
  onClose,
  connection,
  connectedHistory,
  merchantDetails,
}) => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sentConnections, setSentConnections] = useState([]);

  const chatRef = useRef();
  const { token, loggedInUserId } = useContext(AppContext);

  const merchant_id = parseInt(localStorage.getItem("merchant_id"));
  const user_id = connection.merchant_id;
  const connected_id = connection.connected_id;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setSendingMessage(true);
    axios
      .post(
        `${BASE_URL}/adminChatting`,
        {
          connected_id,
          user_id,
          merchant_id,
          merchant_chat: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status) {
          setChatList((prev) => [...prev, response.data.chat]);
          setMessage("");

          if (merchant_id && user_id) {
            trackActivity({
              merchant_id,
              agent_id: Number(user_id),
              action: "chat",
              token,
              meta: {
                connected_id,
                message_excerpt: message.slice(0, 120),
              },
            }).catch((err) =>
              console.warn("Failed to log chat activity", err)
            );
          }

          // Save unique connection info if not already stored
          setSentConnections((prev) => {
            const exists = prev.some(
              (item) =>
                item.user_id === user_id && item.connected_id === connected_id
            );
            if (!exists) {
              return [...prev, { user_id, connected_id }];
            }
            return prev;
          });
        }
      })
      .catch((error) => {
        console.error("Message send error:", error);
      })
      .finally(() => {
        setSendingMessage(false);
      });
  };

  // Fetch chat history on mount or when connection changes
  useEffect(() => {
    setLoading(true);

    axios
      .post(
        `${BASE_URL}/getChatIndivitually`,
        { user_id, merchant_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("chatResponse===>", response);
        if (response.data.status) {
          setChatList(response.data.chat);
        }
      })
      .catch((error) => {
        console.error("Chat fetch error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [connection, token]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatList]);

  return (
    <>
      <div className="chatOverlay" />
      <div className="chatWindowWrapper">
        {sendingMessage === true && (
          <div className="chatMessageSendingLoader">
            <div>Sending message..</div>
          </div>
        )}
        <div className="chatWindowTop">
          <div className="chatWindowCloseBtn" onClick={onClose}>
            <IoMdClose color="#000" size={24} />
          </div>
          {/* <div className="userName">{connection?.merchant_name || "Chat"}</div> */}
        </div>
        <div className="chatWindowContainer">
          {loading ? (
            <div className="chatWindowLoaderContainer">
              <PreLoader />
            </div>
          ) : (
            <div className="chatWindowInner" ref={chatRef}>
              <div className="userName">{connection?.merchant_name || "Chat"}</div>
              <div className="successConnectionMessage">
                {"Hi you are successfully connected with " +
                  connection?.merchant_name}
              </div>

              {chatList.map((msg, index) => (
                <React.Fragment key={index}>
                  {msg.user_chat && (
                    <div className="usersMessageContainer">{msg.user_chat}</div>
                  )}
                  {msg.merchant_chat && (
                    <div className="ownMessageContainer">
                      {msg.merchant_chat}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="writeMessageView">
            <input
              type="text"
              className="writeMessageInput"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button className="sendMessageButton" onClick={handleSendMessage} data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title="Send Message to The Merchant Services Providers">
              <BsSendFill color="white" size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
