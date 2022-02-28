export interface IDisposable {
  dispose(): void;
}

interface IListener<T> {
  (arg1: T): void;
}

export interface IEvent<T> {
  (listener: (arg1: T) => any): IDisposable;
}

export interface IEventEmitter<T> {
  event: IEvent<T>;
  fire(arg1: T): void;
  dispose(): void;
}

export class EventEmitter<T> implements IEventEmitter<T> {
  private _event: IEvent<T>;
  private _listeners: IListener<T>[] = [];
  private _disposed: boolean = false;

  constructor() {
    this._event = (listener: (arg1: T) => any) => {
      this._listeners.push(listener);
      const disposeable = {
        dispose: () => {
          if (!this._disposed) {
            for (let i = 0; i < this._listeners.length; i++) {
              if (this._listeners[i] === listener) {
                this._listeners.splice(i, 1);
                return;
              }
            }
          }
        }
      };
      return disposeable;
    };
  }

  public get event(): IEvent<T> {
    return this._event;
  }
  public fire(arg1: T): void {
    const queue: IListener<T>[] = [];
    for (let i = 0; i < this._listeners.length; i++) {
      queue.push(this._listeners[i]!);
    }

    for (let i = 0; i < queue.length; i++) {
      queue[i]!.call(undefined, arg1);
    }
  }
  public dispose(): void {
    if (this._listeners) {
      this._listeners.length = 0;
    }
    this._disposed = true;
  }
}
