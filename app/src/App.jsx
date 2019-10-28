import React, { Component } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'

import app from 'FRS/feathers-client.js'
import responsive from 'FRS/components/responsive.jsx'
import Login from 'FRS/components/login.jsx'
import Registration from 'FRS/components/registration.jsx'


@responsive
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      isLoading: true,
      snackBarOpen: false,
      snackBarMessage: null
    }
  }

  authenticate = (options) => {
    return app.authenticate({ strategy: 'local', ...options })
      .then(() => this.setState({ isAuthenticated: true }))
      .catch((err) => this.setState({
          isAuthenticated: false,
          snackBarOpen: true,
          snackBarMessage: 'Login failed, please check your email and/or password'
        })
      )
  }

  handleCloseSnackBar = () => this.setState({ snackBarOpen: false })

  componentDidMount() {
    return app.authentication.getAccessToken()
      .then(accessToken => {
        if (accessToken) {
          return app.reAuthenticate()
            .then(() => this.setState({ isAuthenticated: true }))
        }
      })
      .then(() => this.setState({ isLoading: false }))
  }

  render() {
    const { onMobile } = this.props
    const { isAuthenticated, isLoading, snackBarOpen, snackBarMessage } = this.state

    const textStyle = {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      fontSize: 22,
      fontWeight: 100,
    }

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
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackBar}
          message={snackBarMessage}
        />
        <Paper
          elevation={onMobile ? 0 : 3}
          style={{
            padding: onMobile ? 10 : 20,
            position: 'relative',
            minHeight: 500,
            ...onMobile ? { height: '100%', width: '100%', overflow: 'scroll' } : { width: 500 }
          }}
        >
          <div
            style={{
              fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
              fontSize: 28,
              fontWeight: 700,
              textAlign: 'center',
              marginTop: onMobile ? 10 : 20,
              marginBottom: onMobile ? 10 : 40,
            }}
          >
            Project Name
          </div>
          {isLoading
            ? <div style={{ position: 'fixed', right: 'calc(50vw - 22px)', top: 'calc(50vh - 22px)' }}>
                <CircularProgress />
              </div>
            : isAuthenticated
              ? <div style={{ ...textStyle, margin: '60px auto', textAlign: 'center' }}>
                  Congrats, you're now logged in!
                </div>
              : <div>
                  <div style={{ ...textStyle, fontSize: 16, padding: '0 20px' }}>
                    Already have an account?
                  </div>
                  <Login authenticate={this.authenticate} />
                  <div  style={{ ...textStyle, margin: '30px auto', textAlign: 'center' }}>
                    OR
                  </div>
                  <div  style={{ ...textStyle, fontSize: 16, padding: '0 20px' }}>
                    Register as a new user
                  </div>
                  <Registration authenticate={this.authenticate} />
                </div>
          }
        </Paper>
      </div>
    )
  }
}
