import { Ditto } from '@dittolive/ditto'

let ditto: Ditto

export default function get() {
  if (!ditto) {
    const identity = {
      type: 'onlinePlayground',
      appID: 'f0862187-a16f-42c3-848e-48e1bb2d216a',
      token: 'f93a278f-5c38-494d-96ec-71c7b0b8f5a8'
    }
    ditto = new Ditto(identity, '/ditto')
    ditto.startSync()
  }
  return ditto
}
