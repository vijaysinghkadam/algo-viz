import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ArrayVal from './ArrayVal';
import { observer } from 'mobx-react';
import store from '../../store';
import genId from '../../utils/genId';

type Props = {
    structure: Viz.Structure,
    objectId: string,
    ratio: number,
    pointed: boolean
}


const iterate = (len: number, display: 'column' | 'row', ratio: number, valSize: number, objectId: string, structure: Viz.Structure) => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(
            <ArrayVal display={display}
                ratio={ratio} size={valSize}
                key={i} index={i} objectId={objectId} array={structure} />
        )
    }
    return arr
}

const ArrayStruct: React.FC<Props> = observer(({ structure, objectId, ratio, pointed }) => {
    const [node, setNode] = useState(null)
    const ref = useCallback((node) => {
        if (node) {
            setNode(node)
        }
    }, [])
    const renderId = useMemo(() => genId(objectId.length), [objectId])

    useEffect(() => {
        if (node) {
            store.structs.setPosition(objectId, node, renderId)
        }
    })
    const maxWidth = store.windowWidth * .5 * store.widths.array
    const len = structure['length'].value

    const valSize = Math.max(Math.min(maxWidth / (len * 2), 30) * ratio, .001)
    const display = store.structs.children[objectId].size > 0 ? 'column' : 'row'
    if (display === 'column' && store.widths.array === 1) {
        ratio *= Math.min(1, 8 / len)
    }

    const arr: React.ReactNode[] = useMemo(
        () => iterate(len, display, ratio, valSize, objectId, structure),
        [len, display, ratio, valSize, objectId, structure]
    )
    const size = Math.max(Math.round(ratio * 5), 3)
    const color = store.settings.structColors['Array']
    const active = pointed || store.structs.activePointers[objectId];
    const bkgExtend = active ? '600px' : '20px'
    const styles: React.CSSProperties = {
        margin: `${size}px`,
        padding: `${size}px`,
        flexDirection: display as 'row' | 'column',
        backgroundImage: `linear-gradient(${color}, ${color}),
        linear-gradient(${color}, ${color}),
        linear-gradient(${color}, ${color}),
        linear-gradient(${color}, ${color})`,
        backgroundSize: `4px ${bkgExtend}, ${bkgExtend} 4px, 4px ${bkgExtend}, ${bkgExtend} 4px`
    }


    if (display === 'row') {
        styles.height = valSize * 1.5 + 5
    } else {
        styles.maxHeight = '100%'
        styles.overflowY = 'scroll'
    }
    return (
        <div className={`array-struct`} ref={ref} style={styles}>
            {arr}
        </div>
    );
})

export default ArrayStruct;
