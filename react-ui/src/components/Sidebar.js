import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Resizable } from 're-resizable'

const Sidebar = ({ children }) => {
  const [width, setWidth] = React.useState(192)

  return (
    <Nav>
      <Container
        size={{ width }}
        onResizeStop={(e, direction, ref, d) => {
          setWidth(width + d.width)
        }}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        {children}
      </Container>
    </Nav>
  )
}

export default Sidebar

const Nav = styled.nav`
  position: sticky;
  top: 0;
  left: 0;

  height: 100vh;
  background-color: var(--color-gray-25);
`

const Container = styled(Resizable)`
  display: flex !important;
  flex-direction: column !important;

  min-width: 12rem !important;
  max-width: 25rem !important;
  height: 100% !important;

  padding: var(--spacing-s);
  font-size: var(--text-2xl);

  :first-child:hover {
    border-right: 2px solid var(--color-gray);
  }

  & a {
    text-decoration: none;
    color: var(--color-text);
  }
`
