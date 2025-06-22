import {test} from '@jest/globals'
import {AaMutex} from './mutex.ts'


test('mutex', async () => {
    const tx = new AaMutex('test')
    //tx.debug = true

    tx.waitLock().then(() => {
        expect(tx.isLocked()).toBe(true)
    }).catch((err) => {
        console.error(err)
    }).finally(() => {
        expect(tx.isLocked()).toBe(true)
        tx.unlock()
        expect(tx.isLocked()).toBe(false)
    })
})
