// <div className='groupdiv d-flex flex-column align-items-center bg-light m-3'>
        //     <br></br>
        //     <ToastContainer />
        //     <h1>List of Groups</h1>
        //     <div className='w-75 rounded bg-white border shadow p-4'>


        //         <button style={{ paddingLeft: "15px", width: "135px" }} className="btn btn-success" onClick={() => handleShowAdd()}>{lngsltd["Add"]}</button>

        //         <Table striped bordered hover size="sm" style={{ marginTop: "15px" }}>  
        //             <thead className="thead-dark">
        //                 <tr>
        //                     <th className="text-center">#</th>
        //                     <th className="text-center">{lngsltd["Group Name"]}</th>
        //                     <th className="text-center">{lngsltd["Actions"]}</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {
        //                     data.map((d, i) => (

        //                         <tr key={i}>
        //                             <td className="text-center">{i + 1}</td>
        //                             <td className="text-center">{d.groupName}</td>
        //                             <td className="text-center">
        //                                 <button className='btn btn-sm btn-primary me-2 px-3' onClick={() => handleEdit(d.groupID)}>{lngsltd["Edit"]}</button>
        //                                 <button className='btn btn-sm btn-danger ' onClick={() => handleDelete(d.groupID)}>{lngsltd["Delete"]}</button>
        //                             </td>
        //                         </tr>
        //                     ))
        //                 }
        //             </tbody>
        //         </Table>
        //         <Modal show={show} onHide={handleClose}>
        //             <Modal.Header closeButton>
        //                 <Modal.Title>{lngsltd["Update details"]}</Modal.Title>
        //             </Modal.Header>
        //             <Modal.Body>
        //                 <Form>
        //                     <FormGroup>
        //                         <FormLabel>{lngsltd["Group Name"]}<span style={{ color: 'red' }}>*</span></FormLabel>
        //                         <FormControl
        //                             type="text"
        //                             placeholder={lngsltd["Enter Group Name"]}                                    
        //                             value={editGroup}
        //                             onChange={(e) => setEditGroup(e.target.value)}
        //                         />
        //                         <div className="text-danger">{editGroupNameError}</div>
        //                     </FormGroup>
        //                 </Form>
        //             </Modal.Body>
        //             <Modal.Footer>                        
        //                 <Button variant="primary" onClick={handleUpdate}>
        //                 {lngsltd["Save"]}
        //                 </Button>
        //                 <Button variant="secondary" onClick={handleClose}>
        //                     {lngsltd["Cancel"]}
        //                 </Button>
        //             </Modal.Footer>
        //         </Modal>
        //         <Modal show={showadd} onHide={handleCloseAdd}>
        //             <Modal.Header closeButton>
        //                 <Modal.Title>{lngsltd["Create a new Group"]}</Modal.Title>
        //             </Modal.Header>
        //             <Modal.Body>
        //                 <Form>
        //                     <FormGroup>
        //                         <FormLabel>{lngsltd["Group Name"]}<span style={{ color: 'red' }}>*</span></FormLabel>
        //                         <FormControl
        //                             type="text"
        //                             placeholder={lngsltd["Enter Group Name"]}                                   
        //                             value={group}
        //                             onChange={(e) => setGroup(e.target.value)}
        //                         />

        //                         <div className="text-danger">{groupNameError}</div>
        //                     </FormGroup>
        //                 </Form>
        //             </Modal.Body>
        //             <Modal.Footer>                        
        //                 <Button variant="primary" onClick={handleSave}>
        //                 {lngsltd["Create"]}
        //                 </Button>
        //                 <Button variant="secondary" onClick={handleCloseAdd}>
        //                 {lngsltd["Cancel"]}
        //                 </Button>
        //             </Modal.Footer>
        //         </Modal>
        //     </div>
        // </div>



        App.css 
        @media only screen and (max-width: 932px) and (max-height: 430px) {
                .main-content{
                  width: auto; 
                  height: auto;    
                }
                .main-container {
                  width: auto;  
                  height: auto;             
                }
                .dimsns{
                  width: auto; 
                }
                }
                
                /* @media only screen and (max-width: 932px) and (max-height: 430px) {
                  .loginheader {
                    background: black;
                    text-align: center;
                    height: 40px;
                    color: #fff;
                    width: 100vw;
                    padding-top: 10px;
                    font-size: 15px;
                  
                  }
                  .loginbox{
                    padding: 0px !important;
                  }
                  .logintitle{
                    font-size: 25px !important;
                  }
                  .btnlgn{
                    font-size: 15px !important;
                    margin-top: 15px !important;
                  }
                   
                  .btnnorwagian{
                    font-size: 10px !important;
                    padding: 5px 10px !important;
                    margin-top: 3px !important;
                  margin-right: 15px !important;
                  }
                  .btnenglish{
                    font-size: 10px !important;
                    padding: 5px 10px !important;
                    margin-top: 3px !important;
                  margin-right: 5px !important;
                  } 
                  .btncltrs{
                    margin-right: 35px;
                  }
                  .cntnr{
                    padding-bottom: 40px !important;
                  }
                
                }*/
                @media only screen and (max-width: 430px) {
                  .main-content{
                    width: auto; 
                    height: auto;    
                  }
                  .main-container {
                    width: auto;  
                    height: auto;             
                  }
                  .dimsns{
                    width: auto;
                   
                  }
                  /* .btnenglish,
                  .btnnorwagian{
                    font-size: 14px ;
                    padding: 5px 7px ;
                    margin-top: 3px ;
                  margin-right: 15px ;
                  }
                
                  .cntnr{
                    height: 10vh !important;
                    padding-bottom: 300px;
                  } */
                }
                
                @media only screen and (min-width: 431px) and (max-width: 600px) {
                  .main-content{
                    width: auto; 
                    height: auto;    
                  }
                  .main-container {
                    width: auto;  
                    height: auto;             
                  }
                  .dimsns{
                    width: auto;
                   
                  }
                  /* .cntnr{
                    padding-bottom: 250px;
                  } */
                }
                
                @media only screen and (min-width: 601px) and (max-width: 767px) {
                  .main-content{
                    width: auto; 
                    height: auto;    
                  }
                  .main-container {
                    width: auto;  
                    height: auto;             
                  }
                  .dimsns{
                    width: auto;
                   
                  }
                  /* .cntnr{
                    padding-bottom: 200px;
                  } */
                
                }
                
                @media only screen and (min-width: 768px) and (max-width: 991px) {
                  .main-content{
                    width: auto; 
                    height: auto;    
                  }
                  .main-container {
                    width: auto;  
                    height: auto;             
                  }
                  .dimsns{
                    width: auto;
                   
                  }
                  /* .cntnr{
                    padding-bottom: 200px;
                  } */
                
                }
                
                @media only screen and (min-width: 992px) and (max-width: 1199px) {
                  .main-content{
                    width: auto; 
                    height: auto;    
                  }
                  .main-container {
                    width: auto;  
                    height: auto;             
                  }
                  .dimsns{
                    width: auto;
                   
                  }
                  /* .cntnr{
                    padding-bottom: 200px;
                  }*/
                
                } 
                
                @media only screen and (min-width: 1200px) and (max-width: 1500px) {
                  .main-content{
                    width: auto; 
                    height: auto;    
                  }
                  .main-container {
                    width: auto;  
                    height: auto;             
                  }
                  .dimsns{
                    width: auto;
                   
                  }
                  /* .cntnr{
                    padding-bottom: 200px;
                  } */
                
                }
                @media only screen and (min-width: 1501px) and (max-width: 2100px) {
                  .main-content{
                    width: auto; 
                    height: auto;    
                  }
                  .main-container {
                    width: auto;  
                    height: auto;             
                  }
                  .dimsns{
                    width: auto;
                   
                  }
                  /* .cntnr{
                    padding-bottom: 250px;
                  } */
                
                }
                
                /* @media only screen and (max-width: 600px) {
                  .dimsns {
                    width: 400px;
                    max-width: 600px;
                  }
                }
                
                @media only screen and (min-width: 601px) and (max-width: 767px) {
                  .dimsns {
                    width: 601px;
                    max-width: 767px;
                  }
                }
                
                
                @media only screen and (min-width: 768px) and (max-width: 991px) {
                  .dimsns {
                    width: 768;
                    max-width: 991px;
                  }
                }
                
                @media only screen and (min-width: 992px) and (max-width: 1199px) {
                  .dimsns {
                    width: 992px;
                    max-width: 1199px;
                  }
                }
                
                @media only screen and (min-width: 1200px) {
                  .dimsns {
                    width: 1200px;
                    
                  }
                } */ 