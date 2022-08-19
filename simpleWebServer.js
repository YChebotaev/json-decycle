const express = require("express")
const detectPort = require("detect-port")
const open = require("open")
const app = express()



app.use("/", express.static("."))


detectPort(3000).then((port) => {
  app.listen(port, undefined, () => {
    const url = `http://127.0.0.1:${port}`
    console.log(`Server running on ${url}.`)
    console.log(`Opening in browser...`)
    open(url).then(() => {
      console.log("Done!")
      console.log("Note: This server does not live reload its clients on code changes.")
    })
  })
})
