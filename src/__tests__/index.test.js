import { describe, it, assert } from 'vitest'
import { decycle, retrocycle, extend } from '../index'

describe('json-decycle', () => {
  it('should pass', () => {
    const cycled = {
      foo: {},
      bar: {}
    }

    cycled.foo.bar = cycled.bar
    cycled.bar.foo = cycled.foo

    assert(cycled.foo.bar === cycled.bar)
    assert(cycled.bar.foo === cycled.foo)

    let result = JSON.stringify(cycled, decycle())

    assert.equal(result, '{"foo":{"bar":{"foo":{"$ref":"#/foo"}}},"bar":{"$ref":"#/foo/bar"}}')

    result = JSON.parse(result, retrocycle())

    assert(result.foo.bar === result.bar)
    assert(result.bar.foo === result.foo)
  })

  it('should pass too', () => {
    const obj1 = {}
    const obj2 = { b: obj1 }
    obj1.a = obj2
    obj2.c = obj1.a
    obj2.d = obj1.a

    assert(obj1 === obj2.b)
    assert(obj1 === obj1.a.b)
    assert(obj1.a === obj1.a.c)
    assert(obj1.a === obj1.a.d)

    let result2 = JSON.stringify(obj1, decycle())

    assert.equal(result2, '{"a":{"b":{"$ref":"#"},"c":{"$ref":"#/a"},"d":{"$ref":"#/a"}}}')

    result2 = JSON.parse(result2, retrocycle())

    assert(result2 === result2.a.b)
    assert(result2.a === result2.a.c)
    assert(result2.a === result2.a.d)
  })

  it('should pass 3', () => {
    const cycled2 = {
      foo: {},
      bar: {}
    }

    cycled2.foo.bar = cycled2.foo
    cycled2.bar.foo = cycled2.bar

    assert(cycled2.foo.bar === cycled2.foo)
    assert(cycled2.bar.foo === cycled2.bar)

    let result3 = JSON.stringify(cycled2, decycle())

    assert.equal(result3, '{"foo":{"bar":{"$ref":"#/foo"}},"bar":{"foo":{"$ref":"#/bar"}}}')

    result3 = JSON.parse(result3, retrocycle())

    assert(result3.foo.bar === result3.foo)
    assert(result3.bar.foo === result3.bar)
  })

  it('should pass 3', () => {
    // console.log('Now begin extra test for issue #1')
    // extra test for issue #1
    // https://github.com/YChebotaev/json-decycle/issues/1
    const infos = {
      tasks:
        [{
          type: 'task',
          description: 'Finish inbox',
          createdOn: '2017-11-07T22:02:19.696Z'
        },
        {
          type: 'task',
          description: 'Make sure it works',
          createdOn: '2017-11-07T22:02:36.775Z'
        }],
      notes:
        [{
          type: 'note',
          content: 'This is a note',
          createdOn: '2017-11-07T22:02:27.631Z'
        },
        {
          type: 'note',
          content: 'It\'s working, I think.',
          createdOn: '2017-11-07T22:02:44.442Z'
        }],
      inbox:
        [],
    }

    infos.inbox[0] = infos.tasks[0]
    infos.inbox[1] = infos.tasks[0]
    infos.inbox[2] = infos.tasks[1]
    infos.inbox[3] = infos.tasks[1]

    assert(infos.inbox[0] === infos.tasks[0])
    assert(infos.inbox[1] === infos.tasks[0])
    assert(infos.inbox[2] === infos.tasks[1])
    assert(infos.inbox[3] === infos.tasks[1])

    let result4 = JSON.stringify(infos, decycle())

    assert.equal(result4, '{"tasks":[{"type":"task","description":"Finish inbox","createdOn":"2017-11-07T22:02:19.696Z"},{"type":"task","description":"Make sure it works","createdOn":"2017-11-07T22:02:36.775Z"}],"notes":[{"type":"note","content":"This is a note","createdOn":"2017-11-07T22:02:27.631Z"},{"type":"note","content":"It\'s working, I think.","createdOn":"2017-11-07T22:02:44.442Z"}],"inbox":[{"$ref":"#/tasks/0"},{"$ref":"#/tasks/0"},{"$ref":"#/tasks/1"},{"$ref":"#/tasks/1"}]}')

    result4 = JSON.parse(result4, retrocycle())

    assert(result4.inbox[0] === result4.tasks[0])
    assert(result4.inbox[1] === result4.tasks[0])
    assert(result4.inbox[2] === result4.tasks[1])
    assert(result4.inbox[3] === result4.tasks[1])
  })

  it('should pass 4', () => {
    const JSONMock = {
      parse: JSON.parse,
      stringify: JSON.stringify
    }
    extend(JSONMock)

    assert(typeof JSONMock.decycle === 'function')
    assert(typeof JSONMock.retrocycle === 'function')

    assert(JSONMock.decycle({}) === '{}')
    assert(JSON.stringify(JSONMock.retrocycle('{}')) === JSON.stringify({}))
  })
})
