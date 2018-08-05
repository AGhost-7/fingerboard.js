const mkEvents = () => {
  const listeners = {
    // Returns the note that the mouse is parked on when the canvas
    // is clicked.
    noteclick: [],
    // Triggers every time that the mouse hovers on a different note.
    notehover: [],
    // Whenever a change is done to an element, this event is triggered.
    // Some of the internal logic won't trigger this event at all.
    modelchange: []
  }

  const self = {
    broadcast(event, ...pass) {
      for (let listener of listeners[event]) {
        listener.apply(null, pass)
      }
    },
    on(event, callback) {
      listeners[event].push(callback)
    }
  }

  Object.keys(listeners).forEach(key => {
    self[key] = callback => listeners[key].push(callback)
  })

  return self
}
export default mkEvents
