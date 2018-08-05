import $ from 'jquery'
import Fingerboard from '../src'

console.log(Fingerboard)
console.log($)

var fingerboard = new Fingerboard($('#fingerboard')[0], {
  model: {
    scale: {
      root: 1,
      values: [1, 3, 5, 6, 8, 10, 12]
    }
  }
})

fingerboard.noteclick(function(note) {
  console.log(note)
})

fingerboard.notehover(function(note) {
  console.log(note)
  $('#hovered-note').text(note.interval.notation + note.interval.index)
})

var modelMods = {
  '#root-selector': function(val) {
    return { scale: { root: val } }
  },
  '#tuning-selector': function(val) {
    return { tuning: val }
  },
  '#scale-selector': function(val) {
    return { scale: { values: val } }
  }
}

$.each(modelMods, function(select, gen) {
  $(select).on('change', function(ev) {
    fingerboard.set({
      model: gen(ev.target.value)
    })
  })
})

var colorScheme = 'default'

var selectorStyle = 'default'

var viewMods = {
  '#selector-color': function(val) {
    colorScheme = val
  },
  '#selector-style': function(val) {
    selectorStyle = val
  }
}

$.each(viewMods, function(select, update) {
  $(select).on('change', function(ev) {
    update(ev.target.value)

    var View = Fingerboard.View
    var args = (function() {
      if (selectorStyle === 'notation') return { withIndex: false }
      else return {}
    })()

    if (colorScheme === 'blue') {
      $.extend(args, { tonicColor: '#003D7A', elseColor: '#6399CE' })
    } else if (colorScheme === 'red') {
      $.extend(args, { tonicColor: '#5C1C26', elseColor: '#D68391' })
    } else if (colorScheme === 'green') {
      $.extend(args, { tonicColor: '#1C5C21', elseColor: '#6AAB6F' })
    }

    var curry = (function() {
      if (selectorStyle === 'default') return View.selectors.default
      else if (
        selectorStyle === 'notation' ||
        selectorStyle === 'notation-index'
      ) {
        return View.selectors.notationDots
      } else if (selectorStyle === 'degree') return View.selectors.degreeDots
    })()

    fingerboard.set({ view: { drawSelector: curry(args) } })
  })
})
