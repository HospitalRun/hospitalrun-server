export interface Design<T> {
  _id: string
  _rev?: string
  language: 'javascript'
  views?: {
    [key: string]: {
      /**
       * Map functions accept a single document as the argument and (optionally) emit() key/value pairs that are stored in a view.
       * Since version 1.1.0, map supports CommonJS modules and the require() function.
       * @param {Object} doc - The document that is being processed
       * @returns {void}
       */
      map?(doc: T): void
      /**
       * Reduce functions take two required arguments of keys and values lists - the result of the related map function - and an optional third value which indicates if rereduce mode is active or not.
       * Rereduce is used for additional reduce values list, so when it is true there is no information about related keys (first argument is null).
       * @param {string[] | null} keys - Array of pairs of docid-key for related map function results. Always null if rereduce is running (has true value).
       * @returns {any}
       */
      reduce?(keys: [string, string][] | null, values: any[], rereduce?: boolean): any
    }
  }
  shows?: {
    [key: string]: () => void
  }
  lists?: {
    [key: string]: () => void
  }
  updates?: {
    [key: string]: () => void
  }
  filters?: {
    [key: string]: () => void
  }
  validate_doc_update?: {
    [key: string]: () => void
  }
}

export default Design
