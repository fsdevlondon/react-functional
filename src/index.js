import React from 'react'

export default function (component) {
  if (!component) {
     throw new Error(`
      [ReactStateless.createClass(component)] stateless needs a component
    `)   
  }

  component = (component instanceof Function) ?
    {render: component, ...component} :
    component

  if (!('render' in component)) {
    throw new Error(`
      [ReactStateless.createClass(component)] No render function found. 
      "component" should be a render function or contain a render function.
    `)
  }

  const {render} = component

  const displayName = render.name

  const methods = [
    'componentWillMount',
    'componentDidMount',
    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate',
    'componentWillUnmount'
  ]

  const properties = [
    'propTypes',
    'defaultProps',
    'getDefaultProps',
    'displayName'
  ]

  const options = { 
    displayName,
    render: function () { return render(this.props) },
    ...properties.reduce((o, p) => {
      if (!(p in component)) return o
      o[p] = component[p]
      return o
    }, {}),
    ...methods.reduce((o, m) => {
      if (!(m in component)) return o
      o[m] = function(input) {
        const {props, refs} = this
        return component[m](...props, input, ...refs)
      }
      return o
    }, {})
  }

  return React.createClass(options)
}