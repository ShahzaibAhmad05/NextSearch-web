// components/AddDocumentModal.tsx
'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { addCordSlice as apiAddCordSlice } from '@/lib/api';
import { Modal, Button, Alert } from './ui';
import { formatFileSize, formatDuration } from '@/lib/utils';
import type { AddDocumentModalProps, AddDocumentResponse } from '@/lib/types';

/**
 * Modal for uploading CORD-19 document slices.
 * Handles file selection, validation, and upload with progress feedback.
 */
export default function AddDocumentModal({ show, onClose }: AddDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileLabel = useMemo(() => {
    if (!file) return 'No file chosen';
    return `${file.name} (${formatFileSize(file.size)})`;
  }, [file]);

  /**
   * Validate the selected file
   */
  const validateFile = (f: File): string | null => {
    if (!f.name.toLowerCase().endsWith('.zip')) {
      return 'File must be a .zip archive.';
    }
    return null;
  };

  /**
   * Format the success message from the response
   */
  const formatSuccessMessage = (response: AddDocumentResponse): string => {
    const duration =
      response.total_time_ms != null
        ? formatDuration(response.total_time_ms)
        : '?';

    return `Indexed ${response.docs_indexed ?? '?'} docs into ${response.segment ?? '?'} (reloaded=${response.reloaded ?? '?'}) in ${duration}`;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file) {
      setError('Please choose a .zip file (CORD-19 cord_slice).');
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await apiAddCordSlice(file);
      setSuccess(formatSuccessMessage(response));
      setFile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (!loading) {
      setError(null);
      setSuccess(null);
      onClose();
    }
  };

  return (
    <Modal
      show={show}
      onClose={handleClose}
      title="Add Dataset Slice"
      preventClose={loading}
    >
      <form onSubmit={handleSubmit}>
        <p className="mb-3 text-gray-300">
          Upload a zip file of the <b className="text-green-300">CORD-19 Dump</b>:
        </p>

        <FileInput
          file={file}
          fileLabel={fileLabel}
          loading={loading}
          onChange={setFile}
        />

        {error && (
          <Alert variant="error" className="mt-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mt-4">
            {success}
          </Alert>
        )}

        <FormActions
          loading={loading}
          hasFile={!!file}
          onClose={handleClose}
        />
      </form>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface FileInputProps {
  file: File | null;
  fileLabel: string;
  loading: boolean;
  onChange: (file: File | null) => void;
}

/**
 * File input with styled label
 */
function FileInput({ file, fileLabel, loading, onChange }: FileInputProps) {
  return (
    <>
      <div className="flex gap-3 items-center">
        <input
          type="file"
          className="flex-1 px-4 py-2.5 text-sm bg-white/5 border border-white/20 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-green-500/20 file:text-green-300 hover:file:bg-green-500/30"
          accept=".zip,application/zip"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          disabled={loading}
        />
      </div>
    </>
  );
}

interface FormActionsProps {
  loading: boolean;
  hasFile: boolean;
  onClose: () => void;
}

/**
 * Form action buttons
 */
function FormActions({ loading, hasFile, onClose }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 mt-5">
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={loading}
      >
        Close
      </Button>
      <Button
        variant="primary"
        type="submit"
        loading={loading}
        disabled={!hasFile}
      >
        {loading ? 'Indexing...' : 'Upload & Index'}
      </Button>
    </div>
  );
}
