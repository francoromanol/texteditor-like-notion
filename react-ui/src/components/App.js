import React, { useState, useEffect } from 'react'
import { Switch, Route, useRouteMatch, Redirect, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { initialPages } from '../services/pages'

import Sidebar from './Sidebar'
import EditablePage from './EditablePage'
import NotFound from './NotFound'
import { uid } from '../utilities'

const App = () => {
  const [pages, setPages] = useState(initialPages)
  const history = useHistory()

  useEffect(() => {
    setPages(initialPages)
  }, [])

  const addPage = currentPageId => {
    const newPage = {
      information: {
        id: uid(),
        title: 'Untitled',
        cover: null,
      },
      blocks: [
        {
          id: uid(),
          html: 'First block!',
          tag: 'p',
          placeholder: 'Type \'/\' for commands',
        }
      ]
    }

    const updatedPages = [...pages]

    if (currentPageId) {
      const currentPageIndex = pages.map(page => page.information.id).indexOf(currentPageId)
      updatedPages.splice(currentPageIndex + 1, 0, newPage)
    } else {
      const lastPageIndex = pages.length - 1
      updatedPages.splice(lastPageIndex + 1, 0, newPage)
    }

    setPages([...updatedPages])
    history.push(`/${newPage.information.id}`)
  }

  // home redirect to last visited (now first page)
  const linkToRedirect = `/${pages[0].information.id}`

  // pass only the required page to the component
  const match = useRouteMatch('/:id')
  const page = match
    ? pages.find(page => page.information.id === match.params.id)
    : null

  // pass only the information of the pages
  const sideBarLinks = pages.map(p => p.information)

  return (
    <AppContainer>
      <Sidebar links={sideBarLinks} addPage={addPage} />
      <Switch>
        <Route path="/:id">
          <EditablePage page={page} />
        </Route>

        <Route path="/" exact>
          <Redirect to={linkToRedirect} />
        </Route>
        <Route path="*" component={NotFound} />
        <Route path="/404" component={NotFound} />
      </Switch>
    </AppContainer>
  )
}

export default App

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`
