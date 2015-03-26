mkEvents = ->
  listeners =
    # Returns the note that the mouse is parked on when the canvas
    # is clicked.
    noteclick: [],
    # Triggers every time that the mouse hovers on a different note.
    notehover: [],
    # Whenever a change is done to an element, this event is triggered.
    # Some of the internal logic won't trigger this event at all.
    modelchange: []
  self =
    broadcast: (event, pass...) ->
      for listener in listeners[event]
        listener.apply(undefined, pass)

    on: (event, callback) ->
      listeners[event].push(callback)

  for key of listeners
    self[key] = do (key) ->
      (callback) ->
        listeners[key].push(callback)

  self
