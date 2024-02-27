// @ts-nocheck
import Quill from 'quill'

const MentionBlot = Quill.import('quill-mention')

class StyledMentionBlot extends MentionBlot {
	static render(data) {
		const element = document.createElement('span')
		element.innerText = data.value
		element.style.color = data.color
		return element
	}
}
StyledMentionBlot.blotName = 'styled-mention'

Quill.register(StyledMentionBlot)

export default Quill
