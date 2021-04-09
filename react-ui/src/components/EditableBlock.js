import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useEditable } from 'use-editable'

import { useMousePosition } from '../hooks/useMousePosition'
import useOutsideClick from '../hooks/useOutsideClick'

import BlockAction from './blockAction'
import SelectTagMenu from './SelectTagMenu'

const CMD_KEY = '/'

const EditableBlock = ({ element, addBlock, deleteBlock, updatePage }) => {
  const { id, tag, html, placeholder } = element

  const [block, setBlock] = useState({ id, tag, html, placeholder })
  const [htmlBackup, setHtmlBackup] = useState(null)

  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false)
  const [tagMenuPosition, setTagMenuPosition] = useState({ x: null, y: null })

  const blockRef = useRef(null)
  const editorRef = useRef(null)
  const menuRef = useRef(null)

  // hooks for managing content editable
  const handleUseEditable = html => {
    setBlock(block => ({ ...block, html }))
  }

  useEditable(editorRef, handleUseEditable, {
    indentation: 2,
  })

  // hooks for clicking outside of ref (menu)
  useOutsideClick(menuRef, () => {
    if (isTagMenuOpen) setIsTagMenuOpen(false)
  })

  const onKeyDownHandler = e => {
    if (e.key === CMD_KEY) {
      e.preventDefault()
      setHtmlBackup(html)
    }
    if (!e.shiftKey && e.key === 'Enter') {
      e.preventDefault()
      addBlock({
        id,
        ref: blockRef.current,
      })
    }
    if (e.key === 'Backspace' && !block.html.trim()) {
      e.preventDefault()
      deleteBlock({
        id: id,
        ref: blockRef.current,
      })
    }
  }

  const handleSelection = tag => {}

  return (
    <DataBlock ref={blockRef}>
      <BlockAction
        type={'plus'}
        onClick={() => addBlock({ id, ref: blockRef.current })}
      />
      <BlockAction
        type={'dots'}
        onClick={() => setIsTagMenuOpen(!isTagMenuOpen)}
      />

      {isTagMenuOpen && (
        <div ref={menuRef}>
          <SelectTagMenu handleSelection={handleSelection} />
        </div>
      )}

      <ContentEditable
        id="content-editable"
        as={block.tag}
        tag={block.tag}
        ref={editorRef}
        onKeyDown={onKeyDownHandler}
        placeholder={block.placeholder}
      >
        {block.html.trim()}
      </ContentEditable>
    </DataBlock>
  )
}

export default EditableBlock

const DataBlock = styled.article`
  position: relative;
  display: flex;
  align-items: center;

  width: 100%;

  :hover {
    #block-action {
      visibility: visible;
    }
  }
`

const ContentEditable = styled.pre`
  margin: var(--spacing-xxs);
  padding: var(--spacing-xxs);
  outline-style: none;

  width: 100%;

  :empty:before {
    content: attr(placeholder);
    color: var(--color-gray)
  }

  ${props => {
    if (props.tag === 'h1') {
      return `
        font-size: var(--text-3xl);
        font-weight: 600;
        margin-top: var(--spacing-l);
      `
    } else if (props.tag === 'h2') {
      return `
        font-size: var(--text-2xl);
        font-weight: 600;
        margin-top: var(--spacing-m);
      `
    } else if (props.tag === 'h3') {
      return `
        font-size: var(--text-xl);
        font-weight: 600;
        margin-top: var(--spacing-s);
      `
    } else {
      return `
        font-size: var(--text-base);
      `
    }
  }}

  :hover {
    background-color: var(--color-hover);
  }

  :focus {
    background-color: var(--color-background);
  }
`
