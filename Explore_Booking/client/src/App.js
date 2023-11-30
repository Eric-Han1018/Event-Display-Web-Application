import React from 'react';
// import cookies, { currentUser } from './components/cookie/cookie'
// Importing react-router-dom to use the React Router
import { Route, Switch, BrowserRouter, Redirect} from 'react-router-dom';
import './App.css';

// Import pages here.
import Explore from './views/explore/index'
import Login from './views/login';
import Home from './views/homepage/index'
import Register from './views/register/register';
import Profile from './views/profile/profile';
import BoothView from 'views/booth/BoothView';
import NotFound from 'views/404/NotFound';
import EditEvent from './views/profile/editpage/editEvent';
import EditProfile from './views/profile/editpage/editProfile';
import EditBooth from './views/profile/editpage/editBooth';
import ManageUsers from 'views/manageUsers/index';
import CreateBooth from 'views/createBooth/index';
import CreateEvent from 'views/createEvent';
import { checksession } from 'utils/user';
import Prehome from 'views/Prehomepage';

class App extends React.Component {

  componentDidMount(){
    checksession(this)
  }

  state = {
    currentUser: null,
    currentEvent: null
  }

  render() {
    // const currUser = currentUser()
    // if(currUser && window.location.pathname === "/"){
    //   if(currUser.identity === "admin"){
    //     window.location.href = '/admin'
    //   }else{
    //     window.location.href = '/home'
    //   }
    // }

    return (
        <div>
        <BrowserRouter>
          <Switch>
            <Route exact path='/'><Redirect to='/chooseEvent'/></Route>
            <Route exact path='/chooseEvent' render={(props) => (<Prehome app={this} {...props}/>)}/>
            <Route exact path='/login' render={(props) => (<Login app={this} {...props}/>)}/>
            <Route exact path='/register' render={(props) => (<Register/>)}/>
            <Route exact path='/explore' render={(props) => (<Explore {...props} app={this}/>)}/>
            <Route exact path='/explore/:id' render={(props) => (<Explore {...props} app={this}/>)}/>
            <Route exact path='/home/:id' render={(props) => (<Home user={this.state.currentUser} {...props} app={this}/>)}/>
            <Route exact path='/boothview/:id' render={(props) => (<BoothView {...props} app={this}/>)}/>
            <Route exact path='/profile/:id' render={() => (<Profile app={this}/>)}/>
            <Route exact path='/editEvent/:id' render={() => (<EditEvent app={this}/>)}/>
            <Route exact path='/editBooth/:id' render={() => (<EditBooth app={this}/>)}/>
            <Route exact path='/editProfile/:id' render={() => (<EditProfile app={this}/>)}/>
            <Route exact path='/manageUsers' render={()=>(<ManageUsers app={this}/>)}/>
            <Route exact path='/createBooth' render={()=>(<CreateBooth app={this}/>)}/>
            <Route exact path='/createEvent' render={()=>(<CreateEvent app={this}/>)}/>
            <Route exact path='/404' render={(props) => (<NotFound  {...props} app={this}/>)}/>
            <Route>
              <Redirect to='/404'/>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );  
  }
}

export default App;
