import { Node, Path, Transforms } from 'slate'

const withDivider = editor => {
  const { isVoid, deleteBackward } = editor

  editor.isVoid = element => {
    return element.type === 'divider' ? true : isVoid(element)
  }

  editor.deleteBackward = (...args) => {
    const parentPath = Path.parent(editor.selection.focus.path)
    const parentNode = Node.get(editor, parentPath)

    if (isVoid(parentNode) || !Node.string(parentNode).length) {
      Transforms.removeNodes(editor, { at: parentPath })
    } else {
      deleteBackward(...args)
    }
  }

  return editor
}

const withLink = editor => {
  const { isInline } = editor

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element)
  }

  return editor
}

export { withDivider, withLink }
