import Engine from '@aomao/engine'
import Mention, { MentionComponent } from '@aomao/plugin-mention'

export default class Editor extends Engine {
	el = null
	options = {}
	engine = null

	constructor(el, options) {
		super(el, {
			placeholder: '请输入内容',
			autoAppend: true,
			cards: [MentionComponent],
			plugins: [Mention],
			toolbar: false,
			config: {
				[Mention.name]: {}
			},
			...options
		})

	}
}
