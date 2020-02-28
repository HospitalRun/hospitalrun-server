/**
 * Emits a key-value pair for further processing by CouchDB after the map function is done.
 * @param {string} key - The view key
 * @param {any} value - The key’s associated value
 * @returns {void}
 */
declare function emit(key: string, value: any): void
/**
 * @deprecated since version 2.0
 * Extracts the next row from a related view result.
 * @returns {Object} - View result row
 */
declare function getRow<T>(): T

/**
 * A helper function to check if the provided value is an Array.
 * @param {Object} obj - Any JavaScript value
 * @returns {boolean}
 */
declare function isArray<T>(obj: T): boolean

/**
 * Log a message to the CouchDB log (at the INFO level).
 * @param {string} message - Message to be logged
 * @returns {void}
 */
declare function log(message: string): void

/**
 * @deprecated since version 2.0
 * Registers callable handler for specified MIME key.
 * @param {string} key - MIME key previously defined by registerType()
 * @param {Function} value - MIME type handler
 * @returns {void}
 */
declare function provides(key: string, func: Function): void

/**
 * @deprecated since version 2.0
 * Registers list of MIME types by associated key.
 * @param {string} key - MIME types
 * @param {string[]} mimes - MMIME types enumeration
 * @returns {void}
 */
declare function registerType(key: string, mimes: string[]): void

/**
 * @deprecated since version 2.0
 * Sends a single string chunk in response.
 * @param {string} chunk - Text chunk
 * @returns {void}
 */
declare function send(chunk: string): void

interface InitResp {
  code: number
  json: object
  body: string
  base64: string
  headers: any
  stop: boolean
}

/**
 * @deprecated since version 2.0
 * Initiates chunked response. As an option, a custom response object may be sent at this point. For list-functions only!
 * @param {Object} init_resp - InitResp object
 * @returns {void}
 */
// eslint-disable-next-line
declare function start(init_resp?: InitResp): void

/**
 * Sum arr’s items.
 * @param {number[]} arr - Array of numbers
 * @returns {number}
 */
declare function sum(arr: number[]): number

/**
 * Encodes obj to JSON string. This is an alias for the JSON.stringify method.
 * @param {any} obj - Array of numbers
 * @returns {string}
 */
declare function toJSON(obj: any): string

/**
 * Reduce functions take two required arguments of keys and values lists - the result of the related map function - and an optional third value which indicates if rereduce mode is active or not.
 * Rereduce is used for additional reduce values list, so when it is true there is no information about related keys (first argument is null).
 * @param {string[] | null} keys - Array of pairs of docid-key for related map function results. Always null if rereduce is running (has true value).
 * @returns {void}
 */
declare type redfun = (keys: [string, string][] | null, values: any[], rereduce?: boolean) => any
