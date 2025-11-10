import multer from "multer"

// can use disk or memory

// memory storage
const storage = multer.memoryStorage()

export const upload = multer({ storage })   // storage: storage

// me code ek thiyenne file upload karanna puluwan middleware ekak hadanna
// https://www.npmjs.com/package/multer - meken gnn puluwn code ek