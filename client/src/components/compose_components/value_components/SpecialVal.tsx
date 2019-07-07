import React from 'react';
import store from '../../../store';

type Props = {
    value: 'null' | 'undefined' | '<empty>' | 'NaN' | 'Infinity'
}

export const SpecialVal: React.FC<Props> = ({ value }) => {
    return (
        <span style={{ color: store.settings.valueColors.special }}><span>{value}</span></span>
    )
}
