import React, { useState } from "react";
import "../styles/styles.css";
import { Accordion, Table } from "react-bootstrap";
import AdminRejectPopup from "./AdminRejectPopup";

const AdminPendingReview = () => {
  const items = ["1", "2", "3"];
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleRejectClick = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };


  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="accordionWrap">
        <div className="merchantaccordian-table">
          <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div className="d-flex">
                  <div className="merchant-icon"></div>
                  <div className="merchant-heading">Pending Review</div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <div className="accordianTableWrap">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>Review From</th>
                        <th>Review To</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td>{item}</td>
                          <td>
                            <div className="ratingCol">
                              <span>5</span>
                              <div className="starWrap">
                                <span>★</span>
                                <span>★</span>
                                <span>★</span>
                                <span>★</span>
                                <span>★</span>
                              </div>
                            </div>
                          </td>
                          <td className="reviewText">
                            Lorem ipsum is a dummy or placeholder text
                          </td>
                          <td>Sangite</td>
                          <td>Demo</td>
                          <td className="actionBtn">
                            <button className="approveBtn">Approve</button>
                            <button
                              className="rejectBtn"
                              onClick={() => handleRejectClick(item)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>


      {/* Popup */}
      <AdminRejectPopup
        show={showPopup}
        title="Reject Review"
        onClose={handleClosePopup}
      />
      
    </>
  );
};

export default AdminPendingReview;
