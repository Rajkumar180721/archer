
import React from 'react';
import Profile from  '../../assets/human-icon.png';
import './Topbar.css';


const Topbar = ({logout}) => {
    const toggleTooltip = () => {
        let elem = document.getElementById('logoutMenu');
        elem.style.transition = 'all 1s';
        if(elem.style.height === 'auto') {
            elem.style.height = '0px';
            elem.style.width = '0px';
        } 
        else {
            elem.style.height = 'auto';
            elem.style.width = 'auto';
        }
    }
    return(
        <div className='topbar' id='topbar' style={{width: '85%', transition: 'width .3s ease-out'}} >
            <img id='profile' src={Profile} alt='profile' onClick={toggleTooltip} draggable="false"/>
            <div id='logoutMenu' >
                <span onClick={() => logout(true)} >Logout</span>
            </div>
        </div>
    );
}

export default Topbar;