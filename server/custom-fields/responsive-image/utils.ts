export const SUPPORTED_IMAGE_EXTENSIONS = ["jpg", "png", "webp", "gif"]
export const WEBP_IMAGE_VERSIONS = [
  { resize: 0.125, suffix: "1x" }, // ex. 400 x 300
  { resize: 0.25, suffix: "2x" }, // ex. 800 x 600
  { resize: 0.5, suffix: "3x" }, // ex. 1600 x 1200
  { resize: 0.75, suffix: "4x" }, // ex. 2400 x 1800
  { resize: 1, suffix: "5x" }, // ex. 3200 x 2400
]
