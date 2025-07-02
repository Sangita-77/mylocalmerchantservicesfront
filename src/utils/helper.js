import axios from "axios";
import { BASE_URL } from "./apiManager";
import { useContext } from "react";
import { AppContext } from "./context";

export const apiErrorHandler = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    error?.response?.message ||
    error?.data?.meessage
  );
};

export const getAuthToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/authToken`, {
      email: "sangita@dreamlogodesign.com",
      password: "dream1234!!",
    });
    const token = response?.data?.user?.token;
    return token;
  } catch (error) {
    return error;
  }
};

export const testAuthToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/getauthToken`, {
      api_key: "sangita@dreamlogodesign.com",
      api_secret: "dream1234!!",
    });

    // console.log("test token====>", response);
    const token = response?.data?.data?.token;
    return token;
  } catch (error) {
    return error;
  }
};

export const textUppercase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const monthOrder = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const weekOrder = ["Week 1", "Week 2", "Week 3", "Week 4"];

export const shortMonthMap = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

export const formatChartDataByMonth = (data) => {
  return monthOrder.map((month) => ({
    month: shortMonthMap[month],
    users: data[month] || 0,
  }));
};

export const formatChartDataByWeek = (data) => {
  return weekOrder.map((week) => ({
    week: week,
    users: data[week] || 0,
  }));
};

export const prepareTableData = (data) => {
  // const tableData = [
  //   {
  //     tableTitle: "Merchant",
  //     data: [
  //       {
  //         id: "svscs",
  //         merchant_id: "vsgv",
  //       },
  //     ],
  //   },
  // ];

  const keys = Object.keys(data);

  return keys.map((key) => ({ tableTitle: key, data: data[key] }));
};

export const calculateTableDataLength = (data) => {
  let length = 0;
  for (let i = 0; i < data?.length; i++) {
    length += data[i]?.data?.length;
  }
  return length;
};

export const middleware = (token) => {
  if (token) {
    return "/merchant/dashboard";
  } else {
    return "/merchant_registration";
  }
}
