import React from 'react';
import searchLens from '../../assets/player_assets/searchLens.png';
import './searchpage.css';
// import song from '../songs/songs';

let currentTabFocus = 0;
class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            searchedSong: ''
        }
    }
    
    componentDidMount() {
        // document.addEventListener("keydown", this.searchPageTiggerEvents, false);
        if(this.props.currentWindow === 'Search')
            document.getElementById('searchField').focus();
    }
        

    addSearchResults = (event) => {
        let value = event.target.value;
        value = value.trim();
        
        
        //return if the input field is empty with cleared state
        if(document.getElementById('searchField').value.trim() === '') {
            this.state.searchResults.splice(0, this.state.searchResults.length);
            return;
        }
      
      
        //searching for includes
        fetch(`https://cryptic-falls-60318.herokuapp.com/search/${value}`)
        .then(res => res.json())
        .then(includes => {
            this.setState({
                searchResults: [...includes]
            })
        })
        .catch(err => console.log(err));
        document.getElementById('searchField').focus();
        currentTabFocus = 0;
        this.setState({searchedSong: value});
    }


    searchPageTiggerEvents = (event)  => {
        console.log(this.props.currentWindow);

        if(event.keyCode === 38 && (this.props.currentWindow === 'Search')) {
            console.log('---------------------------------------------------------------------------')
            if(currentTabFocus <= 0)
                return;
            currentTabFocus -= 1;
            let element = document.querySelectorAll('.search-results')[currentTabFocus];
            element.focus();
            console.log(element);
        }


        if(event.keyCode === 40  && (this.props.currentWindow === 'Search')) {
            if(currentTabFocus >= this.state.searchResults.length-1) 
                return;
            currentTabFocus += 1;
            let element = document.querySelectorAll('.search-results')[currentTabFocus];
            element.focus();
            element.style={position: 'sticky', top: '30px'};
            console.log(element);
        }

        if(event.keyCode === 32)
            event.preventDefault();
    }

    render() { 
        const {InitSong, addSearchList, searchHistory, searchHistoryContainer} = this.props;
        return(
            <div id='searchPage' className='toggleWidth' style={{width: '85%', transition: 'width .3s ease-out'}}>
                <div className='searchBoxContainer'>
                    <img id='lensimge' src={searchLens} alt='search' draggable='false' />
                    <input id='searchField' type='text' autoComplete='off' onChange={this.addSearchResults}/>
                </div>
                {this.state.searchResults.length !== 0 ? 
                <div style={{marginTop: '30px'}} >
                    <ul id='nav' >
                        {this.state.searchResults.map((arr, index) => 
                            <li id={arr.song_id} key={arr.song_id} onClick={() => {
                                addSearchList(arr)
                                InitSong(arr)
                                }} style={{padding: '20px 65px'}} >
                                <a href='\#' tabIndex={index} className='search-results' id={arr.song_id}>
                                    <img className='search-results-songimg' src={arr.song_image} alt='songImg' height='40px' width='40px' draggable='false'/>
                                    <p>{arr.song_name}</p>
                                </a>
                            </li>
                        )}
                    </ul> 
                </div> : 
                <div>
                    {this.state.searchedSong.length !== 0 ?
                     <ul id='nav' >
                         <li style={{padding: '20px 165px', opacity: '.5'}}>Song not found</li>
                    </ul> 
                     : <ul id='nav' >
                         <span style={{padding: '10px 0px 10px 100px', opacity: '.7'}} >Search history</span>
                     {searchHistory.map((arr, index) => 
                         <li id={arr} key={arr} onClick={() => {
                             addSearchList({'song_id': arr, 'song_image': searchHistoryContainer[arr][0], 'song_name': searchHistoryContainer[arr][1]})
                             InitSong({'song_id': arr, 'song_image': searchHistoryContainer[arr][0], 'song_name': searchHistoryContainer[arr][1]})
                             }} style={{padding: '20px 65px'}} >
                             <a href='\#' tabIndex={index} className='search-results' id={arr}>
                                 <img className='search-results-songimg' src={searchHistoryContainer[arr][0]} alt='songImg' height='40px' width='40px' draggable='false'/>
                                 <p>{searchHistoryContainer[arr][1]}</p>
                             </a>
                         </li>
                     )}
                 </ul> }
                </div>
                }
            </div>
        );
    }
}

export default Search;