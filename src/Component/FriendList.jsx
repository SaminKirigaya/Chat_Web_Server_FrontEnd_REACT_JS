import React, { Component, Fragment } from 'react'
import ZoomOutIcon from '@mui/icons-material/ZoomOut';


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

import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import TelegramIcon from '@mui/icons-material/Telegram';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import axios from 'axios';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
export class FriendList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchname : '',
            friendData : [],
            open: false,
            returnMessage : ''
        }
    }

    unfriend = async(e, idno)=>{
        const slno = this.props.slno;
        try{
            const response = await axios({
                url : `/unfriendHim/${slno}`,
                method : 'post',
                data : {
                    thisGuy : idno
                }
            });

            if(response.data.message == 'Successfully Unfriended This User ...'){
                setTimeout(()=>{window.location.reload()},500)
            }

            this.setState({
                returnMessage : response.data.message,
                open : true
              })

        }catch(err){
            console.log(err)
        }
    }

    showAllFriends = ()=>{
        if(this.state.friendData){
            if(this.state.friendData.length>0){
                return this.state.friendData.map((each)=>{
                    return <div className='col'>
                    <div className="card cardwidth cardwidth2 brdred profilecardbg mb-4 cardanim">
                    <div className='mx-auto mt-4 anim'>
                    <Stack direction="row" spacing={2}>
                    <Avatar alt="Remy Sharp" src={each.image} sx={{ width: 56, height: 56, border: '0.13rem solid #dd3d8a' }}
                    />
                
                    </Stack>
                    </div>
                    
                    
                    <div className="card-body d-flex flex-column align-items-center">
                      <h5 className="card-title"><PersonIcon fontSize='large'/>@_{each.username}</h5>
                      <p className="card-text"><BadgeIcon/> <span>Full Name : </span>{each.fullname}<br></br><PublicIcon /> <span>Country : </span>{each.country}<br></br><AccessibilityNewIcon /> <span>Age : </span>{each.age}<br></br><WcIcon /> <span>Gender : </span>{each.gender}</p>
                      <Link to={'/message/'+each._id} className="btn btn-sm btn-danger btndescardprofile text-center"><TelegramIcon /> Message</Link>
                      <Link to='#' onClick={(e)=>{this.unfriend(e,each._id)}} className="btn btn-sm btn-danger btndescardprofile text-center mt-1"><PersonRemoveIcon /> Unfriend !</Link>
                    </div>
                    </div>

                    </div>

                })
            }
        }else{
            return <div className='col mx-auto mt-4 nofriend'>
                <h5>UwU You Dont Have Any Friend ...</h5>
            </div>
        }
    }

    async componentDidMount(){
        const slno = this.props.slno;

        try{


            const response = await axios.get(`/allMyFriends/${slno}`,{
                headers : {
                    'Content-Type' : 'application/json'
                }
            })
    
            if(response.data.message == 'success'){
                this.setState({
                    friendData : response.data.friends
                })
                
            }


        }catch(err){
            console.log(err)
        }
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
    
    
    render() {
        return (
            <Fragment>
                <div className='container-fluid d-flex justify-content-center mainnav p-0'>
                    <div className='container m-0 p-1 searchmain'>
                    <div className="input-group mb-3">
                    <input onChange={(e)=>{this.setState({searchname : e.target.value})}} type="text" class="form-control" placeholder="Search People username or Name" aria-label="Recipient's username" aria-describedby="button-addon2" />
                    <Link to={'/searchresult/'+this.state.searchname} className="btn btn-outline-secondary desbtnsearch" type="button" id="button-addon2"><ZoomOutIcon /></Link>
                    </div>
                    </div>

                    
                </div>
                <h4 className='tagsearch'>Friend List :</h4>
                <div className='friendbox'>
                    <div className='row row-cols-1 row-cols-md-3'>


                    {this.showAllFriends()}


                    {!(this.state.friendData.length>0) ? <div className='col mx-auto mt-4 nofriend'>
                    <h5 className='text-center'>UwU You Got No Friends Uwuuuuuu ...</h5>
                    </div> : null}

                    
                        
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
                  color: 'white' // Set text color for visibility
                }}>
                  {this.state.returnMessage}
                </Alert>
              </Snackbar>

                </div>
            </Fragment>
        )
    }
}

export default FriendList