import React, { useContext, useEffect, useState } from "react";
import "../../styles/styles.css";
import { IoSearch } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { PiEyeLight } from "react-icons/pi";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import MerchantViewDetailsModal from "../../components/MerchantViewDetailsModal";
import { AppContext } from "../../utils/context";
import PreLoader from "../../components/PreLoader";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

import { routes } from "../../utils/routes";
import { useNavigate } from "react-router-dom";
import DashBoardTopBar from "../../components/DashBoardTopBar";
import DashboardTopHeading from "../../components/DashboardTopHeading";

const MerchantAgentList = () => {
  const { token } = useContext(AppContext);
  const [userData, setUserData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: null, order: null });

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);

  const [searchByName, setSearchName] = useState("");
  const [searchByState, setSearchByState] = useState("");
  const [searchByZip, setSearchByZip] = useState("");
  const [searched, setSearched] = useState(false);
  const [DWtoTravel, setDWtoTravel] = useState("");
  const [searchByService, setSearchByService] = useState("");

  const [validationError, setValidationError] = useState({
    searchFieldError: "",
  });

  const navigate = useNavigate();

  const limit = 5;

  const fetchTableData = async (offset = 0) => {
    try {
      setLoading(true);
      const body = { offset };
      const response = await axios.post(
        `${BASE_URL}/getMerchantServicesOneInAll`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { users, pageCount, activePage } = response?.data?.data;

      setTableData(users || []);
      setPageCount(pageCount || 1);
      setActivePage(activePage || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaginate = (pageNo) => {
    const offsetPage = Math.max(0, pageNo); 
    if (searched) {
      handleSearchTableData(offsetPage);
    } else {
      fetchTableData(offsetPage);
    }
  };

  const toggleViewDetailsModal = (merchantId) => {
    setModalData(merchantId);
    setShowViewDetailsModal(true);
  };

  const handleSearchTableData = async (page = 1) => {
    const errors = {};
    if (
      !searchByName &&
      !searchByState &&
      !searchByZip &&
      !DWtoTravel &&
      !searchByService
    ) {
      errors.searchFieldError = "Please enter something in the search fields!";
      setValidationError(errors);
      return;
    }

    setValidationError({ searchFieldError: "" });

    try {
      setLoading(true);
      setSearched(true);

      const searchType = [];
      const text = [];

      if (searchByName) {
        searchType.push("name");
        text.push(searchByName);
      }
      if (searchByState) {
        searchType.push("state");
        text.push(searchByState);
      }
      if (searchByZip) {
        searchType.push("zipcode");
        text.push(searchByZip);
      }
      if (DWtoTravel) {
        searchType.push("distance");
        text.push(DWtoTravel);
      }
      if (searchByService) {
        searchType.push("service");
        text.push(searchByService);
      }

      const pageNumber = Number.isInteger(page) && page > 0 ? page : 1;
      const offset = (pageNumber - 1) * limit;

      const body = { searchType, text, offset };

      const response = await axios.post(
        `${BASE_URL}/searchingData`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { users, pageCount, activePage } = response?.data;

      setTableData(users || []);
      setPageCount(pageCount || 1);
      setActivePage(pageNumber); 
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchByName && !searchByState && !searchByZip && !searchByService) {
      setSearched(false);
      fetchTableData(0);
    }
  }, [searchByName, searchByState, searchByZip, searchByService]);

  useEffect(() => {
    fetchTableData();
  }, []);

  const createArray = (value) => {
    return Array.from({ length: value }, (_, i) => i + 1);
  };

  const createArray2 = (count) =>
    Array.from({ length: count }, (_, i) => i + 1);

  const handleFilterClick = async (field) => {
    let newOrder = "asc";
    if (sortConfig.field === field && sortConfig.order === "asc") {
      newOrder = "desc";
    }

    setSortConfig({ field, order: newOrder });
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/filterMerchantData`,
        {
          offset: 0,
          sortField: field,
          sortOrder: newOrder,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setTableData(response.data.users);
      }
    } catch (error) {
      console.error("Error filtering data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (sortField, sortOrder) => {

    const response = await axios.post(
      `${BASE_URL}/searchingData`,
      JSON.stringify({
        searchType: [], 
        text: [],
        offset: 0,
        sortField,
        sortOrder,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUserData(response.data.users);
  };

  return (
    <>
    <div className="userConnectedHistoryPageWrapper merchantAgentList">
      <DashBoardTopBar heading="Find Agents" />

      <div className="userConnectedHistoryContainer">
        <div className="merchantContainerHeader">
          <div className="merchantHeaderTitle">
            <DashboardTopHeading text="Agent List" />
          </div>
        </div>
      <div className="merchantListPageWrapper">
        <div className="merchantListTopSearchSection">
          <div className="merchantTopSearchSingleItem">
            <div className="searchTitle">Search by name</div>
            <div className="searchInputContainer">
              <input
                type="text"
                className="searchInput"
                placeholder="Search By Name"
                value={searchByName}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[A-Za-z\s]*$/.test(val)) {
                    setSearchName(val);
                    setActivePage(1); 
                  }
                }}
              />
            </div>
          </div>

          <div className="merchantTopSearchSingleItem">
            <div className="searchTitle">Search by Service</div>
            <div className="searchInputContainer">
              <select
                name="services"
                id="services"
                className="inputField selectField searchInput"
                value={searchByService}
                onChange={(e) => setSearchByService(e.target.value)}
              >
                <option value=""> Select Any Services </option>
                <option value="HighRisk"> High Risk </option>
                <option value="PointofSale"> Point Of Sale </option>
                <option value="Financing"> Merchant Cash Advance or Financing </option>
              </select>
            </div>
          </div>

          <div className="merchantTopSearchSingleItem">
            <div className="searchTitle">Search by state</div>
            <div className="searchInputContainer">
              <input
                type="text"
                className="searchInput"
                placeholder="Search By State"
                value={searchByState}
                onChange={(e) => setSearchByState(e.target.value)}
              />
            </div>
          </div>

          <div className="merchantTopSearchSingleItem">
            <div className="searchTitle">Search by zipcode</div>
            <div className="searchInputContainer">
              <input
                type="text"
                className="searchInput"
                placeholder="Search By Zipcode"
                value={searchByZip}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 6 && /^\d*$/.test(val)) setSearchByZip(val);
                }}
              />
            </div>
          </div>

          <div className="merchantTopSearchSingleItem">
            <div className="searchTitle">Search by Distance</div>
            <div className="searchInputContainer">
              <select
                name="cars"
                id="cars"
                className="inputField selectField searchInput"
                value={DWtoTravel}
                onChange={(e) => setDWtoTravel(e.target.value)}
                disabled={!searchByZip} 
              >
                <option value=""> Select Any Type </option>
                <option value="5"> &lt; 5 miles </option>
                <option value="10"> &lt; 10 miles </option>
                <option value="25"> &lt; 25 miles </option>
                <option value="50"> &lt; 50 miles </option>
                <option value="100"> &lt; 100 miles </option>
              </select>
            </div>
          </div>

          <button
            className="searchBtn"
            onClick={() => handleSearchTableData(0)}
          >
            <IoSearch size={24} color="white" />
            Search
          </button>
        </div>

        {validationError.searchFieldError && (
          <div className="errorText">{validationError.searchFieldError}</div>
        )}

        <div className="merchantListTableSection">
          <div className="merchantListSingleTablePart">
            <div className="tableTitle">
              {searched ? "Search Results" : "Agents"}
            </div>

            <div className="tableWrapper" style={{ position: "relative" }}>
              {loading && (
                <div className="tableOverlayLoader">
                  <PreLoader text="Fetching data..." />
                </div>
              )}

              <table className="tableContainer">
                <thead
                  className="theadContainer"
                  style={{ backgroundColor: "#71cdea" }}
                >
                  <tr>
                    <th className="th">
                      Name{" "}
                      {sortConfig.field === "name" && sortConfig.order === "asc" ? (
                        <AiFillCaretUp
                          size={14}
                          color="#fff"
                          style={{ cursor: "pointer" }}
                          title="Sort by Name"
                          onClick={() => handleFilterClick("name")}
                        />
                      ) : (
                        <AiFillCaretDown
                          size={14}
                          color="#fff"
                          style={{ cursor: "pointer" }}
                          title="Sort by Name"
                          onClick={() => handleFilterClick("name")}
                        />
                      )}
                    </th>
                    <th className="th">
                      Company Name{" "}
                      {sortConfig.field === "company_name" && sortConfig.order === "asc" ? (
                        <AiFillCaretUp
                          size={14}
                          color="#fff"
                          style={{ cursor: "pointer" }}
                          title="Sort by Company Name"
                          onClick={() => handleFilterClick("company_name")}
                        />
                      ) : (
                        <AiFillCaretDown
                          size={14}
                          color="#fff"
                          style={{ cursor: "pointer" }}
                          title="Sort by Company Name"
                          onClick={() => handleFilterClick("company_name")}
                        />
                      )}
                    </th>
                    <th className="th">
                      Average Rating{" "}
                      {sortConfig.field === "average_rating" &&
                      sortConfig.order === "asc" ? (
                        <AiFillCaretUp
                          size={14}
                          color="#fff"
                          style={{ cursor: "pointer" }}
                          title="Sort by Rating"
                          onClick={() => handleFilterClick("average_rating")}
                        />
                      ) : (
                        <AiFillCaretDown
                          size={14}
                          color="#fff"
                          style={{ cursor: "pointer" }}
                          title="Sort by Rating"
                          onClick={() => handleFilterClick("average_rating")}
                        />
                      )}
                    </th>
                    <th className="thActions">Actions</th>
                  </tr>
                </thead>

                <tbody className="tbodyContainer">
                  {tableData.length > 0 ? (
                    tableData.map((row, i) => (
                      <tr className="tr" key={i}>
                        <td className="td">
                          {row?.first_name && row?.last_name
                            ? `${row.first_name} ${row.last_name}`
                            : row?.merchant_name}
                        </td>
                        <td className="td">{row?.company_name}</td>
                        <td className="td ratingColWrap">
                          <div className="ratingCol">
                            <span style={{ fontWeight: "500" }}>
                              {row?.average_rating
                                ? row.average_rating.toFixed(1)
                                : "0.0"}
                            </span>
                            <div className="starWrap">
                              {[...Array(5)].map((_, index) => {
                                const filled =
                                  index < Math.round(row?.average_rating || 0);
                                return (
                                  <span
                                    key={index}
                                    style={{
                                      color: filled ? "#FFD700" : "#ccc",
                                      fontSize: "18px",
                                    }}
                                  >
                                    ★
                                  </span>
                                );
                              })}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              ({row?.review_count || 0} review
                              {(row?.review_count || 0) !== 1 ? "s" : ""})
                            </div>
                          </div>
                        </td>
                        <td className="actionTd">
                          <button
                            className="viewButton"
                            onClick={() =>
                              navigate(routes.agent_details(row?.merchant_id))
                            }
                          >
                            <PiEyeLight size={22} color="#23b7e5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    !loading && (
                      <tr>
                        <td colSpan="4" className="noResultFound">
                          No Entries Found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {searched && tableData.length > 0 && (
          <div className="merchantTablePaginationContainer">
            <button
              className={`pageChangeBtns ${
                activePage === 1 && "pageChangeDisabledBtn"
              }`}
              onClick={() => handlePaginate(activePage)}
              disabled={activePage === 1}
            >
              <MdOutlineKeyboardDoubleArrowLeft size={24} color="white" />
            </button>

            {createArray(pageCount).map((pageNo) => (
              <div
                key={pageNo}
                className={`pageNo ${activePage === pageNo && "activePage"}`}
                onClick={() => handlePaginate(pageNo)}
              >
                {pageNo}
              </div>
            ))}

            <button
              className={`pageChangeBtns ${
                activePage === pageCount && "pageChangeDisabledBtn"
              }`}
              onClick={() => handlePaginate(activePage)}
              disabled={activePage === pageCount}
            >
              <MdOutlineKeyboardDoubleArrowRight size={22} color="white" />
            </button>
          </div>
        )}
        {!searched && (
          <div className="merchantTablePaginationContainer">
            <button
              className={`pageChangeBtns ${
                activePage === 1 && "pageChangeDisabledBtn"
              }`}
              onClick={() => handlePaginate(activePage - 2)}
              disabled={activePage === 1}
            >
              <MdOutlineKeyboardDoubleArrowLeft size={24} color="white" />
            </button>

            {createArray(pageCount).map((pageNo) => (
              <div
                key={pageNo}
                className={`pageNo ${activePage === pageNo && "activePage"}`}
                onClick={() => handlePaginate(pageNo - 1)}
              >
                {pageNo}
              </div>
            ))}

            <button
              className={`pageChangeBtns ${
                activePage === pageCount && "pageChangeDisabledBtn"
              }`}
              onClick={() => handlePaginate(activePage)}
              disabled={activePage === pageCount}
            >
              <MdOutlineKeyboardDoubleArrowRight size={22} color="white" />
            </button>
          </div>
        )}
      </div>

      </div>

      {showViewDetailsModal && (
        <MerchantViewDetailsModal
          id={modalData}
          handleClose={() => setShowViewDetailsModal(false)}
        />
      )}
      </div>
    </>
  );
};

export default MerchantAgentList;

