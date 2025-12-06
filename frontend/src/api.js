export const API_BASE = "http://quiz-backend-env-1.eba-3xbkacm2.ap-south-1.elasticbeanstalk.com";

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return res.json();
}
