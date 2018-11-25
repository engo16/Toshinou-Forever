class Minimap {
	constructor(a) {
	  this._api = a;
	}
  
	createWindow() {
	  this.minimap = WindowFactory.createWindow({
		width: 320,
		text: chrome.i18n.getMessage("minimap")
	  });
  
	  this.canvas = jQuery("<canvas/>", {
		width: 300,
		height: 150
	  });
  
	  this.ctx = this.canvas.get(0).getContext("2d");
		this.canvas.appendTo(this.minimap);
		if (window.settings.showCoordinates){
			this.ctx.beginPath();
			this.ctx.moveTo(window.hero.position.x,window.hero.position.y);
			this.ctx.lineTo(150,75);
			this.ctx.stroke();
		}

	  var self = this;
	  this.canvas.click(function (e) {
			  var pos = self.minimap.position();
			  var x = (e.clientX - pos.left) * (window.b1) - window.b3;
			  var y = (e.clientY - pos.top) * (window.b2) - window.b3;
			  api.move(x, y);
		  });
	}
  
	draw() {
  
	  var ct = this.ctx;
	  ct.font = "10px Arial";
  
	  ct.clearRect(0, 0, this.canvas.width() + 2, this.canvas.height() + 2);
  
	  ct.strokeStyle = "gray";
	  ct.lineWidth = 1;
	  ct.rect(1, 1, this.canvas.width() - 2, this.canvas.height() - 2);
		ct.stroke();
		if (window.settings.minimapefso){
			ct.fillStyle = "gray";
			ct.strokeRect((window.hero.position.x / window.b1)-20, (window.hero.position.y / window.b2)-20, 40, 40);
		}


  
	  ct.fillStyle = 'green';
	  this._fillCircle(ct, window.hero.position.x / window.b1, window.hero.position.y / window.b2, 2);
  
	  for (var property in this._api.boxes) {
		var box = this._api.boxes[property];
  
		if (box == null || box.isResource())
		  continue;

  
		ct.fillStyle = BoxType.getColor(box.type);
		this._fillCircle(ct, box.position.x / window.b1, box.position.y / window.b2, 1.3);
		if (window.settings.showenemy){
			ct.fillText(box.type, box.position.x / window.b1 + 1, box.position.y / window.b2 + 13);
		}
		
	  }
	  if(api.targetBoxHash!=null&&window.settings.minimapefso){
				this.ctx.beginPath();
				let box = api.findNearestBox();
				var boxx = this._api.boxes[property];
					this.ctx.moveTo((window.hero.position.x/ window.b1),window.hero.position.y/window.b2);
					this.ctx.lineTo(box.box.position.x/window.b1,box.box.position.y/window.b2);
					this.ctx.strokeStyle = BoxType.getColor(boxx.type);
					this.ctx.stroke();
			}
  
	  for (var property in this._api.ships) {
		var ship = this._api.ships[property];
  
		if (ship == null)
		  continue;

  
		ship.update();
		var pos = ship.position;
		
		if (!ship.isNpc && ship.isEnemy && window.settings.minimapefso){
			this.ctx.beginPath();
			this.ctx.moveTo((window.hero.position.x/ window.b1),window.hero.position.y/window.b2);
			this.ctx.lineTo(ship.position.x/window.b1,ship.position.y/window.b2);
			this.ctx.strokeStyle = '#ff0000';
			this.ctx.stroke();

		} else if (ship.isNpc && window.settings.minimapefso) {
			
			if(api.targetShip!=null){
				if(api.attacking==true){
					//console.log(api.targetShip);
					api.lockedShip.id = api.targetShip.id;
					this.ctx.lineTo(api.targetShip.position.x/window.b1,api.targetShip.position.y/window.b2);
				}
			}
			if(api.lockedShip == api.targetShip){
				if(api.attacking==true){
					this.ctx.beginPath();
					this.ctx.moveTo((window.hero.position.x/ window.b1),window.hero.position.y/window.b2);
					this.ctx.lineTo(api.targetShip.position.x/window.b1,api.targetShip.position.y/window.b2);
					this.ctx.strokeStyle = '#EFFBFB';
					this.ctx.stroke();
					this._strokeCircle(ct, api.targetShip.position.x / window.b1, api.targetShip.position.y/ window.b2,500/window.b1 );
				}
				
			}else{
				this.ctx.beginPath();
				this.ctx.moveTo((window.hero.position.x/ window.b1),window.hero.position.y/window.b2);
				//this.ctx.lineTo(ship.position.x/window.b1,ship.position.y/window.b2);
				this.ctx.strokeStyle = '#bdff00';
				this.ctx.stroke();
				this._strokeCircle(ct, ship.position.x / window.b1, ship.position.y/ window.b2,500/window.b1 );
			}
			
			
			

		}
		  
		
		if (ship.isNpc) {
		  ct.fillStyle = "rgb(255, 0, 245)";
		} else if (ship.isEnemy) {
		  ct.fillStyle = "rgb(255, 0, 0)";
		  if (ship.cloaked) {
			ct.fillText(ship.name + " | Cloaked", pos.x / window.b1 + 1, pos.y / window.b2 + 13);
		  } else {
			ct.fillText(ship.name, pos.x / window.b1 + 1, pos.y / window.b2 + 13);
		  }
		} else {
		  ct.fillStyle = "rgb(0, 125, 255)";
		  ct.fillText(ship.name, pos.x / window.b1 + 1, pos.y / window.b2 + 13);
		}
  
		this._fillCircle(ct, pos.x / window.b1, pos.y / window.b2, 2);
	  }
  
	  if (this._api.battlestation) {
		let bs = this._api.battlestation;
  
		if (bs.isEnemy && bs.factionId != 0) {
		  ct.fillStyle = "rgb(255, 0, 0)";
		} else if (bs.factionId == 0) {
		  ct.fillStyle = "rgb(76, 76, 76)";
		} else {
		  ct.fillStyle = "rgb(0, 255, 0)";
		}
  
		this._fillCircle(ct, (bs.position.x) / window.b1, bs.position.y / window.b2, 3);
  
		if (bs.clanTag != "") {
		  ct.fillText("[" + bs.clanTag + "] " + bs.name, bs.position.x / window.b1 - 30, bs.position.y / window.b2 - 8);
		} else {
		  ct.fillStyle = "white";
		  ct.fillText(bs.name, bs.position.x / window.b1 - 20, bs.position.y / window.b2 - 5);
		}
  
		for (let prop in this._api.battlestation.modules) {
		  let mod = this._api.battlestation.modules[prop];
		  this._fillCircle(ct, (mod.position.x) / window.b1, mod.position.y / window.b2, 2);
		}
	  }
  
	  ct.strokeStyle = 'white';
	  ct.fillStyle = 'yellow';
	  ct.lineWidth = 1;
	  this._api.gates.forEach(gate => {
	  var pos = gate.position;
		var gatefactionId = gate.gatefactionId;
		var gateType = gate.gateType;
		var gateId = gate.gateId;
		this._strokeCircle(ct, pos.x / window.b1, pos.y / window.b2, 4);
		this._strokeCircle(ct, pos.x / window.b1, pos.y / window.b2,0.4 );
		if (window.settings.showNearestPortal){
			ct.fillText(gatefactionId, pos.x / window.b1 + -20, pos.y / window.b2 + 13);
			ct.fillText(gateType, pos.x / window.b1 + -20, pos.y / window.b2 + 20);
			ct.fillText(gateId, pos.x / window.b1 + -20, pos.y / window.b2 + 27);
		}
		
	  });
	  if (window.settings.showCoordinates) {
	  	if(window.bigMap){
	  		ct.fillStyle = 'white';
	  		ct.fillText(("X:"+window.hero.position.x + " " +"Y:"+ window.hero.position.y),200 / window.b1 + 1,1600/ window.b2 + 1);
	  	}else{
	  		ct.fillStyle = 'white';
	  		ct.fillText(("X:"+window.hero.position.x + " " +"Y:"+ window.hero.position.y),200 / window.b1 + 1,1000/ window.b2 + 1);
	  	}
	}
	  if (window.settings.showMapID) {
	  	if(window.bigMap){
			ct.fillStyle = 'white';
			ct.fillText("Map Id: "+(window.hero.mapId),15000 / window.b1 + 1,1600/ window.b2 + 1);
	  	}else {
	  		ct.fillStyle = 'white';
			ct.fillText("Map Id: "+(window.hero.mapId),17000 / window.b1 + 1,1000/ window.b2 + 1);
	  	}
	}
	}
  
	_fillCircle(ctx, x, y, r) {
	  this._drawCircle(ctx, x, y, r);
	  ctx.fill();
	}
  
	_strokeCircle(ctx, x, y, r) {
	  this._drawCircle(ctx, x, y, r);
	  ctx.stroke();
	}
  
	_drawCircle(ctx, x, y, r) {
	  ctx.beginPath();
	  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	}
  }