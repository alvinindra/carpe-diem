'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, BaseEditor } from 'slate'
import { Slate, Editable, withReact, ReactEditor, RenderLeafProps, RenderElementProps } from 'slate-react'
import { Bold, Italic, Underline, Code, Quote, List, ListOrdered, Heading1, Heading2 } from 'lucide-react'
import { Button } from './ui/button'

// Define custom types for TypeScript
type CustomElement = { type: string; children: CustomText[] }
type CustomText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean; code?: boolean }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

interface PlateEditorProps {
  initialValue?: any
  onChange?: (value: any) => void
}

// Helper functions for formatting
const isMarkActive = (editor: BaseEditor & ReactEditor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format as keyof typeof marks] === true : false
}

const toggleMark = (editor: BaseEditor & ReactEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: BaseEditor & ReactEditor, format: string) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === format,
    })
  )

  return !!match
}

const toggleBlock = (editor: BaseEditor & ReactEditor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = format === 'ul' || format === 'ol'

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n.type === 'ul' || n.type === 'ol'),
    split: true,
  })

  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'p' : isList ? 'li' : format,
  }

  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

// Render functions for custom elements
const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: (element as any).align }

  switch (element.type) {
    case 'h1':
      return <h1 style={style} {...attributes} className="slate-h1">{children}</h1>
    case 'h2':
      return <h2 style={style} {...attributes} className="slate-h2">{children}</h2>
    case 'h3':
      return <h3 style={style} {...attributes} className="slate-h3">{children}</h3>
    case 'blockquote':
      return <blockquote style={style} {...attributes} className="slate-blockquote">{children}</blockquote>
    case 'ul':
      return <ul style={style} {...attributes} className="slate-ul">{children}</ul>
    case 'ol':
      return <ol style={style} {...attributes} className="slate-ol">{children}</ol>
    case 'li':
      return <li style={style} {...attributes} className="slate-li">{children}</li>
    case 'code_block':
      return <pre style={style} {...attributes} className="slate-code_block"><code>{children}</code></pre>
    default:
      return <p style={style} {...attributes} className="slate-p">{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong className="slate-bold">{children}</strong>
  }

  if (leaf.italic) {
    children = <em className="slate-italic">{children}</em>
  }

  if (leaf.underline) {
    children = <u className="slate-underline">{children}</u>
  }

  if (leaf.code) {
    children = <code className="slate-code">{children}</code>
  }

  return <span {...attributes}>{children}</span>
}

