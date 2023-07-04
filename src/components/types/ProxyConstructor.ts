interface ProxyConstructor {
   new <T extends object, H>(target: T, handler: ProxyHandler<T>): H
}

export const ProxyConstructor = Proxy as ProxyConstructor
