declare module 'react-intersection-observer' {
  export function useInView(options?: any): {
    ref: (node: any) => void;
    inView: boolean;
  };
}

declare module 'react-router-dom' {
  export const Link: any;
  export function useLocation(): any;
  export function useParams<T = any>(): T;
}
