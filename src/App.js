import logo from './logo.svg';
import './App.css';
import { Grid, IconButton, TextField, Paper, Menu, MenuItem, Button, InputAdornment, Divider } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useState } from 'react';

function App() {

  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [logged, setLogged] = useState(false)
  const [menu, setMenu] = useState(null)
  const [Username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const openMenu = (event) => {
    setMenu(event.currentTarget);
  }

  const closeMenu = () => {
    setMenu(null)
  }

  const handleLogIn = () => {
    setLogged(true)
  }

  const handleLogOut = () => {
    setLogged(false)
  }

  return (
    <div>
      <header className="header">
        <Grid container direction="row" justifyContent="space-around" alignItems="center">
          <h2>URL Shortener</h2>
          <IconButton onClick={openMenu}>
            <AccountCircleIcon fontSize="large" />
          </IconButton>
          <Menu anchorEl={menu} keepMounted open={Boolean(menu)} onClose={closeMenu}>
            {logged ?
              <Grid container direction="column" justifyContent="space-between" alignItems="center">
                <MenuItem>See top 20</MenuItem>
                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
              </Grid>
              
            : 
              <Grid container direction="column" justifyContent="space-between" alignItems="center">
                <TextField label="Username"/>
                <TextField label="Password"/>
                <MenuItem onClick={handleLogIn}>
                  Log In
                </MenuItem>
              </Grid>
            }
          </Menu>
        </Grid>
      </header>
      <body className='body'>
        <Grid container direction="column" justifyContent="space-between" alignItems="center">
          <Grid container direction="column" justifyContent="space-around" alignItems="center">
            <h1>Insert your URL here</h1>
            <TextField label="URL" variant="outlined" />
            <h2>Your code</h2>
            <TextField placeholder="Your code will show up here" variant="outlined" InputProps={{ endAdorment : ( <InputAdornment position="end"> <AssignmentIcon/> </InputAdornment> ), }} />
            <h1>Insert your code here</h1>
          </Grid>
          <TextField label="Code" variant="outlined" />
        </Grid>
      </body>
    </div>
  );
}

export default App;
