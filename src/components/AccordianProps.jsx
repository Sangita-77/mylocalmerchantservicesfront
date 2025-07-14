import React from "react";
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';


const AccordianProps = (props) => {
  return (

<div>
   <Accordion defaultActiveKey={['0']} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
            <div className="d-flex">
                 {props.Icon && <props.Icon/>}
            <div>
              
            </div>
                 {props.Heading}
             <div>
                
            </div>
            </div>
            </Accordion.Header>
        <Accordion.Body>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Merchant Id</th>
          <th>Merchant Name</th>
          <th>Location</th>
          <th>Category</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td>@fat</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Larry the Bird</td>
          <td>Larry the Bird</td>
          <td>@twitter</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </Table>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
</div>

  );
};

export default AccordianProps;
