

class Interval {
	constructor() {
		// Absolute value of this note. If two notes have the same freqId, they would
		// be played at the exact same frequency.
		this.freqId = -1

		// index of the interval value.
		this.index = -1

		// integer representation/notation of C,Db,D,E,F... referred to as the
		// interval value in some comments.
		this.value = -1

		// notational (view) of value (C,Db,D,E,F...)
		this.notation = ''

		// shift is used to 'push' the interval to where the tonic should be.
		this.shift = -1

		// the degree is the displayed value of the shift integer
		this.degree = -1
	}
}

class Note {
	constructor (fret, string) {
		this.fret = fret
		this.string = string
		this.interval = new Interval()
	}

	log() {
		console.log(this)
	}
}

export default {Interval, Note}
