
import React from 'react';
import './Player.css';
import images from './controllersImages';


class Player extends React.Component {
    

    componentDidMount() {
        document.getElementById('slider').value = 0;
    }
    
    handler = (event) => {
        this.props.ShowTimeInChange(event);
        if(this.props.state.currentSong.id.length !== 0)
            document.getElementById('showOnChange').style.display = 'block';
        
    }
    
    render () {
        const {  currentSong, playPauseId,
            playPauseSrc,
            totalTime,
            currentTimeDisplay,
            totalTimeDisplay, speaker} = this.props.state;
            const {playFromBeginning, toggle, playNext, OnChangeVolume, OnChangeSlider} = this.props;
        return (
            <div id='Player' >
            <div className='currentsong' >
                { currentSong.image === '' ? <div/> : 
                    <div>
                        <img  src={currentSong.image} alt='' className='currentsong' draggable='false' />
                    </div>
                }
            </div>
            <div className='player-container' id='player-container' style={{transition: 'width .3'}} >
                <span id='showOnChange' style={{display: 'none'}} ></span>
                <div className='player' id='player' style={{right: '15%', transition: 'right .3s ease-out'}} >
                    <input id='slider' type='range' step='any' min='0' max={totalTime}  
                        onChange={(e) => {this.handler(e)}} 
                        onMouseUp={(e) => {
                            document.getElementById('showOnChange').style.display = 'none'; 
                            OnChangeSlider(e);
                            document.getElementById('slider').blur();}
                        } 
                    />
                    <div id='time-separator' ><span id='currentTime' >{currentTimeDisplay}</span><span id='endingTime' >{totalTimeDisplay}</span></div>
                    <div id='controlers' >
                        <img className='controllersBtns controllersBtnsHover' src={images[0].src} alt='back' draggable='false'
                        onClick={playFromBeginning}  />
                        <img id={playPauseId} className='controllersBtns controllersBtnsHover' src={images[playPauseSrc].src} alt='play' draggable='false' 
                        onClick={(e) => toggle(e.target.id)} />
                        <img className='controllersBtns controllersBtnsHover' src={images[2].src} alt='playnext' draggable='false'
                        onClick={playNext}  />
                    </div> 
                </div>
            </div>
            <div className='volume' >
                <img id='speaker' src={images[speaker].src} alt='volume' height='20px' width='20px' style={{backgroundColor: '#9a905d', borderRadius: '50%', opacity: '.5', userSelect:'none'}} draggable='false'/>
                <input id='volumeDisplayer' type='range' step='any' min='0' max='1' onChange={OnChangeVolume} />
            </div>
            </div>
        );
    }
}

export default Player;