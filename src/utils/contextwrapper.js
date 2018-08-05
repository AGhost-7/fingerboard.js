/*
	Just a little wrapper for the HTML5 canvas 2d context.
	Method chains! \o/
	*/

class ContextWrapper {
	constructor (context) {
		for(let key in context) {
			if(key !== 'webkitImageSmoothingEnabled') {
				if(typeof context[key] === 'function') {
					this[key] = (...args) => {
						context[key].apply(context, args)
						return this
					}
				} else {
					this[key] = (val) => {
						context[key] = val
						return this
					}
				}
			}
		}
		this.context = context
	}

	begin () {
		this.context.beginPath()
		return this
	}

	beginAt (x ,y) {
		this.context.beginPath()
		this.context.moveTo(x, y)
		return this
	}

	color (col) {
		this.context.fillStyle = col
		return this
	}

	get (key) {
		return this.context[key]
	}

}

export default ContextWrapper
