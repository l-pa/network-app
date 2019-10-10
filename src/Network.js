import React from 'react'
import { Sigma, RandomizeNodePositions, RelativeSize } from 'react-sigma';

function Network(props) {
    console.log(props);
    return (
        <div>
            <Sigma style={{ height: '90vh' }} graph={props.network} settings={{ drawEdges: true, clone: false }}>
                <RelativeSize initialSize={15} />
                <RandomizeNodePositions />
            </Sigma>
        </div>
    )
}

export default Network