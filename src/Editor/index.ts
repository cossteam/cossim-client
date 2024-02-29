import Editor, { EditorOptions } from './core/core'
import ReadEditor from './components/ReadEditor/ReadEditor'
import ToolEditor, { ToolEditorMethods } from './components/ToolEditor/ToolEditor'

import { EventType } from './shared'

export { ToolEditor as default, Editor, EventType, ReadEditor }

export type { EditorOptions, ToolEditorMethods }
