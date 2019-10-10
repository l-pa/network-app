import React from 'react';
import './App.css';
import Network from './Network'

function JsonParse(props) {
    return (
            <div className={"selector"}>
                <div className={"center dialog"}>

                    <h2>Select nodes, edges</h2>

                    <div className={"values"}>
                        <div>
                            <p>Nodes</p>
                            {
                                Object.keys(props.file).map((o, i, a) => {
                                    return <div>
                                        <input key={i} type={"checkbox"} onChange={(event) => {
                                        }} name={o} value={i} /> {o}
                                    </div>

                                })}

                        </div>
                        <div>
                            <p>Edges</p>
                        </div>
                    </div>
                <button onClick={() => {
                    props.showNetwork(true)
                }}>Save</button>
                </div>
            </div>
    )
}
export default JsonParse;