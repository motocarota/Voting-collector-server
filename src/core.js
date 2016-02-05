import {
	List, Map
}
from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries( state, entries ) {

	return state.set( 'entries', List( entries ) ); //imposta lo stato, rendendolo immutabile
}

export function next( state ) {

	const entries = state.get( 'entries' )
		.concat( getWinners( state.get( 'vote' ) ) );

	if ( entries.size === 1 ) {
		return state.remove( 'vote' ) // se ho un solo concorrente
			.remove( 'entries' )
			.set( 'winner', entries.first( ) ); // ha vinto lui 
	} else {
		return state.merge( {
			vote: Map( {
				pair: entries.take( 2 )
			} ), //prende le prime due entry dalla coda
			entries: entries.skip( 2 ) //lascia le rimanenti entry in coda
		} )
	};
}

export function vote( voteState, entry ) {

	return voteState.updateIn( //aggiorna nel path..
		[ 'tally', entry ], //state.vote.tally.Trainspotting
		0, //se il path non esiste crea e imposta a 0
		tally => tally + 1 //aggiungi 1 al valore
	);
}

function getWinners( vote ) {
	if ( !vote ) return [ ];
	const [ a, b ] = vote.get( 'pair' );
	const aVotes = vote.getIn( [ 'tally', a ], 0 );
	const bVotes = vote.getIn( [ 'tally', b ], 0 );
	if ( aVotes > bVotes ) return [ a ];
	else if ( aVotes < bVotes ) return [ b ];
	else return [ a, b ];
}
