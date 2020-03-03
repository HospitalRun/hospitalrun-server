// Reference: https://docs.couchdb.org/en/latest/ddocs/ddocs.html and https://docs.couchdb.org/en/latest/api/ddoc/common.html#put--db-_design-ddoc
interface DesignDocument<T> {
  _id: string
  _rev?: string
  language?: string // defaults to 'javascript'
  autoupdate?: boolean // defaults to 'true'
  // Reference: https://docs.couchdb.org/en/stable/api/ddoc/views.html#view-options
  options?: {
    local_seq?: boolean
    include_design?: boolean
  }
  views?: {
    [key: string]: {
      /**
       * Map functions accept a single document as the argument and (optionally) emit() key/value pairs that are stored in a view.
       * Since version 1.1.0, map supports CommonJS modules and the require() function.
       *
       * Reference: https://docs.couchdb.org/en/master/ddocs/ddocs.html#map-functions
       * @param {Object} doc - The document that is being processed
       * @returns {void}
       */
      map?(doc: T): void
      /**
       * Reduce functions take two required arguments of keys and values lists - the result of the related map function - and an optional third value which indicates if rereduce mode is active or not.
       * Rereduce is used for additional reduce values list, so when it is true there is no information about related keys (first argument is null).
       *
       * Reference: https://docs.couchdb.org/en/master/ddocs/ddocs.html#reduce-and-rereduce-functions
       * @param {[string, string][] | null} keys - Array of pairs of docid-key for related map function results. Always null if rereduce is running (has true value).
       * @returns {Object}
       */
      reduce?(keys: [string, string][] | null, values: any[], rereduce?: boolean): any
    }
  }
  updates?: {
    /**
     * Update handlers are functions that clients can request to invoke server-side logic that will create or update a document.
     * This feature allows a range of use cases such as providing a server-side last modified timestamp,
     * updating individual fields in a document without first getting the latest revision, etc.
     *
     * Reference: https://docs.couchdb.org/en/master/ddocs/ddocs.html#update-functions
     * @param {Object | null} doc - Thedocument that is being processed
     * @param {Object} req - Request object
     * @returns {[Object, any]} - the first element is the (updated or new) document, which is committed to the database; The second element is the response that will be sent back to the caller.
     */
    [key: string]: <P extends T | null>(
      doc: P,
      req: CouchDB.RequestObject,
    ) => [Partial<T> | null, any]
  }
  filters?: {
    /**
     * Filter functions mostly act like Show Functions and List Functions: they format, or filter the changes feed.
     *
     * Reference: https://docs.couchdb.org/en/master/ddocs/ddocs.html#filter-functions
     * @param {Object} doc - The document that is being processed
     * @param {Object} req - Request object
     * @returns {boolean} - true means that doc passes the filter rules, false means that it does not
     */
    [key: string]: (doc: T, req: CouchDB.RequestObject) => boolean
  }
  /**
   * Used to prevent invalid or unauthorized document update requests from being stored.
   * The function is passed the new document from the update request, the current document stored in the database,
   * a User Context Object containing information about the user writing the document (if present),
   * and a Security Object with lists of database security roles.
   *
   * Reference: https://docs.couchdb.org/en/master/ddocs/ddocs.html#validatefun
   * @param {Object} newDoc - New version of document that will be stored
   * @param {Object} oldDoc - Previous version of document that is already stored
   * @param {Object} userCtx - User Context Object
   * @param {Object} secObj - Security Object
   * @returns {void}
   */
  //
  validate_doc_update?( // eslint-disable-line
    newDoc: T,
    oldDoc: T,
    userCtx: CouchDB.UserCtx,
    secObj: CouchDB.SecurityObject,
  ): void
  /**
   * @deprecated in CouchDB 3.0, and will be removed in CouchDB 4.0
   */
  shows?: {
    /**
     * @deprecated in CouchDB 3.0, and will be removed in CouchDB 4.0
     * Show functions are used to represent documents in various formats, commonly as HTML pages with nice formatting.
     * They can also be used to run server-side functions without requiring a pre-existing document.
     *
     * Reference: https://docs.couchdb.org/en/master/ddocs/ddocs.html#show-functions
     * @param {Object} doc - The document that is being processed; may be omitted
     * @param {Object} req - Request object
     * @returns {Object | string}
     */
    [key: string]: (doc: T, req: CouchDB.RequestObject) => string | CouchDB.ResponseObject | void
  }
  /**
   * @deprecated in CouchDB 3.0, and will be removed in CouchDB 4.0
   */
  lists?: {
    /**
     * @deprecated in CouchDB 3.0, and will be removed in CouchDB 4.0
     * While Show Functions are used to customize document presentation,
     * List Functions are used for the same purpose, but on View Functions results.
     *
     * Reference: https://docs.couchdb.org/en/master/ddocs/ddocs.html#list-functions
     * @param {Object} head - View Head Information
     * @param {Object} req - Request object
     * @returns {string} Last chunk
     */
    [key: string]: (head: CouchDB.ViewHeadInformation, req: CouchDB.RequestObject) => string | void
  }
  /**
   * @deprecated in CouchDB 3.0, and will be removed in CouchDB 4.0
   * Rewrites the specified path by rules defined in the specified design document.
   * The rewrite rules are defined by the rewrites field of the design document.
   * The rewrites field can either be a string containing the a rewrite function or an array of rule definitions.
   *
   */
  rewrites?: ((req: CouchDB.Request2Object) => CouchDB.RewriteReturnObject) | CouchDB.RewriteRule[]
}

export default DesignDocument
