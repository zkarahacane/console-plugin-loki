import { type Plugin } from '@cpn-console/hooks'
import infos from './infos.js'

export const plugin: Plugin = {
  infos,
  subscribedHooks: {},
}
