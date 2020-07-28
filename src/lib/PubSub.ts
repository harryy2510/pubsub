import { forEach, omit, pickBy } from 'lodash-es'
import multimatch from 'multimatch'
import { nanoid } from 'nanoid'

export type PubSubData = {
    type: string
    data?: any
}

export interface PubSubSubscription {
    namespaces: string[]
    callback: PubSubCallback
}

export type PubSubCallback = (data: PubSubData | null, namespaces: string[], key: string) => void

let subscriptions: Record<string, PubSubSubscription> = {}

const coerceArray = <T>(value: T | T[]): T[] => {
    return Array.isArray(value) ? value : [value]
}

const publish = (namespace: string | string[], data: PubSubData | null = null): void => {
    const namespaces = coerceArray(namespace)
    const subscribers = pickBy(subscriptions, (subscription) =>
        Boolean(multimatch(namespaces, subscription.namespaces).length)
    )
    forEach(subscribers, (s, k) => s.callback?.(data, namespaces, k))
}

const subscribe = (
    namespace: string | string[],
    callback: PubSubCallback | PubSubCallback[]
): string => {
    const key = nanoid()
    const subscriptionCallback: PubSubCallback = (...args) =>
        coerceArray(callback).forEach((c) => c?.(...args))
    subscriptions[key] = {
        namespaces: coerceArray(namespace),
        callback: subscriptionCallback
    }
    return key
}

const subscribeOnce = (
    namespace: string | string[],
    callback: PubSubCallback | PubSubCallback[]
): string => {
    const subscriptionCallback: PubSubCallback = (d, n, k) => unsubscribe(k)
    return subscribe(namespace, [subscriptionCallback, ...coerceArray(callback)])
}

const unsubscribe = (key: string): void => {
    subscriptions = omit(subscriptions, key)
}

const clearSubscriptions = (): void => {
    subscriptions = {}
}

const PubSub = {
    subscribeOnce,
    clearSubscriptions,
    publish,
    subscribe,
    unsubscribe
}

export default PubSub
