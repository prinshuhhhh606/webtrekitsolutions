/**
 * Normalizes image paths so that both remote CDN URLs (e.g. Unsplash, Cloudinary)
 * and local backend-uploaded images (/uploads/filename.ext) render seamlessly.
 */
export const resolveImageUrl = (imgUrl) => {
  if (!imgUrl) return '';
  if (
    imgUrl.startsWith('http://') ||
    imgUrl.startsWith('https://') ||
    imgUrl.startsWith('data:') ||
    imgUrl.startsWith('blob:')
  ) {
    return imgUrl;
  }

  const apiBase =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
      ? 'https://webtrekitsolutions-ezoq.onrender.com/api'
      : 'http://localhost:5001/api');

  const origin = apiBase.replace(/\/api\/?$/, '');
  const cleanPath = imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`;
  return `${origin}${cleanPath}`;
};

export default resolveImageUrl;
