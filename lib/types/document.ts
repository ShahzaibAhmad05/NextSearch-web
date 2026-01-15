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
}
