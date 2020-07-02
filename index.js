const robot   = require("robotjs")
const express = require("express")
const app     = express()

const port = 80

const ok  = res => res.status(204).send()
const err = res => res.status(400).send()

app.use(express.static(__dirname + "/public"))

app.get("/key/:key/:action", (req, res) => {
    if (req.params.action == "tap") {
        robot.keyTap(req.params.key)
    }
    else {
        robot.keyToggle(req.params.key, req.params.action)
    }

    ok(res)
})

app.get("/mouse/:button/:action", (req, res) => {
    if (req.params.action == "click") {
        robot.mouseClick(req.params.button)
    }
    else {
        robot.mouseToggle(req.params.action, req.params.button)
    }

    ok(res)
})

app.get("/mouse/move/:x/:y", (req, res) => {
    const pos = robot.getMousePos()

    const targetX = pos.x + parseInt(req.params.x)
    const targetY = pos.y + parseInt(req.params.y)

    robot.moveMouse(targetX, targetY)

    ok(res)
})

app.listen(port, () => {
    console.log("listening on port " + port)
})