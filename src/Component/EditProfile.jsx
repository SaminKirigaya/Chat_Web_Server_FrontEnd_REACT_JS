import React, { Component, Fragment } from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { io } from 'socket.io-client';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import DeleteIcon from '@mui/icons-material/Delete';


import BadgeIcon from '@mui/icons-material/Badge';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PublicIcon from '@mui/icons-material/Public';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import WcIcon from '@mui/icons-material/Wc';
import TaskAltIcon from '@mui/icons-material/TaskAlt';



import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import axios from 'axios';


const socket = io('http://localhost:8000');

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  

export class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData : [],
            returnMessage : '',
            open : false
        }

        socket.on('notification', (data)=>{
            localStorage.setItem('totalNots',data)
        })
    }

    dateConvert2 = (dateString)=>{
        var date = new Date(dateString);
    
        if (isNaN(date.getTime())) {
            return "Invalid date";
        }
        
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;

    }

    dateConvert = (date)=>{
        var NewDate = new Date(date);
        var options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            timeZoneName: 'short' 
        };
        var convertedDate = NewDate.toLocaleString("en-US", options);

        return convertedDate;
    }
    

    handleClick = () => {
        this.setState({open : true})
      };
    
    handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }

    this.setState({open : false})
    };

        
    async componentDidMount(){
        const {userslno} = this.props.match.params;
        try{
            const response = await axios.get(`/getMyIdData/${userslno}`,{
                headers : {
                    'Content-Type' : 'application/json'
                }
            });

            if(response.data.message == 'success'){
                this.setState({
                    userData : response.data.userValue
                })
            }

            const { slno } = this.props;
            
            if(this.props.element != 9){
                try{
                    const res = await axios.get(`/setmeoutmsgbox/${slno}`,{
                        headers : {
                            'Content-Type' : 'application/json'
                        }
                    })
                }catch(err){
                    console.log(err)
                }
            }
            socket.emit('authenticate', slno);
            

        }catch(err){
            console.log(err)
        }


    }

    async componentDidUpdate(prevProps){
        // send that user left message box
       
        if(this.props.element != prevProps.element){
          this.componentDidMount()
      }
      }

    changeFullName = (id, name) => {
        this.setState(prevState => ({
            userData: {
                ...prevState.userData,
                fullname: name
            }
        }))

       
    }

    changeDate = (date) => {
        this.setState(prevState=>({
            userData : {
                ...prevState.userData,
                dateOfBirth : date
            }
        }))
    }
    

    changeCountry = (country) => {
        this.setState(prevState=>({
            userData : {
                ...prevState.userData,
                country : country
            }
        }))
    }

    changeAge = (age) => {
        this.setState(prevState=>({
            userData : {
                ...prevState.userData,
                age : age
            }
        }))
    }


    changeGender = (gender) => {
        this.setState(prevState=>({
            userData : {
                ...prevState.userData,
                gender : gender
            }
        }))

        
    }

    editProfileNow = async(e)=>{

        const {userslno} = this.props.match.params;
        const formData = new FormData();
        formData.append('fullname',this.state.userData.fullname)
        formData.append('country',this.state.userData.country)
        formData.append('age',this.state.userData.age)
        formData.append('gender',this.state.userData.gender)
        formData.append('dateofBirth',this.state.userData.dateOfBirth)
        
        try{
            const response = await axios.post(`/changethisid/${userslno}`,formData,{
                headers : {
                    'Content-Type' : 'application/json'
                }
            })

            if(response.status == 200){
                if(response.data.message == 'Successfully Updated Profile ... Kindly Login Again.'){
                    document.getElementById('fullname').value = '';
                    document.getElementById('dateofB').value = '';
                    document.getElementById('country').value = '';
                    document.getElementById('age').value = '';
                    document.getElementById('gender').value = '';
                    

                    localStorage.clear();
                    
                    setTimeout(()=>{window.location.href = '/login'},1800);
                }

                this.setState({
                    returnMessage : response.data.message,
                    open : true
                  })
            }

        }catch(err){
            console.log(err)
        }
    }


  render() {
    return (
        <Fragment>
        <div className='container-fluid login d-flex flex-column justify-content-center align-items-center'>
        <h3 className='loginstyle loganimtxt zind headfont'>EDIT !!!</h3>
        <div className="card cardwidth profilecardbg">
        <div className='mx-auto mt-4 anim'>
        <Stack direction="row" spacing={2}>
        <Avatar alt="Remy Sharp" src={this.props.image} sx={{ width: 56, height: 56, border: '0.13rem solid #dd3d8a' }}
        />
    
        </Stack>
        </div>
        
        
        <div className="card-body bodfont">
          <h5 className="card-title"><PersonIcon fontSize='large'/><b>@_{this.state.userData.username}</b></h5>
          <p clasName="card-text"><BadgeIcon/> <span className='bolding'>Full Name : </span><input autoComplete='none' id='fullname' onChange={(e)=>{this.changeFullName(this.state.userData._id,e.target.value)}} value={this.state.userData.fullname} className="form-control form-control-sm" type="text" placeholder="Full Name" aria-label=".form-control-sm example" /><br></br><DateRangeIcon /> <span className='bolding'>Date of Birth : </span><input autoComplete='none' id='dateofB' onChange={(e)=>{this.changeDate(e.target.value)}} value={this.dateConvert2(this.state.userData.dateOfBirth)} className="form-control form-control-sm" type="date" placeholder="Date of Birth" aria-label=".form-control-sm example" /><br></br><PublicIcon /> <span className='bolding'>Country : </span><input autoComplete='none' id='country' onChange={(e)=>{this.changeCountry(e.target.value)}} value={this.state.userData.country} className="form-control form-control-sm" type="text" placeholder="Country" aria-label=".form-control-sm example" /><br></br><AccessibilityNewIcon /> <span className='bolding'>Age : </span><input autoComplete='none' id='age' onChange={(e)=>{this.changeAge(e.target.value)}} value={this.state.userData.age} className="form-control form-control-sm" type="text" placeholder="Age" aria-label=".form-control-sm example" /><br></br><WcIcon /> <span className='bolding'>Gender : </span><select id='gender' className="form-select form-select-sm"  onChange={(e)=>{this.changeGender(e.target.value)}} aria-label=".form-select-sm example">
          <option selected disabled>Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
          </select></p>
          <Link to='#' onClick={(e)=>{this.editProfileNow(e)}} className="btn btn-sm btn-danger btndescardprofile"><ManageAccountsIcon />Edit Submit</Link>
          
        </div>
        </div>
        <Snackbar
                  open={this.state.open}
                  autoHideDuration={4000}
                  onClose={this.handleClose} // Removed parentheses
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                <Alert onClose={this.handleClose} severity="success" sx={{
                  width: '100%',
                  backgroundColor: '#e80070', // Set your custom color here
                  color: 'white', // Set text color for visibility
                  fontFamily: 'Cormorant Infant'
                }}>
                  {this.state.returnMessage}
                </Alert>
               </Snackbar>
        </div>
        </Fragment>
    )
  }
}

export default EditProfile
