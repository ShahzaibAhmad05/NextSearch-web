// lib/api.ts
// Re-export all API functions from the new modular structure for backward compatibility

export {
  search,
  suggest,
  addCordSlice,
  getAIOverview,
  getResultSummary,
} from './services/index';
