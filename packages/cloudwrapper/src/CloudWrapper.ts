import { Core } from '@quatrain/core'

/**
 * Singleton registry for managing cloud wrapper contexts.
 */
export class CloudWrapper extends Core {
    /** Internal domain logger instance. */
    static logger = this.addLogger('Cloud')
}
