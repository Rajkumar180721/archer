import React from 'react';
import './Rightpanel.css';
import Home from '../Homepage/Homepage';
import Search from '../Searchpage/Searchpage';
import Topbar from '../Topbar/Topbar';
import CreatePlayList from '../CreatePlaylist/CreatePlayList';
import Player from '../Player/Player';


let audio = new Audio();
let ctrlPressed = false;
audio.volume = 0.75;
let currentVolume = {
    changing: false,
    value: 0.75
};

class RightPanel extends React.Component  {
    mounted = false;
    constructor() {
        super();
        this.state = {
            currentSong: {id: '', image: ''},
            playPauseId: 'play',
            playPauseSrc: 1,
            currentTime: 0,
            totalTime: '',
            currentTimeDisplay: '',
            totalTimeDisplay: '',
            speaker: 4,
            recents: [],
            recentsContainer: {},
            sliderIsChanging: false
        }
    }
    
    componentDidMount(){
        this.mounted = true;
        if(typeof InstallTrigger === 'undefined') {
            navigator.mediaSession.setActionHandler('play', () => {this.toggleBtn('play')});
            navigator.mediaSession.setActionHandler('pause', () => {this.toggleBtn('pause')});
            navigator.mediaSession.setActionHandler('seekbackward', () => {
                if(audio.src === '')
                    return;
                audio.currentTime -=10;
            });
            navigator.mediaSession.setActionHandler('seekforward', () => {
                if(audio.src === '')
                    return;
                audio.currentTime +=10;
            });
            navigator.mediaSession.setActionHandler('previoustrack',() => {this.playFromBeginning()});
            navigator.mediaSession.setActionHandler('nexttrack', () => {this.playNext()});
        }

        fetch(`https://cryptic-falls-60318.herokuapp.com/image/${JSON.stringify(this.props.state.recents)}`)
            .then(res => res.json())
            .then(json => {
                let tempObj = {}; 
                json.forEach(arr => {
                    tempObj[arr.song_id] = [arr.song_image, arr.song_name];
                })
                this.setState({recentsContainer: {...tempObj}, recents: [...this.props.state.recents]});
            })
            .catch(console.log);
        document.addEventListener("keydown", this.tiggerEvents, false);
        document.addEventListener("keyup", (e) => {
            if(e.keyCode===17)
            this.ctrlPressed=false
        });

        audio.onvolumechange = () => {  
            if(!currentVolume.changing) {
                let volume = audio.volume;
                // speaker image
                if(volume === 0)
                    this.setState({speaker: 5});
                else 
                    this.setState({speaker: 4});
                document.getElementById('volumeDisplayer').value = volume;
            }   
        }
        }
        
        componentWillUnmount(){
            this.mounted = false;
            audio.pause();
            document.removeEventListener("keydown", this.tiggerEvents, false);
            document.addEventListener("keyup", (e) => {
            if(e.keyCode===17)
                this.ctrlPressed=false
        });
      }


    InitSong = (arr) => {
        if(arr.song_id === this.state.currentSong.id) {
            this.toggleBtn('play')
            return;
        }
        this.props.addque(arr);
    }
    
