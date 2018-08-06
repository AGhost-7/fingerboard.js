Constructor and `set` method has the same options.
```js
const canvas = document.getElementsByTagName('canvas')[0]
const fingerboard = new Fingerboard(canvas, {

  // contains all data related shizzle.
  model: {

    // determine how many strings the instrument will have
    strings: 6,

    // determine how many frets the instrument will have
    frets: 18,

    // Each value of the tuning of the instrument in integer notation. The
    // value is the note's zero-base integer representation (e.g., D would be
    // 2) with the index multiplied by the scale's length.
    // equation: integer notation + index * scale length
    // example (E4): 5 + 4 * 12
    // The tuning shown here is the standard guitar tuning.
    tuning: [28, 33, 38, 43, 47, 52],

    interval: {

      // you may use this to override the default displayed values to the
      // user. Its also possible to change this to microtonal values (its not
      // restricted to arrays of 12 notes).
      notation: [
        'C', 'Db', 'D', 
        'Eb', 'E', 'F',
        'Gb', 'G', 'Ab',
        'A', 'Bb', 'B'
      ],

      // you can adjust the maximum length that the  fingerboard will
      // calculate the notes to. E.g., you could limit it to B4, or B20 if
      // you wanted instead (although b20 would be well beyond what the human
      // ear can detect).
      maxIndex: 8
    },

    scale: {

      // You can select the values which will be part of the scale relative
      // to the root. E.g., if you want to select F where the key is E, the
      // value will be 2.
      values: [1, 3, 5, 6, 8, 10, 12],

      // this is the root of the scale, e.g., 1 is for playing in C, 3 in D,
      // etc.
      root: 1
    }
  },

  view: {

    // you can override some of the drawn components here.
    drawSelector(context, note, x, y, radius) {},

    drawString(context, color, width, stringY, openX) {},

    drawFret(context, fret, fretStart, height, color) {},

    drawInlay(context, color, x, y, width, height) () {}
  }

)
```

There's also two events for user interation:
```coffeescript
fingerboard.notehover(({interval}) => {
  const {notation, index} = interval
  console.log(`Note ${notation}${index} was hovered on.`)
})

fingerboard.noteclick((note) => {
  console.log(`Note at string ${note.string}, fret ${note.fret} was clicked!`)
})
```

## Example
An example application using this library can be found under the `example`
directory. View the example, run:
```bash
git clone git@github.com:AGhost-7/fingerboard.js
cd fingerboard.js
npm install
npm run build
npm run example
```

And navigate to `localhost:1234`.
