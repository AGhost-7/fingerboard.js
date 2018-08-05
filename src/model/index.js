/**
 *The Mother of All Models in this project.
 */

import range from '../utils/range'
import Note from './note'

class Model {
  /**
   *~Options~
   * frets : Number
   * strings: Number
   * tuning: Array<Number>
   * interval:
   *  notation: Array<String>
   *  maxIndex: Number
   * scale:
   *   values: Array<Number>
   *   root: Number
   */
  constructor(args, events) {
    this.events = events
    // contains the note objects
    this.notes = [[]]
    // notation is used to make the integer notation (interval value) "pretty".
    // Other information is derived from it as well.
    this.notation = [
      'C',
      'Db',
      'D',
      'Eb',
      'E',
      'F',
      'Gb',
      'G',
      'Ab',
      'A',
      'Bb',
      'B'
    ]
    // root of the scale
    this.root = 1
    // tuning of the instrument, defaults to standard guitar tuning.
    this.tuning = [28, 33, 38, 43, 47, 52]
    this.scale = undefined
    // the total number of values in the note system. some other systems such
    // as the Maqam have a different scale length (the octave is divided in 24 parts
    // instead of 12 for the Maqam).
    this.scaleLength = this.notation.length
    // number of strings on the instrument.
    this.strings = 6
    // number of frets on the instrument.
    this.frets = 16
    // the interval values are generated by repeating 1 to scaleLength a number
    // of times defined by the maxIndex
    this.maxIndex = 8
    // And finally we build the whole thing by using the set method which will
    // parse all of the arguments properly.
    this.set(args)
  }

  // This will simply fill the notes array with a fresh coat of Note instances
  // based on its current state.
  fill() {
    this.notes = []
    for (let fret of range(0, this.frets)) {
      this.notes[fret] = []
      for (let string of range(1, this.strings)) {
        this.notes[fret][string - 1] = new Note(fret, string)
      }
    }
  }

  // This will handle the rebuilding of the interval-related data, but unlike
  // the original this doesn't take care of the arguments parsing.
  buildInterval() {
    if (this.tuning.length !== this.strings) {
      throw new Error('Tuning is invalid for the number of strings given.')
    }
    const ln = this.scaleLength * (this.maxIndex + 1) - 1
    const intervals = range(0, ln).map(i => {
      const f = i + 1
      const index = Math.floor(i / this.scaleLength)
      const intervalValue = f - index * this.scaleLength

      return {
        value: intervalValue,
        index: index,
        freqId: f,
        notation: this.notation[intervalValue - 1]
      }
    })

    // I can now slap it on the notes
    this.forEach((note, fret, string) => {
      const interval = intervals[this.tuning[string - 1] + fret]
      for (let key in interval) {
        note.interval[key] = interval[key]
      }
    })
  }

  // This will set up the shifted interval value for building the scale.
  buildRootedValue() {
    this.forEach((note, fret, string) => {
      note.interval.shift = note.interval.value - this.root + 1
      if (note.interval.shift < 1) {
        note.interval.shift += this.scaleLength
      }
    })
  }

  buildScale() {
    let degree
    const scale = range(1, this.scaleLength).map(i => this.scale.indexOf(i) + 1)

    this.forEach((note, fret, string) => {
      if ((degree = scale[note.interval.shift - 1])) {
        note.interval.degree = degree
      } else {
        note.interval.degree = undefined
      }
    })
  }

  /*
    ~Options~

    frets : Number
    strings: Number
    tuning: Array<Number>
    interval:
      notation: Array<String>
      maxIndex: Number
    scale:
      values: Array<Number>
      root: Number
  */
  set(args) {
    if (args === undefined) {
      throw new Error('Oye, forgot something? I need an options object.')
    }

    // start by changing the state of the "settings" on the model.

    if (args.strings) this.strings = args.strings
    if (args.frets) this.frets = args.frets
    if (args.tuning) this.tuning = this.asJSArray(args.tuning)
    if (args.interval) {
      const i = args.interval
      if (i.notation) {
        this.notation = this.asJSArray(i.notation)
      }
      // we can derive the scale length of the note system by taking it
      // from the number of notation values we have in there.
      this.scaleLength = this.notation.length
      if (i.maxIndex) this.maxIndex = i.maxIndex
    }
    if (args.scale) {
      const s = args.scale
      if (s.values) this.scale = this.asJSArray(s.values)
      if (s.root) this.root = s.root
    }

    // Figure out what to rebuild

    // We dont need to look into it more than that, we're going to have to fill
    // it with new notes.
    const fill = args.strings || args.frets || !this.notes[0][0]
    const buildInterval = args.tuning || args.interval || fill
    const buildRootedValue = buildInterval || (args.scale && args.scale.root)
    const buildScale = args.scale || (buildRootedValue && this.scale)

    if (fill) this.fill()
    if (buildInterval) this.buildInterval()
    if (buildRootedValue) this.buildRootedValue()
    if (buildScale) this.buildScale()

    if (fill || buildInterval || buildRootedValue || buildScale) {
      this.events.broadcast('modelchange')
    }
  }

  // this is a helper function to process array arguments. data can be in the
  // for of a csv or json, as well as a regular array object.
  asJSArray(arr) {
    if (typeof arr === 'string') {
      // smells like JSON
      if (arr[0] === '[') {
        return JSON.parse(arr)
      } else if (arr.indexOf(',') !== -1) {
        return arr.split(',').map(val => {
          if (isNaN(val)) {
            throw new Error('Invalid array input.')
          } else return Number(val)
        })
      } else {
        throw new Error('Could not parse array argument')
      }
    } else {
      return arr
    }
  }

  /**
   * Traversing functions
   */

  forEach(traversor) {
    for (let fret = 0; fret < this.notes.length; fret++) {
      for (let string = 0; string < this.notes[fret].length; string++) {
        let note = this.notes[fret][string]
        if (traversor(note, fret, string + 1) === false) {
          return
        }
      }
    }
  }

  find(traversor) {
    let result
    this.forEach((note, fret, string) => {
      if (traversor(note, fret, string) === true) {
        result = note
        return false
      }
    })
    return result
  }
}
export default Model
