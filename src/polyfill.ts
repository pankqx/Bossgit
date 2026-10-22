// isomorphic-git expects Node's Buffer; give the browser one before it loads.
import { Buffer } from 'buffer'
;(globalThis as any).Buffer = (globalThis as any).Buffer ?? Buffer
