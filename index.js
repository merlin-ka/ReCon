const robot   = require("robotjs")
const express = require("express")
const app     = express()

const port = 80

const ok  = res => res.status(204).send()
const err = res => res.status(400).send()

app.use(express.static(__dirname + "/public"))
app.use(express.json())

app.post("/robot", (req, res) => {
    switch (req.body.action) {
        case "keyboardToggle":
            robot.keyToggle(req.body.key, req.body.keyState)
            break
        
        case "mouseToggle":
            robot.mouseToggle(req.body.buttonState, req.body.button)
            break
        
        case "mouseClick":
            robot.mouseClick(req.body.button)
            break
        
        case "mouseMove":
            mouseMove(req.body.x, req.body.y)
            break
        
        default:
            err(res)
            return
    }

    ok(res)
})

const mouseMove = (x, y) => {
    const pos = robot.getMousePos()

    const targetX = pos.x + x
    const targetY = pos.y + y

    robot.moveMouse(targetX, targetY)
}

app.listen(port, () => {
    console.log("listening on port " + port)
})