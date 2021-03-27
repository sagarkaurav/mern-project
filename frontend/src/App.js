import { useState } from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom'
import  Users from './users/pages/Users';
import NewPlace from './places/pages/NewPlace';
import Places from './places/pages/Places';
import Header from './Header/Header';
import  AuthContext  from './context/AuthContext';

function App() {
  const [auth, setAuth] = useState(false);
  const login = () => {
    setAuth(true);
  }
  const logout = () => {
    setAuth(false);
  }

  return(
      <AuthContext.Provider value={{
        isLoggedIn: auth,
        login: login,
        logout: logout
      }}>
      <Router>
      <Header />
        <Route exact path="/users"  component={Users}></Route>
        <Route exact path="/places/new"  component={NewPlace}></Route>
        <Route exact path="/:userId/places"  component={Places}></Route>
      </Router>
      </AuthContext.Provider>
    );
}

export default App;
