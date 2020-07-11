/** Send a simple GET request and ignore the response */
const sendRequest = json => {
    const req = new XMLHttpRequest()
    req.open("POST", "/robot")
    req.setRequestHeader("content-type", "application/json")
    req.send(JSON.stringify(json))
}


// ##################################################################### //
// ####################### Button event handlers ####################### //
// ##################################################################### //

const toggleKey = key => {
    const down = {
        action: "keyboardToggle",
        key: key,
        keyState: "down",
    }

    const up = {
        action: "keyboardToggle",
        key: key,
        keyState: "up",
    }

    return element => {
        element.addEventListener("touchstart", () => sendRequest(down))
        element.addEventListener("touchend",   () => sendRequest(up))
    }
}

const toggleMouse = button => {
    const down = {
        action: "mouseToggle",
        button: button,
        buttonState: "down",
    }

    const up = {
        action: "mouseToggle",
        button: button,
        buttonState: "up",
    }

    return element => {
        element.addEventListener("touchstart", () => sendRequest(down))
        element.addEventListener("touchend",   () => sendRequest(up))
    }
}

const buttonConfig = {
    "button-left":        toggleKey("left"),
    "button-right":       toggleKey("right"),
    "button-up":          toggleKey("up"),
    "button-down":        toggleKey("down"),
    "button-vol-up":      toggleKey("audio_vol_up"),
    "button-vol-down":    toggleKey("audio_vol_down"),
    "button-vol-mute":    toggleKey("audio_mute"),
    "button-space":       toggleKey("space"),
    "button-enter":       toggleKey("enter"),
    "button-left-click":  toggleMouse("left"),
    "button-right-click": toggleMouse("right"),
}

for (const id in buttonConfig) {
    const button = document.getElementById(id)
    const bindEventHandler = buttonConfig[id]
    
    bindEventHandler(button)
}


// ##################################################################### //
// ###################### Touchpad event handlers ###################### //
// ##################################################################### //

// Delay in ms for how long the user can touch the touchpad until it is no
// longer registered as a click (similar to double click delay)
const clickReleaseDelay = 100

const touchpad = document.getElementById("touchpad")

let lastTouchStart    = 0
let lastTouchPosition = null

const click = () => {
    const body = {
        action: "mouseClick",
        button: "left",
    }

    sendRequest(body)
}

const move = ({ x, y }) => {
    const body = {
        action: "mouseMove",
        x: x,
        y: y,
    }

    sendRequest(body)
}

// Get touch position relative to touchpad from a touch event
const getRelativePosition = e => {
    return {
        x: e.touches[0].clientX - touchpad.offsetLeft,
        y: e.touches[0].clientY - touchpad.offsetTop,
    }
}

touchpad.addEventListener("touchstart", e => {
    lastTouchStart    = e.timeStamp
    lastTouchPosition = getRelativePosition(e)
})

touchpad.addEventListener("touchend", e => {
    lastTouchPosition = null

    if (e.timeStamp - lastTouchStart <= clickReleaseDelay) {
        click()
    }
})

touchpad.addEventListener("touchmove", e => {
    const pos = getRelativePosition(e)

    // Only register touch move inside the touchpad
    if (pos.x < 0 ||
        pos.y < 0 ||
        pos.x > touchpad.clientWidth ||
        pos.y > touchpad.clientHeight)
    { return }

    const movement = {
        x: Math.round(pos.x - lastTouchPosition.x),
        y: Math.round(pos.y - lastTouchPosition.y),
    }

    lastTouchPosition = pos
    move(movement)
})


// ##################################################################### //
// ##################### Button CSS change on touch #################### //
// ##################################################################### //

let touchObjects = Array.from(document.getElementsByTagName("button"))
touchObjects.push(touchpad)

for (const object of touchObjects) {
    object.addEventListener("touchstart", () => {
        object.classList.add("touching")
    })

    object.addEventListener("touchend", () => {
        object.classList.remove("touching")
    })
}