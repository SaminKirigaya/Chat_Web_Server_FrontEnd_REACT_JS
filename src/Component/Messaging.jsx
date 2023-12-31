import React, { Component, Fragment } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';

import ScrollableFeed from 'react-scrollable-feed';

import Stack from '@mui/material/Stack';
import { io } from 'socket.io-client';
import axios from 'axios';

import AcUnitIcon from '@mui/icons-material/AcUnit';

import Cookies from 'js-cookie';

const socket = io('http://localhost:8000');



function getCurrentDateTime() {
    const now = new Date();
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return now.toLocaleString('en-US', options);
  }

  function getDateFormated(value) {
    const now = new Date(value);
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return now.toLocaleString('en-US', options);
  }
export class Messaging extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldMessages : [],
            image : null,
            allmessages : [],
            message : '',
            placeval : 'Insert Message ...',
            disabled : false,
            username : ''
        }
        this.cardContainerRef = React.createRef();

        const userId = this.props.userId;
        const {friendId} = this.props.match.params;
        
        socket.on('privateMessage', (message) => {
            this.setState((prevState) => ({
              allmessages: [...prevState.allmessages, { text: message,  sender: this.props.match.params.friendId }],
            }));
          });

        socket.on('notification', (data)=>{
            localStorage.setItem('totalNots',data)
        })

        socket.on('navThreeLastUsers', (data)=>{
           
            var stingify = JSON.stringify(data)
            if(data.length>3){
                data.map((each,index)=>{
                    if(index<3){
                        localStorage.setItem(`user${index}avatar`,each.recvAvatar)
                        localStorage.setItem(`user${index}recverId`,each.recverId)
                    }
                })
            }else{
                data.map((each,index)=>{
                    localStorage.setItem(`user${index}avatar`,each.recvAvatar)
                    localStorage.setItem(`user${index}recverId`,each.recverId)
                })
            }
            
        })
          


    }
    
    async componentDidMount(){
        const myusersl = this.props.userId;
        
        
        var {friendId} = this.props.match.params;
        try{
            const response = await axios.get(`/getmyusername/${myusersl}`,{
                headers : {
                    'Content-Type' : 'application/json'
                }
            });

            if(response.data.message == 'success'){
                this.setState({
                    username : response.data.username
                })
                
            }

            const response2 = await axios({
                url : `/getmyoldconv/${myusersl}`,
                method : 'post',
                data: {
                    thisFriend : friendId
                }
            })

            if(response2.data.message == 'success'){
                this.setState({
                    oldMessages : response2.data.oldConv
                })
                
            }
            const { userId } = this.props;

            if(this.props.element == 9){
            const res = await axios.get(`/setmeinmsgbox/${userId}`,{
                headers : {
                    'Content-Type' : 'application/json'
                }
            })
        }

        }catch(err){
            console.log(err)
        }
    
        socket.on('connect', () => {
            console.log('Connected to socket server');
          });
        const { userId } = this.props;
        
        socket.emit('authenticate', userId);
        
    }
    

    async componentDidUpdate(prevProps){
        const { userId } = this.props;
        var {friendId} = this.props.match.params;
        if(friendId != prevProps.match.params.friendId || this.props.element != prevProps.element){
            this.componentDidMount();
        }

        // send that user entered message box
        
    }

 

    setImage= (e, file, filename)=>{
            if(file && filename){
                this.setState({
                    image : file,
                    message : '',
                    placeval : filename,
                    disabled : true
                })
            }else{
                this.setState({
                    image : null,
                    message : '',
                    placeval : 'Insert Message ...',
                    disabled : false
                })
            }
            
            
        
        
    }

    
    
  
    handleSendMessage = () => {
        const myImg = this.props.image;
        const userId = this.props.userId;
        const {friendId} = this.props.match.params;
        const Token = this.props.token;

        const { message, image } = this.state;
    
        if (message || image) {
          socket.emit('privateMessage', {
            fromUserId: userId,
            toUserId: friendId,
            myToken : Token,
            message: this.state.message,
            image: this.state.image,
            
            sendingtime : getCurrentDateTime()
           
          });

        
    
          this.setState((prevState) => ({
            allmessages: [
              ...prevState.allmessages,
              { text: message, sender: userId, senderAvatar : myImg, image: image , sendingtime: getCurrentDateTime(), username: this.state.username},
            ],
            message: '',
            image: null,
            placeval : 'Insert Message ...',
            disabled : false

          }));

         
        }
      };

      PreviousChaT = ()=>{
        const userId = this.props.userId;
        if(this.state.oldMessages.length>0){
            return this.state.oldMessages.map((each, index)=>{
                
                if(each.senderId == userId){
                    if(each.message){
                        return  <div className="card mymsg smallborder sizebigmsg" id={'prev'+index} key={index}>
                        <div className="card-body">
                            <h5 className="card-title d-flex flex-row text-center wball headfont"><Avatar alt="Remy Sharp" src={each.senderAvatar} /> &nbsp;{each.username}</h5>
                            <p className="card-text textbg bodfont">{each.message}</p>
                            <sup>{getDateFormated(each.sendingtime)}</sup>
                            
                        </div>
                        </div>
                    }else{

                        

                        return  <div className="card mymsgimg smallborder sizebigmsg" id={'prev'+index} key={index}>
                        <div className="card-body">
                            <h5 className="card-title d-flex flex-row text-center headfont"><Avatar alt="Remy Sharp" src={each.senderAvatar} /> &nbsp;{each.username}</h5>
                            
                            <img class='msgimgbox' src={each.image}/>
                            <sup>{getDateFormated(each.sendingtime)}</sup>
                            
                            
                        </div>
                        </div>
                    }
                    

                }else{
                    
                    if(each.message){
                        return  <div className="card sendermsg smallborder sizebigmsg" id={'prev'+index} key={index}>
                        <div className="card-body">
                            <h5 className="card-title d-flex flex-row text-center wball headfont"><Avatar alt="Remy Sharp" src={each.senderAvatar} /> &nbsp; {each.username}</h5>
                            <p className="card-text textbg bodfont">{each.message}</p>
                            <sup>{getDateFormated(each.sendingtime)}</sup>

                        </div>
                        </div>
        
                    }else{

                        
                        return  <div className="card sendermsgimg smallborder sizebigmsg" id={'prev'+index} key={index}>
                        <div className='secretDisp'></div> 
                        <div className="card-body">
                            <h5 className="card-title d-flex flex-row text-center headfont"><Avatar alt="Remy Sharp" src={each.senderAvatar} /> &nbsp; {each.username}</h5>
                            <img class='msgimgbox' src={each.image}/>
                            <sup>{getDateFormated(each.sendingtime)}</sup>
                        </div>
                        </div>
                    }
                    
                }
            })
        }
      }

      loadMessages = ()=>{
        const {friendId} = this.props.match.params;
        const userId = this.props.userId;

        if(this.state.allmessages.length>0){
            return this.state.allmessages.map((each, index)=>{
                
                if(each.sender == userId){
                    if(each.text){
                        return  <div className="card mymsg smallborder sizebigmsg" id={'load'+index} key={index}>
                        <div className="card-body">
                            <h5 className="card-title d-flex flex-row text-center wball headfont"><Avatar alt="Remy Sharp" src={each.senderAvatar} /> &nbsp;{each.username}</h5>
                            <p className="card-text textbg bodfont">{each.text}</p>
                            <sup>{each.sendingtime}</sup>
                            
                        </div>
                        </div>
                    }else{

                        const blob = new Blob([each.image], { type: 'image/jpeg' });

                        // Create Data URL from Blob
                        const dataUrl = URL.createObjectURL(blob);

                        return  <div className="card mymsgimg smallborder sizebigmsg" id={'load'+index} key={index}>
                        <div className="card-body">
                            <h5 className="card-title d-flex flex-row text-center headfont"><Avatar alt="Remy Sharp" src={each.senderAvatar} /> &nbsp;{each.username}</h5>
                            
                            <img class='msgimgbox' src={dataUrl}/>
                            <sup>{each.sendingtime}</sup>
                            
                            
                        </div>
                        </div>
                    }
                    

                }else{
                   
                    if(each.text[0].sentBy == friendId){
                        if(each.text[0].message){
                            return  <div className="card sendermsg smallborder sizebigmsg wball" id={'load'+index} key={index}>
                            <div className="card-body">
                                <h5 className="card-title d-flex flex-row text-center headfont"><Avatar alt="Remy Sharp" src={each.text[0].senderAvatar} /> &nbsp; {each.text[0].username}</h5>
                                <p className="card-text textbg bodfont">{each.text[0].message}</p>
                                <sup>{each.text[0].sendingtime}</sup>
    
                            </div>
                            </div>
            
                        }else{
    
                            const blob = new Blob([each.text[0].image], { type: 'image/jpeg' });
    
                            // Create Data URL from Blob
                            const dataUrl = URL.createObjectURL(blob);
                            return  <div className="card sendermsgimg smallborder sizebigmsg" id={'load'+index} key={index}>
                            <div className='secretDisp'></div> 
                            <div className="card-body">
                                
                                <h5 className="card-title d-flex flex-row text-center headfont"><Avatar alt="Remy Sharp" src={each.text[0].senderAvatar} /> &nbsp; {each.text[0].username}</h5>
                                <img class='msgimgbox' src={dataUrl}/>
                                <sup>{each.text[0].sendingtime}</sup>
                            </div>
                            </div>
                        }
                    }
                    
                    
                }
            })
        }
      }

        saveMeFromParents = (e)=>{

            document.getElementById("hideit").classList.add('hiddenbtn2');
            if(this.state.allmessages.length > 0){
                for(var i=0; i<this.state.allmessages.length; i++){
                    var idn = 'load'+i;
                    document.getElementById(idn).classList.add('saveMeGod');

                }
            }

            if(this.state.oldMessages.length>0){
                for(var i=0; i<this.state.oldMessages.length; i++){
                    var idn = 'prev'+i;
                    document.getElementById(idn).classList.add('saveMeGod');
                    
                }
            }
        }

    render() {
        return (
            <Fragment>
                <div id="hideit" className='container hiddenbtn' onClick={(e)=>{this.saveMeFromParents(e)}}><AcUnitIcon fontSize='large'/></div>

                <div className='container-fluid sendingbox'>
                <div className="input-group mb-3">
                
                <label for='fileinp' className='me-2 imgcol'><AddPhotoAlternateIcon fontSize='large'/></label>
                <input id="fileinp" accept="image/jpeg, image/jpg" type='file' onChange={(e)=>{this.setImage(e,e.target.files[0],e.target.value)}}></input>
                
            
                <input id='txtmsg' type="text"  onChange={(e)=>{this.setState({message : e.target.value})}} value={this.state.message} className="form-control" placeholder={this.state.placeval} aria-label="Recipient's message" aria-describedby="button-addon2" disabled={this.state.disabled}/>
                <button className="btn btn-outline-secondary desbtnsearch" onClick={(e)=>{this.handleSendMessage(e)}} type="button" id="button-addon2"><SendIcon /></button>
              </div>
                </div>


                
                <ScrollableFeed className="card-container" id="cardContainer">
 
                {this.PreviousChaT()}
                {this.loadMessages()}




                </ScrollableFeed>
           

            </Fragment>
        )
    }
}

export default Messaging
