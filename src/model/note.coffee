

class Interval
	constructor: ->
		# Absolute value of this note. If two notes have the same freqId, they would
		# be played at the exact same frequency.
		@freqId = -1

		# index of the interval value.
		@index = -1

		# integer representation/notation of C,Db,D,E,F... referred to as the
		# interval value in some comments.
		@value = -1

		# notational (view) of value (C,Db,D,E,F...)
		@notation = ''

		# shift is used to 'push' the interval to where the tonic should be.
		@shift = -1

		# the degree is the displayed value of the shift integer
		@degree = -1

class Square

	constructor: ->
		@x1 = -1
		@y1 = -1
		@x2 = -1
		@y2 = -1

	isPointWithinBounds: (x, y) ->
		x > @x1 && x <= @x2 && y > @y1 && y <= @y2


class Note
	constructor: (@fret, @string) ->
		@dimension = new Square
		@interval = new Interval

	log: ->
		console.log(@)
