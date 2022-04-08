import axios from 'axios'
import './App.css';
import { Grid, IconButton, TextField, Paper, Menu, MenuItem, Button, InputAdornment, Divider, Tooltip } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useEffect, useState } from 'react';

function App() {

  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [logged, setLogged] = useState(false)
  const [menu, setMenu] = useState(null)
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [errorLogin, setErrorLogin] = useState(false)
  const [errorUrl, setErrorUrl] = useState(false)
  const [errorCode, setErrorCode] = useState(false)

  const openMenu = (event) => {
    setMenu(event.currentTarget);
  }

  const closeMenu = () => {
    setMenu(null)
  }

  const handleLogIn = () => {
    axios.post("http://localhost:8000/login", { userName: username, password: password }).then((res) => {
      if (res.status === 200) {
        setUserName('')
        setPassword('')
        setLogged(true)
        setErrorLogin(false)
      } else {
        setErrorLogin(true)
      }
    })
  }

  const handleLogOut = () => {
    setLogged(false)
  }

  const handleChangeUsername = (event) => {
    setUserName(event.target.value)
  }

  const handleChangePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleChangeUrl = (event) => {
    setUrl(event.target.value)
  }

  const handleGenerate = () => {
    const regEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    const check = regEx.exec(url)
    if (check) {
      setErrorUrl(false)
      axios.post("http://localhost:8000/generate", { urlSent: url }).then((res) => {
        console.log(res.data)
        if (res.status === 200) {
          setCode(res.data.code.toString())
        }
      })
    } else {
      setErrorUrl(true)
    }

  }

  useEffect(() => {
    setCode('Your code will show up here')
  }, [])

  return (
    <div>
      <header className="header">
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <h2 className='codeShow'>URL Shortener</h2>
          <Tooltip title="Admin options">
            <IconButton onClick={openMenu}>
              <AccountCircleIcon fontSize="large" className='codeCopy' />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={menu} keepMounted open={Boolean(menu)} onClose={closeMenu}>
            {logged ?
              <Grid container direction="column" justifyContent="space-between" alignItems="center" className='loginMenu'>
                <Button variant="contained" className='buttonsLogin' >See top 20</Button>
                <p></p>
                <Button variant="contained" className='buttonsLogin' onClick={handleLogOut}>Log Out</Button>
              </Grid>
              :
              <Grid container direction="column" justifyContent="space-between" alignItems="center" className='loginMenu'>
                <TextField className='loginField' label="Username" onChange={handleChangeUsername} error={errorLogin} />
                <TextField className='loginField' label="Password" onChange={handleChangePassword} error={errorLogin} />
                <p></p>
                <Button variant="contained" className='buttonsLogin' onClick={handleLogIn}>
                  Log In
                </Button>
              </Grid>
            }
          </Menu>
        </Grid>
      </header>
      <body className='body'>
        <Grid container direction="column" justifyContent="space-between" alignItems="center">
          <h1>Insert your URL here</h1>
          <TextField label="URL" variant="outlined" className='mainField' onChange={handleChangeUrl} error={errorUrl} helperText={errorUrl ? "The URL introduced is invalid" : ""} />
          <p></p>
          <Button variant="contained" className='buttonsMain' onClick={handleGenerate}>
            Generate code
          </Button>
          <p></p>
          <Paper variant="outlined" elevation={0} className='code'>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <h3 className='showCode'>{code}</h3>
              <Paper elevation={0} className='codeCopy'>
                <Tooltip title="Copy to clipboard">
                  <IconButton onClick={() => {
                    if ('clipboard' in navigator) {
                      navigator.clipboard.writeText(code)
                    } else {
                      document.execCommand('copy', true, code)
                    }
                  }}>
                    <AssignmentIcon />
                  </IconButton>
                </Tooltip>
              </Paper>
            </Grid>
          </Paper>
          <h1>Insert your code here</h1>
          <TextField className='code' label="Code" variant="outlined" />
          <p></p>
          <Button variant="contained" className='buttonsMain' >Go to page</Button>
        </Grid>
      </body>
    </div>
  );
}

export default App;
