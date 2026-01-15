// lib/types/document.ts

/**
 * Document management type definitions
 */

/**
 * Response from the add_document API endpoint
 */
export interface AddDocumentResponse {
  /** Success status */
  success: boolean;
  /** Optional success message */
  message?: string;
  /** ID of the added document (optional) */
  docId?: number;
  /** Processing time in milliseconds (optional) */
  processing_time_ms?: number;
  /** Total time in milliseconds (optional) */
  total_time_ms?: number;
  /** Number of documents indexed (optional) */
  docs_indexed?: number;
  /** Segment name (optional) */
  segment?: string;
  /** Whether the index was reloaded (optional) */
  reloaded?: boolean;
}
