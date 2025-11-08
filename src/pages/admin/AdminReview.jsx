import React, { useContext, useState, useEffect } from "react";
import "./../../styles/styles.css";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";
import MerchantListComp from "../../components/MerchantListComp";
import axios from "axios";
import { BASE_URL } from "../../utils/apiManager";
import { AppContext } from "../../utils/context";
import { Accordion, Table } from "react-bootstrap";
import { MdRealEstateAgent } from "react-icons/md";
import { PiEyeLight } from "react-icons/pi";
import { GoPencil } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";

const AdminReview = () => {

    const { token } = useContext(AppContext);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    return (
        <></>

    )

};

export default AdminReview;
