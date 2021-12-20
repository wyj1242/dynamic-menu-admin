import React, { Component, ReactNode, ComponentType } from 'react';
import * as uuid from 'uuid';

type ModuleNamespace<T> = { default: ComponentType<T> };
type PromiseFun<T> = () => Promise<ModuleNamespace<T>>;

interface Options<T> {
  resolve: PromiseFun<T>;
  loading?: ReactNode;
  error?: ReactNode;
  delay?: number;
}

interface State<T> {
  readonly ResultComponent: ComponentType<T> | null;
  readonly status: 'loading' | 'error' | 'normal';
}

function getAsyncComponent<T>(options: Options<T> | PromiseFun<T>) {
  let resolve: PromiseFun<T>;
  let LoadingComponent: ReactNode = null;
  let ErrorComponent: ReactNode = null;
  let delay = 0;
  let timer: NodeJS.Timeout;

  const cacheComponentMap = new Map<string, State<T>['ResultComponent']>();
  const uid = uuid.v1();
  cacheComponentMap.set(uid, null);

  if (typeof options === 'function') {
    resolve = options;
  } else if (Object.prototype.toString.call(options) === '[object Object]') {
    if (typeof options.resolve === 'function') {
      resolve = options.resolve;
    } else {
      throw new TypeError('`resolve` must be a function like: () => import("./xxx").');
    }
    LoadingComponent = options.loading === undefined ? null : options.loading;
    ErrorComponent = options.error === undefined ? null : options.error;
    delay = options.delay === undefined ? 0 : options.delay;
  } else {
    throw new Error('Please make sure the input `option` meets the specification.');
  }

  return class asyncComponent extends Component<T, State<T>> {
    constructor(props: T) {
      super(props);
      this.state = {
        ResultComponent: null,
        status: 'loading'
      }
    }

    async componentDidMount() {
      if (cacheComponentMap.get(uid)) {
        this.setState({
          ResultComponent: cacheComponentMap.get(uid) as State<T>['ResultComponent'],
          status: 'normal'
        });
        return;
      }
      const { default: ResultComponent } = await resolve();
      if (ResultComponent) {
        timer = setTimeout(() => {
          this.setState({
            ResultComponent,
            status: 'normal'
          });
          cacheComponentMap.set(uid, ResultComponent);
        }, delay);
      } else {
        this.setState({
          status: 'error'
        });
      }
    }

    componentWillUnmount() {
      if (timer) {
        clearTimeout(timer);
      }
    }

    render() {
      const { status, ResultComponent } = this.state;
      if (status === 'loading') {
        return LoadingComponent;
      }
      if (status === 'error') {
        return ErrorComponent;
      }
      return ResultComponent ? <ResultComponent {...this.props} /> : null;
    }
  }
}

export default getAsyncComponent;