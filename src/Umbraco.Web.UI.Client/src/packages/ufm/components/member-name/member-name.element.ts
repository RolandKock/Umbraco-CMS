import { UmbUfmElementBase } from '../ufm-element-base.js';
import { UMB_UFM_RENDER_CONTEXT } from '../ufm-render/ufm-render.context.js';
import { customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbId } from '@umbraco-cms/backoffice/id';
import { UmbMemberItemRepository } from '@umbraco-cms/backoffice/member';

// eslint-disable-next-line local-rules/enforce-umb-prefix-on-element-name
@customElement('ufm-member-name')
export class UmbUfmMemberNameElement extends UmbUfmElementBase {
	@property()
	alias?: string;

	#memberRepository?: UmbMemberItemRepository;

	constructor() {
		super();

		this.consumeContext(UMB_UFM_RENDER_CONTEXT, (context) => {
			this.observe(
				context.value,
				async (value) => {
					const temp =
						this.alias && typeof value === 'object'
							? (value as Record<string, unknown>)[this.alias]
							: (value as unknown);

					if (!temp) return;

					const uniques = this.#getUniques(temp);

					this.value = await this.#getNames(uniques);
				},
				'observeValue',
			);
		});
	}

	#getUniques(value: unknown) {
		if (Array.isArray(value)) {
			return value.map((x) => x.unique ?? x).filter((x) => UmbId.validate(x));
		}

		return typeof value === 'string' && UmbId.validate(value) ? [value] : [];
	}

	async #getNames(uniques?: Array<string>) {
		if (uniques?.length) {
			if (!this.#memberRepository) {
				this.#memberRepository = new UmbMemberItemRepository(this);
			}

			const { data } = await this.#memberRepository.requestItems(uniques);
			if (Array.isArray(data) && data.length > 0) {
				return data.map((item) => item.name).join(', ');
			}
		}

		return '';
	}
}

export { UmbUfmMemberNameElement as element };

declare global {
	interface HTMLElementTagNameMap {
		'ufm-member-name': UmbUfmMemberNameElement;
	}
}