export function PlateEditor({ initialValue, onChange }: PlateEditorProps) {
  const [isClient, setIsClient] = useState(false)

  const editor = useMemo(() => withReact(createEditor()), [])

  const parsedInitialValue = useMemo((): Descendant[] => {
    if (!initialValue) {
      return [{ type: 'p', children: [{ text: '' }] }] as Descendant[]
    }

    if (typeof initialValue === 'string') {
      try {
        return JSON.parse(initialValue) as Descendant[]
      } catch {
        return [{ type: 'p', children: [{ text: initialValue }] }] as Descendant[]
      }
    }

    return initialValue as Descendant[]
  }, [initialValue])

  const [value, setValue] = useState<Descendant[]>(parsedInitialValue)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  // Show loading state on server
  if (!isClient) {
    return (
      <div className="w-full">
        <div className="border border-slate-700 rounded-t-lg bg-slate-800/50 p-2 flex flex-wrap gap-1">
          <Button type="button" variant="outline" size="sm" disabled className="h-8 w-8 p-0">
            <Heading1 className="w-4 h-4" />
          </Button>
        </div>
        <div className="border border-t-0 border-slate-700 rounded-b-lg bg-slate-900/50 p-4 min-h-[400px] text-white w-full flex items-center justify-center">
          <p className="text-slate-400">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        {/* Toolbar */}
        <div className="border border-slate-700 rounded-t-lg bg-slate-800/50 p-2 flex flex-wrap gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleBlock(editor, 'h1')
            }}
            className="h-8 w-8 p-0"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleBlock(editor, 'h2')
            }}
            className="h-8 w-8 p-0"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <div className="w-px h-8 bg-slate-700 mx-1" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleMark(editor, 'bold')
            }}
            className="h-8 w-8 p-0"
            title="Bold (Cmd+B)"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleMark(editor, 'italic')
            }}
            className="h-8 w-8 p-0"
            title="Italic (Cmd+I)"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleMark(editor, 'underline')
            }}
            className="h-8 w-8 p-0"
            title="Underline (Cmd+U)"
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleMark(editor, 'code')
            }}
            className="h-8 w-8 p-0"
            title="Code"
          >
            <Code className="w-4 h-4" />
          </Button>
          <div className="w-px h-8 bg-slate-700 mx-1" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleBlock(editor, 'blockquote')
            }}
            className="h-8 w-8 p-0"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleBlock(editor, 'ul')
            }}
            className="h-8 w-8 p-0"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleBlock(editor, 'ol')
            }}
            className="h-8 w-8 p-0"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
        </div>

        {/* Editor */}
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Start writing your poem..."
          spellCheck
          className="border border-t-0 border-slate-700 rounded-b-lg bg-slate-900/50 p-4 min-h-[400px] text-white w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
          onKeyDown={(event) => {
            // Keyboard shortcuts
            if (!event.ctrlKey && !event.metaKey) return

            switch (event.key) {
              case 'b': {
                event.preventDefault()
                toggleMark(editor, 'bold')
                break
              }
              case 'i': {
                event.preventDefault()
                toggleMark(editor, 'italic')
                break
              }
              case 'u': {
                event.preventDefault()
                toggleMark(editor, 'underline')
                break
              }
              case '`': {
                event.preventDefault()
                toggleMark(editor, 'code')
                break
              }
            }
          }}
        />
      </Slate>

      <style>{`
        /* Slate Editor Styles */
        .slate-p {
          margin-bottom: 1em;
        }

        .slate-h1 {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 0.5em;
          line-height: 1.2;
        }

        .slate-h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 0.5em;
          line-height: 1.3;
        }

        .slate-h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-bottom: 0.5em;
          line-height: 1.4;
        }

        .slate-blockquote {
          border-left: 3px solid #06b6d4;
          padding-left: 1em;
          margin-left: 0;
          margin-bottom: 1em;
          font-style: italic;
          color: #cbd5e1;
        }

        .slate-ul {
          list-style-type: disc;
          padding-left: 2em;
          margin-bottom: 1em;
        }

        .slate-ol {
          list-style-type: decimal;
          padding-left: 2em;
          margin-bottom: 1em;
        }

        .slate-li {
          margin-bottom: 0.25em;
        }

        .slate-code {
          background-color: rgba(100, 116, 139, 0.3);
          padding: 0.125em 0.375em;
          border-radius: 0.25em;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.875em;
        }

        .slate-code_block {
          background-color: rgba(15, 23, 42, 0.8);
          padding: 1em;
          border-radius: 0.5em;
          font-family: 'Courier New', Courier, monospace;
          overflow-x: auto;
          margin-bottom: 1em;
        }

        .slate-code_block code {
          background: none;
          padding: 0;
        }

        .slate-bold {
          font-weight: 600;
        }

        .slate-italic {
          font-style: italic;
        }

        .slate-underline {
          text-decoration: underline;
        }

        /* Ensure cursor is visible */
        [data-slate-editor] {
          caret-color: white;
          outline: none;
        }

        /* Placeholder styles */
        [data-slate-placeholder] {
          color: rgba(203, 213, 225, 0.4);
          pointer-events: none;
          user-select: none;
          display: inline-block;
          width: 0;
          max-width: 100%;
          white-space: nowrap;
          opacity: 0.4;
        }
      `}</style>
    </div>
  )
}
