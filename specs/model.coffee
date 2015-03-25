events =
	broadcast: (name) ->

describe 'initialization with empty parameters', ->
	m = new Model({}, events)

	it 'will default to 6 strings', ->
		expect(m.strings).toEqual 6

	it 'will initialize the notes array', ->
		expect(m.notes.length).toEqual 17
		for fret in m
			expect(fret.length).toEqual 6

	it 'will have the intervals properly set', ->
		expect(m.notes[0][0].interval.notation).toEqual 'E'
		expect(m.notes[12][0].interval.notation).toEqual 'E'
		expect(m.notes[0][5].interval.notation).toEqual 'E'
		expect(m.notes[12][5].interval.notation).toEqual 'E'

	it 'will have the interval values\' index of properly set', ->
		# the big E in standard guitar tuning is E2
		expect(m.notes[0][0].interval.index).toEqual 2
		# the small e is E4
		expect(m.notes[0][5].interval.index).toEqual 4

describe 'initialization with non-empty parameters', ->

	it 'should initialize with the proper number of strings', ->
		m = new Model({
			frets: 12
			strings: 5
			tuning: [28, 33, 38, 43, 47]
		}, events)
		expect(m.strings).toEqual 5
		expect(m.frets).toEqual 12

	it 'should initialize with the proper notation', ->
		m = new Model({
			interval:
				notation:
					['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
				maxIndex: 12
		}, events)

		expect(m.notes[2][0].interval.notation).toEqual 'F#'
		expect(m.notes[2][5].interval.notation).toEqual 'F#'

	it 'should initialize with the proper scale', ->
		m = new Model({
			scale:
				# lets try D Major
				values: [1, 3, 5, 6, 8, 10, 12]
				root: 3
		}, events)
		# D is 2 notes below E, and should be the designated root
		d = m.notes[10][0].interval
		expect(d.shift).toEqual 1
		expect(d.degree).toEqual 1

		e = m.notes[12][0].interval
		expect(e.shift).toEqual 3
		expect(e.degree).toEqual 2

		g = m.notes[3][0].interval
		expect(g.notation).toEqual "G"
		expect(g.shift).toEqual 6
		expect(g.degree).toEqual 4

	it 'should handle combined params', ->
		m = new Model({
			frets: 20
			strings: 5
			tuning: [28, 33, 38, 43, 47]
			interval:
				notation:
					['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
				maxIndex: 9
			scale:
				values: [1, 3, 5, 6, 8, 10, 12]
				root: 3
		}, events)

		d = m.notes[10][0].interval
		expect(d.shift).toEqual 1
		expect(d.degree).toEqual 1

		fSharp = m.notes[14][0].interval
		expect(fSharp.shift).toEqual 5
		expect(fSharp.degree).toEqual 3
		expect(fSharp.notation).toEqual 'F#'

		expect(m.frets).toEqual 20
		expect(m.strings).toEqual 5
		expect(m.notes[21]).not.toBeDefined()
		expect(m.notes[20][5]).not.toBeDefined()

describe 'mutations on model', ->
	m = new Model({
		frets: 20
		strings: 5
		tuning: [28, 33, 38, 43, 47]
		interval:
			notation:
				['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
			maxIndex: 9
		scale:
			values: [1, 3, 5, 6, 8, 10, 12]
			root: 3
	}, events)

	it 'should handle tuning changes', ->
		expect(m.notes[0][5]).not.toBeDefined()
		m.set
			strings: 6
			tuning: [28, 33, 38, 43, 47, 52]

		expect(m.strings).toEqual 6
		expect(m.notes[0][5]).toBeDefined()
		expect(m.notes[0][5].interval.notation).toEqual 'E'

		fSharp = m.notes[2][5].interval
		expect(fSharp.notation).toEqual 'F#'
		expect(fSharp.shift).toEqual 5
		expect(fSharp.degree).toEqual 3

	it 'should handle fret amount changes', ->
		m.set
			frets: 12
		expect(m.frets).toEqual 12
		expect(m.notes[13]).not.toBeDefined()

		m.set
			frets: 20
		expect(m.notes[13]).toBeDefined()

		fSharp = m.notes[14][0].interval
		expect(fSharp.notation).toEqual 'F#'
		expect(fSharp.degree).toEqual 3

	it 'should handle notation changes', ->
		m.set
			interval:
				notation:
					['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
				maxIndex: 10
		expect(m.notes[2][0].interval.notation).toEqual 'Gb'

	it 'should handle scale changes', ->
		m.set
			scale:
				#  A, B, C, D, E, F, G
				values: [1, 3, 4, 6, 8, 9, 11]
				root: 10

		a = m.notes[0][1].interval
		expect(a.notation).toEqual 'A'
		expect(a.degree).toEqual 1
		expect(a.shift).toEqual 1

		b = m.notes[2][1].interval
		expect(b.notation).toEqual 'B'
		expect(b.degree).toEqual 2
		expect(b.shift).toEqual 3
