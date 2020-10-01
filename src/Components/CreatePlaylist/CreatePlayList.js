import React from 'react';
import './createPlayList.css';
import searchLens from '../../assets/player_assets/searchLens.png';
import createPlayList from '../../assets/create_list.png';
import arrow from '../../assets/icons8-down-button-30.png'
import disselect from '../../assets/icons8-close-window-30.png';

class CreatePlayList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            selectedItems: [],
            selectedCount: 0,
            newPlaylistName: ''
        }
    }
    
    componentDidMount() {
        
        if(this.props.currentWindow === 'CreatePlayList')
            document.getElementById('inputField').focus();
    }
        

    addSearchResults = (event) => {
        let value = event.target.value;
        value = value.trim();
        
        //return if the input field is empty with cleared state
        if(value.trim() === '') {
            this.setState({searchResults: []});
            return;
        }
        
      
        //searching for includes
        fetch(`https://cryptic-falls-60318.herokuapp.com/search/${value}`)
        .then(res => res.json())
        .then(includes => {
            let tempResults = includes.filter(arr => {return !this.state.selectedItems.includes(arr.song_id)});
            this.setState({
                searchResults: tempResults
            })
        })
        .catch(err => console.log(err));
        document.getElementById('searchField').focus();
    }

    addCount = (ele) => {
        let elem = ele.parentNode;
        if(this.state.selectedItems.includes(elem.id))
            return;
        elem.animate({opacity: 0}, {duration: 150});
        setTimeout(() => {
            elem.style.display = 'none';
        }, 150);
        this.setState({selectedCount: this.state.selectedCount+1, selectedItems: [...this.state.selectedItems, elem.id]});
    }

    disselectAll = () => {
        if(this.state.selectedCount === 0)
            return;
        let parentElem = document.getElementsByClassName('searchForNewPlaylist');
        Object.values(parentElem).forEach(arr => {
            if(this.state.selectedItems.includes(arr.id)) {
                arr.style.display = 'block';
                arr.parentNode.style.opacity = 1;
            }
        })
        this.setState({
            selectedItems: [],
            selectedCount: 0
        })
    } 

    addPlaylist = () => {

        if(this.props.playlists.includes(this.state.newPlaylistName)) {
            this.props.toggleNotificationBar('Playlist already exists!', true);
            return;
        }
        
        if(this.state.selectedCount < 10) {
            this.props.toggleNotificationBar('A playlist need atleat ten songs!', true);
            return;
        }


        fetch(`https://cryptic-falls-60318.herokuapp.com/newplaylist/${this.props.userID}`, {
            method: 'post',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                newPlaylistName: this.state.newPlaylistName,
                newPlaylistSongs: this.state.selectedItems
            })
        })
        .then(res => res.json())
        .then(data => {
            
            let tempPlaylistName = Object.keys(data).filter(arr => {return  (!this.props.playlists.includes(arr) && arr !=='default')});
            this.props.stateUpdater(tempPlaylistName, data[tempPlaylistName[0]]);
            this.props.toggleNotificationBar('Playlist created successfully', true, 10000);
            this.props.ChangeCurrentWindow('Home');
        })
        .catch(err => {throw(err)});
        
    }

    render() {
        return(
            <div id='CreatePlayList' style={{transition: 'width .3s'}} >
                {this.state.newPlaylistName !=='' ? 
                <p id='selected-song' ><span style={{fontSize: '26px'}}>{this.state.selectedCount}</span> selected
                <span id='deselect-items' onClick={this.disselectAll}>
                    <img src={disselect} alt='disselect' 
                    style={{ marginRight: '10px', backgroundColor: 'white', height: '20px'}} draggable='false' />
                    Deselect All
                </span>
                </p>
                : <div/>
                }
                <div className='searchBoxContainer fixed' style={{zIndex: '99999', transition: 'width .3s', marginBottom: '20px'}}   >
                    <img id='lensimge' src={createPlayList} alt='search' draggable='false' />
                    <input id='inputField' type='text' autoComplete='off' placeholder='Name your playlist' onChange={(e) => {this.setState({newPlaylistName: e.target.value.trim()})}}/>
                    {this.state.newPlaylistName !=='' ? <button id='addBtn' onClick={this.addPlaylist} ><span>Add</span></button> : <div/>}
                </div>

                {this.state.newPlaylistName !=='' ? 
                <div id='searchPage' style={{transition: 'width .3s', marginBottom: '120px'}}  >
                <div className='searchBoxContainer' >
                    <img id='lensimge' src={searchLens} alt='search' draggable='false' />
                    <input id='searchField' type='text' autoComplete='off' placeholder='Search and add songs' onChange={this.addSearchResults}/>
                </div>
                </div>
                : <div/>}


                
                {this.state.newPlaylistName !=='' ? 
                <div className='grid-container' id='createPlaylistSearchResultContainer' >
                {
                    this.state.searchResults.map((arr) => 
                        <div className='box searchForNewPlaylist' id={arr.song_id} key={arr.song_id}>
                            <img id={arr.song_id} className='song-picture' src={arr.song_image} alt='song_image' draggable='false' onClick={(e) => this.addCount(e.target)} />
                            <div className='songInfo' >
                                <h4 id='songInfoWithHighlight' ><p>{arr.song_name}</p></h4>
                            </div>
                        </div>)
                }

                <div/><div/><div/><div/><div/><div/>
                </div>
                : <div/>}
            <div id='up-down-arrows' >
                <img id='up-arrow' src={arrow} alt='up arrow' draggable='false' onMouseDown={() => {document.getElementById('splitUp').scrollBy({top: -((window.innerHeight) - 100), behavior: 'smooth'})}} />
                <img id='down-arrow' src={arrow} alt='down arrow' draggable='false' onMouseDown={() => {document.getElementById('splitUp').scrollBy({top: (window.innerHeight) - 100, behavior: 'smooth'})}  } />
            </div>
            </div>

        );
    }
}

export default CreatePlayList;