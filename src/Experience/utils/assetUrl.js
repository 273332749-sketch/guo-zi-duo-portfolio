// Resolve original source assets at / locally and beneath a GitHub Pages repo.
export const assetUrl = (file) => `${import.meta.env.BASE_URL}${file.replace(/^\/+/, "")}`;
