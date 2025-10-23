import { useState } from 'react'
import { Bold, Italic, Underline, Code, Quote, List, ListOrdered, Heading1, Heading2 } from 'lucide-react'
import { Button } from './ui/button'

interface PlateEditorProps {
  initialValue?: any
  onChange?: (value: any) => void
}

export function PlateEditor({ initialValue, onChange }: PlateEditorProps) {
  const [content, setContent] = useState(
    initialValue
      ? typeof initialValue === 'string'
        ? initialValue
        : JSON.stringify(initialValue, null, 2)
      : ''
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)

    if (onChange) {
      // Try to parse as JSON, otherwise send as string
      try {
        const parsed = JSON.parse(newContent)
        onChange(parsed)
      } catch {
        onChange([{ type: 'p', children: [{ text: newContent }] }])
      }
    }
  }

  const insertMarkdown = (prefix: string, suffix = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end)
    setContent(newText)

    if (onChange) {
      onChange([{ type: 'p', children: [{ text: newText }] }])
    }

    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="border border-slate-700 rounded-t-lg bg-slate-800/50 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown('# ', '\n')}
          className="h-8 w-8 p-0"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown('## ', '\n')}
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
          onClick={() => insertMarkdown('**', '**')}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown('*', '*')}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown('__', '__')}
          className="h-8 w-8 p-0"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown('`', '`')}
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
          onClick={() => insertMarkdown('> ', '\n')}
          className="h-8 w-8 p-0"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown('- ', '\n')}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown('1. ', '\n')}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={handleChange}
        className="border border-t-0 border-slate-700 rounded-b-lg bg-slate-900/50 p-4 min-h-[400px] text-white w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono resize-y"
        placeholder="Start writing your poem... (supports Markdown formatting)"
        style={{
          caretColor: 'white',
        }}
      />
    </div>
  )
}
