### Constructor Arguments
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
		events = mkEvents()

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
