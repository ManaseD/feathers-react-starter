import React, { Component } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import responsive from 'FRS/components/responsive.jsx'

@responsive
export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange = (field, value) => this.setState({ [field]: value })

  render() {
    const { authenticate } = this.props
    const { email, password } = this.state

    return (
      <div style={{ padding: '0 20px' }}>
        <TextField
          fullWidth
          required
          id="email-local"
          label="Email"
          margin="normal"
          onChange={(event) => this.handleChange('email', event.target.value)}
          type="email"
          variant="outlined"
          value={email}
        />
        <TextField
          fullWidth
          required
          id="password-local"
          label="Password"
          margin="normal"
          onChange={(event) => this.handleChange('password', event.target.value)}
          type="password"
          variant="outlined"
          value={password}
        />
        <div style={{ textAlign: 'center', marginBottom: 20, marginTop: 16 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => authenticate({ email, password })}
            style={{ width: '100%' }}
          >
            Login
          </Button>
        </div>
      </div>
    )
  }
}
