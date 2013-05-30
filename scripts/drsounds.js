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
	c.Album = function (data) {
		this.node = document.createElement('div');
		this.node.innerHTML = "<h1>" + data.name + "</h1>";
		this.name = data.name;
		this.table = document.createElement('table');
		this.node.appendChild(this.table);
		this.songs = [];
		for(var i = 0; i < data.songs.length; i++) {
			var song = new c.Song(data.songs[i]);
			this.songs.push(song);

		}
		this.render = function () {
			var tr = document.createElement('tr');
			for(var i = 0; i < this.songs.length; i++) {
				var song = this.songs[i];
				if((i % 5) == 0) {
					this.table.appendChild(tr);
				}
				var td = document.createElement('td');
				this.songs[i].render();
				td.appendChild(this.songs[i].node);
				tr.appendChild(td);
				console.log("AT", td);
			}
			this.table.appendChild(tr);
		}
		this.render();
	}
	c.Song = function (data) {
		this.sets = data.sets;
		this.name = data.name;
		this.groups = [];
		this.node = document.createElement('div');
		this.table = document.createElement('table');
		this.node.innerHTML = "<h1>" + this.name + "</h1>";
		this.node.appendChild(this.table);
		for(var i = 0; i < data.sets.length; i++) {
			var set = data.sets[i];
			var group = new c.Group(set.name, set.color, set.samples);
			this.groups.push(group);
		}
		this.render = function () {
			var tr = document.createElement('tr');
			for(var i = 0; i < this.groups.length; i++) {
				if((i % 4) == 0) {
					this.table.appendChild(tr);
					tr = document.createElement('tr');
				}
				var group = this.groups[i];

				group.render();
				var td = document.createElement('td');
				td.innerHTML ="<h2>" + group.name + "</h2>";
				td.appendChild(group.node);
			
				tr.appendChild(td);
			}
			this.table.appendChild(tr);
		};
		this.render();
	}
	/**
	 * Group of keys
	 * @param  {[type]} name  [description]
	 * @param  {[type]} color [description]
	 * @return {[type]}       [description]
	 */
	c.Group = function (name, color, keys) {
		this.name = name;
		this.color = color;
		this.keys = keys || [];
		this.node = document.createElement('table');
		this.render = function () {
			this.node.innerHTML = "";
			var tr = document.createElement("tr");
			for(var i = 0; i < this.keys.length; i++) {
				if((i % 4) == 0) {
					this.node.appendChild(tr);
					tr = document.createElement("tr");
				}
				var td = document.createElement('td');
				td.dataset['track'] = this.keys[i];
				console.log(td.dataset);
				td.addEventListener('click', function () {
					console.log("KEY", this.dataset['track']);
					console.log("TFWE", [bufferList[this.dataset['track']]]);
					c.enqueue([bufferList[this.dataset['track']]]);
				});
				td.style.background = this.color;
				td.innerHTML = this.keys[i];
				tr.appendChild(td);
			}
			
			this.node.appendChild(tr);
		}
		this.add = function (key) {
			this.node.innerHTML = "";
			this.render();
		}
		this.render();
	}
	c.groups = [];
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
		      'fantastic': 'audio/pads/fantasticpad.wav',
		      'oceanbungalow_piano': 'audio/melody/piano/oceanbungalow.wav',
		      'oceanbungalow_pad': 'audio/pads/oceanbungalow.wav',

		    },
	    	finishedLoading
	    );
	    //
	    var oceanlove = new Album({
			"name": "Ocean Love",
			"songs": [ {
				"name": "Ocean Love",
				"sets": [
					{
						"name":"Pads",
						"samples":["oceanlove_pad"]
					},
					{
						"name":"Piano",
						"samples":["piano1"]
					}
				]
			}]
		});
		oceanlove.render();
		document.querySelector('#keyboard').appendChild(oceanlove.node); 
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
		console.log("Next buffers", c.nextBuffers);
	}
	c.bassSounds = [];
	c.tempo = 70;
	c.eightNoteTime = (60 / c.tempo) / 2;
	c.bufferList = [];
	c.currentNote = 0;
	c.position = 0;
	c.finishedLoading = function (bufferList) {
		c.bufferList = bufferList;
		c.bassSounds = [bufferList["tabla"], bufferList["breakbeat"]];
		console.log(c.bassSounds);
		setInterval(function () {
			console.log(c.nextBuffers);
			console.log("Bass sounds", c.bassSounds);
			console.log("TA", position, (position % 4));
			if((position % 4) == 0) {
				console.log("T");
				console.log(c.nextBuffers);
				for (var i = 0; i < c.nextBuffers.length; i++) {
					c.playSound(c.nextBuffers[i], 0);
					
				}
				c.nextBuffers = [];
			}
			for (var i = 0; i < c.bassSounds.length; i++) {
				console.log("tt", c.bassSounds[i]);
				playSound(c.bassSounds[i], 0);
			}
			currentNote += eightNoteTime * 8;
			position += 1;
		}, eightNoteTime * 8 * 1000);
		
		/*for(var k in bufferList) {
			var td = document.createElement('td');
			td.dataset['track'] = k;
			td.addEventListener('click', function () {
				console.log([bufferList[this.dataset.track]]);
				c.enqueue([bufferList[this.dataset.track]]);
			});
			td.innerHTML = k;
			document.querySelector('#piano').appendChild(td);
		}*/
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



