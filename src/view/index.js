/**
 * Draw thing
 */

import ContextWrapper from '../utils/contextwrapper'
import selectors from './selectors'

class View {

  constructor(args, canvas, model, events) {

		this.canvas = canvas
		this.model = model
		this.events = events

		this.endArc = Math.PI * 2

    //this.canvas = this.$canvas[0]
    this.context = new ContextWrapper(this.canvas.getContext('2d'))

    // setup the canvas' css settings
    this.canvas.style['user-select'] = 'none'
    this.canvas.style['-webkit-user-select'] = 'none'
    this.canvas.style['-moz-user-select'] = 'none'

    this.colors = {
      strings: 'gray',
      inlays: '#D1A319',
      frets: 'gray'
		}

    // listen for changes on the canvas, or data
    //$(window).resize(this.repaint)
    window.addEventListener('resize', this.repaint)
    // this will need to be triggered manually
    this.canvas.addEventListener('resize', this.repaint)
    this.events.modelchange(this.repaint)

    // setup event services
    this.canvas.addEventListener("click", this.onMouseClick)
    this.canvas.addEventListener('mousemove', this.onMouseMove)

    this.set(args)
	}

  set (args) {
    if (args.drawInlay) this.drawInlay = args.drawInlay
    if (args.drawSelector) this.drawSelector = args.drawSelector
    if (args.drawString) this.drawString = args.drawString
    if (args.drawFret) this.drawFret = args.drawFret
    if (args.colors) {
      const c = args.colors
      if(c.strings) this.colors.strings = c.strings
      if(c.frets) this.colors.frets = c.frets
      if(c.inlays) this.colors.inlays = c.inlays
		}
	}

  relativePosition (e) {
    const docE = document.documentElement
    const b = this.canvas.getBoundingClientRect()

    const canvX = b.left - window.pageXOffset - docE.clientLeft
    const canvY = b.top - window.pageYOffset - docE.clientTop

    return {
			x: e.pageX - canvX,
			y: e.pageY - canvY
		}
	}

  pinpointNote (x, y) {
    const {openFretWidth, fretWidth} = this.fretWidths()
    const fret = x < openFretWidth
			? 0 
      : Math.floor((x - openFretWidth) / fretWidth) + 1

    const heightRatio = this.height / this.model.strings
    const string = this.model.strings - Math.floor(y / heightRatio)

		return {
			string: string,
			fret: fret
		}
	}

  onMouseClick (e) {
    const {x, y} = this.relativePosition(e)
    const {string, fret} = this.pinpointNote(x, y)

    const note = this.model.notes[fret][string - 1]

    this.events.broadcast('noteclick', note)
	}

  onMouseMove (e) {
    const {x, y} = this.relativePosition(e)

    // check if the note cached is still corresponding to the note that the
    // mouse is on. if mouseHoveredNote note is undefined, we must check.
    const {fret, string} = this.pinpointNote(x, y)

    if (!this.hoveredNote || this.hoveredNote.fret != fret || this.hoveredNote.string != string) {

      // its possible that find won't be able to locate anything, in which
      // case we'll have to wait for the next event to check again.
      if(this.model.notes[fret] && this.model.notes[fret][string - 1]) {
        this.hoveredNote = this.model.notes[fret][string - 1]
        this.events.broadcast('notehover', this.hoveredNote)
			}
		}
	}

  updateDimensions () {
    this.width = this.canvas.offsetWidth
    this.height = this.canvas.offsetHeight
    this.context.get('canvas').height = this.height
    this.context.get('canvas').width = this.width
	}

  drawInlay (context, color, x, y, width, height) {
    context
      .color(color)
      .beginPath()
      .moveTo(x - (width / 2), y)
      .lineTo(x, (y - (height / 2)))
      .lineTo(x + (width / 2), y)
      .lineTo(x, (y + (height / 2)))
      .fill()
	}

  drawSelector (context, note, x, y, radius) {
    if (note.interval.degree) {
      const color = note.interval.degree == 1 ? 'firebrick' : 'gray'
      context
        .beginPath()
        .color(color)
        .arc(x, y, radius, 0, this.endArc)
        .fill()
		}
	}

  drawString (context, color, width, stringY, openX) {
    context
      .beginPath()
      .lineWidth(1)
      .fillStyle(color)
      // the string starts after the open fret in this case.
      .moveTo(openX, stringY)
      .lineTo(width, stringY)
      .stroke()
	}

  drawFret (context, fret, fretStart, height, color) {
    if( fret == 1) {
      context.lineWidth(5)
    } else {
      context.lineWidth(1)
		}
    // the fret "0" doesnt really exist
    if (fret > 0) {
      context
        .beginPath()
        .fillStyle(color)
        .moveTo(fretStart, 0)
        .lineTo(fretStart, height)
        .stroke()
		}
	}

  // returns the width of the open fret and of the other frets
  fretWidths () {
    // the open note will be a much smaller rectangle with a "fat" line to
    // represent the nut of the instrument
    const openFretWidth = this.width / (this.model.frets * 2)
    const leftover = this.width - openFretWidth
    const fretWidth = leftover / (this.model.frets - 2)

    return {
			openFretWidth: openFretWidth,
			fretWidth: fretWidth
		}
	}

  paint () {
    const {openFretWidth, fretWidth} = this.fretWidths()
    const heightRatio = this.height / this.model.strings
    const radius = heightRatio > openFretWidth
			? openFretWidth / 4
      : heightRatio / 4
    // the string's location is in the center of the "square" of the note
    let stringH  = 0
    let fretStart = 0
    let fretEnd = 0
    let circle = 0

    this.model.forEach((note, fret, string) => {
      // the first fret will just start at pixel 1, otherwise standard logic
      // applies
      fretStart = !fret ? 1 : ((fret - 1) * fretWidth) + openFretWidth
      fretEnd = fretStart + fretWidth - 1
      // I need to invert the order of the strings since fingerboards are
      // typically viewed upside down (so that its easy to read the graphic with
      // the instrument in hand).
      let stringInvert = this.model.strings - string + 1
      //console.log(stringInvert)
      // the string is located in the middle of the note
      let stringY = ((stringInvert - 1) * heightRatio) + (heightRatio / 2)
      // inlay is located at the center of the note.
      let inlayX = fretStart + ((!fret ? openFretWidth : fretWidth) / 2)

			// if we're at the open note, just need to draw the instrument's string.
      if (fret === 0) {
        this.drawString(this.context, this.colors.strings, this.width, stringY, openFretWidth)
			}

      if (string == 1) {
        this.drawFret(this.context, fret, fretStart, this.height, this.colors.frets)
        switch (fret) {
          case 3:
					case 5:
					case 7:
					case 9:
            this.drawInlay(
                this.context,
                this.colors.inlays,
                inlayX,
                this.height / 2,
                radius * 3,
                radius * 6
                )
						break
          case 12:
            this.drawInlay(
                this.context,
                this.colors.inlays,
                inlayX,
                this.height / 3,
                radius * 3,
                radius * 6
                )
            this.drawInlay(
                this.context,
                this.colors.inlays,
                inlayX,
                2 * (this.height / 3),
                radius * 3,
                radius * 6
                )
						break
				}
			}

      this.drawSelector(this.context, note, inlayX, stringY, radius)
		})
	}

  repaint () {
    this.updateDimensions()
    this.context
      .begin()
      .clearRect(0, 0, this.width, this.height)
      .fill()
    this.paint()
	}
}

View.selectors = selectors
export default View
