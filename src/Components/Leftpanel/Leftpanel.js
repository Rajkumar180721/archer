import React from 'react';
import './Leftpanel.css';
import images from './leftpanelIcons';


const toggleQueClass = () => {

    if(document.getElementsByClassName('queScroller')[0].style.maxHeight ===  '0px') {
        document.getElementsByClassName('queScroller')[0].style.maxHeight =  '500px';
    }
    else {
        document.getElementsByClassName('queScroller')[0].style.maxHeight =  '0px';
    }
    
}

const LeftPanel = ({que, queContainer, ChangeCurrentWindow, addque, toggleLeftPanel}) => {
    return (
        <div id='leftPanel' style={{transition: 'all .3s'}} onClick={() => {
            if(document.getElementById('leftPanel').clientWidth < 100)
                toggleLeftPanel(true)
            }} >
            <div style={{height: '45px'}} >
            <img src={images.Back} 
                id='leftPanelToggleButton'
                draggable='false'
                alt='cancel'
                style={{right: '5%', left: 'auto'}}
                onClick = {() => {
                    if(document.getElementById('leftPanel').clientWidth > 100)
                        toggleLeftPanel(false);
                }}
            />
            </div>
            <p id='plogo' style={{position: 'sticky', top: '0px', backgroundColor: 'black' }} onClick={() => ChangeCurrentWindow('Home')} ><img id='logo' style={{transition: 'height .3s, width .3s'}} src={images.Logo} draggable='false' alt='archer' /><span className='visible-during-leftPanelToggle' >Archer</span></p>
            <ul id='nav' >
                <li id='home-icon' onClick={() => ChangeCurrentWindow('Home')} > <img  className='icon' src={images.Home} alt='home' draggable='false' /><span className='visible-during-leftPanelToggle' >Home</span></li>
                <li id='search-icon' onClick={() => ChangeCurrentWindow('Search')} > <img  className='icon' src={images.Search} alt='home' draggable='false' /><span className='visible-during-leftPanelToggle' >Search</span></li>
                <li id='create-playlist-icon' onClick={() => ChangeCurrentWindow('CreatePlayList')} > <img  className='icon' src={images.CreateList} alt='home' draggable='false' /><span className='visible-during-leftPanelToggle' >Create playlist</span></li>
                <div style={{height:'40px'}} />
                <li onClick={toggleQueClass} ><img className='icon' style={{backgroundColor: '#dadce0'}} src={require('../../assets/player_assets/que.png')} alt='que' draggable='false' /><span className='visible-during-leftPanelToggle' >Now playing</span></li>

            </ul>

            <span className='visible-during-leftPanelToggle' style={{width: '100%'}}>
                {/*      Queue        */}
                <div className='queScroller' style={{maxHeight: '0px', transition: 'max-height .25s ease-in'}} >
                {que.length !== 0 ? 
                    <ul>
                        {que.map((arr, index) => 
                            <li  id={arr} key={arr} onClick={() => addque({'song_id': arr, 'song_image': queContainer[arr][0], 'song_name': queContainer[arr][1]})} >{index === 0 ? 
                            <img  className='icon queue'  src={require('../../assets/player_assets/firstInQue.png')} alt='home' draggable='false' />  
                            : <img  className='icon queue'  src={require('../../assets/player_assets/membersInQue.png')} alt='home' draggable='false' />} {queContainer[arr][1]} 
                            </li> 
                        )}
                    </ul>:
                <p id='noQue'  >no one in the queue</p>
                }
                </div>
            </span>
            <div style={{height: '30px'}} />
        </div>
    );
}


export default LeftPanel;