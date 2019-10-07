import { observable, action } from "mobx";
import { RootStore } from ".";

const SETTINGS_VERSION = 'settings'

export const structInfo: Viz.structSettings = {
    "Viz.BST": {
        order: {
            left: {
                pos: 1,
                isMultiple: false
            },
            right: {
                pos: 2,
                isMultiple: false
            }
        },
        main: 'value',
        numChildren: 2,
        pointers: {

        }
    },
    "Viz.DLL": {
        order: {
            next: {
                pos: 1,
                isMultiple: false
            },
        },
        main: 'value',
        numChildren: 1,
        pointers: {
            prev: false
        }
    },
    "Viz.SLL": {
        order: {
            next: {
                pos: 1,
                isMultiple: false
            },
        },
        main: 'value',
        numChildren: 1,
        pointers: {
        }
    },
    "Viz.BTree": {
        order: {
            left: {
                pos: 1,
                isMultiple: false
            },
            right: {
                pos: 2,
                isMultiple: false
            }
        },
        main: 'value',
        numChildren: 2,
        pointers: {

        }
    },
    "Viz.Queue": {
        order: {
            front: {
                pos: 1,
                isMultiple: false
            }
        },
        main: 'length',
        numChildren: 1,
        pointers: {
            end: false
        }
    },
    "Viz.Node": {
        order: {
            next: {
                pos: 1,
                isMultiple: false
            }
        },
        main: 'value',
        numChildren: 1,
        pointers: {
            prev: false
        }
    },
    "Viz.PQ": {
        order: {
            heap: {
                pos: 1,
                isMultiple: false
            }
        },
        main: 'display',
        numChildren: 1,
        pointers: {

        }
    },
    "Viz.Tree": {
        order: {
            leaf: {
                pos: 1,
                isMultiple: false
            },
            children: {
                pos: 2,
                isMultiple: true
            }
        },
        main: 'key',
        numChildren: null,
        pointers: {}
    },
    "Viz.Leaf": {
        order: {},
        main: 'value',
        numChildren: null,
        pointers: {}
    },
    "Viz.Trie": {
        order: {
            children: {
                pos: 1,
                isMultiple: true
            }
        },
        main: 'value',
        numChildren: null,
        pointers: {}
    }
}

const configColorDefaults: Viz.configColors = {
    'Primary Background': '#0b1423',
    'Secondary Background': '#4a4a4a',
    'Call Stack': '#ffa500',
    'Code': '#f5f5f5',
    'Code Highlight': '#98fb98',
    'Step Slider Track': '#a663cc',
    'Step Slider Rail': '#c2bbf0',
    'Step Slider Handle': '#0000ff',
    'Step Type': '#808080',
    'Text': '#f5f5f5',
    'Line Pointer': '#FFFFFF',
    'Arc Pointer': '#FFFFFF',
    'Line Pointer: GET': '#23D160',
    'Line Pointer: SET': '#A663CC',
    'Arc Pointer: GET': '#23D160',
    'Arc Pointer: SET': `#A663CC`
}
const valueColorDefaults: Viz.valueColors = {
    special: '#255e4f',
    number: '#4682b4',
    string: '#ffff00',
    boolean: '#00ff00',
    other: '#000000',
    func: '#ffffff',
    native: '#ff3860'
}

class Settings {
    valueColorDefaults: Viz.valueColors = valueColorDefaults
    @observable valueColors: Viz.valueColors = { ...valueColorDefaults }
    configColorDefaults: Viz.configColors = configColorDefaults
    @observable configColors: Viz.configColors = { ...configColorDefaults }
    @observable speeds = {
        DECLARATION: 5,
        ASSIGNMENT: 5,
        EXPRESSION: 5,
        CALL: 5,
        DELETE: 3,
        GET: 3,
        SET: 3,
        CLEAR: 3
    }
    @observable editing: boolean = false
    @observable structColors: Viz.structColors = {
        Array: '#FFFFFF',
        Object: '#FFFFFF',
        Map: '#4682B4',
        Set: '#FF69B4'
    }
    @observable structSettings: Viz.structSettings = {}
    @observable config: Viz.configSettings = {
        'Callstack': true,
        'Code Display': true,
        'Identifiers': true,
        'Objects': true,
        'Step View': true,
        'tooltips': false,
        'Active Pointer on GET': false,
        'Scroll Objects Into View': false,
        'Find Object Parents': true

    }
    @observable root: RootStore
    constructor(store: RootStore) {
        const settings = window.localStorage.getItem(SETTINGS_VERSION)
        if (settings) {
            const all: Viz.AllSettings = JSON.parse(settings)
            // syncObjects(this, all)
            this.valueColors = { ...this.valueColors, ...all.valueColors };
            this.configColors = { ...this.configColors, ...all.configColors };
            this.speeds = { ...this.speeds, ...all.speeds }
            this.structColors = { ...this.structColors, ...all.structColors }
            this.structSettings = all.structSettings;
            this.config = { ...this.config, ...all.config }
        }
        this.structSettings['Array'] = {
            order: {},
            main: 'value',
            numChildren: null,
            pointers: {}
        }
        this.structSettings['Object'] = {
            order: {},
            main: 'value',
            numChildren: null,
            pointers: {}
        }
        this.structSettings['Map'] = {
            order: {},
            main: 'value',
            numChildren: null,
            pointers: {}
        }
        this.structSettings['Set'] = {
            order: {},
            main: 'value',
            numChildren: null,
            pointers: {}
        }

        for (const name in structInfo) {
            this.structSettings[name] = {
                ...structInfo[name],
                pointers: {
                    ...(this.structSettings[name] || { pointers: {} }).pointers,
                    ...structInfo[name].pointers
                }
            }


            if (!this.structColors[name]) {
                this.setColor(name)
            }
        }

        this.root = store
        window.onbeforeunload = () => {
            delete this.root
            window.localStorage.setItem(SETTINGS_VERSION, JSON.stringify(this))
        }
    }

    @action startEdit() {
        this.editing = true
        if (this.root.iterator) {
            this.root.iterator.pause()
        }
    }
    @action stopEdit() {
        this.editing = false
    }
    @action changeSpeed(type: string, val: number) {
        if (type in this.speeds) {
            if (val >= 0) {
                this.speeds[type as Viz.configurable] = val
            }
        }
    }
    @action addStruct(structType: string) {
        const restricted = ['Object', 'Array', 'Map', 'Set']
        if (!(structType in this.structColors)) {
            this.setColor(structType)
        }
        if (restricted.includes(structType)) return

        if (!(structType in this.structSettings)) {
            this.structSettings[structType] = {
                order: {},
                main: 'value',
                numChildren: null,
                pointers: {}
            }
        }

    }
    @action setColor(structType: string, color?: string) {
        if (!color) {
            const newColor = (Math.floor(Math.random() * (16777215))).toString(16).padStart(6, '0');
            color = '#' + newColor

        }
        this.structColors[structType] = color
    }
    @action deleteStruct(structType: string) {
        delete this.structColors[structType]
        delete this.structSettings[structType]
    }
}

export default Settings
