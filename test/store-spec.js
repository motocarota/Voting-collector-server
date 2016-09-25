import { is, fromJS } from 'immutable'
import { test } from 'tape'
import makeStore from '../src/store'

const store = makeStore( )

test( 'store empty', ( t ) => {

	const message = 'is a Redux store configured with the correct reducer',
		expected = fromJS( {} ),
		actual = store.getState( )

	t.ok( is( actual, expected ), message )
	t.end( )
} )

test( 'store set entries', ( t ) => {

	store.dispatch( {
		type: 'SET_ENTRIES',
		entries: [ 'Trainspotting', '28 Days Later' ]
	} )

	const message = 'is a Redux store configured with the correct reducer',
		expected = fromJS( {
			entries: [ 'Trainspotting', '28 Days Later' ]
		} ),
		actual = store.getState( )

	t.ok( is( actual, expected ), message )
	t.end( )
} )
