class Api {
	constructor() {
		this._blackListedBoxes = [];
		this.gates = [];
		this.boxes = {};
		this.ships = {};
		this.battlestation = null;
		this.lastMovement = 0;
		this.isDisconnected = false;
		this.disconnectTime = null;
		this.reconnectTime = null;
		this.jumpTime = $.now();
		this.resetBlackListTime = $.now();
		this.blackListTimeOut = 150000
		this.rute = null;
		this.starSystem = [];
		this.workmap = null;
		this.changeConfigTime = $.now();
		this.autoLocked = false;
		this.lastAutoLock = $.now();
		this.habilityCoolDown = 1;
		this.habilityCoolDownTwo = 1;
		this.habilityCoolDownThree = 1;
		this.habilityCoolDownFour = 1;
		this.changeFormationTime = $.now();
		this.RSBTime = $.now();
		this.formation = -1;
		this.ammunition = -1;
		this.resetTargetWhenHpBelow25Percent = false;
		this.sentinelship = null;
		this.attacking = false;
		this.moving = false;
		this.map53 = [];
		this.map52 = [];
		this.map51 = [];
		this.lowMap = [];
		this.rutePirateMaps = null;
		this.pet = null;
		this.jumped = false;
		this.petHasFuel = true;
	}
	
	changePetModule(module_id){
		if(this.pet.currentModule != module_id){
			Injector.injectScript('document.getElementById("preloader").petModule(parseInt('+module_id+'), "");');
			this.pet.currentModule = module_id;
		}
	}

	callPet(n){
		// 0 = activate
		// 1 = deactivate
		// 4 = repair
		Injector.injectScript('document.getElementById("preloader").petCall('+parseInt(n)+');');
		this.pet.currentModule = -1;
	}

	useHability() {
		var cooldownlist = {"cyborg":311000,"solace":141000,"diminisher":162000,"venom":181000,"sentinel":236000,"spectrum":211000,"v-lightning":186000,"aegis":101000,"spearhead":401000,"citadel":46000,"mimesis":361000,"hammerclaw":171000,"tartarus":28000};
		if (this.habilityCoolDown && $.now() - this.habilityCoolDown > cooldownlist[window.hero.skillName]) {
			this.quickSlot(window.globalSettings.habilitySlot);
			this.habilityCoolDown = $.now();
			return true;
		}
		return false;
	}

	useHabilityTwo() {
		var cooldownlist = {"aegis":36000,"spearhead":200000,"citadel":51000, "mimesis":301000,"hammerclaw":101000,"tartarus":71000};
		if (this.habilityCoolDownTwo && $.now() - this.habilityCoolDownTwo > cooldownlist[window.hero.skillName]) {
			this.quickSlot(window.globalSettings.habilitySlotTwo);
			this.habilityCoolDownTwo = $.now();
			return true;
		}
		return false;
	}

	useHabilityThree() {
		var cooldownlist = {"aegis":131000,"spearhead":56000,"citadel":71000, "hammerclaw":147000};
		if (this.habilityCoolDownThree && $.now() - this.habilityCoolDownThree > cooldownlist[window.hero.skillName]) {
			this.quickSlot(window.globalSettings.habilitySlotThree);
			this.habilityCoolDownThree = $.now();
			return true;
		}
		return false;
	}

	useHabilityFour() {
		var cooldownlist = {"citadel":370000,"spearhead":150000};
		if (this.habilityCoolDownFour && $.now() - this.habilityCoolDownFour > cooldownlist[window.hero.skillName]) {
			this.quickSlot(window.globalSettings.habilitySlotFour);
			this.habilityCoolDownFour = $.now();
			return true;
		}
		return false;
	}

	getShipName(fullname) {
		let namelist = /ship_(.*?)(_|$)/g;
		let rname = namelist.exec(fullname);
		let shipType = "";
		if (rname != null) {
			if (rname[1] == "a-veteran" || rname[1] == "a-elite") {
				shipType = "aegis";
			} else if (rname[1] == "c-veteran" || rname[1] == "c-elite") {
				shipType = "citadel";
			} else if (rname[1] == "s-veteran" || rname[1] == "s-elite") {
				shipType = "spearhead";
			} else {
				shipType = rname[1];
			}
			return shipType;
		} else {
			return false;
		}
	}

	changeFormation(n) {
		if (this.changeFormationTime && $.now() - this.changeFormationTime > 3000) {
			this.changeFormationTime = $.now();
			this.formation = n;
			this.quickSlot(n);
			return true;
		} else {
			return false;
		}
	}

	quickSlot(n) {
		if (n>=0 && n< 10) {
			let slots = [48,49,50,51,52,53,54,55,56,57];
			this.pressKey(slots[n]);
			setTimeout(() => {
				this.pressKey(slots[n]);
			}, 700);
		}
	}

	pressKey(n) {
		Injector.injectScript('document.getElementById("preloader").pressKey('+n+');');
	}

	changeRefreshCount(n) {
		chrome.storage.local.set({"refreshCount": n});
	}

	changeAmmunition(ammo) {
		if(this.ammunition != ammo) {
			switch(ammo) {
				case 1:
					this.quickSlot(window.globalSettings.x1Slot);
					break;
				case 2:
					this.quickSlot(window.globalSettings.x2Slot);
					break;
				case 3:
					this.quickSlot(window.globalSettings.x3Slot);
					break;
				case 4:
					this.quickSlot(window.globalSettings.x4Slot);
					break;
				case 6:
					this.quickSlot(window.globalSettings.sabSlot);
					break;
				case 45:
					if ($.now() - this.RSBTime > 3000) {
						this.quickSlot(window.globalSettings.rsbSlot);
						this.ammunition = ammo;
						this.RSBTime = $.now();
						setTimeout(() => {
							this.quickSlot(window.globalSettings.x4Slot);
							this.ammunition = 4;
						}, 500);
					} else {
						this.quickSlot(window.globalSettings.x4Slot);
						this.ammunition = 4;
					}
					break;
				default:
					this.quickSlot(window.globalSettings.x1Slot);
			}	
			this.ammunition = ammo;
		}
	}

	lockShip(ship) {
		if (!(ship instanceof Ship))
			return;

		if (this.ships[ship.id] == null)
			return;

		ship.update();
		let pos = ship.position;
		let scr = 'document.getElementById("preloader").lockShip(' + ship.id + ',' + Math.round(pos.x) + ',' + Math.round(pos.y) + ',' + Math.round(window.hero.position.x) + ',' + Math.round(window.hero.position.y) + ');';
		Injector.injectScript(scr);

		this.lockTime = $.now();
	}

	lockNpc(ship) {
		if (!(ship instanceof Ship))
			return;

		if (this.ships[ship.id] == null)
			return;

		this.lockTime = $.now();

		this.lockShip(ship);
	}

	reconnect() {
		Injector.injectScript('document.getElementById("preloader").reconnect();');
		this.reconnectTime = $.now();
	}

	collectBox(box) {
		if (!(box instanceof Box))
			return;

		if (this.boxes[box.hash] == null)
			return;

		if (MathUtils.random(1, 100) >= window.settings.collectionSensitivity) {
			return;
		}

		Injector.injectScript('document.getElementById("preloader").collectBox' + box.hash + '()');

		this.collectTime = $.now();
	}

	moveWithFilter(x, y) {
		if (window.hero.mapId == 93 || window.hero.mapId == 92 || window.hero.mapId == 91 || window.hero.mapId == 200) {
			if (window.hero.mapId == 93 && window.settings.palladium && window.globalSettings.workmap == 93 && window.globalSettings.korsanbotmovetrue){
				this.move(x, y);
				window.movementDone = false;
			}else if (window.hero.mapId == 92 && window.settings.piratebot && window.globalSettings.workmap == 92 && window.globalSettings.korsanbotmovetrue){
				this.move(x, y);
				window.movementDone = false;
			}else if (window.hero.mapId == 91 && window.settings.piratebot && window.globalSettings.workmap == 91 && window.globalSettings.korsanbotmovetrue){
				this.move(x, y);
				window.movementDone = false;
			}
			else{
				this.moveForSpecialMap(x, y, window.hero.mapId);
			}
			
		} 
		if (!window.bigMap && !window.settings.ggbot && ((x < 200 || x > 20800) || (y < 200 || y > 12900)) &&( window.globalSettings.workmap == window.hero.mapId || window.globalSettings.workmap == 0) ) {
			x = MathUtils.random(200, 20800);
			y = MathUtils.random(200, 12900);
			this.move(x, y);
			window.movementDone = false;
		}  else if (window.bigMap && !window.settings.ggbot && ((x < 500 || x > 41500) || (y < 500 || y > 25700)) &&( window.globalSettings.workmap == window.hero.mapId || window.globalSettings.workmap == 0) ) {
			x = MathUtils.random(500, 41500);
			y = MathUtils.random(500, 25700);
			this.move(x, y);
			window.movementDone = false;
		} else if ( window.globalSettings.workmap == window.hero.mapId || window.globalSettings.workmap == 0){
			this.move(x, y);
			window.movementDone = false;
		}
	}

