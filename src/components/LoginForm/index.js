import {useState} from 'react'
import Cookies from 'js-cookie'
import {useNavigate, Navigate} from 'react-router-dom'

import './index.css'

const LoginForm = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    navigate('/', {replace: true})
  }

  const onSubmitFailure = errorMsgValue => {
    setShowSubmitError(true)
    setErrorMsg(errorMsgValue)
  }

  const onChangeUsername = event => {
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const submitForm = async event => {
    event.preventDefault()

    const userDetails = {username, password}
    const loginApiUrl = 'https://apis.ccbp.in/login'

    const response = await fetch(loginApiUrl, {
      method: 'POST',
      body: JSON.stringify(userDetails),
    })

    const data = await response.json()

    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="login-form-container">
      <form className="form-container" onSubmit={submitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="website-logo"
          alt="website logo"
        />

        <div className="input-container">
          <label className="input-label" htmlFor="username">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            className="input-field"
            value={username}
            onChange={onChangeUsername}
            placeholder="username"
          />
        </div>

        <div className="input-container">
          <label className="input-label" htmlFor="password">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            className="input-field"
            value={password}
            onChange={onChangePassword}
            placeholder="password"
          />
        </div>

        <button className="login-button" type="submit">
          Login
        </button>

        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      </form>
    </div>
  )
}

export default LoginForm
