/*
	Just a little wrapper for the HTML5 canvas 2d context.
	Method chains! \o/
	*/

class ContextWrapper {
	constructor (context) {
		// TODO: ????
		//for key of context
		//	# the warning is a bit annoying...
		//	if key != 'webkitImageSmoothingEnabled'
		//		if typeof context[key] == 'function'
		//			this.[key] = do(key) ->
		//				() ->
		//					context[key].apply(context, arguments)
		//					this.
		//		else
		//			this.[key] = do(key) ->
		//				(val) ->
		//					context[key] = val
		//					this.


		this.context = context
	}

	begin () {
		this.context.beginPath()
		this
	}

	beginAt (x ,y) {
		this.context.beginPath()
		this.context.moveTo(x, y)
		return this
	}

	color (col) {
		this.context.fillStyle = col
		this
	}

	get (key) {
		this.context[key]
	}

}

export default ContextWrapper
