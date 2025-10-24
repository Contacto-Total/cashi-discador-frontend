/***************************************************************************************************
 * Zone JS is required by Angular for async operations.
 */
import 'zone.js';  // Already included with Angular CLI.
import { Buffer } from 'buffer';

/***************************************************************************************************
 * Browser polyfills for Node.js globals used by crypto libraries
 */
(window as any).global = window;
(window as any).process = {
    env: { DEBUG: undefined },
    version: ''
};
(window as any).Buffer = (window as any).Buffer || Buffer;
