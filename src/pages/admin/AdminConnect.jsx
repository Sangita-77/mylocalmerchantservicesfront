import React, { useContext, useState, useEffect } from "react";
import "./../../styles/styles.css";
import AdminDashBoardTopBar from '../../components/AdminDashBoardTopBar';
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import PreLoader from "../../components/PreLoader";
import { PiEyeLight } from "react-icons/pi";
import { AiOutlineDelete } from "react-icons/ai";
import ChatWindow from "../../components/ChatWindow";
import MessagesWindow from "../../components/MessagesWindow";

const AdminConnect = () => {
    const [connectedHistory, setConnectedHistory] = useState([]);
    const [merchantDetails, setMerchantDetails] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWindow, setShowChatWindow] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState(null);
    const [loadingChatId, setLoadingChatId] = useState(null);
    const [chatData, setChatData] = useState([]);
    const [selectedChatInfo, setSelectedChatInfo] = useState(null); 

    const { token } = useContext(AppContext);

    // const toggleChatWindow = () => {
    //     setShowChatWindow(false);
    // };

    useEffect(() => {
        const fetchData = async () => {
            const merchantId = localStorage.getItem("merchant_id");

            if (!merchantId) {
                console.error("No merchant_id in localStorage");
                return;
            }

            setLoading(true);

            try {
                const response = await axios.post(
                    `${BASE_URL}/getchatHistoryDetails`,
                    { merchant_id: merchantId },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.status) {
                    setConnectedHistory(response.data.connectedHistory || []);
                    setMerchantDetails(response.data.merchantDetails || []);
                    setUserDetails(response.data.userDetails || []);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error("API Error:", error);
            }

            setLoading(false);
        };

        fetchData();
    }, [token]);

    const handleViewClick = (connection) => {
        setSelectedConnection(connection);
        setShowChatWindow(true);
    };

    const handleViewChat = async (connected_id, user_id, merchant_id) => {
        try {
          setLoadingChatId(connected_id); // show loader on the button being clicked
          const res = await axios.post(
            `${BASE_URL}/getChat`,
            {
              connected_id,
              user_id,
              merchant_id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          if (res.data.status) {
            setChatData(res.data);
            setSelectedChatInfo({
              connected_id,
              user_id,
              merchant_id,
              merchant_name: res.data.merchant?.merchant_name,
            });
            setShowChatWindow(true);
          }
        } catch (error) {
          console.error("Error fetching chat:", error);
        } finally {
          setLoadingChatId(null); // hide button loader after chat fetch
        }
      };

    return (
        <div className="adminUserlistWrapper">
            <div className="adminDashboardContainer">
                <AdminDashBoardTopBar heading={"User Connect"} />

                <div className="adminUserlIstContainer">
                    <table className="tableContainer">
                        <thead className="theadContainer">
                            <tr>
                                <th className="th">Created</th>
                                <th className="th">Merchant Email</th>
                                <th className="th">User Email</th>
                                <th className="thActions">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="tbodyContainer">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="td" style={{ textAlign: "center", padding: "20px 0px" }}>
                                        <PreLoader />
                                    </td>
                                </tr>
                            ) : connectedHistory.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="td">
                                        No connections found
                                    </td>
                                </tr>
                            ) : (
                                connectedHistory.map((connection, index) => {
                                    const merchant = userDetails.find((m) => m.merchant_id === connection.merchant_id);
                                    const user = merchantDetails.find((u) => u.merchant_id === connection.user_id);

                                    return (
                                        <tr className="tr" key={index}>
                                            <td className="td">{new Date(connection.created_at).toLocaleString()}</td>
                                            <td className="td">{merchant ? merchant.user_id : "N/A"}</td>
                                            <td className="td">{user ? user.user_id : "N/A"}</td>
                                            <td className="actionTd">
                                                <button className="viewButton" disabled={loadingChatId === connection.connected_id} onClick={() => handleViewChat(connection.connected_id, connection.user_id, connection.merchant_id)}>
                                                    {/* <PiEyeLight size={22} color="white" /> */}
                                                    {loadingChatId === connection.connected_id ? (
                                                        <div className="spinner" style={{ width: "16px", height: "16px" }} />
                                                    ) : (
                                                        <PiEyeLight size={22} color="white" />
                                                    )}
                                                </button>
                                                <button className="delButton">
                                                    <AiOutlineDelete size={22} color="#E60E4E" style={{ cursor: "pointer" }} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {showWindow && (
            <MessagesWindow
                chatData={chatData}
                onClose={() => setShowChatWindow(false)}
                selectedInfo={selectedChatInfo}
            />
            )}
        </div>
    );
};

export default AdminConnect;
