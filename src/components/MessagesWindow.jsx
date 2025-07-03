import React from "react";
import "./../styles/styles.css";
import { IoMdClose } from "react-icons/io";
import bgEclipseImg from "./../assets/images/merchant_list_bg_eclipse.png";
import { BsSendFill } from "react-icons/bs";

const MessagesWindow = ({ onClose, chatData = [], selectedInfo = {} }) => {
  // console.log("chatData.........................",chatData);
  // console.log("selectedInfo....................",selectedInfo);
  return (
    <>
      <div className="messagesOverlay" />
      <div className="messagesWindowWrapper">
        <div className="messagesWindowTop">
          <div className="messagesWindowCloseBtn" onClick={() => onClose()}>
            <IoMdClose color="white" size={24} />
          </div>
        </div>

        <div className="messagesWindowContainer">
        <div className="messagesWindowInner">
          {chatData?.chat?.map((chat, index) => {
            const isUserChat = chat.user_chat;
            const isMerchantChat = chat.merchant_chat;

            return (
              <div
                key={index}
                className={isUserChat ? "usersMessageContainer" : "ownMessageContainer"}
              >
                <div className="messageContainerTop">
                  <div className="username">
                    {isUserChat
                      ? chatData?.user?.merchant_name || "User"
                      : chatData?.merchant?.merchant_name || "Merchant"}
                  </div>
                </div>
                <div className="messageText">
                  {isUserChat ? chat.user_chat : chat.merchant_chat}
                </div>
                <div className="messageTime">
                  {new Date(chat.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })}
        </div>

          {/* 

          <div className="writeMessageView">
            <input
              type="text"
              className="writeMessageInput"
              placeholder="Type your message here..."
            />
            <button className="sendMessageButton">
              <BsSendFill color="white" size={24} />
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default MessagesWindow;
