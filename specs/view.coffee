console.log('running view tests!')

canvas = document.getElementById('fingerboard')

$canvas =
  0: canvas
  on: () -> true
  width: () -> 500
  height: () -> 300

args = new Object
console.log(canvas.height)
model = new Model(args, events)

view = new View(args, $canvas, model, events)
view.updateDimensions()
view.paint()


describe 'foo', ->
  it 'should be high', ->
    expect(canvas.height).toEqual(300)
