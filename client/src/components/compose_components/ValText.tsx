import React from 'react';
import store from '../../store';
import Pointer from './Pointer';

type Props = {
    value: any,
    type: Viz.valType,
    textOnly?: boolean,
    size?: number
}

const ValText: React.FC<Props> = ({ value, type, textOnly = false, size = 30 }) => {
    let color;
    if (type === 'null') return null
    if (type === 'object') {
        const objType = store.viz.types[value]
        color = store.settings.structColors[objType]
        if (!textOnly) {
            return <Pointer size={size} id={value} active={false} />
        } else {
            value = objType
        }
    } else {
        color = store.settings.valueColors[type]
    }

    if (type === 'func' || type === 'native') {
        value = store.viz.types[value]
    }
    return <span style={{ color }}>{value}</span>

}

export default ValText

