import { UmbUfmElementBase } from '../ufm-element-base.js';
import { UMB_UFM_RENDER_CONTEXT } from '../ufm-render/ufm-render.context.js';
import { customElement, property } from '@umbraco-cms/backoffice/external/lit';

// eslint-disable-next-line local-rules/enforce-umbraco-external-imports
import { EvalAstFactory, Parser } from '@heximal/expressions';
// eslint-disable-next-line local-rules/enforce-umbraco-external-imports
import type { Expression, Scope } from '@heximal/expressions';

const astFactory = new EvalAstFactory();
const expressionCache = new Map<string, Expression | undefined>();

// eslint-disable-next-line local-rules/enforce-umb-prefix-on-element-name
@customElement('ufm-js-eval')
export class UmbUfmJsEvalElement extends UmbUfmElementBase {
	@property()
	alias?: string;

	constructor() {
		super();

		this.consumeContext(UMB_UFM_RENDER_CONTEXT, (context) => {
			this.observe(
				context.value,
				(value) => {
					this.value = this.#labelTemplate(this.alias ?? '', value);
				},
				'observeValue',
			);
		});
	}

	#labelTemplate(expression: string, value?: any): string {
		const scope: Scope = { ...value };

		let ast = expressionCache.get(expression);

		if (ast === undefined) {
			ast = new Parser(expression, astFactory).parse();
			expressionCache.set(expression, ast);
		}

		return ast?.evaluate(scope) ?? '';
	}
}

export { UmbUfmJsEvalElement as element };

declare global {
	interface HTMLElementTagNameMap {
		'ufm-js-eval': UmbUfmJsEvalElement;
	}
}
