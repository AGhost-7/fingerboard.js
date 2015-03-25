Fingerboard.View ?= {}
Fingerboard.View.selectors =
  default: (tonicColor, elseColor, ratio) ->
    endArc = Math.PI * 2
    ratio ?= 1
    color = undefined
    tonicColor ?= 'firebrick'
    elseColor ?= 'gray'

    (context, note, x, y, radius) ->
      if note.interval.degree
        color = if note.interval.degree == 1 then tonicColor else elseColor
        context
          .begin()
          .color(color)
          .arc(x, y, radius * ratio, 0, endArc)
          .fill()

  # returns a drawing function which will be a circle with the notation inside
  notationDots: ({tonicColor, elseColor, textColor, withIndex, ratio, font}) ->
    endArc = Math.PI * 2
    ratio ?= 1.4
    font ?= '600 9px tahoma'
    tonicColor ?= 'fireBrick'
    elseColor ?= 'gray'
    textColor ?= 'white'
    withIndex ?= true

    color = undefined
    text = undefined
    (context, note, x, y, radius) ->
      if note.interval.degree
        color = if note.interval.degree == 1 then tonicColor else elseColor
        context
          .begin()
          .color(color)
          .arc(x, y, radius * ratio, 0, endArc)
          .fill()
        text =
          if withIndex
            note.interval.notation + note.interval.index
          else
            note.interval.notation
        context
          .begin()
          .color(textColor)
          .textAlign('center')
          .textBaseline('middle')
          .font(font)
          .fillText(text, x, y)

  oversizedNotation: ({tonicColor, elseColor, textColor, withIndex, ratio, font}) ->
