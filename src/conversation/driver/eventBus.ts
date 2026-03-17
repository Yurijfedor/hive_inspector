export type EventWithType = {type: string};

type Listener<E> = (event: E) => void;

export class EventBus<E extends EventWithType> {
  private listeners: Partial<{
    [K in E['type']]: Listener<Extract<E, {type: K}>>[];
  }> = {};

  // --------------------------------------------------
  // SUBSCRIBE
  // --------------------------------------------------

  on<K extends E['type']>(
    type: K,
    handler: Listener<Extract<E, {type: K}>>,
  ): () => void {
    const list = (this.listeners[type] ??
      (this.listeners[type] = [])) as Listener<Extract<E, {type: K}>>[];

    list.push(handler);

    // unsubscribe
    return () => {
      this.listeners[type] = list.filter(h => h !== handler) as any;
    };
  }

  // --------------------------------------------------
  // EMIT
  // --------------------------------------------------

  emit(event: E): void {
    console.log('📡 EVENT:', event);

    const type = event.type as E['type'];

    const list = this.listeners[type] as Listener<typeof event>[] | undefined;

    if (!list) return;

    for (const handler of list) {
      handler(event);
    }
  }
}
