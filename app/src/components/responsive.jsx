import React, { Component } from 'react'
import includes from 'lodash/includes'

import withWidth from '@material-ui/core/withWidth'

export default (Renderable) => {

  @withWidth()
  class Responsive extends Component {
    render() {
      const { width } = this.props
      const onMobile = includes(['xs', 'sm'], width)

      const props = {
        ...this.props,
        onMobile
      }

      return <Renderable { ...props } />
    }
  }

  return Responsive
}
