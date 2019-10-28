import React, { Component } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Snackbar from '@material-ui/core/Snackbar'

import app from 'FRS/feathers-client.js'
import responsive from 'FRS/components/responsive.jsx'


@responsive
export default class Registration extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      passwordConfirmation: '',
      error: null,
      snackBarOpen: false,
      snackBarMessage: null
    }
  }

  handleCloseSnackBar = () => this.setState({ snackBarOpen: false })

  handleRegistrationChange = (field, value) => this.setState({ [field]: value, error: null })

  handleRegisterUser = event => {
    event.preventDefault()
    const { authenticate } = this.props
    const { email, password, passwordConfirmation } = this.state

    if (password !== passwordConfirmation) {
      return this.setState({ error: 'Please make sure your passwords match' })
    }

    app.service('users').create({ email, password })
      .then(() => authenticate({ strategy: 'local', email, password }))
      .catch(() => this.setState({ snackBarOpen: true, snackBarMessage: 'Sorry, this email has already been used' }))

  }

  render() {
    const { email, password, passwordConfirmation, error, snackBarOpen, snackBarMessage } = this.state

    return (
      <div style={{ padding: '0 20px' }}>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackBar}
          message={snackBarMessage}
        />
        <TextField
          error={error === "email"}
          fullWidth
          required
          id="email"
          label="Email"
          margin="normal"
          onChange={(event) => this.handleRegistrationChange('email', event.target.value)}
          type="email"
          variant="outlined"
          value={email}
        />
        <TextField
          fullWidth
          required
          id="password"
          label="Password"
          margin="normal"
          onChange={(event) => this.handleRegistrationChange('password', event.target.value)}
          type="password"
          variant="outlined"
          value={password}
        />
        <TextField
          error={!!error}
          fullWidth
          helperText={error}
          required
          id="password-confirmation"
          label="Confirm Password"
          margin="normal"
          onChange={(event) => this.handleRegistrationChange('passwordConfirmation', event.target.value)}
          type="password"
          variant="outlined"
          value={passwordConfirmation}
        />
        <div style={{ textAlign: 'center', marginBottom: 20, marginTop: 16 }}>
          <Button variant="contained" color="secondary" onClick={this.handleRegisterUser} style={{ width: '100%' }}>
            Sign Up
          </Button>
        </div>
      </div>
    )
  }
}
