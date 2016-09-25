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

const state = fromJS({}),
    entries = ['Trainspotting', '28 Days Later', 'Sunshine']

test('setEntries', (t) => {

    const message = "setEntries correctly sets the state",
        actual = setEntries(state, entries),
        expected = fromJS({ entries })

    t.ok(is(actual, expected), message)
    t.end()
})

test('next (basic)', (t) => {

    let message = 'takes the next two entries under vote',
        actual = next(setEntries(state, entries)),
        expected = fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later']
            },
            entries: ['Sunshine']
        })

    t.ok(is(actual, expected), message)
    t.end()
})

test('next (win)', (t) => {

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

  t.ok( is( actual, expected ), message) 
  t.end()
})

test('next (pareggio)', (t) => {

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

  t.ok( is( actual, expected ), message) 
  t.end()
})

test('vote', (t) => {

	let currentState = next(setEntries(state, entries))

	currentState = vote(currentState, 'Trainspotting')

  let message = 'creates a tally for the voted entry',
    actual = currentState.toJS().tally,
    expected = {
        'Trainspotting': 1
    }

  t.deepEqual(actual, expected, message)

  currentState = vote(currentState, '28 Days Later') 
  message = 'adds to existing tally for the voted entry'
  actual = currentState.toJS().tally 
  expected = {
      'Trainspotting': 1,
      '28 Days Later': 1
  }

  t.deepEqual(actual, expected, message)

 	currentState = vote(currentState, 'Trainspotting')
  message = 'adds to existing tally for the voted entry'
  actual = currentState.toJS().tally
  expected = {
      'Trainspotting': 2,
      '28 Days Later': 1
  }

  t.deepEqual(actual, expected, message) 
  t.end()
})