	move(x, y) {
		if (!isNaN(x) && !isNaN(y)) {
			if(window.invertedMovement){
				x = x + ((window.hero.position.x - x)*2);
				y = y + ((window.hero.position.y - y)*2);
			}
			window.hero.move(new Vector2D(x, y));
		}
	}

	blackListHash(hash) {
		this._blackListedBoxes.push(hash);
	}

	isOnBlacklist(hash) {
		return this._blackListedBoxes.includes(hash);
	}

	startLaserAttack() {
		this.pressKey(17);
	}

	jumpGate() {
		this.pressKey(74);
	}

	changeConfig() {
		if (this.changeConfigTime && $.now() - this.changeConfigTime > 5000) {
			this.changeConfigTime = $.now();
			this.pressKey(67);
			return true;
		} else {
			return false;
		}
	}

	resetTarget(target) {
		if (target == "enemy") {
			this.targetShip = null;
			this.attacking = false;
			this.triedToLock = false;
			this.lockedShip = null;
			this.ammunition = -1;
		} else if (target == "box") {
			this.targetBoxHash = null;
		} else if (target == "all") {
			this.targetShip = null;
			this.attacking = false;
			this.triedToLock = false;
			this.lockedShip = null;
			this.targetBoxHash = null;
			this.ammunition = -1;
		}
	}

	jumpInGateByType(gateType, settings) {
		if (settings) {
			let box = this.findNearestBox;
			if (!box.box || window.X1Map) {
				let gate = this.findNearestGatebyGateType(gateType);
				if (gate.gate) {
					let x = gate.gate.position.x;
					let y = gate.gate.position.y;
					if (!this.jumped && window.hero.position.distanceTo(gate.gate.position) < 200 && this.jumpTime && $.now() - this.jumpTime > 3000) {
						this.jumpGate();
						this.jumpTime = $.now();
					}
					this.resetTarget("all");
					this.moveWithFilter(x, y);
					window.movementDone = false;
				}
			}
		}
	}

	jumpInGateByID(gateId){
		let hasJumped = false;
		let gate = this.findGatebyID(gateId);
		if (gate.gate) {
			let x = gate.gate.position.x + MathUtils.random(-100, 100);
			let y = gate.gate.position.y + MathUtils.random(-100, 100);
			if (!this.jumped && window.hero.position.distanceTo(gate.gate.position) < 200 && this.jumpTime && $.now() - this.jumpTime > 3000) {
				this.jumpGate();
				this.jumpTime = $.now();
				hasJumped = true;
			}
			this.resetTarget("all");
			this.moveWithFilter(x, y);
			window.movementDone = false;
		}
		return hasJumped;
	}

	jumpAndGoBack(gateId){
		if (window.globalSettings.workmap != null) {
			this.workmap = window.globalSettings.workmap;
		} else {
			this.workmap = window.hero.mapId;
		}
		let hasJumped = this.jumpInGateByID(gateId);
		return hasJumped;
	}
	piratebotorta(){
		if (window.settings.piratebot && window.hero.position.x > 15000 && window.hero.position.x < 16000){
				let x = MathUtils.random(17000, 17000);
				let y = MathUtils.random(window.hero.position.y, window.hero.position.y);
				api.move(x,y);
		}
		if(window.settings.piratebot && window.hero.position.x > 11700 && window.hero.position.x < 13400 && window.hero.position.y > 4200 && window.hero.position.y < 8700){
				let x = MathUtils.random(12500, 12500);
				let y = MathUtils.random(6900, 6900);
				api.move(x,y);
		}else if (window.hero.position.x == 12500 && window.hero.position.y == 6900){
				let x = MathUtils.random(window.hero.position.x, window.hero.position.x);
				let y = MathUtils.random(6900, 6900);
				api.move(x,y);
				this.moving=true;
		}else if (window.hero.position.y == 6900){
			this.moving=false;
		}else if(window.hero.position.x > 13400 && window.hero.position.x < 15000 && this.moving==false){
			let x = MathUtils.random(12000, 12000);
			let y = MathUtils.random(window.hero.position.y, window.hero.position.y);
			api.move(x,y)
		}
	}

	ggDeltaFix() {
		let changeTarget = true;
		let shipsCount = Object.keys(this.ships).length;
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && (ship.name == "-=[ StreuneR ]=- δ4" || 
					ship.name == "-=[ Lordakium ]=- δ9" || 
					ship.name == "-=[ Sibelon ]=- δ14" || 
					ship.name == "-=[ Kristallon ]=- δ19")) {
				this.resetTargetWhenHpBelow25Percent = false;
				if (shipsCount > 1) {
					changeTarget = true;
				} else {
					changeTarget = false;
				}
			} else if (ship && (ship.name == "..::{ Boss Lordakium }::... δ25" ||
					ship.name == "..::{ Boss Lordakium }::... δ21" ||
					ship.name == "..::{ Boss Lordakium }::... δ23")) {
				this.resetTargetWhenHpBelow25Percent = false;
				if (shipsCount > 3) {
					changeTarget = true;
				} else {
					changeTarget = false;
				}
			}
			
