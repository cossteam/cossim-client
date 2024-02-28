import Quill from 'quill'
import Mention from './mention/quill.mention'
import type { Data } from './mention/type'

Quill.register({ 'modules/mention': Mention })

export { Mention }

export type { Data }

export default Quill
