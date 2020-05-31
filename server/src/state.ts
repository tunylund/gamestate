import { ID } from "./transport"
import { ACTIONS } from "./actions"
import deepDiff from 'deep-diff'
import rfdc from 'rfdc'
import { broadcast, send } from "./clients"

const deepClone = rfdc()

let current = {}
let clone = deepClone(current)

export function state<T>(): T {
  return clone as T
}

export function init<T>(state: T) {
  current = deepClone(state)
  clone = deepClone(current)
  broadcast(ACTIONS.STATE_INIT, current)
}

export function initState(id: ID) {
  send(id, ACTIONS.STATE_INIT, state())
}

function compressKeys(diff: any): any {
  const result: any = { k: diff.kind }
  if (diff.hasOwnProperty('path')) result.p = diff.path
  if (diff.hasOwnProperty('lhs')) result.l = diff.lhs
  if (diff.hasOwnProperty('rhs')) result.r = diff.rhs
  if (diff.hasOwnProperty('index')) result.x = diff.index
  if (diff.hasOwnProperty('item')) result.i = diff.item
  return result
}

export function update<T>(state: T) {
  const diffs = deepDiff.diff(current, state)
  if (diffs && diffs.length > 0) {
    diffs.map(d => deepDiff.applyChange(current, state, d))
    broadcast(ACTIONS.STATE_UPDATE, diffs.map(compressKeys))
    clone = deepClone(current)
  }
}
