import type { UfmToken } from '../../plugins/marked-ufm.plugin.js';
import { UmbUfmComponentBase } from '../ufm-component-base.js';

import './js-eval.element.js';

export class UmbUfmJsEvalComponent extends UmbUfmComponentBase {
	render(token: UfmToken) {
		if (!token.text) return;

		const attributes = super.getAttributes(token.text);
		return `<ufm-js-eval ${attributes}></ufm-js-eval>`;
	}
}

export { UmbUfmJsEvalComponent as api };
