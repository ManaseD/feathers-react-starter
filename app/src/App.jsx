import React, { Component } from 'react'

import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'

import app from 'FRS/feathers-client.js'
import responsive from 'FRS/components/responsive.jsx'
import Registration from 'FRS/components/registration.jsx'


@responsive
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: null,
      snackBarOpen: false,
      snackBarMessage: null
    }
  }

  handleCloseSnackBar = () => this.setState({ snackBarOpen: false })

  handleRegistrationChange = (field, value) => this.setState({ [field]: value, error: null })

  handleRegisterUser = event => {
    event.preventDefault()
    const { email, password } = this.state

    app.service('users').create({ email, password })
      .then(result => this.setState({ snackBarOpen: true, snackBarMessage: 'Successfully registered!' }))
      .catch(error => this.setState({ snackBarOpen: true, snackBarMessage: 'Sorry, this email has already been used' }))

  }

  render() {
    const { onMobile } = this.props
    const { email, password, error, snackBarOpen, snackBarMessage } = this.state

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          position: 'absolute'
        }}
      >
        <Paper
          elevation={onMobile ? 0 : 3}
          style={{
            padding: onMobile ? 10 : 20,
            position: 'relative',
            minHeight: 500,
            ...onMobile ? { height: '100%', width: '100%', overflow: 'scroll' } : { width: 500 }
          }}
        >
          <Registration
            email={email}
            password={password}
            error={error}
            onChange={this.handleRegistrationChange}
            onStart={this.handleRegisterUser}
            snackBarOpen={snackBarOpen}
            onClose={this.handleCloseSnackBar}
          />
        </Paper>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackBar}
          message={snackBarMessage}
        />
      </div>
    )
  }
}