    OnSongImgClick = (data) => {
        this.mounted = true;
        fetch(`https://cryptic-falls-60318.herokuapp.com/mp3/${JSON.stringify(data.song_id)}`, {
            method: 'get',
            headers: {'content-type': 'application/json'}
        })
        .then(res => {
            audio.src = res.url;
        } )
        .catch(err => {throw(err)});   

        audio.preload = "metadata";
        document.getElementById('volumeDisplayer').value = audio.volume = currentVolume.value;
        audio.currentTime = 0;
        audio.onloadedmetadata = () => {
            
            let totalDuration = audio.duration;
            let totalSec = ~~(totalDuration % 60);
            this.setState({
                currentSong: {id : data.song_id, image: data.song_image},
                currentTime: 0,
                totalTime: totalDuration,
                currentTimeDisplay: '0:00',
                totalTimeDisplay: ~~((totalDuration % 3600) / 60) + ':' + (totalSec <=9 ? '0'+ totalSec: totalSec)
            })
            
            this.addRecents(data);
            this.toggleBtn('play');
            if(this.mounted){
            audio.ontimeupdate = () => {
                let currentsec = ~~(audio.currentTime % 60);
                let currentimeDisplay = ~~((audio.currentTime % 3600) / 60) + ':' + (currentsec <=9 ? '0'+ currentsec: currentsec);
                if(this.mounted) {
                this.setState({
                    currentTime: audio.currentTime,
                    currentTimeDisplay: currentimeDisplay
                })
                if(this.state.sliderIsChanging === false)
                    document.getElementById('slider').value=this.state.currentTime;
                    
                if(this.state.currentTime >= this.state.totalTime) {
                    this.mounted = false;
                    this.toggleBtn('pause');
                    if (this.props.deletePlayed(this.state.currentSong.id)) //deleting played song from que
                        this.mounted = true;
                    this.toggleBtn('pause');
                }}
            }}
        }
    }

