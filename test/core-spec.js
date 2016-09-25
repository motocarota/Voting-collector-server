import { test } from 'tape'
import {
	is,
	fromJS
} from 'immutable'

import {
	next,
	vote,
	setEntries
} from '../src/core'

const state = fromJS( {} ),
	entries = [ 'Trainspotting', '28 Days Later', 'Sunshine' ]

test( 'core setEntries', ( t ) => {

	const message = "setEntries correctly sets the state",
		actual = setEntries( state, entries ),
		expected = fromJS( { entries } )

	t.ok( is( actual, expected ), message )
	t.end( )
} )

test( 'core next (base)', ( t ) => {

	const message = 'takes the next two entries under vote',
		actual = next( setEntries( state, entries ) ),
		expected = fromJS( {
			vote: {
				pair: [ 'Trainspotting', '28 Days Later' ]
			},
			entries: [ 'Sunshine' ]
		} )

	t.ok( is( actual, expected ), message )
	t.end( )
} )

test( 'core next (vittoria)', ( t ) => {

	const message = 'puts winner of current vote back to entries',
		currentState = fromJS( {
			vote: {
				pair: [ 'Trainspotting', '28 Days Later' ],
				tally: {
					'Trainspotting': 4,
					'28 Days Later': 2
				}
			},
			entries: [ 'Sunshine', 'Millions', '127 Hours' ]
		} ),
		actual = next( currentState ),
		expected = fromJS( {
			vote: {
				pair: [ 'Sunshine', 'Millions' ]
			},
			entries: [ '127 Hours', 'Trainspotting' ]
		} )

	t.ok( is( actual, expected ), message )
	t.end( )
} )

test( 'core next (pareggio)', ( t ) => {

	const message = 'puts both from tied vote back to entries',
		currentState = fromJS( {
			vote: {
				pair: [ 'Trainspotting', '28 Days Later' ],
				tally: {
					'Trainspotting': 3,
					'28 Days Later': 3
				}
			},
			entries: [ 'Sunshine', 'Millions', '127 Hours' ]
		} ),
		actual = next( currentState ),
		expected = fromJS( {
			vote: {
				pair: [ 'Sunshine', 'Millions' ]
			},
			entries: [ '127 Hours', 'Trainspotting', '28 Days Later' ]
		} )

	t.ok( is( actual, expected ), message )
	t.end( )
} )

test( 'core next (ultimo elemento)', ( t ) => {

	const message = 'marks winner when just one entry left',
		currentState = fromJS( {
			vote: {
				pair: [ 'Trainspotting', '28 Days Later' ],
				tally: {
					'Trainspotting': 4,
					'28 Days Later': 2
				}
			},
			entries: [ ]
		} ),
		actual = next( currentState ),
		expected = fromJS( {
			winner: 'Trainspotting'
		} )

	t.ok( is( actual, expected ), message )
	t.end( )
} )

test( 'core vote (1-0)', ( t ) => {

	const initialState = fromJS( {
			pair: [ 'Trainspotting', '28 Days Later' ]
		} ),
		message = 'creates a tally for the voted entry',
		actual = vote( initialState, 'Trainspotting' ),
		expected = fromJS( {
			pair: [ 'Trainspotting', '28 Days Later' ],
			tally: {
				'Trainspotting': 1
			}
		} )

	t.ok( is( actual, expected ), message )
	t.end( )
} )

test( 'core vote (1-1)', ( t ) => {

	const initialState = fromJS( {
			pair: [ 'Trainspotting', '28 Days Later' ],
			tally: {
				'Trainspotting': 1
			}
		} ),
		message = 'adds to existing tally for the voted entry',
		actual = vote( initialState, '28 Days Later' ),
		expected = fromJS( {
			pair: [ 'Trainspotting', '28 Days Later' ],
			tally: {
				'Trainspotting': 1,
				'28 Days Later': 1
			}
		} )

	t.ok( is( actual, expected ), message )
	t.end( )
} )

test( 'core vote (2-1)', ( t ) => {

	const initialState = fromJS( {
			pair: [ 'Trainspotting', '28 Days Later' ],
			tally: {
				'Trainspotting': 1,
				'28 Days Later': 1
			}
		} ),
		message = 'adds to existing tally for the voted entry',
		actual = vote( initialState, 'Trainspotting' ),
		expected = fromJS( {
			pair: [ 'Trainspotting', '28 Days Later' ],
			tally: {
				'Trainspotting': 2,
				'28 Days Later': 1
			}
		} )

	t.ok( is( actual, expected ), message )
	t.end( )
} )
