type Listener<T> = (event: T) => void;

export class EventBus<T> {
  private listeners: Listener<T>[] = [];

  subscribe(listener: Listener<T>) {
    this.listeners.push(listener);
  }

  emit(event: T) {
    console.log('📡 EVENT:', event);
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
