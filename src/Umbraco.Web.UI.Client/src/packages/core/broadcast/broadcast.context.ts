import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

export class UmbBroadcastContext extends UmbContextBase<UmbBroadcastContext> {
	#broadcaster = new BroadcastChannel('umb-app');

	constructor(host: UmbControllerHost) {
		super(host, UMB_BROADCAST_CONTEXT);
	}

	public post(type: string, data: unknown): void {
		this.#broadcaster.postMessage({ type, data });
	}

	public receive(listener: (this: BroadcastChannel, event: BroadcastChannelEventMap['message']) => void): void {
		this.#broadcaster.addEventListener('message', listener);
	}

	override destroy(): void {
		this.#broadcaster.close();
		super.destroy();
	}
}

export const UMB_BROADCAST_CONTEXT = new UmbContextToken<UmbBroadcastContext>('UmbBroadcastContext');

export { UmbBroadcastContext as api };

export default UmbBroadcastContext;
