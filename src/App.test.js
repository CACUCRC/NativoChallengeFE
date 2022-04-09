import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { wait } from '@testing-library/user-event/dist/utils';
import App from './App';

test('inserting an URL does generate a code', () => {
  render(<App/>)
  const urlField = screen.getByTestId('urlField')
  fireEvent.change(urlField, { target: { value: "http://www.facebook.com" } })
  const genButton = screen.getByTestId('generateButton')
  fireEvent.click(genButton)
  waitFor(() => {
    const codeText = screen.getByText("Your code will show up here")
    expect(codeText).toBeNull()
  })
})

test('generates apropiate code for "http://www.youtube.com" (2149)', () => {
  render(<App />)
  const urlField = screen.getByTestId('urlField')
  fireEvent.change(urlField, { target: { value: "http://www.youtube.com" } })
  const genButton = screen.getByTestId('generateButton')
  fireEvent.click(genButton)
  waitFor(() => {
    const codeGen = screen.getByText(/2149/i)
    expect(codeGen).toBeInTheDocument()
  })
})

test('introducing 2149 should redirect to "http://www.yotube.com"', () => {
  render(<App/>)
  const codeField = screen.getByTestId('codeField')
  fireEvent.change(codeField, {target: {value: "2149"}})
  const redButton = screen.getByTestId('redirectButton')
  fireEvent.click(redButton)

})

test('login with correct credentials', () => {
  render(<App/>)
  const userField = screen.getByTestId('usernameField')
  const passField = screen.getByTestId('passwordField')
  fireEvent.change(userField, {target: {value: "Admin"}})
  fireEvent.change(passField, {target: {valie: "12345"}})
  const loginButton = screen.getByTestId('loginButton')
  fireEvent.click(loginButton)
  waitFor(() => {
    const logoutButton = screen.getByTestId('logoutButton')
    expect(logoutButton).toBeInTheDocument()
  })
})

test('login with incorrect credentials', () => {
  render(<App/>)
  const userField = screen.getByTestId('usernameField')
  const passField = screen.getByTestId('passwordField')
  fireEvent.change(userField, {target: {value: "admin"}})
  fireEvent.change(passField, {target: {valie: "12"}})
  const loginButton = screen.getByTestId('loginButton')
  fireEvent.click(loginButton)
  waitFor(() => {
    expect(loginButton).toBeInTheDocument()
  })
})