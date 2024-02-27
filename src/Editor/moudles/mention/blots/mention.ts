import Quill from 'quill'
import Embed from 'quill/blots/embed'

// const QuillEmbed = Quill.import('blots/embed') as Embed

class Mention extends Embed {}

Mention.blotName = 'MentionBlot'
Mention.className = 'mntion-chat'
Mention.tagName = 'span'
Quill.register({ 'formats/mention': Mention })

export default Mention
