import React from "react";
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';


const AccordianProps = (props) => {
  return (

<div className="merchantaccordian-table">
   <Accordion defaultActiveKey={['0']} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header style={{ backgroundColor: props.bgColor, borderBottomColor: props.borderColor}}>
            <div className="d-flex">
            <div className="merchant-icon">
                 {props.Icon && <props.Icon  style={{ color: props.iconColor || "#000" ,  backgroundColor: props.iconBgColor || "#fff",}}/>}
            </div>
             <div className="merchant-heading">
                {props.Heading}
            </div>
            </div>
            </Accordion.Header>
        <Accordion.Body>
          <div className="accordianTableWrap">
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Location</th>
          <th>E-mail</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
         {props.tbody}
      </tbody>
    </Table>
    </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
</div>

  );
};

export default AccordianProps;
