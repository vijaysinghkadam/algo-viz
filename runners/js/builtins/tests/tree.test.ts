import 'mocha'
import expect from 'expect'
import instantiateViz from '../src';

const Viz = instantiateViz()


describe('Tree', () => {
    it('Should create a tree with leaves', () => {
        const tree = Viz.Tree.create({ k: 'val' })
    })
})