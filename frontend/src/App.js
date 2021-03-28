import { useState, useCallback, useEffect } from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import  Users from './users/pages/Users';
import Signup from './users/pages/Signup';
import Login from './users/pages/Login';
import NewPlace from './places/pages/NewPlace';
import EditPlace from './places/pages/EditPlace';
import Places from './places/pages/Places';
import Header from './Header/Header';
import  AuthContext  from './context/AuthContext';

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const  [userName, setUserName] = useState(null);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    if(authData) {
      setUserId(authData.userId);
      setUserName(authData.userName);
      setToken(authData.token);
    }
  }, []);

  const login = useCallback((userName, userId, token) => {
    localStorage.setItem('authData', JSON.stringify({
      userId,
      userName,
      token
    }));
    setUserId(userId);
    setUserName(userName);
    setToken(token);
  }, [])
  const logout = useCallback(() => {
    localStorage.removeItem('authData');
    setUserId(null);
    setUserName(null);
    setToken(null);
  }, []);

  let routes = null;
  if(token !== null) {
    routes = <Router>
    <Header />
      <Switch>
        <Route exact path="/users"  component={Users}></Route>
        <Route exact path="/logout"  component={null}></Route>
        <Route exact path="/places/new"  component={NewPlace}></Route>
        <Route exact path="/:userId/places"  component={Places}></Route>
        <Route exact path="/places/:placeId/edit"  component={EditPlace}></Route>
      </Switch>
    </Router>;
  }
  else {
    routes = <Router>
    <Header />
    <Switch>
        <Route exact path="/users"  component={Users}></Route>
        <Route exact path="/signup" component={Signup}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/:userId/places"  component={Places}></Route>
        <Redirect to="/users" />
    </Switch>
    </Router>;
  }

  return(
      <AuthContext.Provider value={{
        isLoggedIn: !(token === null),
        token: token,
        userName: userName,
        userId: userId,
        login: login,
        logout: logout
      }}>
        {routes}
      </AuthContext.Provider>
    );
}

export default App;
