goog.provide('jchemhub.view.Command');


/**
 * Commands that the editor can execute via execCommand or queryCommandValue.
 * @enum {string}
 */
jchemhub.view.Command = {
		  // Prepend all the strings of built in execCommands with a plus to ensure
		  // that there's no conflict if a client wants to use the
		  // browser's execCommand.
		  UNDO: '+undo',
		  REDO: '+redo'
		};
