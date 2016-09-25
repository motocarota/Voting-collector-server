import Server from 'socket.io'

export default function startServer( store ) {

	const io = new Server( ).attach( 8090 )

	//We are now publishing the whole state to everyone whenever any changes occur. 
	//This may end up causing a lot of data transfer. 
	store.subscribe(
		( ) => io.emit( 'state', store.getState( ).toJS( ) )
	)

	io.on( 'connection', socket => {
		//Sending the whole state when the user connects to the appllication 
		socket.emit( 'state', store.getState( ).toJS( ) )

		//Our clients emit 'action' events that we feed directly into our Redux store
		socket.on( 'action', store.dispatch.bind( store ) )
	} )
}
