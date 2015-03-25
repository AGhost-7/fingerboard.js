###
		model:
			frets : Number
			strings: Number
			tuning: Array<Number>
			interval:
				notation: Array<String>
				maxIndex: Number
			scale:
				values: Array<Number>
				root: Number
			selector: Function (Note) => String
		view:
			drawSelector
			drawString
			drawFret


###
class Fingerboard
	constructor: ($canvas, args) ->
		events = do ->
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
				broadcast: (event, callback) ->
					if callback
						listener(callback()) for listener in listeners[event]
					else
						listener() for listener in listeners[event]

				on: (event, callback) ->
					listeners[event].push(callback)

			# lets make some shortcuts for the various events
			for key of listeners
				self[key] = do (key) ->
					(callback) ->
						listeners[key].push(callback)

			self

		# And now I gotta expose this at the public level...
		@[key] = events[key] for key of events

		args = args || {}

		model = new Model(args.model || {}, events)

		view = new View(args.view || {}, $canvas, model, events)
		view.updateDimensions()
		view.paint()

		# the rest of the public functions are going to be mainly exposing
		# the model part.

		@forEach = (traversor) ->
			model.forEach (note, fret, string) ->
				traversor(note, fret, string)

		@set = (args) ->
			if args.view then view.set(args.view)
			if args.model then model.set(args.model)
			if args.view && !args.model then view.repaint()


window.Fingerboard = Fingerboard
