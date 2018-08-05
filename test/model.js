import Model from '../src/model'
import assert from 'power-assert'

const events = {
  broadcast(name) {}
}

describe('initialization with empty parameters', () => {
  const m = new Model({}, events)

  it('will default to 6 strings', () => {
    assert.equal(m.strings, 6)
  })

  it('will initialize the notes array', () => {
    assert.equal(m.notes.length, 17)
    for (let fret of m.notes) {
      assert.equal(fret.length, 6)
    }
  })

  it('will have the intervals properly set', () => {
    assert.equal(m.notes[0][0].interval.notation, 'E')
    assert.equal(m.notes[12][0].interval.notation, 'E')
    assert.equal(m.notes[0][5].interval.notation, 'E')
    assert.equal(m.notes[12][5].interval.notation, 'E')
  })

  it("will have the interval values' index of properly set", () => {
    // the big E in standard guitar tuning is E2
    assert.equal(m.notes[0][0].interval.index, 2)
    // the small e is E4
    assert.equal(m.notes[0][5].interval.index, 4)
  })
})

describe('initialization with non-empty parameters', () => {
  it('should initialize with the proper number of strings', () => {
    let m = new Model(
      {
        frets: 12,
        strings: 5,
        tuning: [28, 33, 38, 43, 47]
      },
      events
    )
    assert.equal(m.strings, 5)
    assert.equal(m.frets, 12)
  })

  it('should initialize with the proper notation', () => {
    const m = new Model(
      {
        interval: {
          notation: [
            'C',
            'C#',
            'D',
            'D#',
            'E',
            'F',
            'F#',
            'G',
            'G#',
            'A',
            'A#',
            'B'
          ],
          maxIndex: 12
        }
      },
      events
    )

    assert.equal(m.notes[2][0].interval.notation, 'F#')
    assert.equal(m.notes[2][5].interval.notation, 'F#')
  })

  it('should initialize with the proper scale', () => {
    const m = new Model(
      {
        scale: {
          // lets try D Major
          values: [1, 3, 5, 6, 8, 10, 12],
          root: 3
        }
      },
      events
    )
    // D is 2 notes below E, and should be the designated root
    const d = m.notes[10][0].interval
    assert.equal(d.shift, 1)
    assert.equal(d.degree, 1)

    const e = m.notes[12][0].interval
    assert.equal(e.shift, 3)
    assert.equal(e.degree, 2)

    const g = m.notes[3][0].interval
    assert.equal(g.notation, 'G')
    assert.equal(g.shift, 6)
    assert.equal(g.degree, 4)
  })

  it('should handle combined params', () => {
    const m = new Model(
      {
        frets: 20,
        strings: 5,
        tuning: [28, 33, 38, 43, 47],
        interval: {
          notation: [
            'C',
            'C#',
            'D',
            'D#',
            'E',
            'F',
            'F#',
            'G',
            'G#',
            'A',
            'A#',
            'B'
          ],
          maxIndex: 9
        },
        scale: {
          values: [1, 3, 5, 6, 8, 10, 12],
          root: 3
        }
      },
      events
    )

    const d = m.notes[10][0].interval
    assert.equal(d.shift, 1)
    assert.equal(d.degree, 1)

    const fSharp = m.notes[14][0].interval
    assert.equal(fSharp.shift, 5)
    assert.equal(fSharp.degree, 3)
    assert.equal(fSharp.notation, 'F#')

    assert.equal(m.frets, 20)
    assert.equal(m.strings, 5)
    assert(!m.notes[21])
    assert(!m.notes[20][5])
  })
})

describe('mutations on model', () => {
  const m = new Model(
    {
      frets: 20,
      strings: 5,
      tuning: [28, 33, 38, 43, 47],
      interval: {
        notation: [
          'C',
          'C#',
          'D',
          'D#',
          'E',
          'F',
          'F#',
          'G',
          'G#',
          'A',
          'A#',
          'B'
        ],
        maxIndex: 9
      },
      scale: {
        values: [1, 3, 5, 6, 8, 10, 12],
        root: 3
      }
    },
    events
  )

  it('should handle tuning changes', () => {
    assert(!m.notes[0][5])
    m.set({
      strings: 6,
      tuning: [28, 33, 38, 43, 47, 52]
    })

    assert.equal(m.strings, 6)
    assert(m.notes[0][5])
    assert.equal(m.notes[0][5].interval.notation, 'E')

    const fSharp = m.notes[2][5].interval
    assert.equal(fSharp.notation, 'F#')
    assert.equal(fSharp.shift, 5)
    assert.equal(fSharp.degree, 3)
  })

  it('should handle fret amount changes', () => {
    m.set({
      frets: 12
    })
    assert.equal(m.frets, 12)
    assert(!m.notes[13])

    m.set({
      frets: 20
    })
    assert(m.notes[13])

    const fSharp = m.notes[14][0].interval
    assert.equal(fSharp.notation, 'F#')
    assert.equal(fSharp.degree, 3)
  })

  it('should handle notation changes', () => {
    m.set({
      interval: {
        notation: [
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
        ],
        maxIndex: 10
      }
    })
    assert.equal(m.notes[2][0].interval.notation, 'Gb')
  })

  it('should handle scale changes', () => {
    m.set({
      scale: {
        //  A, B, C, D, E, F, G
        values: [1, 3, 4, 6, 8, 9, 11],
        root: 10
      }
    })

    const a = m.notes[0][1].interval
    assert.equal(a.notation, 'A')
    assert.equal(a.degree, 1)
    assert.equal(a.shift, 1)

    const b = m.notes[2][1].interval
    assert.equal(b.notation, 'B')
    assert.equal(b.degree, 2)
    assert.equal(b.shift, 3)
  })
})
