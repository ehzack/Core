import { BaseObjectClass } from './BaseObjectClass'

interface ProxyConstructor {
   new <T extends object, H>(target: T, handler: ProxyHandler<T>): Proxy<H>
}

export const ProxyConstructor = Proxy as ProxyConstructor

export type Proxy<T> = T & {
   readonly toJSON: () => object
   readonly core: BaseObjectClass
   //save: () => Promise<void>
}
