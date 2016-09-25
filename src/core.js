import {
	List,
	Map,
	fromJS
}
from 'immutable'

function getWinners( vote ) {

	if ( !vote ) {
		return []
	}
	const [ a, b ] = vote.get( 'pair' )
	const aVotes = vote.getIn( [ 'tally', a ], 0 )
	const bVotes = vote.getIn( [ 'tally', b ], 0 )
	if ( aVotes === bVotes ) {
		return [ a, b ]
	}
	return ( aVotes < bVotes ) ?
		 [ b ] : [ a ]
}

// ritorna lo stato iniziale

const INITIAL_STATE = Map()

// imposta le entry per il voto nello stato

const setEntries = ( state, entries ) =>
	state.set( 'entries', List( entries ) )

// crea una mappa "vote" sullo stato, spostandoci le prime due entry disponibili

const next = ( state ) => {

	const entries = state
		.get( 'entries' )
		.concat( getWinners( state.get( 'vote' ) ) )

	// se ho un solo concorrente ha vinto
	if ( entries.size === 1 ) {

		return state.remove( 'vote' ) 
			.remove( 'entries' )
			.set( 'winner', entries.first() )
	}

	return state.merge( fromJS({
		vote: {
			// prende le prime due entry dalla coda
			pair: entries.take( 2 )  
		},
		// lascia le rimanenti entry in coda
		entries: entries.skip( 2 ) 
	} ) )
}

// When a vote is ongoing, it should be possible for people to vote 
// on entries. When a new vote is cast for an entry, a "tally" for it 
// should appear in the vote. 
// If there already is a tally for the entry, it should be incremented:

const vote = ( voteState, entry ) => {

	return voteState.updateIn( 
		[ 'tally', entry ], 0, tally => tally + 1 
	)
}


export {
	INITIAL_STATE,
	setEntries,
	next,
	vote
}
