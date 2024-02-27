import Quill from 'quill'
import Mention from './mention/quill.mention'

Quill.register({ 'modules/mention': Mention })

export { Mention }

export default Quill
