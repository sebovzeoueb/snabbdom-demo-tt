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

let state = {

}

let vnode = document.body

const view = (state, send) => h('body', [
  h('h1', 'Snabbdom Demo')
])

const effect = (state, action, send) => {

}

const update = (state, action) => {
  return state
}

const send = action => {
  state = update(state, action)
  vnode = patch(vnode, view(state, send))
  effect(state,action,send) 
}

send({type: 'init'})