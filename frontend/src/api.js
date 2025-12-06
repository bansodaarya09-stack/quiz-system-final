// src/api.js
// Put the EB backend URL here (your Elastic Beanstalk environment URL).
// If you deploy frontend with backend to same domain, you can use empty string '' to use relative paths.

export const API_BASE = process.env.REACT_APP_API_BASE || 'https://quiz-backend-env.eba-3xbkacm2.ap-south-1.elasticbeanstalk.com';
// Example above: replace with your actual EB env url if different.
