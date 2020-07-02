/** Send a simple GET request and ignore the response */
const sendRequest = url => {
    const req = new XMLHttpRequest()
    req.open("GET", url)
    req.send()
}


// ##################################################################### //
// ####################### Button event handlers ####################### //
// ##################################################################### //

const holdKey = key => {
    return element => {
        element.addEventListener("touchstart", () => sendRequest(`/key/${key}/down`))
        element.addEventListener("touchend",   () => sendRequest(`/key/${key}/up`))
    }
}

const holdMouseButton = button => {
    return element => {
        element.addEventListener("touchstart", () => sendRequest(`/mouse/${button}/down`))
        element.addEventListener("touchend",   () => sendRequest(`/mouse/${button}/up`))
    }
}

const buttonConfig = {
    "button-left":        holdKey("left"),
    "button-right":       holdKey("right"),
    "button-up":          holdKey("up"),
    "button-down":        holdKey("down"),
    "button-vol-up":      holdKey("audio_vol_up"),
    "button-vol-down":    holdKey("audio_vol_down"),
    "button-vol-mute":    holdKey("audio_mute"),
    "button-space":       holdKey("space"),
    "button-enter":       holdKey("enter"),
    "button-left-click":  holdMouseButton("left"),
    "button-right-click": holdMouseButton("right"),
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

const click = ()       => sendRequest("/mouse/left/click")
const move  = ({x, y}) => sendRequest(`/mouse/move/${x}/${y}`)

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