			if (!changeTarget) {
				window.settings.setNpc(ship.name, "9");
				this.targetShip = ship;
			} else {
				window.settings.setNpc(ship.name, "0");
				if (this.targetShip == ship) {
					this.resetTarget("enemy");
				}
			}
		}
	}

	ggZetaFix() {
		let shipsCount = Object.keys(this.ships).length;
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && (ship.name == "-=[ Devourer ]=- ζ25" || ship.name == "-=[ Devourer ]=- ζ27")) {
				this.resetTargetWhenHpBelow25Percent=false;
				if (shipsCount > 1) {
					window.settings.setNpc(ship.name, "0");
					if (this.targetShip == ship) {
						this.resetTarget("enemy");
					}
				} else {
					window.settings.setNpc(ship.name, "9");
					this.targetShip = ship;
				}
			}
		}
	}
	piraterevfix(){
		let gatemmoleft51 = api.findGatebyID(150000414);//5-1 sağ üst mmo
		let gatemmorigt51 = api.findGatebyID(150000419);//5-1 sol alt mmo
		let gateeicleft51 = api.findGatebyID(150000416);//5-1 sağ orta eic
		let gateeicrigt51 = api.findGatebyID(150000421);//5-1 sol orta eic
		let gatevruleft51 = api.findGatebyID(150000418);//5-1 sağ alt vru
		let gatevrurigt51 = api.findGatebyID(150000423);//5-1 sol üst vru
		//5-2
		let gatemmoleft52 = api.findGatebyID(150000420);//5-2 sağ üst mmo
		let gatemmorigt52 = api.findGatebyID(150000425);//5-2 sol alt mmo
		let gateeicleft52 = api.findGatebyID(150000422);//5-2 sağ orta eic
		let gateeicrigt52 = api.findGatebyID(150000427);//5-2 sol orta eic
		let gatevruleft52 = api.findGatebyID(150000424);//5-2 sağ alt vru
		let gatevrurigt52 = api.findGatebyID(150000429);//5-2 sol üst vru 
		if (MathUtils.percentFrom(window.hero.hp, window.hero.maxHp) < window.globalSettings.repairWhenHpIsLowerThanPercent){
			if (window.hero.mapId == 91){//5-1 başlar
				if (window.hero.factionId == 1){
					let distgateleft = window.hero.distanceTo(gatemmoleft51.gate.position);
					let distgateright = window.hero.distanceTo(gatemmorigt51.gate.position);
					if (distgateleft < distgateright){
						let x = gatemmoleft51.gate.position.x + MathUtils.random(-100, 100);
						let y = gatemmoleft51.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}else{
						let x = gatemmorigt51.gate.position.x + MathUtils.random(-100, 100);
						let y = gatemmorigt51.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}
					return;					
				}else if (window.hero.factionId == 2){
					let distgateleft = window.hero.distanceTo(gateeicleft51.gate.position);
					let distgateright = window.hero.distanceTo(gateeicrigt51.gate.position);
					if (distgateleft < distgateright){
						let x = gateeicleft51.gate.position.x + MathUtils.random(-100, 100);
						let y = gateeicleft51.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}else{
						let x = gateeicrigt51.gate.position.x + MathUtils.random(-100, 100);
						let y = gateeicrigt51.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}
					return;
				}else if (window.hero.factionId == 3){
					let distgateleft = window.hero.distanceTo(gatevruleft51.gate.position);
					let distgateright = window.hero.distanceTo(gatevrurigt51.gate.position);
					if (distgateleft < distgateright){
						let x = gatevruleft51.gate.position.x + MathUtils.random(-100, 100);
						let y = gatevruleft51.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}else{
						let x = gatevrurigt51.gate.position.x + MathUtils.random(-100, 100);
						let y = gatevrurigt51.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}
					return;
				}
			}if (window.hero.mapId == 92){//5-1 başlar
				if (window.hero.factionId == 1){
					let distgateleft = window.hero.distanceTo(gatemmoleft52.gate.position);
					let distgateright = window.hero.distanceTo(gatemmorigt52.gate.position);
					if (distgateleft < distgateright){
						let x = gatemmoleft52.gate.position.x + MathUtils.random(-100, 100);
						let y = gatemmoleft52.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}else{
						let x = gatemmorigt52.gate.position.x + MathUtils.random(-100, 100);
						let y = gatemmorigt52.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}
					return;
				}else if (window.hero.factionId == 2){
					let distgateleft = window.hero.distanceTo(gateeicleft52.gate.position);
					let distgateright = window.hero.distanceTo(gateeicrigt52.gate.position);
					if (distgateleft < distgateright){
						let x = gateeicleft52.gate.position.x + MathUtils.random(-100, 100);
						let y = gateeicleft52.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}else{
						let x = gateeicrigt52.gate.position.x + MathUtils.random(-100, 100);
						let y = gateeicrigt52.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}
					return;
				}else if (window.hero.factionId == 3){
					let distgateleft = window.hero.distanceTo(gatevruleft52.gate.position);
					let distgateright = window.hero.distanceTo(gatevrurigt52.gate.position);
					if (distgateleft < distgateright){
						let x = gatevruleft52.gate.position.x + MathUtils.random(-100, 100);
						let y = gatevruleft52.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}else{
						let x = gatevrurigt52.gate.position.x + MathUtils.random(-100, 100);
						let y = gatevrurigt52.gate.position.y + MathUtils.random(-100, 100);
						api.move(x, y);
						api.isRepairing=true;
						return;
					}
					return;
				}
			}
		}
	}
	palladiumrevivefixit(){
		let gate = api.findNearestGate();
		let shipsCount = Object.keys(this.ships).length;
		let distgate = window.hero.distanceTo(gate.gate.position);
		if (12182 < window.hero.position.x && 17193 > window.hero.position.x &&  18000 < window.hero.position.y ){
			let x = 14687 + MathUtils.random(-100, 100);
			let y = 25550+ MathUtils.random(-100, 100);
			api.move(x, y);
			if (shipsCount > 0) {
				api.isRepairing = true;
				return;
			} else {
				api.isRepairing = false;
			}
			return;
		} else if (17193 < window.hero.position.x && 22203 > window.hero.position.x &&  18000 < window.hero.position.y ){
			let x = 19698 + MathUtils.random(-100, 100);
			let y = 25550 + MathUtils.random(-100, 100);
			api.move(x, y);
			if (shipsCount > 0) {
				api.isRepairing = true;
				return;
			} else {
				api.isRepairing = false;
			}
			return;
		} else if (22203 < window.hero.position.x && 27213 > window.hero.position.x &&  18000 < window.hero.position.y ){
			let x = 24708 + MathUtils.random(-100, 100);
			let y = 25550 + MathUtils.random(-100, 100);
			api.move(x, y);
			if (shipsCount > 0) {
				api.isRepairing = true;
				return;
			} else {
				api.isRepairing = false;
			}
			return;
		}else if (27213 < window.hero.position.x && 35000 > window.hero.position.x &&  18000 < window.hero.position.y ){
			let x = 29718 + MathUtils.random(-100, 100);
			let y = 25550 + MathUtils.random(-100, 100);
			api.move(x, y);
			if (shipsCount > 0) {
				api.isRepairing = true;
				return;
			} else {
				api.isRepairing = false;
			}

			return;
		} else {
			  let gate5344vru = api.findGatebyID(150000435);
		  	  let gate5344eic = api.findGatebyID(150000433);
			  let gate5344mmo = api.findGatebyID(150000431);
			  let gate5352mmo = api.findGatebyID(150000426);
			  let gate5352eic = api.findGatebyID(150000428);
			  let gate5352vru = api.findGatebyID(150000430);
			 if (window.hero.factionId == 1){
				let x = gate5344mmo.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5344mmo.gate.position.y + MathUtils.random(-100, 100);
				let x1 = gate5352mmo.gate.position.x + MathUtils.random(-100, 100);
				let y1 = gate5352mmo.gate.position.y + MathUtils.random(-100, 100);
				
				if (window.hero.hp == window.hero.maxHp){
					if (window.hero.position.distanceTo(gate5344mmo.gate.position) < 500 && !state) {
						setTimeout(() => {
						api.pressKey(74);
					   }, 3000);
					}
				}
				if (distgate > 300){
					api.resetTarget("all");
					api.move(x, y);
					window.movementDone = false;
					return;
				}else if (window.hero.position.x > 33000 && window.hero.position.y < 13900){
					let distgate = window.hero.distanceTo(gate5344mmo.gate.position);
					if (distgate > 300){
						api.resetTarget("all");
						api.move(x1, y1);
						window.movementDone = false;
						api.isRepairing = true;
						return;
					} 
				}else {
					api.isRepairing = true;
				}	
			  }	else if (window.hero.factionId == 2){
				let x = gate5344eic.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5344eic.gate.position.y + MathUtils.random(-100, 100);
				let x1 = gate5352eic.gate.position.x + MathUtils.random(-100, 100);
				let y1 = gate5352eic.gate.position.y + MathUtils.random(-100, 100);
				if (window.hero.hp == window.hero.maxHp){
					if (window.hero.position.distanceTo(gate5344eic.gate.position) < 500 && !state) {
						setTimeout(() => {
						api.pressKey(74);
					   }, 3000);
					}
				}
				if (distgate > 300){
					api.resetTarget("all");
					api.move(x, y);
					window.movementDone = false;
					return;
				}else if (window.hero.position.x > 33000 && window.hero.position.y < 13900){
					let distgate = window.hero.distanceTo(gate5352eic.gate.position);
					if (distgate > 300){
						api.resetTarget("all");
						api.move(x1, y1);
						window.movementDone = false;
						api.isRepairing = true;
						return;
					} 
				}else {
					api.isRepairing = true;
				}
			  }else if (window.hero.factionId == 3){
				let x = gate5344vru.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5344vru.gate.position.y + MathUtils.random(-100, 100);
				let x1 = gate5352vru.gate.position.x + MathUtils.random(-100, 100);
				let y1 = gate5352vru.gate.position.y + MathUtils.random(-100, 100);
				if (window.hero.hp == window.hero.maxHp){
					if (window.hero.position.distanceTo(gate5344vru.gate.position) < 500 && !state) {
						setTimeout(() => {
						api.pressKey(74);
					   }, 3000);
					}
				}
				if (distgate > 300){
					api.resetTarget("all");
					api.move(x, y);
					window.movementDone = false;
					return;
				}else if (window.hero.position.x > 33000 && window.hero.position.y < 13900){
					let distgate = window.hero.distanceTo(gate5352vru.gate.position);
					if (distgate > 300){
						api.resetTarget("all");
						api.move(x1, y1);
						window.movementDone = false;
						api.isRepairing = true;
						return;
					} 
				}else {
					api.isRepairing = true;
				}
			}

		}

	}

	protegitmode() {
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && (ship.name == "-=[ Cubikon ]=-") && ship.distanceTo(window.hero.position) < 1000) {
				let shipsCount = this.countNpcAroundByName("-=[ Protegit ]=-", 2000);
				if (shipsCount > 1 && !(lockedShip && lockedShip.percentOfHp < 5 && lockedShip.name == "-=[ Cubikon ]=-")) {
					window.settings.setNpc(ship.name, true);
					if (lockedShip && lockedShip.percentOfHp < 99 && lockedShip.name == "-=[ Cubikon ]=-") {
						this.resetTarget("enemy");
						window.settings.setNpc(ship.name, false);
					}
					if (this.targetShip == ship) {
						this.resetTarget("enemy");
					}
				} else {
					window.settings.setNpc(ship.name, false);
					this.targetShip = ship;
				}
			}
		}
	}

	countNpcAroundByName(name, distance){
		let shipsCount = Object.keys(this.ships).length;
		let shipsAround = 0;
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && (ship.distanceTo(window.hero.position) < distance) && (ship.name == name)) {
				shipsAround++;
			}
		}
		return shipsAround;
	}

	countNpcAround(distance){
		let shipsCount = Object.keys(this.ships).length;
		let shipsAround = 0;
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && ship.distanceTo(window.hero.position) <= distance) {
				shipsAround++;
			}
		}
		return shipsAround;
	}

	findNearestBox() {
		let minDist = 100000;
		let finalBox;

		if (!window.globalSettings.bonusBox && !window.globalSettings.materials && !window.settings.palladium && !window.globalSettings.cargoBox && !window.globalSettings.greenOrGoldBooty && !window.globalSettings.redBooty && !window.globalSettings.blueBooty && !window.globalSettings.masqueBooty) {
			return {
				box: null,
				distance: minDist
			};
		}

		if (window.settings.palladium) {
			minDist = 1000;
		}

		for (let property in this.boxes) {
			let box = this.boxes[property];
			let dist = box.distanceTo(window.hero.position);
			if (dist < minDist) {
				if (!box.isResource() && ((box.isCollectable() && window.globalSettings.bonusBox) ||
						((box.isMaterial() || box.isDropRes()) && window.globalSettings.materials) ||
						(box.isPalladium() && window.settings.palladium) ||
						(box.isCargoBox() && window.globalSettings.cargoBox) ||
						(box.isGreenOrGoldBooty() && window.globalSettings.greenOrGoldBooty && window.greenOrGoldBootyKeyCount > 0) ||
						(box.isRedBooty() && window.globalSettings.redBooty && window.redBootyKeyCount > 0) ||
						(box.isBlueBooty() && window.globalSettings.blueBooty && window.blueBootyKeyCount > 0) ||
						(box.isMasqueBooty() && window.globalSettings.masqueBooty && window.masqueBootyKeyCount > 0))) {
					finalBox = box;
					minDist = dist;
				}
			}
		}
		return {
			box: finalBox,
			distance: minDist
		};
	}


	findNearestShip() {
		let minDist = 100000;
		let finalShip;
		let minPriority = 1;

		if (!window.settings.killNpcs) {
			return {
				ship: null,
				distance: minDist
			};
		}

		for (let property in this.ships) {
			let ship = this.ships[property];
			ship.update();
			if ((ship.isNpc  && (!window.settings.onlyAnswerAttacks || (window.settings.onlyAnswerAttacks && ship.attacksUs))) || 
			(!ship.isNpc && window.globalSettings.respondPlayerAttacks && ship.attacksUs && ship.isEnemy) || (!ship.isNpc && ship.isEnemy && window.globalSettings.attackEnemyPlayers)) {
				if (!ship.isNpc) {
					finalShip = ship;
					let dist = ship.distanceTo(window.hero.position);
					return {
						ship: finalShip,
						distance: dist
					};
				}
				let npcdata =  window.settings.getNpc(ship.name);
				let priority = npcdata["priority"];
				if (priority >= minPriority) {
					if (!ship.isAttacked) {
						finalShip = ship;
						minPriority = priority;
					}
				}
			}
		}

		for (let property in this.ships) {
			let ship = this.ships[property];
			ship.update();
			if ((ship.isNpc  && (!window.settings.onlyAnswerAttacks || (window.settings.onlyAnswerAttacks && ship.attacksUs))) || 
					(!ship.isNpc && window.globalSettings.respondPlayerAttacks && ship.attacksUs && ship.isEnemy)) {
				let npcdata =  window.settings.getNpc(ship.name);
				let priority = npcdata["priority"];
				if (priority >= minPriority) {
					let dist = ship.distanceTo(window.hero.position);
					if (dist < minDist) {
						if (!ship.isAttacked) {
							finalShip = ship;
							minDist = dist;
							minPriority = priority;
						}
					}
				}
			}
		}

		return {
			ship: finalShip,
			distance: minDist
		};
	}

	findNearestGate() {
		let minDist = 100000;
		let finalGate;

		this.gates.forEach(gate => {
			if (gate.gateId != 150000409 && gate.gateId != 150000410 && gate.gateId != 150000411 && (gate.gateType == 1 || gate.gateType == 51 || gate.gateType == 52)) {
				let dist = window.hero.distanceTo(gate.position);
				if (dist < minDist) {
					finalGate = gate;
					minDist = dist;
				}
			}
		});

		return {
			gate: finalGate,
			distance: minDist
		};
	}

	findNearestGateForRunAway(enemy) {
		let minDist = 100000;
		let finalGate;
		this.gates.forEach(gate => {
			if (gate.gateId != 150000409 && gate.gateId != 150000410 && gate.gateId != 150000411 && (gate.gateType == 1 || gate.gateType == 51 || gate.gateType == 52)) {
				let enemeyDistance = enemy.distanceTo(gate.position);
				let dist = window.hero.distanceTo(gate.position);
				if (enemeyDistance < dist) {
					return;
				}

				if (dist < minDist) {
					finalGate = gate;
					minDist = dist;
				}
			}
		});

		return {
			gate: finalGate,
			distance: minDist
		};
	}

	findNearestGatebyGateType(gateType) {
		let minDist = 100000;
		let finalGate;

		this.gates.forEach(gate => {
			let dist = window.hero.distanceTo(gate.position);
			if (dist < minDist && gate.gateType == gateType) {
				finalGate = gate;
				minDist = dist;
			}
		});

		return {
			gate: finalGate,
			distance: minDist
		};
	}

	markHeroAsDead() {
		this.heroDied = true;
		Injector.injectScript("window.heroDied = true;");
	}

	checkForCBS(){
		let result = {
				walkAway: false,
				cbsPos: null,
		};
		result.cbsPos = this.battlestation.position;
		let dist = this.battlestation.distanceTo(window.hero.position);
		if (dist < 1500) {
			result.walkAway = true;
		}
		return result;
	}

	checkForEnemy() {
		let result = {
				run: false,
				enemy: null,
				edist: 100000
		};
		let enemyDistance = 100000;
		let enemyShip;
		for (let property in this.ships) {
			let ship = this.ships[property];
			ship.update();
			if (!ship.isNpc && ship.isEnemy) {
				let dist = ship.distanceTo(window.hero.position);
				if (enemyDistance > dist) {
					enemyDistance = dist;
					result.edist = dist;
					result.enemy = ship;
				}
			}
		}
		if (enemyDistance < 2000) {
			result.run = true;
			return result;
		}
		return result;
	}

	countShipsAround(distance) {
		let shipsCount = Object.keys(this.ships).length;
		let shipsAround = 0;
		for (let property in this.ships) {
			let ship = this.ships[property];
			if (ship && ship.distanceTo(window.hero.position) < distance && !ship.isNpc) {
				shipsAround++;
			}
		}
		return shipsAround;
	}

	findGatebyID(gateId) {
		let finalGate;

		this.gates.forEach(gate => {
			if (gate.gateId == gateId) {
				finalGate = gate;
			}
		});

		return {
			gate: finalGate,
		};
	}

		goToMap(idWorkMap){
		if (this.rute == null) {
			this.fillStarSystem();
			let mapSystem = {1:{2:1},2:{1:1,3:1,4:1},3:{2:1,7:1,4:1},4:{2:1,3:1,13:2,13:1},13:{4:1,14:2,15:2,16:2},5:{6:1},6:{5:1,7:1,8:1},7:{6:1,3:1,8:1},8:{6:1,7:1,14:2,11:1},14:{8:1,13:2,15:2,16:2},9:{10:1},10:{9:1,12:1,11:1},
			11:{10:1,8:1,12:1},12:{10:1,11:1,15:2,4:1},15:{12:1,14:2,13:2,16:2},16:{13:2,14:2,15:2,17:1,21:1,25:1},29:{17:1,21:1,25:1,91:1},17:{16:2,29:3,19:1,18:1},18:{17:1,20:1},19:{17:1,20:1},20:{18:1,19:1},21:{16:2,29:3,22:1,23:1},22:{21:1,24:1},23:{21:1,24:1},24:{23:1,22:1},25:{29:3,16:2,27:1,26:1},27:{25:1,28:1},26:{25:1,28:1},28:{26:1,27:1},91:{92:1},92:{93:1},93:{16:1}},
			graph = new Graph(mapSystem);
			let imcompleteRute = graph.findShortestPath(window.hero.mapId, idWorkMap);
			if (imcompleteRute != null) {
				this.rute = this.completeRute(imcompleteRute);
			}
		} else {
			let map = this.rute[0];
			let portal = map.portals[0];
			if (window.hero.mapId == map.mapId) {
				this.jumpInGateByID(portal.gateId);
			} else if (window.hero.mapId == portal.idLinkedMap) {
				this.rute.shift(); 
			} else if (window.hero.mapId != map.mapId && window.hero.mapId == portal.idLinkedMap) {
			  this.rute = null;
			}
		}
	}

	fillStarSystem(){
		this.starSystem = [];
		let portals11 = [];
		portals11.push(new Portal(150000156,2));
		this.starSystem.push(new Map(1, portals11));
		let portals12 = [];
		portals12.push(new Portal(150000157,1));
		portals12.push(new Portal(150000158,3));
		portals12.push(new Portal(150000160,4));
		this.starSystem.push(new Map(2, portals12));
		let portals13 = [];
		portals13.push(new Portal(150000159,2));
		portals13.push(new Portal(150000182,4));
		portals13.push(new Portal(150000162,7));
		this.starSystem.push(new Map(3, portals13));
		let portals14 = [];
		portals14.push(new Portal(150000161,2));
		portals14.push(new Portal(150000183,3));
		portals14.push(new Portal(150000186,13));
		portals14.push(new Portal(150000166,12));
		this.starSystem.push(new Map(4, portals14));
		let portals21 = [];
		portals21.push(new Portal(150000171,6)); /* 2-1 | 2-2 */
		this.starSystem.push(new Map(5, portals21));
		let portals22 = [];
		portals22.push(new Portal(150000165,7)); /* 2-2 | 2-3 */
		portals22.push(new Portal(150000172,8)); // 2-2 | 2-4
		portals22.push(new Portal(150000170,5)); // 2-2 | 2-4
		this.starSystem.push(new Map(6, portals22));
		let portals23 = [];
		portals23.push(new Portal(150000163,3)); // 2-3 | 1-3
		portals23.push(new Portal(150000180,8)); // 2-3 | 2-4
		portals23.push(new Portal(150000164,6)); // 2-3 | 2-2
		this.starSystem.push(new Map(7, portals23));
		let portals24 = [];
		portals24.push(new Portal(150000181,7)); // 2-4 | 2-3
		portals24.push(new Portal(150000188,14)); // 2-4 | 4-2
		portals24.push(new Portal(150000173,6)); // 2-4 | 2-2
		portals24.push(new Portal(150000174,11)); // 2-4 | 3-3
		this.starSystem.push(new Map(8, portals24));
		let portals31 = [];
		portals31.push(new Portal(150000179,10)); // 3-1 | 3-2
		this.starSystem.push(new Map(9, portals31));
		let portals32 = [];
		portals32.push(new Portal(150000177,11)); // 3-2 | 3-3
		portals32.push(new Portal(150000169,12)); // 3-2 | 3-4
		portals32.push(new Portal(150000178,9)); // 3-2 | 3-1
		this.starSystem.push(new Map(10, portals32));
		let portals33 = [];
		portals33.push(new Portal(150000175,8)); // 3-3 | 2-4
		portals33.push(new Portal(150000185,12)); // 3-3 | 3-4
		portals33.push(new Portal(150000176,10)); // 3-3 | 3-2
		this.starSystem.push(new Map(11, portals33));
		let portals34 = [];
		portals34.push(new Portal(150000167,4));
		portals34.push(new Portal(150000190,15));
		portals34.push(new Portal(150000184,11));
		portals34.push(new Portal(150000168,10));
		this.starSystem.push(new Map(12, portals34));
		let portals43 = [];
		portals43.push(new Portal(150000191,12)); // 4-3 | 3-4
		portals43.push(new Portal(150000195,14)); // 4-3 | 4-2
		portals43.push(new Portal(150000196,13)); // 4-3 | 4-1
		portals43.push(new Portal(150000278,16)); // 4-3 | 4-4
		this.starSystem.push(new Map(15, portals43));
		let portals41 = [];
		portals41.push(new Portal(150000187,4)); // 4-1 | 1-4
		portals41.push(new Portal(150000192,14)); // 4-1 | 4-2
		portals41.push(new Portal(150000197,15)); // 4-1 | 4-3
		portals41.push(new Portal(150000274,16)); // 4-1 | 4-4
		this.starSystem.push(new Map(13, portals41));
		let portals42 = [];
		portals42.push(new Portal(150000189,8)); // 4-2 | 2-4
		portals42.push(new Portal(150000193,13)); // 4-2 | 4-1
		portals42.push(new Portal(150000194,15)); // 4-2 | 4-3
		portals42.push(new Portal(150000276,16)); // 4-2 | 4-4
		this.starSystem.push(new Map(14, portals42));
		let portals44 = [];
		portals44.push(new Portal(150000303,25)); // 4-4 | 3-5
		portals44.push(new Portal(150000279,15)); // 4-4 | 4-3
		portals44.push(new Portal(150000277,14)); // 4-4 | 4-2
		portals44.push(new Portal(150000293,21)); // 4-4 | 2-5
		portals44.push(new Portal(150000283,17)); // 4-4 | 1-5
		portals44.push(new Portal(150000275,13)); // 4-4 | 4-1
		this.starSystem.push(new Map(16, portals44));
		let portals45 = [];
		portals45.push(new Portal(150000314,17)); // 4-5 | 1-5
		portals45.push(new Portal(150000316,21)); // 4-5 | 2-5
		portals45.push(new Portal(150000318,25)); // 4-5 | 3-5
		portals45.push(new Portal(150000413,91)); // 4-5 | 5-1 MMO
		portals45.push(new Portal(150000415,91)); // 4-5 | 5-1 EIC
		portals45.push(new Portal(150000417,91)); // 4-5 | 5-1 VRU
		this.starSystem.push(new Map(29, portals45));
		let portals15 = [];
		portals15.push(new Portal(150000284,16)); // 1-5 | 4-4
		portals15.push(new Portal(150000313,29)); // 1-5 | 4-5
		portals15.push(new Portal(150000285,18)); // 1-5 | 1-6
		portals15.push(new Portal(150000287,19)); // 1-5 | 1-7
		this.starSystem.push(new Map(17, portals15));
		let portals16 = [];
		portals16.push(new Portal(150000286,17)); // 1-6 | 1-5
		portals16.push(new Portal(150000289,20)); // 1-6 | 1-8
		this.starSystem.push(new Map(18, portals16));
		let portals17 = [];
		portals17.push(new Portal(150000291,20)); // 1-7 | 1-8
		portals17.push(new Portal(150000288,17)); // 1-7 | 1-5
		this.starSystem.push(new Map(19, portals17));
		let portals18 = [];
		portals18.push(new Portal(150000290,18)); // 1-8 | 1-6
		portals18.push(new Portal(150000292,19)); // 1-8 | 1-7
		this.starSystem.push(new Map(20, portals18));
		let portals25 = [];
		portals25.push(new Portal(150000294,16)); // 2-5 | 4-4
		portals25.push(new Portal(150000315,29)); // 2-5 | 4-5
		portals25.push(new Portal(150000295,22)); // 2-5 | 2-6
		portals25.push(new Portal(150000297,23)); // 2-5 | 2-7
		this.starSystem.push(new Map(21, portals25));
		let portals26 = [];
		portals26.push(new Portal(150000296,21)); // 2-6 | 2-5
		portals26.push(new Portal(150000299,24)); // 2-6 | 2-8
		this.starSystem.push(new Map(22, portals26));
		let portals27 = [];
		portals27.push(new Portal(150000298,21)); // 2-7 | 2-5
		portals27.push(new Portal(150000301,24)); // 2-7 | 2-8
		this.starSystem.push(new Map(23, portals27));
		let portals28 = [];
		portals28.push(new Portal(150000300,22)); // 2-8 | 2-6
		portals28.push(new Portal(150000302,23)); // 2-8 | 2-7
		this.starSystem.push(new Map(24, portals28));
		let portals35 = [];
		portals35.push(new Portal(150000304,16)); // 3-5 | 4-4
		portals35.push(new Portal(150000317,29)); // 3-5 | 4-5
		portals35.push(new Portal(150000305,26)); // 3-5 | 3-6
		portals35.push(new Portal(150000307,27)); // 3-5 | 3-7
		this.starSystem.push(new Map(25, portals35));
		let portals36 = [];
		portals36.push(new Portal(150000306,25)); // 3-6 | 3-5
		portals36.push(new Portal(150000309,28)); // 3-6 | 3-8
		this.starSystem.push(new Map(26, portals36));
		let portals37 = [];
		portals37.push(new Portal(150000308,25)); // 3-7 | 3-5
		portals37.push(new Portal(150000311,28)); // 3-7 | 3-8
		this.starSystem.push(new Map(27, portals37));
		let portals38 = [];
		portals38.push(new Portal(150000312,27)); // 3-8 | 3-7
		portals38.push(new Portal(150000310,26)); // 3-8 | 3-6
		this.starSystem.push(new Map(28, portals38));
		let portals51 = [];
		portals51.push(new Portal(150000419,92)); // 5-1 | 5-2 MMO
		portals51.push(new Portal(150000423,92)); // 5-1 | 5-2 VRU
		portals51.push(new Portal(150000421,92)); // 5-1 | 5-2 EIC
		this.starSystem.push(new Map(91, portals51));
		let portals52 = [];
		portals52.push(new Portal(150000427,93)); // 5-2 | 5-3 EIC
		portals52.push(new Portal(150000425,93)); // 5-2 | 5-3 MMO
		portals52.push(new Portal(150000429,93)); // 5-2 | 5-3 VRU
		this.starSystem.push(new Map(92, portals52));
		let portals53 = [];
		portals53.push(new Portal(150000433,16)); // 5-3 | 4-4
		portals53.push(new Portal(150000431,16)); // 5-3 | 4-4
		portals53.push(new Portal(150000435,16)); // 5-3 | 4-4
		this.starSystem.push(new Map(93, portals53));
	}

	completeRute(imcompleteRute){
		let rute = [];
		for (let i = 0;i < imcompleteRute.length; i++) {
			let idWorkMap = imcompleteRute[i];
			let nextMap = imcompleteRute[i + 1];
			for (let e = 0;e < this.starSystem.length;e++) {
				if (this.starSystem[e].mapId == idWorkMap) {
					let map = this.starSystem[e];
					let portalschosen = this.returnANextPortal(map.portals,nextMap);
					let arrayPortals = [];
					arrayPortals.push(portalschosen);
					rute.push(new Map(map.mapId,arrayPortals));
				}
			}
		}
		return rute;
	}

	returnANextPortal(portals,idGoMap){
		for (let i = 0;i < portals.length; i++) {
			if (portals[i].idLinkedMap == idGoMap) {
				return portals[i];
			}
		}
	}

	attackMode() {
		if (window.globalSettings.autoChangeConfig && window.globalSettings.attackConfig != window.hero.shipconfig) {
			this.changeConfig();
		}
		if (window.globalSettings.changeFormation && window.globalSettings.attackFormation != api.formation) {
			this.changeFormation(window.globalSettings.attackFormation);
		}
	}

	speedMode() {
		let changeVelo = false;
		if (window.globalSettings.autoChangeConfig) {
			if(window.globalSettings.flyingConfig != window.hero.shipconfig) {
				if (this.changeConfig()) {
					changeVelo = true;
				}
			}
		}
		if (window.globalSettings.changeFormation && api.formation != window.globalSettings.flyingFormation) {
			if (this.changeFormation(window.globalSettings.flyingFormation)) {
				changeVelo = true;
			}
		}
		return changeVelo;
	}

	escapeMode() {
		let changeVelo = false;
		if (window.globalSettings.autoChangeConfig) {
			if (window.globalSettings.escapeConfig != window.hero.shipconfig) {
				if (this.changeConfig()) {
					changeVelo = true;
				}
			}
		}
		if (window.globalSettings.changeFormation && api.formation != window.globalSettings.escapeFormation) {
			if (this.changeFormation(window.globalSettings.escapeFormation)) {
				changeVelo = true;
			}
		}
		return changeVelo;
	}

	chooseAmmunition() {
		let ammunition;
		if (this.targetShip.isNpc) {
			ammunition = parseInt(window.settings.getNpc(this.targetShip.name)["ammo"]);
		} else {
			ammunition = parseInt(window.globalSettings.playerAmmo);
		}
		if (ammunition != null && ammunition > 0) {
			if (this.targetShip.shd > 200 && (ammunition == 11 || ammunition == 21 || ammunition == 31 || ammunition == 41)) {
				this.changeAmmunition(6);
			} else if (this.targetShip.shd < 200 && (ammunition == 11 || ammunition == 21 || ammunition == 31 || ammunition == 41)) {
				switch(ammunition) {
					case 11:
						this.changeAmmunition(1);
				        break;
					case 21:
						this.changeAmmunition(2);
				        break;
					case 31:
						this.changeAmmunition(3);
				        break;
					case 41:
						this.changeAmmunition(4);
				        break;
				}
			} else {
				this.changeAmmunition(ammunition);
			}
		}
	}

	moveForSpecialMap(finX, finY, idMap) {
		let map = null;
		let graph;
		let connectors;
		if (idMap == 91) {
			if (this.map51 == null || this.map51.length <= 0) {
				this.pirate51to52();
				return;
			} else {
			  map = this.map51;
			}
		} else if (idMap == 92) {
			connectors = {1:{2:1},2:{1:1,3:1},3:{2:1}};
			if (this.map52 == null || this.map52.length <= 0) {
				this.pirate52to53();
				return;
			} else {
			  map = this.map52;
			}
		} else if (idMap == 93) {
			connectors = {1:{2:1},2:{1:1,3:1},3:{2:1,4:1},4:{3:1,5:1},5:{4:1,6:1},6:{5:1,7:5},7:{6:1,8:1},8:{7:5,9:1},9:{8:1}};
			if (this.map53 == null || this.map53.length <= 0) {
				if (!window.settings.palladium){
					this.pirate53to44();
					return;
				}
			} else {
			  map = this.map53;
			}
		} else if (idMap == 200) {
			connectors = {1:{2:1},2:{1:1,3:1},3:{2:1,4:1,6:1,8:1},4:{3:1,5:1},5:{4:1},6:{3:1,7:1},7:{6:1},8:{3:1,9:1},9:{8:1}};
			if (this.lowMap == null || this.lowMap.length <= 0) {
				this.completeLowMap();
				return;
			} else {
			  map = this.lowMap;
			}
		}
		
		if (map != null || map.length > 0) {
			let startZone = this.getMapIDZone(window.hero.position.x, window.hero.position.y, map);
			if (startZone != null && startZone != 0) {
				let endZone = this.getMapIDZone(finX, finY, map);
				if (endZone !=0 && startZone != endZone) {
					if (this.rutePirateMaps != null) {
						let nextZone = api.getMapZone(this.rutePirateMaps[0],map);
						if (nextZone != null) {
							if (window.hero.position.x == nextZone.conectorX && window.hero.position.y == nextZone.conectorY) {
								this.rutePirateMaps.shift();
							}
							this.move(nextZone.conectorX, nextZone.conectorY);
							window.movementDone = false;
						} else {
							this.rutePirateMaps = null;
						}
					} else {
						graph = new Graph(connectors);
						this.rutePirateMaps = graph.findShortestPath(startZone, endZone);
					}
				} else {
					this.rutePirateMaps = null;
					this.move(finX, finY);
					window.movementDone = false;
				}
			} else {
				this.rutePirateMaps = null;
				this.move(finX, finY);
				window.movementDone = false;
			}
		}
	}

	getMapZone(id, map) {
		for (let i = 0;i < map.length; i++) {
			if (map[i].id == id) {
				return map[i];
			}
		} 
	}

	getMapIDZone(x, y, map) {
		let id = 0;
		for (let i = 0;i < map.length; i++) {
			if (map[i].minX < x && map[i].maxX > x && map[i].minY < y && map[i].maxY > y) {
				id = map[i].id;
				return id;
			}
		}
		return id;
	}

	pirate51to52(){
		let gate = api.findNearestGate();
		let distgate = window.hero.distanceTo(gate.gate.position);
		window.movementDone = false;
		if (distgate < 300 && gate.gate.gateId == 150000414){
		  let x = 30000;
		  let y = 9090;
		  api.move(x, y);
		  window.movementDone = false;
		 }else if (distgate < 1000 && gate.gate.gateId == 150000416  /*&& window.movementDone == false*/ ){
		  let x = 30000;
		  let y = 9090;
		  api.move(x, y);
		  window.movementDone = false;
		 }else if (distgate < 1000 && gate.gate.gateId == 150000418  /*&& window.movementDone == false*/ ){
		  let x = 30000;
		  let y = 9090;
		  api.move(x, y);
		 }else if (window.hero.position.x == 30000 && window.hero.position.y == 9090){
		 let x = 24000;
		 let y = 9090;
		 api.move(x, y);	
		 }else if (window.hero.position.x == 24000 && window.hero.position.y == 9090){
		 let x = 23000;
		 let y = 8500;
		 api.move(x, y);
		 }else if (window.hero.position.x == 23000 && window.hero.position.y == 8500){
		 let x = 20200;
		 let y = 8500;
		 api.move(x, y);
		 }else if (window.hero.position.x == 20200 && window.hero.position.y == 8500){
		 let x = 19700;
		 let y = 8900;
		 api.move(x, y); 
		   
		 }else if (window.hero.position.x == 19700 && window.hero.position.y == 8900){
		 let x = 15500;
		 let y = 8900;
		 api.move(x, y); 
		 }else if (window.hero.position.x == 15500 && window.hero.position.y == 8900){
		   let x = 15100;
		   let y = 7900;
		   api.move(x, y);
		 }else if (window.hero.position.x == 15100 && window.hero.position.y == 7900){
		   let x = 12000;
		   let y = 7900;
		   api.move(x, y);
		 }else if (window.hero.position.x < 12500 && window.hero.position.x > 100){
			if (gate.gate) {
			  let gate5152vru = api.findGatebyID(150000423);
			  let gate5152eic = api.findGatebyID(150000421);
			  let gate5152mmo = api.findGatebyID(150000419);
			  if (window.hero.factionId == 1){
				let x = gate5152mmo.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5152mmo.gate.position.y + MathUtils.random(-100, 100);
				 if (window.hero.position.distanceTo(gate5152mmo.gate.position) < 200 && !state) {
				   setTimeout(() => {
				   api.pressKey(74);
				  }, 3000);
				}
				 api.resetTarget("all");
				api.move(x, y);
				window.movementDone = false;
				 return;
			  }else if (window.hero.factionId == 2){
				let x = gate5152eic.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5152eic.gate.position.y + MathUtils.random(-100, 100);
				 if (window.hero.position.distanceTo(gate5152eic.gate.position) < 200 && !state) {
				   setTimeout(() => {
					api.pressKey(74);
				  }, 3000);
				}
				 api.resetTarget("all");
				api.move(x, y);
				window.movementDone = false;
				 return; 
			  }else if (window.hero.factionId == 3){
				let x = gate5152vru.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5152vru.gate.position.y + MathUtils.random(-100, 100);
				 if (window.hero.position.distanceTo(gate5152vru.gate.position) < 200 && !state) {
				   setTimeout(() => {
					api.pressKey(74);
				  }, 3000);
				}
				 api.resetTarget("all");
				api.move(x, y);
				window.movementDone = false;
				 return;
			  }
			   
			}
		   }
		 
		 
		/*}else if (window.hero.position.x > 15000 && window.hero.position.x < 15200 && window.hero.position.y > 7900 && window.hero.position.y < 8000){
	
		  x = MathUtils.random(12000, 15000);
		  y = MathUtils.random(7800, 7900);
		  api.move(x, y);*/
		 
	}
	
	pirate52to53(){
	  let gate = api.findNearestGate();
	  let distgate = window.hero.distanceTo(gate.gate.position);
	  window.movementDone = false;
	   if (distgate < 1000 && gate.gate.gateId == 150000420){
		let x = 15840;
		let y = 6570;
		api.move(x, y);
		window.movementDone = false;
	  
	   }else if (distgate < 1000 && gate.gate.gateId == 150000422  /*&& window.movementDone == false*/ ){
		let x = 15840;
		let y = 6570;
		api.move(x, y);
		window.movementDone = false;
	  
	   }else if (distgate < 1000 && gate.gate.gateId == 150000424  /*&& window.movementDone == false*/ ){
		let x = 15840;
		let y = 6570;
		api.move(x, y);
	  
	   }else if (window.hero.position.x == 15840 && window.hero.position.y == 6570){
	   let x = 10710;
	   let y = 8280;
	   api.move(x, y);
		
	   }else if (window.hero.position.x == 10710 && window.hero.position.y == 8280){
	   let x = 4770;
	   let y = 7200;
	   api.move(x, y);  
	   }else if (window.hero.position.x < 4870 && window.hero.position.x > 100){
		  if (gate.gate) {
			let gate5253vru = api.findGatebyID(150000429);
			let gate5253eic = api.findGatebyID(150000427);
			let gate5253mmo = api.findGatebyID(150000425);
			
			 if (window.hero.factionId == 1){
				let x = gate5253mmo.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5253mmo.gate.position.y + MathUtils.random(-100, 100);
				 if (window.hero.position.distanceTo(gate5253mmo.gate.position) < 200 && !state) {
				   
				   setTimeout(() => {
				   api.pressKey(74);
				  }, 3000);
				}
				 api.resetTarget("all");
				api.move(x, y);
				window.movementDone = false;
				 return;
			  }else if (window.hero.factionId == 2){
				let x = gate5253eic.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5253eic.gate.position.y + MathUtils.random(-100, 100);
				 if (window.hero.position.distanceTo(gate5253eic.gate.position) < 200 && !state) {
				   
				   setTimeout(() => {
					api.pressKey(74);
				  }, 3000);
				}
				 api.resetTarget("all");
				api.move(x, y);
				window.movementDone = false;
				 return;
				
			  }else if (window.hero.factionId == 3){
				let x = gate5253vru.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5253vru.gate.position.y + MathUtils.random(-100, 100);
				 if (window.hero.position.distanceTo(gate5253vru.gate.position) < 200 && !state) {
				   setTimeout(() => {
					api.pressKey(74);
				  }, 3000);
				}
				 api.resetTarget("all");
				api.move(x, y);
				window.movementDone = false;
				 return;
	   
			  }
			   
			}
		   }
	}
	
	pirate53topala(){
		let gate = api.findNearestGate();
		let distgate = window.hero.distanceTo(gate.gate.position);
		window.movementDone = false;
		if (distgate < 1000 && gate.gate.gateId == 150000430){
			  let x = 33625;
			  let y = 13929;
			  api.move(x, y);
			  window.movementDone = false;
		 }else if (distgate < 1000 && gate.gate.gateId == 150000426  /*&& window.movementDone == false*/ ){
			  let x = 33625;
			  let y = 13929;
			  api.move(x, y);
			  window.movementDone = false;
		 }else if (distgate < 1000 && gate.gate.gateId == 150000428  /*&& window.movementDone == false*/ ){
			  let x = 33625;
			  let y = 13929;
			  api.move(x, y);
		 }else if (window.hero.position.x > 33000 && window.hero.position.y < 13900){
			 let x = 33625;
			 let y = 13929;
			 api.move(x, y);  
		 }
		 else if (window.hero.position.x == 33625 && window.hero.position.y == 13929){
			 let x = 28904;
			 let y = 13929;
			 api.move(x, y);
		 }else if (window.hero.position.x == 28904 && window.hero.position.y == 13929){
			 let x = 28904;
			 let y = 16776;
			 api.move(x, y);  
		 }else if (window.hero.position.x == 28904 && window.hero.position.y == 16776){
			  let x = 30354;
			  let y = 16776;
			  api.move(x, y);  
		 }else if (window.hero.position.x > 30100 && window.hero.position.y > 16500){
			  let x = 32304;
			  let y = 18054;
			  api.move(x, y);  
		 }else if (window.hero.position.x == 30354 && window.hero.position.y == 16776){
			  let x = 32004;
			  let y = 19054;
			  api.move(x, y); 
			  window.movementDone = false;
		  }
	}
	
	pirate53to44(){
	  let gate = api.findNearestGate();
	  let distgate = window.hero.distanceTo(gate.gate.position);
	  window.movementDone = false;
	  if (distgate < 1000 && gate.gate.gateId == 150000430){
		let x = 33025;
		let y = 13929;
		api.move(x, y);
		window.movementDone = false;
	  
	   }else if (distgate < 1000 && gate.gate.gateId == 150000426  /*&& window.movementDone == false*/ ){
		let x = 33025;
		let y = 13929;
		api.move(x, y);
		window.movementDone = false;
	  
	   }else if (distgate < 1000 && gate.gate.gateId == 150000428  /*&& window.movementDone == false*/ ){
		let x = 33025;
		let y = 13929;
		api.move(x, y);
	  
	   }else if (window.hero.position.x == 33025 && window.hero.position.y == 13929){
	   let x = 28904;
	   let y = 13929;
	   api.move(x, y);
		
	   }else if (window.hero.position.x == 28904 && window.hero.position.y == 13929){
	   let x = 28904;
	   let y = 16776;
	   api.move(x, y);  
	   }else if (window.hero.position.x == 28904 && window.hero.position.y == 16776){
		let x = 26397;
		let y = 16776;
		api.move(x, y);  
	   }else if (window.hero.position.x == 26397 && window.hero.position.y == 16776){
		let x = 25843;
		let y = 16245;
		api.move(x, y); 
	   }else if (window.hero.position.x == 25843 && window.hero.position.y == 16245){
		let x = 17626;
		let y = 16245;
		api.move(x, y);  
	   }else if (window.hero.position.x == 25843 && window.hero.position.y == 16245){
		let x = 13300;
		let y = 12300;
		api.move(x, y);  
	   }else if (window.hero.position.x == 17626 && window.hero.position.y == 16245){
		let x = 13300;
		let y = 12300;
		api.move(x, y);  
	   }else if (window.hero.position.x == 15462 && window.hero.position.y == 21699){
		let x = 13300;
		let y = 12300;
		api.move(x, y);  
	   }else if (window.hero.position.x < 16000 && window.hero.position.y > 16000){
		let x = 13300;
		let y = 12300;
		api.move(x, y);  
	   }else if (window.hero.position.x > 16000 && window.hero.position.y > 17900){
		let x = 14580;
		let y = 21780;
		api.move(x, y);  
	   }else if (window.hero.position.x == 14580 && window.hero.position.y == 21780){
		let x = 3200;
		let y = 12300;
		api.move(x, y);  
		window.movementDone = false;
		if (window.movementDone == false){
		  wait(1000);
		}
	   }else if (window.hero.position.x == 13300 && window.hero.position.y == 12300){
		let x = 2500;
		let y = 12300;
		api.move(x, y);  
	   } else if (window.hero.position.x == 2500 && window.hero.position.y == 12300){
		   let gate5344vru = api.findGatebyID(150000435);
		  let gate5344eic = api.findGatebyID(150000433);
		  let gate5344mmo = api.findGatebyID(150000431);
			
			 if (window.hero.factionId == 1){
				let x = gate5344mmo.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5344mmo.gate.position.y + MathUtils.random(-100, 100);
				 if (window.hero.position.distanceTo(gate5344mmo.gate.position) < 500 && !state) {
				   
				   setTimeout(() => {
				   api.pressKey(74);
				  }, 3000);
				}
				 api.resetTarget("all");
				api.move(x, y);
				window.movementDone = false;
				 return;
			  }else if (window.hero.factionId == 2){
				let x = gate5344eic.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5344eic.gate.position.y + MathUtils.random(-100, 100);
				 if (window.hero.position.distanceTo(gate5344eic.gate.position) < 500 && !state) {
				   
				   setTimeout(() => {
					api.pressKey(74);
				  }, 3000);
				}
				 api.resetTarget("all");
				api.move(x, y);
				window.movementDone = false;
				 return;
				
			  }else if (window.hero.factionId == 3){
				let x = gate5344vru.gate.position.x + MathUtils.random(-100, 100);
				let y = gate5344vru.gate.position.y + MathUtils.random(-100, 100);
				 if (window.hero.position.distanceTo(gate5344vru.gate.position) < 500 && !state) {
				   setTimeout(() => {
					api.pressKey(74);
				  }, 3000);
				}
				 api.resetTarget("all");
				api.move(x, y);
				window.movementDone = false;
				 return;
			  }    
			} else if (gate.gate){
				let gate5344vru = api.findGatebyID(150000435);
				let gate5344eic = api.findGatebyID(150000433);
				let gate5344mmo = api.findGatebyID(150000431);
				if (window.hero.position.distanceTo(gate5344vru.gate.position) < 200){
				  setTimeout(() => {
					api.pressKey(74);
				  }, 3000);
				} else if (window.hero.position.distanceTo(gate5344eic.gate.position) < 200){
				  setTimeout(() => {
					api.pressKey(74);
				  }, 3000);
				} else if (window.hero.position.distanceTo(gate5344mmo.gate.position) < 200){
				  setTimeout(() => {
					api.pressKey(74);
				  }, 3000);
				}
		   }
	}
	goto44fix(){
	  api.goToMap(window.globalSettings.workmap);
	}
	
	
	
	
	
	completeLowMap() {
		//Portal ID: 150000163
		//Map ID: 200
		var hall1 = { //2
			id: 1,
			minX: 137,
			minY: 119,
			maxX: 2997,
			maxY: 13237,
			conectorX: 2576,
			conectorY: 2389
		};
		var hall2 = { //1 y 3
			id: 2,
			minX: 2939,
			minY: 117,
			maxX: 5086,
			maxY: 3904,
			conectorX: 3809,
			conectorY: 2679
		};
		var center = { //2 , 4, 6 , 8
			id: 3,
			minX: 4670,
			minY: 2796,
			maxX: 14434,
			maxY: 8188,
			conectorX: 9900,
			conectorY: 4230
		};
		var hall3 = { //3 y 5
			id: 4,
			minX: 11083,
			minY: 8502,
			maxX: 12870,
			maxY: 13050,
			conectorX: 11880,
			conectorY: 9090
		};
		var hall4 = { //4
			id: 5,
			minX: 4683,
			minY: 10045,
			maxX: 11250,
			maxY: 12870,
			conectorX: 10710,
			conectorY: 11880
		};
		var hall5 = { //3 y 7
			id: 6,
			minX: 14609,
			minY: 5963,
			maxX: 16020,
			maxY: 8820,
			conectorX: 15210,
			conectorY: 7560
		};
		var hall6 = { //6
			id: 7,
			minX: 16200,
			minY: 7020,
			maxX: 20896,
			maxY: 13209,
			conectorX: 16830,
			conectorY: 9180
		};
		var hall7 = { //3 y 9
			id: 8,
			minX: 11179,
			minY: 233,
			maxX: 16124,
			maxY: 2485,
			conectorX: 13050,
			conectorY: 1530
		};
		var hall8 = { //8
			id: 9,
			minX: 16470,
			minY: 270,
			maxX: 20861,
			maxY: 5206,
			conectorX: 17487,
			conectorY: 1324
		};
		this.lowMap.push(hall1);
		this.lowMap.push(hall2);
		this.lowMap.push(center);
		this.lowMap.push(hall3);
		this.lowMap.push(hall4);
		this.lowMap.push(hall5);
		this.lowMap.push(hall6);
		this.lowMap.push(hall7);
		this.lowMap.push(hall8);
	}
	
	attackSkills() {
		if ((window.hero.skillname == "cyborg" && this.targetShip.hp > window.globalSettings.cyborgHp)||
				(window.hero.skillName == "venom" && this.targetShip.hp > window.globalSettings.venomHp)) { 
			this.useHability();
		} else if (window.hero.skillName == "diminisher" && this.targetShip.shd > window.globalSettings.diminisherSHD){
			this.useHability();
		} else if (window.hero.skillname == "sentinel" || window.hero.skillname == "tartarus"){
			this.useHability();
		} else if (window.hero.skillname == "spearhead") {
			this.useHabilityThree();   
		}
	}
}