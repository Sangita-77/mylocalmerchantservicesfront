const { createContext, useState, useEffect } = require("react");

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [pageLoading, setPageLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [token, setToken] = useState(
    () => sessionStorage.getItem("cc_set") || null
  );
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("logged_in"))
  );
  const [merchantToken, setMerchantToken] = useState();
  const [userToken, setUserToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AppContext.Provider
      value={{
        showToast,
        messageTitle,
        message,
        severity,
        token,
        loggedInUserId,
        userToken,
        merchantToken,
        pageLoading,
        isLoggedIn,
        isAuthenticated,
        setIsAuthenticated,
        setIsLoggedIn,
        setPageLoading,
        setToken,
        setUserToken,
        setMerchantToken,
        setLoggedInUserId,
        setShowToast,
        setMessageTitle,
        setMessage,
        setSeverity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
