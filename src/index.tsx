import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import DatumBar from './DatumBar'
import * as serviceWorker from './serviceWorker'

/*const initDatum: Datum = {
	id: '0',
	time: Date.now(),
	tags: [{ name: 'ayy' }, { name: 'bleh', value: 'blah' }],
}*/

ReactDOM.render(
	<DatumBar />,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
