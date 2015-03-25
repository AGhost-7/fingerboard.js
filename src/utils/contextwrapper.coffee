###
	Just a little wrapper for the HTML5 canvas 2d context.
	Method chains! \o/
###

class ContextWrapper
	constructor: (context) ->
		for key of context
			# the warning is a bit annoying...
			if key != 'webkitImageSmoothingEnabled'
				if typeof context[key] == 'function'
					@[key] = do(key) ->
						() ->
							context[key].apply(context, arguments)
							@
				else
					@[key] = do(key) ->
						(val) ->
							context[key] = val
							@


		@context = context

	begin: ->
		@context.beginPath()
		@

	beginAt: (x ,y) ->
		@context.beginPath()
		@context.moveTo(x, y)
		@

	color: (col) ->
		@context.fillStyle = col
		@

	get: (key) ->
		@context[key]
