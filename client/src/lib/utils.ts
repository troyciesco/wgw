export const getImage = (original: any, targetSize: any = 2) => {
  const base = original.url.slice(0, original.url.length - (original.extension.length + 1))

  return `${base}@${targetSize}x.webp`
}
