import React from 'react';
import './App.css';
import {Signin, Register} from '../Components/login/Login.js';
import LeftPanel from '../Components/Leftpanel/Leftpanel.js';
import RightPanel from '../Components/Rightpanel/Rightpanel.js';
import CancelNotification from '../assets/icons8-xbox-x-32.png';



class App extends React.Component {
  NextSongTimeout  = null;
  constructor() {
    super();
    this.RightPanel = React.createRef();
    this.state = {
      userID: '',
      username: '',
      email: '',
      route: 'Signin',
      signinDisplay: 'signinUser',
      currentWindow: 'Home',
      que: [],
      queContainer:{},
      search_history: [],
      search_history_container: {},
      playlists: [],
      playlistsContainer: {},
      play: '',
      AlwaysForYou: [],
      recents: [],
      currentPlaylist: '',
      currentPlayListArray: [],
      Onoff: false,
      showCancel: true
    }
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      if(this.state.route !== 'Signin') {
        let temp = !this.state.Onoff;
        this.toggleLeftPanel(temp, 'state')
      }
    })
  }

  OnClickSignin = ({value, id, userName, email, playlists, recent, searchHistory}) => {
    this.setState({
      route: value,
      userID: id,
      userName: userName,
      email: email,
      recents: recent !== null ? [...recent] : []
    }, () => {
      this.toggleNotificationBar('', false);

      let tempPlaylist = Object.keys(playlists).filter(key => {return key !== 'default'});
      fetch(`https://cryptic-falls-60318.herokuapp.com/image/${JSON.stringify(playlists.default)}`)
      .then(res => res.json())
      .then(json => {
        let temp = this.shuffleArray(json);
        this.setState({AlwaysForYou: temp})
      })
      .catch(console.log);
      /* playlist block */
      tempPlaylist.forEach(arr => {
        fetch(`https://cryptic-falls-60318.herokuapp.com/image/${JSON.stringify(playlists[arr])}`)
        .then(res => res.json())
        .then(json => {
          let temp = {...this.state.playlistsContainer};
          temp[arr] = this.shuffleArray(json);
          this.setState({playlistsContainer: {...temp}});
        })
        .catch(console.log);
      })
      this.setState({playlists: [...tempPlaylist]});

      if(searchHistory !== null)
        fetch(`https://cryptic-falls-60318.herokuapp.com/image/${JSON.stringify(searchHistory)}`)
        .then(res => res.json())
        .then(json => {
          let tempObj = {}; 
          json.forEach(arr => {
              tempObj[arr.song_id] = [arr.song_image, arr.song_name];
          })
          this.setState({search_history: [...searchHistory], search_history_container: {...tempObj}});
        })
        .catch(console.log);
    })
  }

  logout = (change) => {
    let elem = document.getElementById('confirmLogout-popup');
    if(change) {
      elem.style.display = 'block';
      elem.animate([{opacity: 1}], {duration: 100})
      setTimeout(() => {
        elem.style.opacity = 1
      }, 100);
    }
    else {
      elem.animate([{opacity: 0}], {duration: 100})
      setTimeout(() => {
        elem.style.display = 'none'
      }, 100);
    }
  }
  
  confirmLogout = () => {
    clearTimeout(this.NextSongTimeout);
    let elem = document.getElementById('confirmLogout-popup');
    this.setState({
      userID: '',
      username: '',
      email: '',
      route: 'Signin',
      signinDisplay: 'signinUser',
      que: [],
      queContainer: {},
      search_history: [],
      search_history_container: {},
      playlists: [],
      playlistsContainer: {},
      play: '',
      AlwaysForYou: [],
      recents: [],
      currentPlaylist: '',
      currentPlayListArray: []
    })
    elem.animate([{opacity: 0}], {duration: 100})
      setTimeout(() => {
        elem.style.display = 'none'
      }, 100);
  }

  changeSignin = (value) => {
    this.toggleNotificationBar('', false);
    this.setState({signinDisplay: value})
  }

  toggleLeftPanel = (OnOff, state) => {
    if(OnOff && window.innerWidth > 900) {
      this.toggleLeftPanelTrueSection(state);
    }
    else {
      this.toggleLeftPanelFalseSection(state);
    }
  }

  toggleLeftPanelTrueSection = (state) => { 
    
    let value;
    if(window.innerWidth < 1500) {
      document.getElementById('split-left').style.width = '220px';
      value = 'calc(100% - 220px)';
    }
    else {
      document.getElementById('split-left').style.width = '15%';
      value = '85%';
    }
    document.getElementById('split-right').style.width = value;

    document.getElementById('logo').style.width = '50px';
    document.getElementById('logo').style.height = '50px';

    document.getElementById('topbar').style.width = value;
    document.getElementById('leftPanelToggleButton').classList.remove('rotate180');
    let visible = document.getElementsByClassName('visible-during-leftPanelToggle');
    Object.values(visible).forEach(value => {
      setTimeout(() => {
        value.style.display = 'inline-block';
      }, 100);
    });

    document.getElementById('Player').style.width = value;
    if(this.state.currentWindow === 'Home')
      document.getElementById('HomePage').style.width = value;
    if(this.state.currentWindow === 'Search')
      document.getElementById('searchPage').style.width = value;
    if(this.state.currentWindow === 'CreatePlayList')
      document.getElementById('CreatePlayList').style.width = value;
    if(state === undefined)
      this.setState(() => ({
        Onoff: false
      }));
  }

  toggleLeftPanelFalseSection = (state) => {
    document.getElementById('split-left').style.width = '80px';
    document.getElementById('split-right').style.width = 'calc(100% - 80px)';
    document.getElementById('topbar').style.width = 'calc(100% - 80px)';
    document.getElementById('leftPanelToggleButton').classList.add('rotate180');
    let visible = document.getElementsByClassName('visible-during-leftPanelToggle');
    Object.values(visible).forEach(value => {
      value.style.display = 'none';
    });

    document.getElementById('Player').style.width = 'calc(100% - 80px)';

    document.getElementById('logo').style.width = '30px';
    document.getElementById('logo').style.height = '30px';

    document.getElementsByClassName('queScroller')[0].style.maxHeight =  '0px';
    if(this.state.currentWindow === 'Home')
      document.getElementById('HomePage').style.width = 'calc(100% - 80px)';
    if(this.state.currentWindow === 'Search')
      document.getElementById('searchPage').style.width = 'calc(100% - 80px)';
    if(this.state.currentWindow === 'CreatePlayList')
      document.getElementById('CreatePlayList').style.width = 'calc(100% - 70px)';
    if(state === undefined)
      this.setState(() => ({
        Onoff: true
      }));
  }
  
  deletePlayedFromQue = (id) => {
    let que = this.state.que, queContainer = this.state.queContainer;
    let index = que.indexOf(id);
    que.splice(index, 1).forEach(arr => {delete queContainer[arr]});
    this.setState({
      que: [...que],
      queContainer: {...queContainer}
    })
    if(this.state.que.length !== 0) {
      let arr = this.state.que[0];
      this.NextSongTimeout = setTimeout(() => {
        this.RightPanel.current.OnSongImgClick({'song_id': arr, 'song_image': this.state.queContainer[arr][0], 'song_name': this.state.queContainer[arr][1]});
        this.NextSongTimeout = null;
        clearTimeout(this.NextSongTimeout);
      }, 3000);
    }
    else
      return true;
  }

  addPlayListToQue = (clickedPlaylist) => {

    if(this.state.currentPlaylist === clickedPlaylist)
      return;
    let currentPlayList = [], temp = {};
    
    this.state.playlistsContainer[clickedPlaylist].forEach(arr => {
      temp[arr.song_id] = [arr.song_image, arr.song_name];
      currentPlayList.push(arr.song_id);
    })

    this.setState({
      currentPlaylist: clickedPlaylist,
      currentPlayListArray: {...temp},
      que: [...currentPlayList],
      queContainer: {...temp}
    })
    this.RightPanel.current.OnSongImgClick({'song_id': currentPlayList[0], 'song_image': temp[currentPlayList[0]][0], 'song_name':temp[currentPlayList[0]][1]});
  }

  addque = (arr) => {
    if(this.NextSongTimeout !== null)
      return;
    let index = this.state.que.indexOf(arr.song_id);
    if(index >-1) {
      this.state.que.splice(index, 1);
    }
    
    this.state.que.unshift(arr.song_id);
    let id = arr['song_id'], image = arr['song_image'], name = arr['song_name'];
    let stateQue = {...this.state.queContainer};
    stateQue[id] = [image, name];
    this.setState(() => {
      return {queContainer: {...stateQue}}
    });
    this.RightPanel.current.OnSongImgClick(arr);
  }

  ChangeCurrentWindow = (window) => {
    if(window === this.state.currentWindow) {
      document.getElementById('splitUp').scrollTo({top: 0, behavior: 'smooth'});
      return;
    }
    document.getElementById('splitUp').scrollTo({top: 0});
    this.setState({currentWindow: window });
  }

  addSearchList = (id) => {
    let tempContainer = {...this.state.search_history_container}, temp = [...this.state.search_history];
    let index = temp.indexOf(id.song_id);
    if(index >-1) {
      temp.splice(index, 1);
    }
    temp.unshift(id.song_id);
    tempContainer[id.song_id] = [id.song_image, id.song_name];
    delete tempContainer[temp.splice(10, temp.length - 10)];

    fetch(`https://cryptic-falls-60318.herokuapp.com/search_history/${this.state.userID}`,{
        method: 'put',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            "histories": JSON.stringify(temp)
        })
      })
      .then(res => res.json())
      .then(jsonData => {
        this.setState({search_history: [...jsonData], search_history_container: {...tempContainer}});
      })
      .catch(err => console.log('Error:', err));
        
  }

  stateUpdater = (value1, value2) => {

    fetch(`https://cryptic-falls-60318.herokuapp.com/image/${JSON.stringify(value2)}`)
        .then(res => res.json())
        .then(json => {
          let temp = {...this.state.playlistsContainer};
          temp[value1] = this.shuffleArray(json);
          this.setState({
            playlists: [...this.state.playlists, ...value1],
            playlistsContainer: {...temp}
          });
        })
        .catch(console.log);
  }

  shuffleArray = (array) => {
    let temp, currentPos = array.length - 1, randomValue;

    while(currentPos >= 0) {
      randomValue = Math.round(Math.random() * currentPos);
      temp = array[currentPos];
      array[currentPos] = array[randomValue];
      array[randomValue] = temp;
      currentPos--;
    }
    array.sort(() => Math.random() - 0.5);
    return array;
  }

  toggleNotificationBar = (text, onOff, automatic) => {
    let notificationBar = document.getElementById('notification-bar');
    
    if(automatic) 
        setTimeout(() => {
            this.toggleNotificationBar('', false, )
        }, automatic);
    
    if(onOff) {
        if(document.querySelector('#notification-bar p').innerHTML === text) {
            notificationBar.animate([{transform: 'rotateZ(3deg)'}, {transform: 'rotateZ(-3deg)'}, {transform: 'rotateZ(3deg)'}, {marginTop: '20px'}], {duration: 200})
            return;
        }
        notificationBar.style.marginTop = '10px';
        document.querySelector('#notification-bar p').innerHTML = text;
    }
    else {
        notificationBar.style.marginTop = '-100px';
        document.querySelector('#notification-bar p').innerHTML = '';
    }
  }

  render() {
    return (
      <div className='split' style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div id='notification-bar' ><p></p>
        {this.state.showCancel === true ? 
        <img id='cancel-notification' src={CancelNotification} alt='cancel notification' onClick={() => this.toggleNotificationBar()} draggable='false' /> : <div/>
        }</div>
          <div id='confirmLogout-popup' ><p>Are you sure you want to logout?</p><div><span onClick={() => this.logout(false)} >cancel</span><span onClick={this.confirmLogout} >Logout</span></div></div>
        { this.state.route === 'Signin'? <div style={{height: '100%', width: '100%', display: 'flex',  justifyContent: 'center'}}> 
          <div id='disk-background'/>
          {this.state.signinDisplay === 'signinUser' ? 
          <Signin OnClickSignin={this.OnClickSignin} change = {this.changeSignin} toggleNotificationBar={this.toggleNotificationBar}/>: 
          <Register OnClickSignin={this.OnClickSignin} change = {this.changeSignin} toggleNotificationBar={this.toggleNotificationBar}/> 
          }</div> 
        :<div>
          <div id='split-left' className='split left' style={{width: '15%', transition: 'width .3s ease-out'}} >
          <LeftPanel
          que={this.state.que} 
          queContainer = {this.state.queContainer}
          ChangeCurrentWindow={this.ChangeCurrentWindow} 
          addque={(arr) => this.RightPanel.current.InitSong(arr)} 
          addPlayListToQue = {this.addPlayListToQue}
          toggleLeftPanel = {this.toggleLeftPanel}
          />
          </div>
          <div id='split-right' className='split right' style={{width: '85%', transition: 'width .3s ease-out'}} >
          <RightPanel ref={this.RightPanel} 
            state={this.state} 
            addque={this.addque} 
            deletePlayed={this.deletePlayedFromQue} 
            addSearchList={this.addSearchList} 
            ChangeCurrentWindow={this.ChangeCurrentWindow}  
            addPlayListToQue={this.addPlayListToQue}
            toggleNotificationBar={this.toggleNotificationBar}
            stateUpdater={this.stateUpdater}
            logout={this.logout}
          />
          </div>
          </div>
        }
          
      </div>
    );
  }
}

export default App;