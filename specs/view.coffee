
canvas = document.getElementById('fingerboard')
events = mkEvents()

args =
  model:
    strings: 4
    frets: 6
    tuning: [16, 21, 26, 31]


model = new Model(args.model, events)

view = new View(args, canvas, model, events)
view.updateDimensions()
view.paint()

describe 'view events', ->
  it 'should be able to find notes anywhere on the canvas', ->
    for y in [1..canvas.offsetHeight - 50] by 50
      for x in [1..canvas.offsetWidth - 50] by 50
        {string, fret} = view.pinpointNote(x, y)
        expect(model.notes[fret]).toBeDefined()
        note = model.notes[fret][string - 1]
        expect(note).toBeDefined()
  # Not sure how I should test it further...
