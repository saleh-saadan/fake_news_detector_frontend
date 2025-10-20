const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const analyzeNews = async (text) => {
  const response = await fetch(`${API_URL}/api/analyze-news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze news');
  }

  return response.json();
};

export const analyzeVideo = async (videoFile) => {
  const formData = new FormData();
  formData.append('video', videoFile);

  const response = await fetch(`${API_URL}/api/analyze-video`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze video');
  }

  return response.json();
};
