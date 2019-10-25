import React, { Component } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import responsive from 'FRS/components/responsive.jsx'


@responsive
export default class Registration extends Component {
  render() {
    const { email, password, error, onChange, onMobile, onStart } = this.props

    return (
      <div>
        <div
          style={{
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            fontSize: 28,
            fontWeight: 100,
            textAlign: 'center',
            marginTop: onMobile ? 10 : 20,
            marginBottom: onMobile ? 10 : 40,
          }}
        >
          Project Name
        </div>
        <TextField
          error={error === "email"}
          fullWidth
          required
          id="email"
          label="Email"
          margin="normal"
          onChange={(event) => onChange('email', event.target.value)}
          type="email"
          variant="outlined"
          value={email}
        />
        <TextField
          error={error === "password"}
          fullWidth
          required
          id="password"
          label="Password"
          margin="normal"
          onChange={(event) => onChange('password', event.target.value)}
          type="password"
          variant="outlined"
          value={password}
        />
        <div style={{ textAlign: 'center', marginBottom: 20, marginTop: 40 }}>
          <Button variant="contained" color="secondary" onClick={onStart}>
            Register
          </Button>
        </div>
      </div>
    )
  }
}
