import { test } from 'tape'
import {
  is,
  fromJS,
  INITIAL_STATE
} from 'immutable'
import reducer from '../src/reducer'

test( 'reducer SET_ENTRIES', ( t ) => {

  const action = {
      type: 'SET_ENTRIES',
      entries: [ 'Trainspotting' ]
    },
    currentState = INITIAL_STATE

  const message = 'handles SET_ENTRIES action',
    actual = reducer( currentState, action ),
    expected = fromJS( {
      entries: [ 'Trainspotting' ]
    } )

  t.ok( is( actual, expected ), message )
  t.end( )
} )


test( 'reducer NEXT', ( t ) => {

  const action = {
      type: 'NEXT'
    },
    currentState = fromJS( {
      entries: [ 'Trainspotting', '28 Days Later', 'Sunshine' ]
    } )

  const message = 'handles NEXT action',
    actual = reducer( currentState, action ),
    expected = fromJS( {
      vote: {
        pair: [ 'Trainspotting', '28 Days Later' ]
      },
      entries: [ 'Sunshine' ]
    } )

  t.ok( is( actual, expected ), message )
  t.end( )
} )


test( 'reducer VOTE', ( t ) => {

  const action = {
      type: 'VOTE',
      entry: 'Trainspotting'
    },
    currentState = fromJS( {
      entries: [ ],
      vote: {
        pair: [ 'Trainspotting', '28 Days Later' ],
        tally: {
          'Trainspotting': 1
        }
      }
    } )

  const message = 'handles VOTE action',
    actual = reducer( currentState, action ),
    expected = fromJS( {
      entries: [ ],
      vote: {
        pair: [ 'Trainspotting', '28 Days Later' ],
        tally: {
          'Trainspotting': 2
        }
      }
    } )

  t.ok( is( actual, expected ), message )
  t.end( )
} )

test( 'reducer with no state', ( t ) => {

  const message = 'with undefined state it should return the initial state',
    action = { type: 'SET_ENTRIES', entries: [ 'Sunshine' ] },
    actual = reducer( undefined, action ),
    expected = fromJS( { entries: [ 'Sunshine' ] } )

  t.ok( is( actual, expected ), message )
  t.end( )
} )

test( 'reduce actions in series', ( t ) => {

  const message = 'actions can be applied in series',
    actions = [
      { type: 'SET_ENTRIES', entries: [ 'Trainspotting', '28 Days Later' ] },
      { type: 'NEXT' },
      { type: 'VOTE', entry: 'Trainspotting' },
      { type: 'VOTE', entry: '28 Days Later' },
      { type: 'VOTE', entry: 'Trainspotting' },
      { type: 'NEXT' }
    ],
    actual = actions.reduce( reducer, INITIAL_STATE ),
    expected = fromJS( {
      winner: 'Trainspotting'
    } )

  t.ok( is( actual, expected ), message )
  t.end( )
} )
