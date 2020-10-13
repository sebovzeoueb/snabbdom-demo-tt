import { init } from 'snabbdom/init'
import { classModule } from 'snabbdom/modules/class'
import { propsModule } from 'snabbdom/modules/props'
import { styleModule } from 'snabbdom/modules/style'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'
import { attributesModule } from 'snabbdom/modules/attributes'
import { h } from 'snabbdom/h'

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  attributesModule
])

const buttonValues = [4, 20, 55]

let state = {
  counter: 0,
  pressedKeys: []
}

let vnode = document.body

const view = (state, send) => h('body', 
  [
    h('h1', 'Snabbdom Demo'),
    h('div#buttons', [
      h('div.button', {on: {click: e => send({type: 'increment'})}}, 'Increment'),
      h('div.button', {on: {click: e => send({type: 'decrement'})}}, 'Decrement'),
      ...buttonValues.map(v => h('div.button', {on: {click: e => send({type: 'set', value: v})}}, `Set to ${v}`))
    ]),
    h('div#readouts', [
      h('div.readout', state.counter),
      state.pressedKeys.length ? h('div.readout', `You are pressing ${state.pressedKeys.join(', ')}`) : undefined
    ])
  ]
)

const effect = (state, action, send) => {
  if (action.type == 'init') {
    window.onkeydown = e => send({type: 'keydown', key: e.key, repeat: e.repeat})
    window.onkeyup = e => send({type: 'keyup', key: e.key})
    window.onblur = e => send({type: 'blur'})
  }
  if (action.type == 'keydown') {
    if (action.key == '+') send({type: 'increment'})
    if (action.key == '-') send({type: 'decrement'})
  }
}

const update = (state, action) => {
  if (action.type == 'increment') state.counter++
  if (action.type == 'decrement') state.counter--
  if (action.type == 'set') state.counter = action.value
  if (action.type == 'keydown') { 
    if (!action.repeat) state.pressedKeys.push(action.key)
  }
  if (action.type == 'keyup') state.pressedKeys.splice(state.pressedKeys.indexOf(action.key), 1)
  if (action.type == 'blur') state.pressedKeys = []
  return state
}

const send = action => {
  state = update(state, action)
  vnode = patch(vnode, view(state, send))
  effect(state, action, send) 
}

send({type: 'init'})