/**
 * helpers.js - Utility helper functions for Webtrek Backend
 */

// Generate URL slug from title
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// Standard API response formatter
const formatResponse = (success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return response;
};

// Date formatter
const formatDate = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

module.exports = {
  slugify,
  formatResponse,
  formatDate,
};

