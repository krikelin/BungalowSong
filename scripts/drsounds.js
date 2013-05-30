(function (c) {
	'use strict';
	c.context = null;
	/**
	 * @from http://chromium.googlecode.com/svn/trunk/samples/audio/doc/loading-sounds.html
	 * @param {[type]}   context  [description]
	 * @param {[type]}   urlList  [description]
	 * @param {Function} callback [description]
	 */
	function BufferLoader(context, urlList, callback) {
	    this.context = context;
	    this.urlList = urlList;
	    this.onload = callback;
	    this.bufferList = {};
	    this.loadCount = 0;
	}

	BufferLoader.prototype.loadBuffer = function(url, key, index) {
	    // Load buffer asynchronously
	    var request = new XMLHttpRequest();
	    request.open("GET", url, true);
	    request.responseType = "arraybuffer";

	    var loader = this;

	    request.onload = function() {
	        // Asynchronously decode the audio file data in request.response
	        loader.context.decodeAudioData(
	            request.response,
	            function(buffer) {
	                if (!buffer) {
	                    alert('error decoding file data: ' + url);
	                    return;
	                }

	                loader.bufferList[key] = buffer;
	                 console.log(loader.loadCount);
	                if (++loader.loadCount == Object.keys(loader.urlList).length) {
	                	 console.log("A");
	                    loader.onload(loader.bufferList);

	                }
	            }    
	        );
	    }

	    request.onerror = function() {
	        alert('BufferLoader: XHR error');        
	    }

	    request.send();
	}

	BufferLoader.prototype.load = function() {
		var i = 0;
		console.log(this.urlList.length);
	    for (var key in this.urlList) {

	        this.loadBuffer(this.urlList[key], key, i);
	        i++;
	    }
	}
	/**
	 * @module drsounds
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	window.addEventListener('load', function (e) {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		c.context = new AudioContext();
		console.log(c.context);
		var bufferLoader = new BufferLoader(
		    context,
		    {
		      'tabla': 'audio/beats/tabla.wav',
		      'breakbeat': 'audio/beats/breakbeat.wav',
		      'oceanlove_pad': 'audio/pads/oceanlove_1.wav',
		      'piano1': 'audio/melody/piano/oceanlove.wav',

		    },
	    	finishedLoading
	    );

	 	bufferLoader.load();
	});
	c.nextBuffers = [];

	/**
	 * Put a stuff on the next buffer
	 * @param  {[type]} buffers [description]
	 * @return {[type]}         [description]
	 */
	c.enqueue = function (buffers) {
		console.log("Buffers", buffers);
		for( var i = 0; i < buffers.length; i++) {
			c.nextBuffers.push(buffers[i]);
		}
	}
	c.bassSounds = [];
	c.tempo = 100;
	c.eightNoteTime = (60 / c.tempo) / 2;
	c.bufferList = [];
	c.currentNote = 0;
	c.finishedLoading = function (bufferList) {
		c.bufferList = bufferList;
		c.bassSounds = [bufferList["tabla"], bufferList["breakbeat"]];
		console.log(c.bassSounds);
		setInterval(function () {
			console.log(c.nextBuffers);
			console.log("Bass sounds", c.bassSounds);
			if((currentNote % eightNoteTime * 11.5 * 4) == 0) {
				if(c.nextBuffers)
				for (var i = 0; i < c.nextBuffers.length; i++) {
					c.playSound(c.nextBuffers[i], 0);
					c.nextBuffers = [];
				}
			}
			for (var i = 0; i < c.bassSounds.length; i++) {
				console.log("tt", c.bassSounds[i]);
				playSound(c.bassSounds[i], 0);
			}
			currentNote += eightNoteTime * 11.5;
		}, eightNoteTime * 11.5 * 1000);
		c.enqueue([bufferList["oceanlove_pad"]]);
	}
	/**
	 * Put a component to the play stack
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	c.put = function (name) {
		c.enque(bufferList[name]);
	}
	c.playSound = function (buffer, time) {
	  var source = context.createBufferSource();
	  source.buffer = buffer;
	  source.connect(context.destination);
	  source.start(time);
	}
	/**
	 * 
	 * Melody
	 * @constructor
	 * @return {[type]} [description]
	 */
	c.Melody = function () {
		/**
		 * Sound
		 * @param  {[type]} index [description]
		 * @return {[type]}       [description]
		 */
		this.sound = function (index) {

		};
	};
	c.BungalowMelody = function () {

	};
	c.BungalowMelody.prototype = new c.Melody;
	c.BungalowMelody.prototype.constructor = c.Melody;
	c.BungalowMelody.prototype.sound = function (index) {

	} 
	
})(this);



