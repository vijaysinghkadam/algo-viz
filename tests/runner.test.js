
const stepIterator = require('../stepIterator')

const funcs = require('./funcs')
class Circular {
    constructor() {
        this.value = this
        this.array = [this]
        this.object = { value: this }
        this.object.obj = this.object
        this.val = 0
        this.notCircular = { hello: true }
        this.arr = [1, 2, 3, this.notCircular]
        this.arrContainer = [this.arr]
    }
}
const print = (val) => {
    // console.log(val)
    return val
}
async function main(program) {



    const input = { _name: null, references: {} }
    const { code } = await babel.transformAsync(program, {
        plugins: [
            ['@babel/plugin-transform-destructuring', { loose: true }],
            ['@babel/plugin-transform-parameters', { loose: true }],
            'babel-plugin-transform-remove-console',
            [stepify(input), {
                disallow: {
                    async: true,
                    generator: true
                },
            }]
        ],
        parserOpts: {
            strictMode: true
        }
    })
    fs.writeFileSync('transpiled.js', code)
    const { _name } = input

    global[_name] = new (require('../runner'))(_name)

    eval(code)
    const { steps, objects, types } = global[_name]
    fs.writeFileSync('executed.json', JSON.stringify({
        steps,
        objects,
        types
    }))
    delete global[_name]
    return { steps, objects, types }
}

async function testRunner(func) {

    const { steps, objects, types } = await main(func)
    expect(Array.isArray(steps) && steps.length > 0).toBe(true)
    expect(typeof objects).toBe('object')
    expect(typeof types).toBe('object')
    const scopeStack = [null]
    const callStack = []
    const scopeChain = {}
    const identifiers = {}
    const funcScopes = {}
    const calls = {}
    stepIterator(steps, { scopeChain, scopeStack, callStack, identifiers, funcScopes, calls })


}
for (let func in funcs) {
    test('RUNNER ' + func, async () => {
        await testRunner(funcs[func])
    })
}