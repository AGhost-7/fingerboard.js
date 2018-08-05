import View from './view'
import Model from './model'

/**
 * Constructor Arguments
 *		model:
 *			frets : Number
 *			strings: Number
 *			tuning: Array<Number>
 *			interval:
 *				notation: Array<String>
 *				maxIndex: Number
 *			scale:
 *				values: Array<Number>
 *				root: Number
 *			selector: Function (Note) => String
 *		view:
 *			drawSelector
 *			drawString
 *			drawFret
 *
 */
class Fingerboard {
	constructor ($canvas, args) {
		const events = mkEvents()

		// And now I gotta expose this at the public level...
		for(let key in events) {
			this[key] = events[key]
		}

		args = args || {}

		const model = new Model(args.model || {}, events)

		const view = new View(args.view || {}, $canvas, model, events)
		view.updateDimensions()
		view.paint()

		// the rest of the public functions are going to be mainly exposing
		// the model part.

		this.forEach = function(traversor) {
			model.forEach((note, fret, string) => {
				traversor(note, fret, string)
			})
		}

		this.set = function(args) {
			if (args.view ) view.set(args.view)
			if (args.model) model.set(args.model)
			if (args.view && !args.model) view.repaint()
		}
	}
}

Fingerboard.View = View

Fingerboard.Model = Model

export default Fingerboard
