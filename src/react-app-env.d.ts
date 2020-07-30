/// <reference types="react-scripts" />
import { PubSubSubscription } from './lib'

declare let namespaces: string[]
declare let subscriptions: Record<string, PubSubSubscription>
