import React from "react";
import "./../../styles/styles.css";
import AdminDashBoardTopBar from "../../components/AdminDashBoardTopBar";

const ContactList = () => {
  return (
    <div className="contactlistWrapper">
      <div className="adminDashboardContainer">
        <AdminDashBoardTopBar heading={"Contact  List"} />

        <div className="contactlistContainer">
          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Ronnie E.Barret
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <table class="table">
                    <tr>
                      <td>Email :</td>
                      <td>Shane@dreamlogodesign.com</td>
                    </tr>
                    <tr>
                      <td>Phone:</td>
                      <td> 9674669100</td>
                    </tr>
                  </table>
                </div>

              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Susana A. Wilson
                </button>
              </h2>
              <div
                id="collapseTwo"
                class="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                <table class="table">
                    <tr>
                      <td>Email :</td>
                      <td>Shane@dreamlogodesign.com</td>
                    </tr>
                    <tr>
                      <td>Phone:</td>
                      <td> 9674669100</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Christopher Mayer
                </button>
              </h2>
              <div
                id="collapseThree"
                class="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                <table class="table">
                    <tr>
                      <td>Email :</td>
                      <td>Shane@dreamlogodesign.com</td>
                    </tr>
                    <tr>
                      <td>Phone:</td>
                      <td> 9674669100</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