    addRecents = (id) => {

        let tempRecent = this.state.recents, tempRecentContainer = this.state.recentsContainer;
        let index = tempRecent.indexOf(id.song_id);
        if(index >-1) {
            tempRecent.splice(index, 1);
        }
        tempRecent.unshift(id.song_id);
        tempRecentContainer[id.song_id] = [id.song_image, id.song_name];
        delete tempRecentContainer[tempRecent.splice(10, tempRecent.length - 10)];

        this.setState({
            recents: [...tempRecent],
            recentsContainer: {...tempRecentContainer}
        });
        
        fetch(`https://cryptic-falls-60318.herokuapp.com/recent/${this.props.state.userID}`,{
            method: 'put',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                "recents": JSON.stringify(this.state.recents)
            })
        })
        .then(res => res.json())
        // .then(json => console.log(json))
        .catch(err => console.log('Error:', err));
    }

    smootheningAudio = (dir) => {
        if(currentVolume.changing || !this.mounted)
            return;
        let temp = dir > 0 ? 0 : audio.volume;
        currentVolume.changing = true;
        currentVolume.value = audio.volume;
        let interval = setInterval(() => {
            temp += (0.02 * dir);
            if(dir > 0) {
                this.setState({
                    playPauseId: 'pause',
                    playPauseSrc: 3
                })
                audio.play();
            }
            else {
                this.setState({
                    playPauseId: 'play',
                    playPauseSrc: 1
                })
            }
            if(temp < 0 || temp >= currentVolume.value) {
                clearInterval(interval);
                currentVolume.changing = false;
                if(dir < 0) {
                    audio.pause();
                }
                setTimeout(() => {
                    audio.volume = currentVolume.value;
                }, 40);
                return;
            }
            audio.volume = temp;
        }, 10);
    }

    OnChangeSlider = (event) => {
        this.setState({sliderIsChanging: false});
        audio.currentTime = event.target.value;
    }    

    ShowTimeInChange = (event) => {
        this.setState({sliderIsChanging: true});
        let temp = ~~((event.target.value % 3600) / 60) + ':' + (~~(event.target.value % 60) <=9 ? '0'+ ~~(event.target.value % 60): ~~(event.target.value % 60));
        document.getElementById('showOnChange').innerHTML = temp;
    }

    OnChangeVolume = (event) => {
        audio.volume = event.target.value;
    }

    playFromBeginning = () => {
        audio.currentTime = 0;
    }

    toggleBtn = (data) => {

        if(audio.src === '')
            return 0;
        if(data === 'play') {
            this.smootheningAudio(1);
        }
        else {
            this.smootheningAudio(-1);
        }    
    }

    playNext = () => {
        audio.currentTime = this.state.totalTime;
    }

    changeVolume = (dir) => {
        let volume = audio.volume;
            volume += (0.1 * dir);
            if(volume >= 1.0)
                volume = 1.0;
            if(volume <= 0)
                volume = 0;
            audio.volume= volume;
    }

    tiggerEvents = (event) => {

        if(event.keyCode === 32 && event.target === document.body) {
            event.preventDefault();
        }

        if(event.keyCode === 32 && document.activeElement !== document.getElementById('searchField') && document.activeElement !== document.getElementById('inputField'))
            this.toggleBtn(this.state.playPauseId);
        
        if(event.keyCode === 39 && document.activeElement !== document.getElementById('searchField') && document.activeElement !== document.getElementById('inputField')) {
            if(audio.src === '')
                return;
            audio.currentTime += 10;
        }

        if(event.keyCode === 37 && document.activeElement !== document.getElementById('searchField') && document.activeElement !== document.getElementById('inputField')) {
            if(audio.src === '')
                return;
            audio.currentTime -=10;
        }

        if(event.keyCode === 78 && document.activeElement !== document.getElementById('searchField') && document.activeElement !== document.getElementById('inputField')) 
            audio.currentTime = 0;

        if(event.keyCode === 17)
            this.ctrlPressed=true;

        if(this.ctrlPressed && event.keyCode === 38) {
            event.preventDefault();
            this.changeVolume(1);
        }
        if(this.ctrlPressed && event.keyCode === 40) {
            event.preventDefault();
            this.changeVolume(-1);
        }
        if(this.ctrlPressed && event.keyCode === 37) {
            event.preventDefault();
            let change = audio.currentTime;
            change -=25;
            if(change <0)
                change = 0;
            audio.currentTime = change; 
        }
        if(this.ctrlPressed && event.keyCode === 39) {
            event.preventDefault();
            let change = audio.currentTime;
            change +=25;
            if(change >= audio.duration)
                change = audio.duration;
            audio.currentTime = change; 
        }
    }

    killAudio = () => {
        audio.pause();
    }
    
    render () {
        const {userID, currentWindow, currentPlaylist, currentPlayListArray, AlwaysForYou, search_history, search_history_container, playlists} = this.props.state;
        const {ChangeCurrentWindow, addPlayListToQue, toggleNotificationBar, stateUpdater, logout} = this.props;
        return (
            <div id='rightpanel' >{ctrlPressed}
                <div className='splitUp' id='splitUp'>
                <Topbar  logout={logout}/>
                <p id='currentWindow' >{currentWindow}</p>
                {currentWindow === 'Home' ? <Home AlwaysForYou={AlwaysForYou} InitSong={this.InitSong} recents={this.state.recents} recentsContainer={this.state.recentsContainer} addPlayListToQue={addPlayListToQue} currentPlaylist={currentPlaylist} currentPlayListArray={currentPlayListArray} playlists={playlists} />: <div/>}
                {currentWindow === 'Search' ? <Search InitSong={this.InitSong} currentWindow={currentWindow} addSearchList={this.props.addSearchList} searchHistory={search_history} searchHistoryContainer={search_history_container} />: <div/>}
                {currentWindow === 'CreatePlayList' ? <CreatePlayList currentWindow={currentWindow} toggleNotificationBar={toggleNotificationBar} playlists={playlists} userID={userID} ChangeCurrentWindow={ChangeCurrentWindow} stateUpdater={stateUpdater} /> : <div/>}
                <div style={{height: '50px'}} />
                </div>
                <div className='splitDown' >
                <Player 
                    state={this.state} 
                    playFromBeginning={this.playFromBeginning} 
                    toggle={this.toggleBtn} 
                    playNext={this.playNext} 
                    OnChangeSlider={this.OnChangeSlider} 
                    OnChangeVolume={this.OnChangeVolume} 
                    ShowTimeInChange={this.ShowTimeInChange}
                />
                </div>
            </div>
        );
    }
}

export default RightPanel;