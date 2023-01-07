const actions = new Map<string, Map<Action, Set<Function>>>()
const emptySet = new Set<any>()

export type Action = string
export enum ACTIONS {
  OPEN = 'open',
  CLOSE = 'close',
  ERROR = 'error',
  PING = 'ping',
  STATE_INIT = 'state-init',
  STATE_UPDATE = 'state-update',
  CLIENT_UPDATE = 'client-update'
}

export function act(id: string, action: Action, ...attrs: any[]) {
  for (let fn of actions.get(id)?.get(action) || emptySet) {
    try {
      fn(...attrs)
    } catch (err) {
      console.error(id, err)
    }
  }
}

export function on(id: string, action: Action, fn: Function) {
  const accs = actions.get(id) || new Map<Action, Set<Function>>()
  const fns = accs.get(action) || new Set()
  actions.set(id, accs)
  accs.set(action, fns)
  fns.add(fn)
}

export function off(id: string, action?: Action, fn?: Function) {
  if (action && fn) actions.get(id)?.get(action)?.delete(fn)
  else if (action) actions.get(id)?.delete(action)
  else actions.delete(id)
}
