###
  Draw thing
###

class View

  endArc: Math.PI * 2

  constructor: (args, @canvas, @model, @events) ->

    #@canvas = @$canvas[0]
    @context = new ContextWrapper(@canvas.getContext('2d'))

    # setup the canvas' css settings
    @canvas.style['user-select'] = 'none'
    @canvas.style['-webkit-user-select'] = 'none'
    @canvas.style['-moz-user-select'] = 'none'

    @colors =
      strings: 'gray'
      inlays: '#D1A319'
      frets: 'gray'

    # listen for changes on the canvas, or data
    #$(window).resize(@repaint)
    window.addEventListener('resize', @repaint)
    # this will need to be triggered manually
    @canvas.addEventListener('resize', @repaint)
    @events.modelchange(@repaint)

    # setup event services
    @canvas.addEventListener("click", @onMouseClick)
    @canvas.addEventListener('mousemove', @onMouseMove)

    @set(args)

  set: (args) ->
    if args.drawInlay then @drawInlay = args.drawInlay
    if args.drawSelector then @drawSelector = args.drawSelector
    if args.drawString then @drawString = args.drawString
    if args.drawFret then @drawFret = args.drawFret
    if args.colors
      c = args.colors
      if c.strings then @colors.strings = c.strings
      if c.frets then @colors.frets = c.frets
      if c.inlays then @colors.inlays = c.inlays

  relativePosition: (e) ->
    docE = document.documentElement
    b = @canvas.getBoundingClientRect()

    canvX = b.left - window.pageXOffset - docE.clientLeft
    canvY = b.top - window.pageYOffset - docE.clientTop

    x: e.pageX - canvX
    y: e.pageY - canvY

  pinpointNote: (x, y) ->
    openX = @width / (@model.frets * 2)
    leftover = @width - openX
    fretWidth = leftover / (@model.frets - 2)
    fret = if x < openX then 0 else Math.floor((x - openX) / fretWidth) + 1

    heightRatio = @height / @model.strings
    string = @model.strings - Math.floor(y / heightRatio)

    string: string
    fret: fret

  onMouseClick: (e) =>
    {x, y} = @relativePosition(e)
    {string, fret} = @pinpointNote(x, y)

    note = @model.notes[fret][string - 1]

    @events.broadcast('noteclick', note)

  onMouseMove: (e) =>
    {x, y} = @relativePosition(e)

    # check if the note cached is still corresponding to the note that the
    # mouse is on. if mouseHoveredNote note is undefined, we must check.
    {fret, string} = @pinpointNote(x, y)

    if !@hoveredNote || @hoveredNote.fret != fret || @hoveredNote.string != string

      # its possible that find won't be able to locate anything, in which
      # case we'll have to wait for the next event to check again.
      if @model.notes[fret] && @model.notes[fret][string - 1]
        @hoveredNote = @model.notes[fret][string - 1]
        @events.broadcast('notehover', @hoveredNote)

  updateDimensions: () ->
    @width = @canvas.offsetWidth
    @height = @canvas.offsetHeight
    @context.get('canvas').height = @height
    @context.get('canvas').width = @width

  drawInlay: (context, color, x, y, width, height) ->
    context
      .beginAt(x - (width / 2), y)
      .lineTo(x, (y - (height / 2)))
      .lineTo(x + (width / 2), y)
      .fillStyle(color)
      .fill()

  drawSelector: (context, note, x, y, radius) ->
    if note.interval.degree
      color = if note.interval.degree == 1 then 'firebrick' else 'gray'
      context
        .beginPath()
        .color(color)
        .arc(x, y, radius, 0, @endArc)
        .fill()

  drawString: (context, color, width, stringY, openX) ->
    context
      .beginPath()
      .lineWidth(1)
      .fillStyle(color)
      # the string starts after the open fret in this case.
      .moveTo(openX, stringY)
      .lineTo(width, stringY)
      .stroke()

  drawFret: (context, fret, fretStart, height, color) ->
    if fret == 1
      context.lineWidth(5)
    else
      context.lineWidth(1)
    # the fret "0" doesnt really exist
    if fret > 0
      context
        .beginPath()
        .fillStyle(color)
        .moveTo(fretStart, 0)
        .lineTo(fretStart, height)
        .stroke()


  paint: () ->
    # the open note will be a much smaller rectangle with a "fat" line to
    # represent the nut of the instrument
    openX = @width / (@model.frets * 2)
    # use the difference to calculate the rest of the frets evenly
    leftover = @width - openX
    fretWidth = leftover / (@model.frets - 2)
    heightRatio = @height / @model.strings
    radius = if heightRatio > openX then openX / 4 else heightRatio / 4
    # the string's location is in the center of the "square" of the note
    stringH  = 0
    fretStart = 0
    fretEnd = 0
    circle = 0
    color = ''

    @model.forEach (note, fret, string) =>
      # the first fret will just start at pixel 1, otherwise standard logic
      # applies
      fretStart = if !fret then 1 else ((fret - 1) * fretWidth) + openX
      fretEnd = fretStart + fretWidth - 1
      # I need to invert the order of the strings since fingerboards are
      # typically viewed upside down (so that its easy to read the graphic with
      # the instrument in hand).
      stringInvert = @model.strings - string + 1
      #console.log(stringInvert)
      # the string is located in the middle of the note
      stringY = ((stringInvert - 1) * heightRatio) + (heightRatio / 2)
      # inlay is located at the center of the note.
      inlayX = fretStart + ((if !fret then openX else fretWidth) / 2)

      # Save the dimensions for later for when I need to isolate the note
      # which has been hovered or clicked on.
      #note.dimension.x1 = fretStart
      #note.dimension.y1 = stringY - (heightRatio / 2)
      #note.dimension.x2 = fretEnd
      #note.dimension.y2 = stringY + (heightRatio / 2)

      # if we're at the open note, just need to draw the instrument's string.
      if fret == 0
        @drawString(@context, @colors.strings, @width, stringY, openX)

      if string == 1
        @drawFret(@context, fret, fretStart, @height, @colors.frets)

        switch fret
          when 3, 5, 7, 9
            @drawInlay(@context, inlayX, @height / 2, radius * 3, radius * 6)
          when 12
            @drawInlay(@context, inlayX, @height / 3, radius * 3, radius *6)
            @drawInlay(@context, inlayX, 2 * (@height / 3), radius * 3, radius *6)

      @drawSelector(@context, note, inlayX, stringY, radius)

  repaint: () =>
    @updateDimensions()
    @context
      .begin()
      .clearRect(0, 0, @width, @height)
      .fill()
    @paint()
