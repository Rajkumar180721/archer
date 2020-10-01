import React  from 'react';
import './login.css';
import '../Leftpanel/Leftpanel.css';
import Logo from '../../assets/logo.png'


class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    componentDidMount() {
        document.addEventListener('keypress', (e) => {
            if(this.state.email.length !== 0 && this.state.password.length !== 0 && e.keyCode === 13)
                this.OnSubmit();
        })
    }
    
    OnEmailChange = (event) => {
        this.setState({email: event.target.value})
    }
    OnPasswordChange = (event) => {
        this.setState({password: event.target.value})
    }
    OnSubmit = () => {
        fetch('https://cryptic-falls-60318.herokuapp.com/signin', {
            method: 'post',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        }).then(res => res.json())
        .then(data => {
            if(data === 'wrong credentials' || data === 'unable to get request' || data === 'Invalid user name or password') {
                this.setState({password: ''});
                document.getElementById('password').value = '';
                this.props.toggleNotificationBar(data, true);
            }
            else    
                this.props.OnClickSignin({'value': 'home', 'id': data.user_id, 'userName': data.username, 'playlists': JSON.parse(data.playlist), 'recent': JSON.parse(data.recents), 'searchHistory': JSON.parse(data.search_history)});
        })
        .catch((err) => {console.log(err)});
    }

    render(){
        const {change} = this.props;
        return (
            <div>
                <div className='main center' >
                    <form className='form' >
                    <p id='plogo' 
                        style={{position: 'sticky', top: '0px', margin: '20px 0px 40px 0px', padding: '0px', cursor: 'default'}}>
                        <img id='logo' style={{transition: 'height .3s, width .3s'}} src={Logo} draggable='false' alt='archer' />
                        <span className='visible-during-leftPanelToggle' >Archer</span>
                    </p>
                        <p>Email</p>
                        <input className='sign-in-input' type='text' name='email' onChange={this.OnEmailChange}  />
                        <p>Password</p>
                        <input className='sign-in-input' id='password' type='password' name='userpassword' onChange={this.OnPasswordChange}  /><br/><br/>
                        <p className='center' id='signin' style={{textAlign:"center"}}><span onClick={this.OnSubmit}>SignIn</span></p>
                        <p className='center' id='signin' style={{textAlign:"center"}}><span onClick={() => change('registerUser')}>Create new account</span></p>
                    </form>
                </div>
            </div>
    );
}}

class Register extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            name: '',
            email: '',
            password: '',
            verifiedPassword: false
        }
    }

    componentDidMount() {
        document.getElementsByTagName('input')[0].focus();
        document.addEventListener('keypress', (e) => {
            let canSubmit = Object.values(this.state).filter(arr => {
                return arr.length === 0;
            })
            if(canSubmit.length === 0 && this.state.verifiedPassword && e.keyCode === 13)
                this.OnSubmit();
            if(e.keyCode === 13) {
                let index = this.state.index;
                if(index > 2)
                    return;
                index++;
                this.setState({index: index})
                let input = document.getElementsByTagName('input');
                input[index].focus();
            }
        })

    }

    OnNameChange = (event) => {
        this.setState({name: event.target.value})
    }

    OnEmailChange = (event) => {
        this.setState({email: event.target.value})
    }
    OnPasswordChange = (event) => {
        this.setState({password: event.target.value})
    }
    checkPassword = (event) => {
        if(this.state.password === event.target.value) {
            event.target.style.borderBottom = '1px solid white';
            this.setState({verifiedPassword: true})
        }
        else {
            event.target.style.borderBottom = '1px solid #ff0000';
            this.setState({verifiedPassword: false});
        }
    }

    validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    OnSubmit = () => {
        if(this.validateEmail(this.state.email)) {
        if(this.state.verifiedPassword) {
            fetch('https://cryptic-falls-60318.herokuapp.com/register', {
                method: 'post',
                headers: {'content-type': 'application/json'},
                body : JSON.stringify({
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data === 'user already exists')
                    this.props.toggleNotificationBar(data, true);
                else {
                    this.props.OnClickSignin({'value': 'home', 'id': data.user_id, 'userName': data.username, 'playlists': JSON.parse(data.playlist), 'recent': JSON.parse(data.recents), 'searchHistory': JSON.parse(data.search_history)});
                }
            })
            .catch(err => console.log(err));
        }
        else {
            this.props.toggleNotificationBar('Retype the correct password', true);
            document.getElementById('retype').value = '';
        }}
        else
            this.props.toggleNotificationBar('Invalid email address!', true);
    }

    render() {
        const {change} = this.props;

    return (
        <div>
            <div className='main center' >
                <form className='form' >
                <p id='plogo' 
                    style={{position: 'sticky', top: '0px', margin: '20px 0px 40px 0px', padding: '0px', cursor: 'default'}}>
                    <img id='logo' style={{transition: 'height .3s, width .3s'}} src={Logo} draggable='false' alt='archer' />
                    <span className='visible-during-leftPanelToggle' >Archer</span>
                </p>
                    <p>Name</p>
                    <input className='sign-in-input' type='text' name='name' onChange={this.OnNameChange} />
                    <p>Email</p>
                    <input className='sign-in-input' id='email' type='text' name='email' onChange={this.OnEmailChange}  />
                    <p>Password</p>
                    <input className='sign-in-input' type='password' name='userpassword' minLength='8' placeholder='minimun 8-characters' onChange={this.OnPasswordChange}  /><br/><br/>
                    <p>RetypePassword</p>
                    <input className='sign-in-input' id='retype' type='password' name='userpassword' onChange={this.checkPassword}  /><br/><br/>
                    <p className='center' id='signin' style={{textAlign:"center"}} ><span onClick={this.OnSubmit}>Register</span></p>
                    <p className='center' id='signin' style={{textAlign:"center"}}><span onClick={() => change('signinUser')}>SignIn</span></p>
                </form>
            </div>
        </div>
    );

}}

export   {Signin, Register};