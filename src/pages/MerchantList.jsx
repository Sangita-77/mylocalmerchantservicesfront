import React, { useContext, useEffect, useState } from "react";
import "./../styles/styles.css";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { PiEyeLight } from "react-icons/pi";
import {
  apiErrorHandler,
  calculateTableDataLength,
  prepareTableData,
  textUppercase,
} from "../utils/helper";
import axios from "axios";
import { BASE_URL } from "../utils/apiManager";
import MerchantViewDetailsModal from "../components/MerchantViewDetailsModal";
import { AppContext } from "../utils/context";
import bgEclipse from "./../assets/images/merchant_list_bg_eclipse.png";
import PreLoader from "../components/PreLoader";

const MerchantList = () => {
  const [loading, setLoading] = useState(false);
  const [merchantTypes, setMerchantTypes] = useState();
  const [merchantTypeError, setMerchantTypeError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchTableData, setSearchTableData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [tableIndex, setTableIndex] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchByName, setSearchName] = useState("");
  const [searchByState, setSearchByState] = useState("");
  const [searchByZip, setSearchByZip] = useState("");
  const [searchByType, setSearchByType] = useState("");
  const [searchResults, setSearchResults] = useState(0);

  let searchParams = [];
  let searchParamsValue = [];
  let searchResultsNumber=0 
  const { token } = useContext(AppContext);
   console.log("Context token from list===>", token);

  useEffect(() => {
    fetchTableData();
    fetchAllMerchantTypes();
  }, []);


  const createArray = (value) => {
    let arr = [];
    for (let i = 1; i < value + 1; i++) {
      arr.push(i);
    }
    return arr;
  };

  const handlePaginate = async (type, offset, index) => {
    setTableLoading(true);
    try {
      setTableIndex(index);

      console.log("pagination offset===>", offset);
      const body = {
        flag: type,
        offset: offset,
      };
      const response = await axios.post(
        `${BASE_URL}/paginationMerchantOneInAll`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`Paginate table response===>`, response);

      if (response?.status === 200) {
        const newData = response?.data;
        const newTableData = [...tableData];
        newTableData[index] = newData;
        setTableData(newTableData);
      }
    } catch (error) {
      console.log(error);
      // const errMsg = apiErrorHandler(error)
    } finally {
      setTableLoading(false);
      setTableIndex(null);
    }
  };

  const fetchTableData = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/getMerchantServicesOneInAll`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`Table data new response===>`, response?.data?.data);

      if (response?.status === 200) {
        const data = response?.data?.data;
        setTableData(data);
      }
    } catch (error) {
      console.log(error);
      // const errMsg = apiErrorHandler(error)
    } finally {
      setLoading(false);
    }
  };

  const toggleViewDetailsModal = (data) => {
  
  setModalData(data)
  
   setShowViewDetailsModal(true)
   };

  const handleSearchTableData = async () => {
    if (!searchByName && !searchByState && !searchByType && !searchByZip) {
      return alert("Please enter something in the search field!!");
 
    }
   
    try {
      setLoading(true);
      setSearched(true);
      const body = {
        searchType: searchParams,
        text: searchParamsValue,
        offset: 1,
      };
console.log("data",body)
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
       console.log("Search response=====>", response?.data?.users);
      const data = response?.data?.users;

      const tableData = prepareTableData(data);
      setSearchTableData(tableData);

      console.log("Searched table data===>", tableData);

       searchResultsNumber = calculateTableDataLength(tableData);
   
       if (tableData.length === 0) {
  console.log("No data found, setting searchResultsNumber to 0.");
  setSearchResults(0);
}
      setSearchResults(searchResultsNumber);
     
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // console.log("TableData========>", tableData);

  const fetchAllMerchantTypes = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/getUserTypes`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        const data = response?.data?.userTypes || [];
        setMerchantTypes(data);
      }

      // console.log("Type response===>", response);
    } catch (error) {
      const errMsg = apiErrorHandler(error);
      setMerchantTypeError(errMsg);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   if (token) {
  //     fetchTableData();
  //     fetchAllMerchantTypes();
  //   }
  // }, [token]);

  useEffect(() => {
    // console.log("CONSOLE=========>", searchByName, searchParams);
    // if (searchParams.includes("name") === true) {
    //   console.log(" exists in the array");
    // } else {
    //   console.log(" does not exist in the array");
    // }

    if (searchByName) {
      if (searchParams.includes("name") === false) {
        searchParams.push("name");
      }
      searchParamsValue.push(searchByName);
    } else {
      if (searchParams.includes("name") === true);
      searchParams.splice(0, 1);
      searchParamsValue.splice(0, 1);
    }

    if (searchByState) {
      if (searchParams.includes("state") === false) {
        searchParams.push("state");
      }
      searchParamsValue.push(searchByState);
    } else {
      if (searchParams.includes("state") === true);
      searchParams.splice(1, 1);
      searchParamsValue.splice(1, 1);
    }

    if (searchByZip) {
      if (searchParams.includes("zipcode") === false) {
        searchParams.push("zipcode");
      }
      searchParamsValue.push(searchByZip);
    } else {
      if (searchParams.includes("zipcode") === true);
      searchParams.splice(2, 1);
      searchParamsValue.splice(2, 1);
    }

    if (searchByType) {
      if (searchParams.includes("type") === false) {
        searchParams.push("type");
      }
      searchParamsValue.push(searchByType);
    } else {
      if (searchParams.includes("type") === true);
      searchParams.splice(3, 1);
      searchParamsValue.splice(3, 1);
    }
  }, [searchByName, searchByState, searchByZip, searchByType]);
useEffect(() => {
  
  if (
    searchByName === "" &&
    searchByState === "" &&
    searchByType === "" &&
    searchByZip === ""
  ) {
    setSearched(false)
   
    fetchTableData();
  }
}, [searchByName, searchByState, searchByZip, searchByType]);
const getHeaderColor = (index) => {
  const colors = ["#71cdea", "#DAA520", "#98fb98", "#71cdea"];
  return colors[index % colors.length]; 
};

  return (
    <>
      {loading ? (
        <div className="merchantListLoaderWrapper">
          <PreLoader text={"Loading.."} />
          {searched === true ? (
            <div className="merchantListLoadingText">
              Searching for results...
            </div>
          ) : (
            <div className="merchantListLoadingText">Fetching data...</div>
          )}
        </div>
      ) : (
        <div className="merchantListPageWrapper">
          <div className="merchantListTopSearchSection">
            <div className="merchantTopSearchSingleItem">
              <div className="searchTitle">Search by name</div>
              <div className="searchInputContainer">
                <input
                  type="text"
                  className="searchInput"
                  placeholder="Search by name"
                  value={searchByName}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(inputValue)) {
                      setSearchName(inputValue);
                    }
                  }}
                />
              </div>
            </div>

            <div className="merchantTopSearchSingleItem">
              <div className="searchTitle">Search by state</div>
              <div className="searchInputContainer">
                <input
                  type="text"
                  className="searchInput"
                  placeholder="Search by state"
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
                  placeholder="Search by zipcode"
                  value={searchByZip}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 6 && /^\d*$/.test(inputValue)) {
                      setSearchByZip(inputValue);
                    }
                  }}
                />
              </div>
            </div>

            <div className="merchantTopSearchSingleItem">
              <div className="searchTitle">Search by type</div>
              <div className="searchInputDropdownContainer">
                <select
                  className="searchInputDropdown"
                  value={searchByType}
                  onChange={(e) => setSearchByType(e.target.value)}
                >
                  <option value="" style={{ color: "#b7cce4" }}>
                    -- Search by type --
                  </option>
                  {merchantTypes?.map((type, i) => (
                    <option
                      value={type?.type}
                      key={i}
                      style={{ color: "black" }}
                    >
                      {textUppercase(type?.type)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="searchBtn"
              onClick={() => handleSearchTableData()}
            >
              <IoSearch size={24} color="white" />
              Search
            </button>
          </div>

          {searched === true && (
            <div className="searchResultsText">
              Showing {searchResults} results
            </div>
          )}

          <div className="merchantListTableSection">
            {searched === false ? (
              tableData?.map((table, index) => (
                <div>
                  <div className="merchantListSingleTablePart" key={index}>
                    <div className="tableTitle">
                      {textUppercase(table?.type)}
                    </div>

                    <div className="tableWrapper">
                      {index === tableIndex && (
                        <div className="merchantTableSearchLoaderContainer">
                          <PreLoader />
                          <div>Changing page..</div>
                        </div>
                      )}
                      <table className="tableContainer">
                        <thead className="theadContainer" style={{ backgroundColor: getHeaderColor(index) }}>
                          <tr>
                            <th className="th">Name</th>
                            <th className="th">Email</th>
                            <th className="th">Industry</th>
                            <th className="thActions">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="tbodyContainer">
                          {table?.users?.map((row, i) => (
                            <tr className="tr" key={i}>
                              <td className="td">{row?.merchant_name}</td>
                              <td className="td">{row?.user_id}</td>
                              <td className="td">{row?.industry}</td>
                              <td className="actionTd">
                                <button
                                  className="viewButton"
                                  onClick={() => toggleViewDetailsModal(row?.merchant_id)}
                                >
                                  <PiEyeLight size={22} color="#23b7e5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="merchantTablePaginationContainer">
                    <button
                      className={`pageChangeBtns ${
                        (createArray(table?.pageCount)?.length === 1 ||
                          table?.activePage === 1) &&
                        "pageChangeDisabledBtn"
                      }`}
                      onClick={() =>
                        handlePaginate(
                          table?.type,
                          table?.activePage - 2,
                          index
                        )
                      }
                      disabled={table?.activePage === 1 ? true : false}
                    >
                      <MdOutlineKeyboardDoubleArrowLeft
                        size={24}
                        color="white"
                      />
                    </button>

                    {createArray(table?.pageCount).map((pageNo, ind) => (
                      <div
                        className={`pageNo ${
                          table?.activePage === pageNo && "activePage"
                        }`}
                        key={ind}
                        onClick={() => handlePaginate(table?.type, ind, index)}
                      >
                        {pageNo}
                      </div>
                    ))}

                    <button
                      className={`pageChangeBtns ${
                        (createArray(table?.pageCount).length === 1 ||
                          table?.pageCount === table?.activePage) &&
                        "pageChangeDisabledBtn"
                      }`}
                      onClick={() =>
                        handlePaginate(table?.type, table?.activePage, index)
                      }
                      disabled={
                        table?.pageCount === table?.activePage ? true : false
                      }
                    >
                      <MdOutlineKeyboardDoubleArrowRight
                        size={22}
                        color="white"
                      />
                    </button>
                  </div>
                </div>
              ))
            ) : searchResults=== 0 ? (
              <div className="noResultFound">No Entries Found</div>
            ) : (
              searchTableData?.map((table, index) => (
                <div>
                  <div className="merchantListSingleTablePart" key={index}>
                    <div className="tableTitle">
                      {textUppercase(table?.tableTitle)}
                    </div>

                    <div className="tableWrapper">
                      <table className="tableContainer">
                        <thead className="theadContainer" style={{ backgroundColor: getHeaderColor(index) }} >
                          <tr>
                            <th className="th">Name</th>
                            <th className="th">Email</th>
                            <th className="th">Industry</th>
                            <th className="thActions">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="tbodyContainer">
                          {table?.data?.map((row, i) => (
                            <tr className="tr" key={i}>
                              <td className="td">{row?.merchant_name}</td>
                              <td className="td">{row?.user_id}</td>
                              <td className="td">{row?.industry}</td>
                              <td className="actionTd">
                                <button
                                  className="viewButton"
                                  onClick={() => toggleViewDetailsModal(row)}
                                >
                                  <PiEyeLight size={22} color="#23b7e5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* <div className="merchantTablePaginationContainer">
                      <button
                        className={`pageChangeBtns ${
                          (createArray(table?.pageCount)?.length === 1 ||
                            table?.activePage === 1) &&
                          "pageChangeDisabledBtn"
                        }`}
                        onClick={() =>
                          handlePaginate(
                            table?.type,
                            table?.activePage - 2,
                            index
                          )
                        }
                        disabled={table?.activePage === 1 ? true : false}
                      >
                        <MdOutlineKeyboardDoubleArrowLeft
                          size={24}
                          color="white"
                        />
                      </button>

                      {createArray(table?.pageCount).map((pageNo, ind) => (
                        <div
                          className={`pageNo ${
                            table?.activePage === pageNo && "activePage"
                          }`}
                          key={ind}
                          onClick={() =>
                            handlePaginate(table?.type, pageNo, index)
                          }
                        >
                          {pageNo}
                        </div>
                      ))}

                      <button
                        className={`pageChangeBtns ${
                          (createArray(table?.pageCount).length === 1 ||
                            table?.pageCount === table?.activePage) &&
                          "pageChangeDisabledBtn"
                        }`}
                        onClick={() =>
                          handlePaginate(table?.type, table?.activePage, index)
                        }
                        disabled={
                          table?.pageCount === table?.activePage ? true : false
                        }
                      >
                        <MdOutlineKeyboardDoubleArrowRight
                          size={22}
                          color="white"
                        />
                      </button>
                    </div> */}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showViewDetailsModal && (
        <MerchantViewDetailsModal
          id={modalData}
          handleClose={() => setShowViewDetailsModal(false)}
        />
      )}
    </>
  );
};

export default MerchantList;
