import React from 'react';
import './Homepage.css';
import slideArrow from "../../assets/icons8-circled-right-30.png";
import PlayList from '../../assets/player_assets/music-cd.png';



class Home extends React.Component {
    
    constructor (props) {
        super(props);
        this.state = {
            AlwaysForYou: []
        }
        
    }    
    

    scrollHorizontally = (id, direction) => {
    const element = id.parentNode;
    element.getElementsByTagName('div')[0].scrollBy({
        left: element.getElementsByTagName('div')[0].clientWidth * direction,
        behavior: 'smooth'
    })
    }

    
    render() {
        const {recents, recentsContainer, currentPlaylist, currentPlayListArray, AlwaysForYou, addPlayListToQue, playlists} = this.props;
        return (
            <div id='HomePage' style={{width: '85%', transition: 'width .3s ease-out'}} >
                {/* mapping playlist */}
                {playlists.length !== 0 ?
                <div>
                <p className='madeforyou'>PlayLists</p>  
                <div id='playlistContainer' >
                {playlists.map(arr => 
                <div className='playlists' key={arr} onClick={(e) => {
                    addPlayListToQue(arr);
                    setTimeout(() => {
                        document.getElementById('currentPlaylist').scrollIntoView({behavior: 'smooth'})
                        }, 150);}} >
                    <img  className='playlist-icon' src={PlayList} alt='home' draggable='false' style={{backgroundColor: 'white', borderRadius: '50%', border: '1px solid', margin: '0px 5px'}} /><span style={{marginBottom: '2px'}} >{arr}</span></div>
                    )}
                </div>   
                </div>
                : <div/> }
                {/* recents */}
                {recents.length !== 0 ? 
                <div>
                <hr/>
                <p className='madeforyou' >Recently played</p>   
                <div className='madeForYouContainer'>
                <img className='scroll-left' id='recents' src={slideArrow} alt='scroll-icon-left' draggable='false' onClick={(e) => {this.scrollHorizontally(e.target, -1)}} />
                <div className='madeForYou'>
                    {recents.map((arr) => 
                        <div className='box' key={arr} >
                        <img id={arr} className='song-picture' src={recentsContainer[arr][0]} alt='song' draggable='false' onClick={() => this.props.InitSong({'song_id': arr, 'song_image': recentsContainer[arr][0], 'song_name': recentsContainer[arr][1]})} />
                        <div className='songInfo' >
                            <h4>{recentsContainer[arr][1]}</h4>
                        </div>
                        </div>
                    )}
                    <div className='box' style={{cursor: 'default'}}><div className='empty-picture' /></div>
                </div>
                <img className='scroll-right' id='recents' src={slideArrow} alt='scroll-icon-right' draggable='false' onClick={(e) => {this.scrollHorizontally(e.target, 1)}} />
                </div>
                <hr/>
                </div>
                : <div/>}
                {/* Always for you block */}
                <p className='madeforyou' >Always for you</p>
                <div className='madeForYouContainer'>
                <img className='scroll-left' id='madeForYou' src={slideArrow} alt='scroll-icon-left' draggable='false' onClick={(e) => {this.scrollHorizontally(e.target, -1)}} />
                <div className='madeForYou'>
                    {AlwaysForYou.map(arr => 
                        <div className='box' key={arr.song_id} >
                            <img id={arr.song_id} className='song-picture' src={arr.song_image} alt='song' draggable='false' onClick={() => this.props.InitSong(arr) } />
                            <div className='songInfo' >
                                <h4>{arr.song_name}</h4>
                            </div>
                        </div>
                    )}
                        <div className='box' style={{cursor: 'default'}}><div className='empty-picture' /></div>
                </div>
                <img className='scroll-right' id='madeForYou' src={slideArrow} alt='scroll-icon-right' draggable='false' onClick={(e) => {this.scrollHorizontally(e.target, 1)}} />
                </div>
                <div style={{height:'5px'}} />
                <hr/>

                {/* current playlist */}
                <div style={{height:'5px'}} id='currentPlaylist' />
                {Object.keys(currentPlayListArray).length !== 0 ? 
                <div>
                <p className='madeforyou' >{currentPlaylist}</p>   
                <div className='madeForYouContainer'>
                <img className='scroll-left' id='recents' src={slideArrow} alt='scroll-icon-left' draggable='false' onClick={(e) => {this.scrollHorizontally(e.target, -1)}} />
                <div className='madeForYou'>
                    {Object.keys(currentPlayListArray).map((arr, index) => 
                        <div className='box' key={index} >
                            <img id={arr} className='song-picture' src={currentPlayListArray[arr][0]} alt='song' draggable='false' onClick={(e) => this.props.InitSong({'song_id': arr, 'song_image': currentPlayListArray[arr][0], 'song_name': currentPlayListArray[arr][1]}) } />
                            <div className='songInfo' >
                                <h4>{currentPlayListArray[arr][1]}</h4>
                            </div>
                        </div>
                    )}
                    <div className='box' style={{cursor: 'default'}}><div className='empty-picture' /></div>
                </div>
                <img className='scroll-right' id='recents' src={slideArrow} alt='scroll-icon-right' draggable='false' onClick={(e) => {this.scrollHorizontally(e.target, 1)}} />
                </div>
                </div>
                : <div/>}
            </div>
        );
    }
} 

export default Home;