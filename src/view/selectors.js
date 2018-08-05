// Fingerboard.View = Fingerboard.View || {}
const endArc = Math.PI * 2

const selectors = {
  default({ tonicColor, elseColor, ratio }) {
    ratio = ratio || 1
    let color
    tonicColor = tonicColor || 'firebrick'
    elseColor = elseColor || 'gray'

    return (context, note, x, y, radius) => {
      if (note.interval.degree) {
        color = note.interval.degree === 1 ? tonicColor : elseColor
        context
          .begin()
          .color(color)
          .arc(x, y, radius * ratio, 0, endArc)
          .fill()
      }
    }
  },

  // returns a drawing function which will be a circle with the notation inside
  notationDots({ tonicColor, elseColor, textColor, withIndex, ratio, font }) {
    ratio = ratio || 1.4
    font = font || '600 9px tahoma'
    tonicColor = tonicColor || 'fireBrick'
    elseColor = elseColor || 'gray'
    textColor = textColor || 'white'
    withIndex = withIndex === undefined ? true : withIndex

    let color
    let text

    return (context, note, x, y, radius) => {
      if (note.interval.degree) {
        color = note.interval.degree === 1 ? tonicColor : elseColor
        context
          .begin()
          .color(color)
          .arc(x, y, radius * ratio, 0, endArc)
          .fill()
        text = withIndex
          ? note.interval.notation + note.interval.index
          : note.interval.notation
        context
          .begin()
          .color(textColor)
          .textAlign('center')
          .textBaseline('middle')
          .font(font)
          .fillText(text, x, y)
      }
    }
  },

  degreeDots({ tonicColor, elseColor, textColor, ratio, font }) {
    ratio = ratio || 1.2
    font = font || '600 9px tahoma'
    tonicColor = tonicColor || 'fireBrick'
    elseColor = elseColor || 'gray'
    textColor = textColor || 'white'

    let color

    return (context, note, x, y, radius) => {
      if (note.interval.degree) {
        color = note.interval.degree === 1 ? tonicColor : elseColor
        context
          .begin()
          .color(color)
          .arc(x, y, radius * ratio, 0, endArc)
          .fill()
        context
          .begin()
          .color(textColor)
          .textAlign('center')
          .textBaseline('middle')
          .font(font)
          .fillText('' + note.interval.degree, x, y)
      }
    }
  }
}

export default selectors
