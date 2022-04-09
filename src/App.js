import axios from 'axios'
import './App.css';
import { Grid, IconButton, TextField, Paper, Menu, Button, Tooltip, Dialog, DialogTitle, DialogContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
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
  const [top20, setTop20] = useState([])
  const [popup, setPopup] = useState(false)
  const [goto, setGoto] = useState('')

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

  const handleChangeGoto = (event) => {
    setGoto(event.target.value)
  }

  const handleGenerate = () => {
    const regEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    const check = regEx.exec(url)
    if (check) {
      setErrorUrl(false)
      axios.post("http://localhost:8000/generate", { urlSent: url }).then((res) => {
        if (res.status === 200) {
          setCode(res.data.code.toString())
        }
      })
    } else {
      setErrorUrl(true)
    }

  }

  const handleTop20 = () => {
    axios.get("http://localhost:8000/top20").then((res) => {
      if (res.status === 200) {
        const results = res.data.results
        setTop20(results)
      }
    })
  }

  const handleOpenDialog = () => {
    handleTop20()
    setPopup(true)
  }

  const handleCloseDialog = () => {
    setPopup(false)
  }

  const handleRedirect = () => {
    axios.post("http://localhost:8000/goto", { code: goto }).then((res) => {
      if (res.status === 200) {
        setErrorCode(false)
        const url = res.data.url
        window.open(url)
      }else{
        setErrorCode(true)
      }
    })
  }

  const handleRedirectBar = (gotoBar) => {
    axios.post("http://localhost:8000/goto", { code: gotoBar }).then((res) => {
      if (res.status === 200) {
        const url = res.data.url
        window.open(url)
      }
    })
  }

  useEffect(() => {
    setCode('Your code will show up here')
  }, [])

  useEffect(() => {
    handleRedirectBar(window.location.pathname.substring(1))
  }, [window.location])

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
                <Button data-testid="top20Button" variant="contained" className='buttonsLogin' onClick={handleOpenDialog}>See top 20</Button>
                <p></p>
                <Button data-testid="logoutButton" variant="contained" className='buttonsLogin' onClick={handleLogOut}>Log Out</Button>
              </Grid>
              :
              <Grid container direction="column" justifyContent="space-between" alignItems="center" className='loginMenu'>
                <TextField inputProps={{ "data-testid": "usernameField" }} className='loginField' label="Username" onChange={handleChangeUsername} error={errorLogin} />
                <TextField inputProps={{ "data-testid": "passwordField" }} className='loginField' label="Password" onChange={handleChangePassword} error={errorLogin} />
                <p></p>
                <Button data-testid="loginButton" variant="contained" className='buttonsLogin' onClick={handleLogIn}>
                  Log In
                </Button>
              </Grid>
            }
          </Menu>
        </Grid>
      </header>
      <body className='body'>
        <Grid container direction="column" justifyContent="space-between" alignItems="center">
          <Dialog onClose={handleCloseDialog} open={popup}>
            <DialogTitle>Top 20 most visited URLs</DialogTitle>
            {top20.length === 0 ? <DialogContent>No entries to show</DialogContent> :
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>URL</TableCell>
                      <TableCell>Visits</TableCell>
                      <TableCell>Requests</TableCell>
                      <TableCell>Code</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {top20.map((row) => (
                      <TableRow>
                        <TableCell>{row.url}</TableCell>
                        <TableCell>{row.visits}</TableCell>
                        <TableCell>{row.requests}</TableCell>
                        <TableCell>{row.code}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            }
          </Dialog>
          <h1>Insert your URL here</h1>
          <TextField inputProps={{ "data-testid": "urlField" }} label="URL" variant="outlined" className='mainField' onChange={handleChangeUrl} error={errorUrl} helperText={errorUrl ? "The URL introduced is invalid" : ""} />
          <p></p>
          <Button data-testid="generateButton" variant="contained" className='buttonsMain' onClick={handleGenerate}>
            Generate code
          </Button>
          <p></p>
          <Paper variant="outlined" elevation={0} className='code'>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <h3  className='showCode'>{code}</h3>
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
          <TextField inputProps={{ "data-testid": "codeField" }} className='code' label="Code" variant="outlined" onChange={handleChangeGoto} error={errorCode} helperText={errorCode ? "The code does not match any registered URL" : ""}/>
          <p></p>
          <Button data-testid="redirectButton" variant="contained" className='buttonsMain' onClick={handleRedirect}>Go to page</Button>
          <p></p>
          <label>Or introduce your code in the navbar as "localhost:3000/[your_code]"</label>
        </Grid>
      </body>
    </div>
  );
}

export default App;
