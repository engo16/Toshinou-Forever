window.globalSettings = new GlobalSettings();
let api;
let notrightId;
let state = false;
let randomBreakCreated = false;

/* gets how many times the page reloaded it fixes the fake unsafe js */
let refreshCounter;
chrome.storage.local.get("refreshCount", function(result) {
	refreshCounter = result["refreshCount"];
});


$(document).ready(function () {
	api = new Api();

	let preloader = $("#preloader").attr("wmode", "opaque");
	$("#preloader").remove();

	let check = SafetyChecker.check();

	/* Try to fix false positive on JS Change it refreshes the page 3 times */
	if(refreshCounter > 0 && !check){
		api.changeRefreshCount(refreshCounter-1);
		window.location.reload();
	}


	if (check !== true) {
		let warning = jQuery("<div>");
		warning.css({
			top: 0,
			left: 0,
			position: "absolute",
			width: "100%",
			height: "100%",
			backgroundColor: "gray",
			textAlign: "center"
		});

		jQuery("<h1>").text("The tool detected changes in the game.").appendTo(warning);
		jQuery("<h2>").text("Loading stopped! Your account has to stay safe.").appendTo(warning);
		jQuery("<h3>").text("Reason: UNSAFE JS").appendTo(warning);

		warning.appendTo("body");
		throw new Error("Safety tests failed!");
	}

	preloader.appendTo($("#container"));

	window.settings = new Settings();
	window.newSettings = new Settings();
	window.initialized = false;
	window.reviveCount = 0;
	window.petReviveCount = 0;
	window.count = 0;
	window.movementDone = true;
	window.statusPlayBot = false;
	window.saved = false;
	window.loaded = false;
	window.refreshed = false;
	window.fleeingFromEnemy = false;
	window.hasJumped = false;
	window.debug = false;
	window.tickTime = window.globalSettings.timerTick;
	window.settings.moveRandomly = true;
	window.settings.killNpcs = false;
	window.settings.onlyAnswerAttacks = false;
	window.invertedMovement = false;
	let hm = new HandlersManager(api);

	hm.registerCommand(BoxInitHandler.ID, new BoxInitHandler());
	hm.registerCommand(ResourceInitHandler.ID, new ResourceInitHandler());
	hm.registerCommand(ShipAttackHandler.ID, new ShipAttackHandler());
	hm.registerCommand(ShipCreateHandler.ID, new ShipCreateHandler());
	hm.registerCommand(ShipMoveHandler.ID, new ShipMoveHandler());
	hm.registerCommand(AssetRemovedHandler.ID, new AssetRemovedHandler());
	hm.registerCommand(HeroInitHandler.ID, new HeroInitHandler(init));
	hm.registerCommand(ShipDestroyedHandler.ID, new ShipDestroyedHandler());
	hm.registerCommand(ShipRemovedHandler.ID, new ShipRemovedHandler());
	hm.registerCommand(GateInitHandler.ID, new GateInitHandler());
	hm.registerCommand(ShipSelectedHandler.ID, new ShipSelectedHandler());
	hm.registerCommand(MessagesHandler.ID, new MessagesHandler());
	hm.registerCommand(HeroDiedHandler.ID, new HeroDiedHandler());
	hm.registerCommand(HeroUpdateHitpointsHandler.ID, new HeroUpdateHitpointsHandler());
	hm.registerCommand(HeroUpdateShieldHandler.ID, new HeroUpdateShieldHandler());
	hm.registerCommand(AssetCreatedHandler.ID, new AssetCreatedHandler());
	hm.registerCommand(HeroAffectedHandler.ID, new HeroAffectedHandler());
	hm.registerCommand(GroupCreateHandler.ID, new GroupCreateHandler());
	hm.registerCommand(GroupShipUpdatePosHandler.ID, new GroupShipUpdatePosHandler());
	hm.registerCommand(AttackHandler.ID, new AttackHandler());
	hm.registerCommand(HeroPetUpdateHandler.ID, new HeroPetUpdateHandler());
	hm.registerCommand(PetUpdateFuel.ID, new PetUpdateFuel());
	hm.registerCommand(HeroJumpedHandler.ID, new HeroJumpedHandler());

	hm.registerEvent("updateHeroPos", new HeroPositionUpdateEventHandler());
	hm.registerEvent("movementDone", new MovementDoneEventHandler());
	hm.registerEvent("isDisconnected", new HeroDisconnectedEventHandler());
	hm.registerEvent("isConnected", new HeroConnectedEventHandler());

	hm.listen();
});

function init() {
	if (window.initialized)
		return;

	window.minimap = new Minimap(api);
	window.minimap.createWindow();

	window.attackWindow = new AttackWindow();
	window.attackWindow.createWindow();

	window.generalSettingsWindow = new GeneralSettingsWindow();
	window.generalSettingsWindow.createWindow();

	window.statisticWindow = new StatisticWindow();
	window.statisticWindow.createWindow();

	window.autolockWindow = new AutolockWindow();
	window.autolockWindow.createWindow();
	
	if (window.globalSettings.debug) {
		window.debugWindow = new DebugWindow();
		window.debugWindow.createWindow();
	}

	Injector.injectScriptFromResource("res/injectables/HeroPositionUpdater.js");

	let npcList = window.globalSettings.npcList;
	for (i = 0; i < npcList.length; i++) {
		window.settings.updateNpc(npcList[i]["name"], npcList[i]);
	}

	window.settings.moveRandomly = window.globalSettings.moveRandomly;
	window.settings.killNpcs = window.globalSettings.killNpcs;
	window.settings.circleNpc = window.globalSettings.circleNpc;
	window.settings.dontCircleWhenHpBelow25Percent = window.globalSettings.dontCircleWhenHpBelow25Percent;
	window.setInterval(logic, window.tickTime);


	/* set refreshcount to 3 if page loaded until here */
	api.changeRefreshCount(3);

	if (window.globalSettings.autoPlay > 0) {
		setTimeout(() => {
			window.settings.pause = false;
			let cntBtnPlay = $('.cnt_btn_play .btn_play');
			cntBtnPlay.html("Stop");
			cntBtnPlay.removeClass('in_play').addClass('in_stop');
			window.statusPlayBot = !window.statusPlayBot;
			switch(window.globalSettings.autoPlay) {
			    case "2":
			    	window.settings.palladium = true;
			        break;
			    case "3":
			    	window.settings.piratebot = true;
			        break;
				case "4":
					window.settings.cubibot = true;
			        break;
			    case "5":
			    	window.settings.cubibot = true;
			        break;
			    case "6":
			    	window.settings.ggbot = true;
			        break;
			    case "7":
			    	window.settings.sentinelMode = true;
			        break;
			}
		}, 1000);
	} else {
		window.settings.pause = true;
	}

	$(document).keyup(function (e) {
		let key = e.key;

		if (key == "Pause") {
			if (!window.settings.pause) {
				$('.cnt_btn_play .btn_play').html("Play").removeClass('in_stop').addClass('in_play');
				api.resetTarget("all");
				window.fleeingFromEnemy = false;
				window.settings.pause = true;
			} else {
				$('.cnt_btn_play .btn_play').html("Stop").removeClass('in_play').addClass('in_stop');
				window.settings.pause = false;
			}
		} 
		if (key == "x"||key == "ч" && (!window.settings.autoAttack|| (!api.lastAutoLock || $.now() - api.lastAutoLock > 1000)) ||
		key == "z"||key == "я" && (!window.settings.autoAttack || (!api.lastAutoLock || $.now() - api.lastAutoLock > 1000))) {
			let maxDist = 20000;
			let finDist = 1000000;
			let finalShip;

			for (let property in api.ships) {
				let ship = api.ships[property];
				let dist = ship.distanceTo(window.hero.position);

				if (dist < maxDist && dist < finDist && ((ship.isNpc && window.settings.lockNpc && key == "x"||key == "ч") ||
				  										(!ship.isNpc && ship.isEnemy && window.settings.lockPlayers && key == "z"||key == "я"))) {
					finalShip = ship;
					//alert(finalShip.name);
					finDist = dist;
				}
			}
			if (finalShip != null) {
				if (!window.settings.autoAttack){
					api.lockShip(finalShip);
					api.lastAutoLock = $.now();
					api.autoLocked = true;
				}else {
					api.lockShip(finalShip);
					api.lastAutoLock = $.now();
					api.autoLocked = true;
					api.startLaserAttack();

				}
				
			}
		}



	});

	$(document).on('click', '.cnt_minimize_window', () => {
		if (window.statusMiniWindow) {
			window.mainWindow.slideUp();
		} else {
			window.mainWindow.slideDown();
		}
		window.statusMiniWindow = !window.statusMiniWindow;
	});


	let cntBtnPlay = $('.cnt_btn_play .btn_play');
	cntBtnPlay.on('click', (e) => {
		if (window.statusPlayBot) {
			cntBtnPlay.html("Play");
			cntBtnPlay.removeClass('in_stop').addClass('in_play');
			api.resetTarget("all");
			window.fleeingFromEnemy = false;
			window.settings.pause = true;
		} else {
			cntBtnPlay.html("Stop");
			cntBtnPlay.removeClass('in_play').addClass('in_stop');
			window.settings.pause = false;
		}
		window.statusPlayBot = !window.statusPlayBot;
	});

	let reloadBtn = $('.reloadSettings .btn_reload');
	reloadBtn.on('click', (e) => {
		window.globalSettings = new GlobalSettings();
		api.rute = null;
		setTimeout(() => {
			window.settings.moveRandomly = window.globalSettings.moveRandomly;
			window.settings.killNpcs = window.globalSettings.killNpcs;
			window.settings.circleNpc = window.globalSettings.circleNpc;
			window.settings.dontCircleWhenHpBelow25Percent = window.globalSettings.dontCircleWhenHpBelow25Percent;
			if(window.settings.npcs != null){
				let npcList = window.globalSettings.npcList;
				for (i = 0; i < npcList.length; i++) {
					window.settings.updateNpc(npcList[i]["name"], npcList[i]);
				}
			}
		}, 7000);
	});
}

function logic() {
	let circleBox = null;
	
	if (api.isDisconnected) {
		api.resetTarget("all");
		if (window.fleeingFromEnemy) {
			window.fleeFromEnemy = false;
		}
		if (api.disconnectTime && $.now() - api.disconnectTime > 5000 && (!api.reconnectTime || (api.reconnectTime && $.now() - api.reconnectTime > 15000)) && window.reviveCount < window.globalSettings.reviveLimit) {
			api.reconnect();
		}
		if (api.disconnectTime && $.now() - api.disconnectTime > 120000 && window.globalSettings.refreshToReconnect) {
			window.location.reload();
			state = true;
		}
		return;
	}
	
	window.minimap.draw();

	if (api.targetShip && api.attacking) {
		if(window.globalSettings.changeAmmunition) {
			api.chooseAmmunition();
		}
	}
	
	if (window.globalSettings.debug) {
		if (window.settings.showCoordinates) {
			console.log("X: " + window.hero.position.x + " | Y: " + window.hero.position.y);
		}
		if (window.settings.showMapID) {
			console.log(window.hero.mapId);
		}
		if (window.settings.showNearestPortal) {
			let gate = api.findNearestGate();
			if (gate.gate) {
				console.log(gate.gate);
			}
		}
		if (window.settings.showenemy) {
				for (let property in api.ships) {
					let ship = api.ships[property];
					if (ship.isNpc) {
						fillStyle = "rgb(255, 0, 245)";
					} else if (ship.isEnemy) {
						fillStyle = "rgb(255, 0, 0)";
					} else if ((ship.cloaked)) {
						fillStyle = "rgb(151, 0, 0)";
					}else {
						fillStyle = "rgb(0, 125, 255)";
					}
					arkaplan = "rgb(54, 57, 63)";
				console.log('%c'+ship.name+" "+"X:"+ship.position.x+" "+"Y:"+ship.position.y+" "+"Id:"+ship.id,'background: '+arkaplan+ '; color: '+fillStyle+'; display: block;') ;
			}
			
				for (var property in api.boxes) {
				var box = api.boxes[property];
					fillStyle = BoxType.getColor(box.type);
					console.log('%c'+box.type+" "+"X:"+box.position.x+" "+"Y:"+box.position.y,'background: '+arkaplan+ '; color: '+fillStyle+'; display: block;' );
				}

			
		}
	}
	if (window.globalSettings.enableRefresh && !window.settings.ggbot && (window.settings.runtime >= window.globalSettings.refreshTime)) {
		if ((api.Disconected && !state) || window.settings.palladium) {
			window.location.reload();
			state = true;
		} else {
			let gate = api.findNearestGate();
			if (gate.gate) {
				let x = gate.gate.position.x + MathUtils.random(-100, 100);
				let y = gate.gate.position.y + MathUtils.random(-100, 100);
				if (window.hero.position.distanceTo(gate.gate.position) < 200 && !state) {
					window.location.reload();
					state = true;
				}
				api.resetTarget("all");
				api.moveWithFilter(x, y);
				return;
			}
		}   
	}
	
	if (api.heroDied || window.settings.pause || (window.globalSettings.fleeFromEnemy && window.fleeingFromEnemy) || window.settings.waitingAfterDead) {
		return;
	}

	let x;
	let y;
	
	/* Dodge the CBS */
	if (window.globalSettings.dodgeTheCbs && api.battlestation != null) {
		if (api.battlestation.isEnemy && Object.keys(api.battlestation.modules).length > 0) {
			let result = api.checkForCBS();
			if (result.walkAway) {
				if (api.targetBoxHash) {
					let box = api.boxes[api.targetBoxHash];
					if (box && box.distanceTo(result.cbsPos) < 1800) {
						delete api.boxes[api.targetBoxHash];
						api.blackListHash(api.targetBoxHash);
						api.resetTarget("box");
					}
				}

				let f = Math.atan2(window.hero.position.x - result.cbsPos.x, window.hero.position.y - result.cbsPos.y) + 0.5;
				let s = Math.PI / 180;
				f += s;
				x = result.cbsPos.x + 1800 * Math.sin(f);
				y = result.cbsPos.y + 1800 * Math.cos(f);
				api.moveWithFilter(x, y);
				return;
			}
		}
	}
	
	if (window.globalSettings.randomBreaks && !randomBreakCreated && !window.settings.ggbot && !window.settings.palladium && !api.targetShip) {
		setTimeout(function(){
			let gate = api.findNearestGate();
			if (gate.gate) {
				let x = gate.gate.position.x + MathUtils.random(-100, 100);
				let y = gate.gate.position.y + MathUtils.random(-100, 100);
				api.resetTarget("all");
				api.moveWithFilter(x, y);
				window.settings.pause = true;
				setTimeout(function(){
					window.settings.pause = false;
					randomBreakCreated = false;
				}, MathUtils.random(1, 10)*60000);
				return;
			}
		}, MathUtils.random(45, 90)*60000);
		randomBreakCreated = true;
	}

	if ((window.globalSettings.stopafterxminutes != 0 && window.settings.runtime >= window.globalSettings.stopafterxminutes && !window.settings.ggbot) || (window.globalSettings.stopWhenCargoIsFull && window.hero.cargoIsFull)) {
		if (window.settings.palladium && window.hero.hp == window.hero.maxHp) {
			window.settings.pause = true;
			setTimeout(() => {
				api.pressKey(76);
			}, 7000);
		} else {
			let gate = api.findNearestGate();
			if (gate.gate) {
				let x = gate.gate.position.x + MathUtils.random(-100, 100);
				let y = gate.gate.position.y + MathUtils.random(-100, 100);
				if (window.hero.position.distanceTo(gate.gate.position) < 200 && !state) {
					window.settings.pause = true;
					setTimeout(() => {
						api.pressKey(76);
					}, 7000);
				}
				api.resetTarget("all");
				api.moveWithFilter(x, y);
				return;
			}
		}
	}

	if (window.globalSettings.useHability) {
		if (window.hero.skillName == "solace"){
			if (MathUtils.percentFrom(window.hero.hp, window.hero.maxHp) < 70) {
				if(api.useHability()){
					return;
				}
			}
		} else if (window.hero.skillName == "aegis" || window.hero.skillName == "hammerclaw"){
			if ((window.hero.maxHp - window.hero.hp) >= 150000) {
				api.useHability();
			}
			if ((window.hero.maxShd - window.hero.shd) >= 100000) {
				api.useHabilityTwo();
			}
		} else if (window.hero.skillName == "spearhead") {
			api.useHabilityFour();
		} else if (window.hero.skillName == "citadel" && window.settings.palladium) {
			api.useHabilityTwo();
			api.useHabilityThree();
		}
	}

	if ((api.isRepairing && window.hero.hp !== window.hero.maxHp) && !window.settings.ggbot && !window.settings.palladium) {
		if (window.globalSettings.useHability && (window.hero.skillName == "aegis" || window.hero.skillName == "hammerclaw")){
			api.useHabilityThree();
		}
		return;
	} else if (api.isRepairing && window.hero.hp === window.hero.maxHp) {
		api.isRepairing = false;
		api.attackMode();
	}

	if ($.now() - api.resetBlackListTime > api.blackListTimeOut) {
		api._blackListedBoxes = [];
		api.resetBlackListTime = $.now();
	}

	/* GG BOT for Alpha, Beta and Gamma Gates */
	if(window.settings.ggbot){
		window.settings.moveRandomly = true;
		window.settings.killNpcs = true;
		window.settings.circleNpc = true;
		api.resetTargetWhenHpBelow25Percent = true;
		window.settings.dontCircleWhenHpBelow25Percent = false;
		if (window.hero.mapId == 73) {
			api.ggZetaFix();
		} else if (window.hero.mapId == 55) {
			api.ggDeltaFix();
		}
		if (api.targetBoxHash == null) {
			api.jumpInGateByType(2, window.globalSettings.alpha);
			api.jumpInGateByType(3, window.globalSettings.beta);
			api.jumpInGateByType(4, window.globalSettings.gamma);
			api.jumpInGateByType(5, window.globalSettings.delta);
			api.jumpInGateByType(53, window.globalSettings.epsilon);
			api.jumpInGateByType(54, window.globalSettings.zeta);
			api.jumpInGateByType(70, window.globalSettings.kappa);
			api.jumpInGateByType(71, window.globalSettings.lambda);
			api.jumpInGateByType(72, window.globalSettings.kronos);
			api.jumpInGateByType(74, window.globalSettings.hades);
			api.jumpInGateByType(82, window.globalSettings.kuiper);
		}
	}

	if (window.globalSettings.enablePet && window.petReviveCount < window.globalSettings.petReviveLimit && api.petHasFuel && window.settings.runtime >= 1) {
		if (api.pet != null && api.pet.destroyed && api.pet.id != 0) {
			setTimeout(() => {
				api.callPet(4);
				api.pet.destroyed = false;
			}, 1000);
		} else if (api.pet == null || api.pet.id == 0) {
			api.callPet(0);
		} else if (window.globalSettings.petModule != 0 && ($.now() - api.pet.activateTimer) > 10000) {
			if (window.globalSettings.petModule == 10) {
				if ($.now() - api.pet.moduleCooldown > 35000) {
					api.changePetModule(window.globalSettings.petModule);
				} else {
					api.changePetModule(2);
				}
			} else {
				api.changePetModule(window.globalSettings.petModule);
			}
		}
	}

	if (window.globalSettings.fleeFromEnemy) {
		let enemyResult = api.checkForEnemy();

		if (enemyResult.run && (!window.globalSettings.onlyEscapeWhenEnemyAttack || (window.globalSettings.onlyEscapeWhenEnemyAttack && enemyResult.enemy.attacksUs))) {
			if (window.globalSettings.useHability) {
				if (enemyResult.enemy.attacksUs) {
					if (window.hero.skillname == "mimesis") {
						api.useHabilityTwo();
					}
					if (window.hero.skillName == "spectrum" || window.hero.skillName == "v-lightning" || window.hero.skillname == "mimesis") {
						api.useHability();
					} else if (window.hero.skillName == "citadel") {
						api.useHabilityTwo();
					} else if (window.hero.skillName == "spearhead" && enemyResult.edist <= 300) {
						api.useHabilityTwo();
					}
				} else {
					if (window.hero.skillName == "spearhead") {
						api.useHability();
					}
				}
			}
			if (window.globalSettings.respondPlayerAttacks && enemyResult.enemy.attacksUs && enemyResult.enemy.isEnemy) {
				api.lockShip(enemyResult.enemy);
				api.triedToLock = true;
				api.targetShip = enemyResult.enemy;
				if (!api.attacking && api.lockedShip) {
					api.startLaserAttack();
					api.lastAttack = $.now();
					api.attacking = true;
					return;
				}
			}
			if (window.globalSettings.jumpFromEnemy && !window.hasJumped & !window.settings.palladium) {
				api.escapeMode();
				let gate = api.findNearestGate();
				if (gate.gate) {
					let x = gate.gate.position.x + MathUtils.random(-100, 100);
					let y = gate.gate.position.y + MathUtils.random(-100, 100);
					let dist = window.hero.distanceTo(gate.gate.position);
					api.moveWithFilter(x, y);
					if (api.jumpAndGoBack(gate.gate.gateId)) {
						window.movementDone = false;
						window.fleeingFromEnemy = true;
						window.hasJumped = true;
						setTimeout(() => {
							window.movementDone = true;
							window.fleeingFromEnemy = false;
							window.hasJumped = false;
							if (window.globalSettings.autoChangeConfig){
								if (window.globalSettings.attackConfig != window.hero.shipconfig) {
									api.changeConfig();
								}
								if(window.globalSettings.changeFormation && api.formation != window.globalSettings.flyingFormation){
									api.changeFormation(window.globalSettings.flyingFormation);
								}
							}
						}, MathUtils.random(10000, 25000));
					}
					return;
				}
			} else if (!window.settings.palladium) {
				api.escapeMode();
				let gate = api.findNearestGateForRunAway(enemyResult.enemy);
				if (gate.gate) {
					let x = gate.gate.position.x + MathUtils.random(-100, 100);
					let y = gate.gate.position.y + MathUtils.random(-100, 100);
					let dist = window.hero.distanceTo(gate.gate.position);
					api.resetTarget("all");
					api.moveWithFilter(x, y);
					window.fleeingFromEnemy = true;
					setTimeout(() => {
						window.movementDone = true;
						window.fleeingFromEnemy = false;
						if (window.globalSettings.autoChangeConfig && window.globalSettings.attackConfig != window.hero.shipconfig) {
							api.changeConfig();
						}
						if (window.globalSettings.changeFormation && api.formation != window.globalSettings.flyingFormation) {
							api.changeFormation(window.globalSettings.flyingFormation);
						}
					}, MathUtils.random(10000, 25000));
					return;
				}
			}
		}
	}


	if (MathUtils.percentFrom(window.hero.hp, window.hero.maxHp) < window.globalSettings.repairWhenHpIsLowerThanPercent || api.isRepairing && !window.settings.cubibot) {
		if (window.settings.ggbot) {
			api.resetTarget("all");
			let npcCount = api.countNpcAround(1000);
			if (npcCount > 0) {
				let ship = api.findNearestShip();
				ship.ship.update();
				let f = Math.atan2(window.hero.position.x - ship.ship.position.x, window.hero.position.y - ship.ship.position.y) + 0.5;
				let s = Math.PI / 180;
				f += s;
				let x = 10890 + 4000 * Math.sin(f);
				let y = 6750 + 4000 * Math.cos(f);
				if (x > 20800 && x < 500 && y > 12900 && y < 500) {
					x = MathUtils.random(500, 20800);
					y = MathUtils.random(500, 12900);
				} else {
					api.moveWithFilter(x, y);
				}
				api.isRepairing = true;
				return;
			} else {
				return;
			}
		} else if (!window.settings.palladium && !window.settings.piratebot) {
			let gate = api.findNearestGate();

			if (window.globalSettings.useCBSZoneSegure) {
				if (api.battlestation != null && !api.battlestation.isEnemy) {
					if (api.battlestation.distanceTo(window.hero.position) < gate.gate.distanceTo(window.hero.position)) {
						api.resetTarget("all");
						let x = api.battlestation.position.x + MathUtils.random(-100, 100);
						let y = api.battlestation.position.y + MathUtils.random(-100, 100);
						api.moveWithFilter(x, y);
						api.escapeMode();
						api.isRepairing = true;
						return;
					}
				}
			}

			if (gate.gate) {
				api.resetTarget("all");
				if (window.globalSettings.jumpFromEnemy) {
					if (api.jumpAndGoBack(gate.gate.gateId)) {
						api.isRepairing = true;
					}
					return;
				} else {
					let x = gate.gate.position.x + MathUtils.random(-100, 100);
					let y = gate.gate.position.y + MathUtils.random(-100, 100);
					api.moveWithFilter(x, y);
					api.escapeMode();
					api.isRepairing = true;
					return;
				}
			}
		} else if (window.settings.palladium) {
			if (api.targetShip == null) {
				api.palladiumrevivefixit();
				return;
			} else {
				api.isRepairing = false;
			}
		} else if (window.settings.piratebot) {
				api.piraterevfix();
				return;
		}
	}

		if (!window.settings.ggbot && window.globalSettings.workmap != 0 && window.hero.mapId != window.globalSettings.workmap && !window.settings.sentinelMode) {
		api.speedMode();
		api.goToMap(window.globalSettings.workmap);
		return;
		if (window.hero.mapId != api.sentinelship.mapId){
			api.speedMode();
			api.goToMap(api.sentinelship.mapId);
			return;
		}
	}else if (window.settings.palladium){
		if (window.hero.mapId == 93){
			
		}else {
		  api.speedMode();
		  api.goToMap(93);
		  return;
		}
		  
	  }  else {
		api.rute = null;
	}

	if (window.X1Map) {
		api.rute = null;
		return;
	}

	if (window.settings.palladium) {
		let gate5344vru = api.findGatebyID(150000435);
		let gate5344eic = api.findGatebyID(150000433);
		let gate5344mmo = api.findGatebyID(150000431);
		if (window.hero.position.distanceTo(gate5344mmo.gate.position)||window.hero.position.distanceTo(gate5344vru.gate.position)||window.hero.position.distanceTo(gate5344eic.gate.position)){
			if (window.hero.maxHp == window.hero.hp){
				api.pressKey(74);
				api.isRepairing = false;
			} else {
				api.isRepairing = true;
				window.settings.moveRandomly = false;
				window.settings.circleNpc = false;
				window.settings.onlyAnswerAttacks = false;
				window.settings.dontCircleWhenHpBelow25Percent = false;
				window.settings.killNpcs = false;
			}
		 		
		}
		if(window.settings.palladium && window.hero.mapId == "93" && (window.hero.position.x < 30000 && window.hero.position.y < 15000)){
		api.pirate53topala();
	  } else if (window.hero.position.x > 28500  && window.hero.position.y > 16000 && 17500 > window.hero.position.y){
	  	api.pirate53topala();
	  }else{
			let palladiumBlackList = [
				"( Uber Annihilator )", 
				"( Uber Saboteur )", 
				"( Uber Barracuda )",
				];
			palladiumBlackList.forEach(npc => {
				window.settings.setNpc(npc, "0");
			});
			window.settings.setNpc("-=[ Battleray ]=-", "1");
			window.settings.setNpc("-=[ Interceptor ]=-", "4");

			window.settings.moveRandomly = true;
			window.settings.circleNpc = true;
			window.settings.onlyAnswerAttacks = true;
			window.settings.dontCircleWhenHpBelow25Percent = false;
			window.settings.killNpcs = true;
			if (11934 < window.hero.position.x && 32318 > window.hero.position.x && 18105 < window.hero.position.y && 25552 > window.hero.position.y) {	
			if (!window.settings.cubibot &&window.settings.palladium && api.targetBoxHash == null && api.targetShip == null && window.movementDone && window.settings.moveRandomly) {
				api.speedMode();
				x = MathUtils.random(13000, 30400);
				y = MathUtils.random(19000, 25500);
				api.moveWithFilter(x, y);
				movementDone=false;
			  }
			} else {
				x = MathUtils.random(13000, 30400);
				y = MathUtils.random(19000, 25500);
				api.moveWithFilter(x, y);
				
			}
		}
	}
	if(window.hero.position.x > 8800 && window.hero.position.x < 11700){
		console.log("ortadayımmm");
	}

	if (window.settings.piratebot) {
		let korsanbotBlackList = [
			"-=[ Battleray ]=-",
			"( Uber Annihilator )", 
			"( Uber Saboteur )", 
			"( Uber Barracuda )",
			];
			korsanbotBlackList.forEach(npc => {
			  window.settings.setNpc(npc, "0");
			});
			window.settings.setNpc("-=[ Saboteur ]=-", "5");
			window.settings.setNpc("-=[ Interceptor ]=-", "2");
			window.settings.setNpc("-=[ Annihilator ]=-", "4");
			  window.settings.setNpc("-=[ Barracuda ]=-", "3");
			window.settings.killNpcs = true;
			window.settings.gatestonpc = true;
			window.settings.moveRandomly = true;
			window.settings.circleNpc = false;
			if (api.lockedShip && api.lockedShip.name == "-=[ Interceptor ]=-"){
			  window.settings.circleNpc = true;
			} else if(api.lockedShip && api.lockedShip.percentOfHp > 98){
			  window.settings.circleNpc = true;
			} else{
			  window.settings.circleNpc = false;
			}
			if(window.hero.position.x > 11600 && window.hero.position.x < 16000){
				api.piratebotorta();
				api.resetTarget("all");	
				window.movementDone = true;
				return;
			}
			if(api.isRepairing){
				api.piraterevfix();
			}
			
			
		
		}

	if(window.hero.position.x > 11600 && window.hero.position.x < 16000 && window.settings.piratebot){
				api.piratebotorta();
				api.resetTarget("all");	
				window.movementDone = true;
				return;
	}
	if (window.settings.cubibot) {
		if (window.hero.mapId == 18||window.hero.mapId == 22||window.hero.mapId == 26){//← harita dışında olursa çalışmaz
			let cubibotblacklist = [
				"-=[ Kristallin ]=-",
				"-=[ Kristallon ]=-",
				"..::{ Boss Kristallin }::..",
				"-=[ Plagued Kristallin ]=-",
				"-=[ Protegit ]=-",
				];
				let prodegitbotblacklist = [
				"-=[ Kristallin ]=-",
				"-=[ Kristallon ]=-",
				"..::{ Boss Kristallin }::..",
				"-=[ Plagued Kristallin ]=-",
				];
				
			
				window.settings.killNpcs = true;
				window.settings.moveRandomly = true;
				window.settings.circleNpc = true;
				let gate = api.findNearestGate();
				if (window.settings.prodegit){ //prodegit bot başlangic
				  if (api.lockedShip && api.lockedShip.percentOfHp > 5 && api.lockedShip.name == "-=[ Cubikon ]=-"){
					api.resetTarget("enemy");
				  }
				  window.settings.setNpc("-=[ Protegit ]=-", "1");
				  window.settings.setNpcrange("-=[ Protegit ]=-", "150");

	
				  prodegitbotblacklist.forEach(npc => {
				  window.settings.setNpc(npc, "0"); });
					
				  let percenlife = MathUtils.percentFrom(window.hero.hp, window.hero.maxHp);
				  if (percenlife < 99) {
					api.protegitmode;     
				  } 
				} else {// cubikon bot başlangıc- protegit bot bitiş
				  cubibotblacklist.forEach(npc => {
				  window.settings.setNpc(npc, "0"); });
				  if (window.hero.shd < 15000 && window.globalSettings.attackConfig){
					api.escapeMode();
				  }	
				  if (window.settings.cubiv2pro){//cubi v2 protegit
					  window.settings.setNpc("-=[ Protegit ]=-", "1");
					  window.settings.setNpc("-=[ Cubikon ]=-", "3");
					
				  }else {
					window.settings.setNpc("-=[ Protegit ]=-", "0");
				  }//cubi v2 protegit bitiş
				  if (api.lockedShip && api.lockedShip.percentOfHp < 0 && api.lockedShip.name == "-=[ Cubikon ]=-"){
					let percenlife = MathUtils.percentFrom(window.hero.hp, window.hero.maxHp);	
					if (percenlife < 30){
						if (gate.gate) {
								let x = gate.gate.position.x + MathUtils.random(-100, 100);
								let y = gate.gate.position.y + MathUtils.random(-100, 100);
								api.moveWithFilter(x, y);
								window.movementDone = false;
								api.escapeMode();
								if (window.hero.maxShd == window.hero.maxShd){
									api.attackConfig();
									if (window.hero.maxShd == window.hero.maxShd){
									  api.escapeMode();
									  api.isRepairing = true;
									  return;
									}
								}
							return;
							}
						}
					}
				
				}// cubikon bot bitiş

		}else {//↓harita dışında ise harıtaya gider 
		  api.speedMode();
		  if(window.hero.factionId == 1){
			api.goToMap(18);
		  } else if(window.hero.factionId == 2){
			api.goToMap(22);
		  } else if(window.hero.factionId == 3){
			api.goToMap(26);
		  }
		  return;
		}
		//↓ tamir olması gerekiyor 
		if (MathUtils.percentFrom(window.hero.hp, window.hero.maxHp) < window.globalSettings.repairWhenHpIsLowerThanPercent){
			if (gate.gate) {
				let x = gate.gate.position.x + MathUtils.random(-100, 100);
				let y = gate.gate.position.y + MathUtils.random(-100, 100);
				api.moveWithFilter(x, y);
				window.movementDone = false;
				api.escapeMode();
				if (window.hero.maxShd == window.hero.maxShd){
					api.attackConfig();
					if (window.hero.maxShd == window.hero.maxShd){
						api.escapeMode();
						api.isRepairing = true;
						return;
					}
				}
				return;
			}
		}
			
	}

	if (window.settings.sentinelMode && api.sentinelship != null) {
		sentinelLogic();
		return;
	}

	if (api.targetBoxHash == null && api.targetShip == null) {
		let ship = api.findNearestShip();

		if (!ship.ship || ship.distance > 1000) {
			let box = api.findNearestBox();
			if (box.box) {
				api.collectBox(box.box);
				api.targetBoxHash = box.box.hash;
				return;
			}
		}
		if (ship.ship && ship.distance < 1000 && window.settings.killNpcs && ship.ship.id != notrightId) {
			api.lockShip(ship.ship);
			api.triedToLock = true;
			api.targetShip = ship.ship;
			return;
		} else if (ship.ship && window.settings.killNpcs && ship.ship.id != notrightId && !window.settings.palladium) {
			ship.ship.update();
			api.moveWithFilter(ship.ship.position.x - MathUtils.random(-50, 50), ship.ship.position.y - MathUtils.random(-50, 50));
			api.targetShip = ship.ship;
			return;
		} else if (window.settings.palladium) {
			api.resetTarget("enemy");
		}
	}

	if (api.targetShip && window.settings.killNpcs) {
		if (!api.triedToLock && (api.lockedShip == null || api.lockedShip.id != api.targetShip.id)) {
			api.targetShip.update();
			let dist = api.targetShip.distanceTo(window.hero.position);
			if (dist < 600) {
				api.lockShip(api.targetShip);
				api.triedToLock = true;
				return;
			}
		}

		if (!api.attacking && api.lockedShip && api.lockedShip.shd + 1 != api.lockedShip.maxShd && window.globalSettings.avoidAttackedNpcs && !window.settings.sentinelMode && !window.settings.ggbot) {
			notrightId = api.lockedShip.id;
			api.resetTarget("enemy");
			return;
		}

		if (!api.attacking && api.lockedShip && api.lockedShip.shd + 1 == api.lockedShip.maxShd && window.globalSettings.avoidAttackedNpcs || !api.attacking && api.lockedShip && !window.globalSettings.avoidAttackedNpcs) {
			api.startLaserAttack();
			api.lastAttack = $.now();
			api.attacking = true;
			return;
		}
	}

	if (api.targetBoxHash && window.hero.position.x < 16000 && window.settings.piratebot&&window.hero.mapId == 92) {
		let box = api.boxes[api.targetBoxHash];
		if (box && box.position.x < 16000) {
			delete api.boxes[api.targetBoxHash];
			api.resetTarget("box");
			return;
		} else if(window.hero.position.x > 200&&window.hero.position.x < 4600){
			if (box && box.position.x > 4600) {
				delete api.boxes[api.targetBoxHash];
				api.resetTarget("box");
				return;
			}
		}
	}else {
		if (api.targetBoxHash && $.now() - api.collectTime > 7000) {
			let box = api.boxes[api.targetBoxHash];
			if (box && box.distanceTo(window.hero.position) > 1000) {
					api.collectTime = $.now();
			} else {
				delete api.boxes[api.targetBoxHash];
				api.blackListHash(api.targetBoxHash);
				api.resetTarget("box");
				return;
			}
		}
	}

	if ((api.targetShip && $.now() - api.lockTime > 5000 && !api.attacking) || ($.now() - api.lastAttack > 10000)) {
		api.resetTarget("enemy");
	}

	if (!window.settings.cubibot && !window.bigMap && !window.settings.palladium && api.targetBoxHash == null && api.targetShip == null && window.movementDone && window.settings.moveRandomly) {
		api.speedMode();
		x = MathUtils.random(200, 20800);
		y = MathUtils.random(200, 12900);
	  } else if (!window.settings.cubibot && window.bigMap && !window.settings.palladium && api.targetBoxHash == null && api.targetShip == null && window.movementDone && window.settings.moveRandomly) {
		api.speedMode();
		x = MathUtils.random(500, 41500);
		y = MathUtils.random(500, 25700);
	  }
	  if (window.settings.cubibot && 100 < window.hero.position.x && 9900 > window.hero.position.x && 6500 < window.hero.position.y && 12600 > window.hero.position.y && api.targetBoxHash == null && api.targetShip == null && window.movementDone && window.settings.moveRandomly) {
			x = MathUtils.random(7400, 7600);
			y = MathUtils.random(3800, 4000);   
		} else if (window.settings.cubibot && 100 < window.hero.position.x && 9900 > window.hero.position.x && 100 < window.hero.position.y && 6500 > window.hero.position.y && api.targetBoxHash == null && api.targetShip == null && window.movementDone && window.settings.moveRandomly) {
			x = MathUtils.random(13300, 13500);
			y = MathUtils.random(3800, 4000);   
		} else if (window.settings.cubibot && 9900 < window.hero.position.x && 20000 > window.hero.position.x && 100 < window.hero.position.y && 6500 > window.hero.position.y && api.targetBoxHash == null && api.targetShip == null && window.movementDone && window.settings.moveRandomly) {
			x = MathUtils.random(13300, 13500);
			y = MathUtils.random(7800, 8000);   
		}else if (window.settings.cubibot && 9900 < window.hero.position.x && 20000 > window.hero.position.x && 6500 < window.hero.position.y && 12600 > window.hero.position.y && api.targetBoxHash == null && api.targetShip == null && window.movementDone && window.settings.moveRandomly) {
			x = MathUtils.random(7400, 7600);
			y = MathUtils.random(7800, 8000);   
	  }else if (window.settings.cubibot && 10500 < window.hero.position.y && api.targetBoxHash == null && api.targetShip == null && window.movementDone && window.settings.moveRandomly) {
			x = MathUtils.random(7400, 7600);
			y = MathUtils.random(7800, 8000);   
		}else if (window.settings.piratebot&&window.hero.position.x >	16000 && api.targetBoxHash == null && api.targetShip == null && window.movementDone && window.settings.moveRandomly){
			x = MathUtils.random(16100, 20300);
			y = MathUtils.random(1100, 11100);
		} else if (window.settings.piratebot && window.hero.position.x < 11600 && api.targetBoxHash == null && api.targetShip == null && window.movementDone && window.settings.moveRandomly) { 
			x = MathUtils.random(600, 4600);
			y = MathUtils.random(1500, 11500);  
		}
	if(api.attacking==true && window.movementDone == true){
		window.movementDone = false;
	}
	
	if (api.targetShip && window.settings.killNpcs && api.targetBoxHash == null) {
		api.targetShip.update();
		let dist = api.targetShip.distanceTo(window.hero.position);
		let radius = 500;
		if (api.lockedShip && api.lockedShip.id == api.targetShip.id) {
			radius = window.settings.getNpc(api.lockedShip.name)["range"];
		}
		if(radius == null || radius < 400){
			radius = window.settings.npcCircleRadius;
		}
		if(api.attacking){
			if(window.globalSettings.useHability && dist < 1000){
				api.attackSkills();
			}
			if (!window.settings.cubiv2pro){
				api.attackMode();
			}else if (api.lockedShip.name == "-=[ Cubikon ]=-"){
				api.attackMode();
			}else if (api.lockedShip.name == "-=[ Protegit ]=-"){
				api.escapeMode();
			}else {
				api.attackMode();
			}
			if(window.globalSettings.useHability && window.hero.skillName && dist < 1000){
				if ((window.hero.skillname == "cyborg" && api.targetShip.hp > 100000)||
						(window.hero.skillName == "venom" && api.targetShip.hp > 60000))
				{ 
					api.useHability();
				} else if (window.hero.skillName == "diminisher" && api.targetShip.shd > 60000){
					api.useHability();
				} else if (window.hero.skillname == "sentinel" || window.hero.skillname == "tartarus"){
					api.useHability();
				} else if (window.hero.skillname == "spearhead") {
					api.useHabilityThree();   
				}
			}
		}
	
		if (window.settings.ggbot && api.targetShip.position.x == 20999 && api.targetShip.position.y == 13499) {
			x = 20495;
			y = 13363;
		} else if (window.settings.ggbot && api.targetShip.position.x == 0 && api.targetShip.position.y == 0) {
			x = 450;
			y = 302;
		} else if (api.resetTargetWhenHpBelow25Percent && api.lockedShip && api.lockedShip.percentOfHp < 25 && api.lockedShip.id == api.targetShip.id) {
			console.log("1");
			api.resetTarget("enemy");
		} else if ((dist > radius && (api.lockedShip == null || api.lockedShip.id != api.targetShip.id) && $.now() - api.lastMovement > 1000)) {
			x = api.targetShip.position.x - MathUtils.random(-50, 50);
			y = api.targetShip.position.y - MathUtils.random(-50, 50);
			api.lastMovement = $.now();
		} else if (api.lockedShip && window.settings.dontCircleWhenHpBelow25Percent && api.lockedShip.percentOfHp < 25 && api.lockedShip.id == api.targetShip.id ) {
			if (dist < (radius+50)) {
				x = api.targetShip.position.x + MathUtils.random(-30, 30);
				y = api.targetShip.position.y + MathUtils.random(-30, 30);
				window.settings.circleNpc = false;
				window.settings.gatestonpc = false;
			} else if (dist > radius){
				window.settings.circleNpc = true;
				window.settings.gatestonpc = true;
				let enemy = api.targetShip.position;
				let f = Math.atan2(window.hero.position.x - enemy.x, window.hero.position.y - enemy.y) + 0.5;
				let s = Math.PI / 180;
				let rot = MathUtils.random(-10, 10);
				f += s;
				x = enemy.x + radius * Math.sin(f);
				y = enemy.y + radius * Math.cos(f);
			}
		} else if (window.settings.ggbot && api.resetTargetWhenHpBelow25Percent && api.lockedShip && api.lockedShip.percentOfHp < 25 && api.lockedShip.id == api.targetShip.id  && !window.settings.gatestonpc) {
			api.resetTarget("enemy");
		} else if (dist > radius && api.lockedShip && api.lockedShip.id == api.targetShip.id & !window.settings.circleNpc && !window.settings.gatestonpc) {
			if(window.settings.piratebot){
				if(dist>(radius+75)){
					x = api.targetShip.position.x + MathUtils.random(-200, 200);
					y = api.targetShip.position.y + MathUtils.random(-200, 200);
				}

			}else{
				x = api.targetShip.position.x + MathUtils.random(-200, 200);
				y = api.targetShip.position.y + MathUtils.random(-200, 200);
			}
			
		} else if (api.lockedShip && api.lockedShip.id == api.targetShip.id &&api.attacking) {
			if (window.settings.circleNpc) {
					let enemy = api.targetShip.position;
					let f = Math.atan2(window.hero.position.x - enemy.x, window.hero.position.y - enemy.y) + 0.5;
					let ff = Math.atan2(window.hero.position.x - enemy.x, window.hero.position.y - enemy.y) - 0.5;
					let s = Math.PI / 180;
					let rot = MathUtils.random(-10, 10);
					f += s;
					ff += s;
					if (window.globalSettings.circleNpcturn == 1){
						x = enemy.x + radius * Math.sin(f);
						y = enemy.y + radius * Math.cos(f);
					} else {
						x = enemy.x + radius * Math.sin(ff);
						y = enemy.y + radius * Math.cos(ff);
					}
					if(window.globalSettings.collectBoxWhenCircle){
						let nearestBox = api.findNearestBox();
						if (nearestBox && nearestBox.box && nearestBox.distance < 300) {
							circleBox = nearestBox;
						}
					} 
			} else if (dist < radius&&!window.settings.gatestonpc) {
				x = api.targetShip.position.x + MathUtils.random(radius-50, radius+50);
				y = api.targetShip.position.y + MathUtils.random(radius-50, radius+50);
			}
			if (window.settings.gatestonpc&&api.lockedShip.percentOfHp>25) {
				let enemy = api.targetShip.position; 
				let gate = api.findNearestGate();   
				let distgate = window.hero.distanceTo(gate.gate.position);
				//kapı let leri
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
				//

				if (!window.settings.circleNpc){
				if (dist > 1200 && api.lockedShip.shd + 1 != api.lockedShip.maxShd ){
				api.resetTarget("enemy");
				}else if(api.attacking == false){
					window.movementDone = true;
				} else if (window.hero.mapId == 91){//5-1 başlar
					if (window.hero.position.x > 500|| window.hero.position.x < 12000){
					if (window.hero.factionId == 1 && window.settings.piratebot && api.lockedShip.percentOfHp < 97 ){
						if (distgate > 400){
						let x = gatemmorigt51.gate.position.x + MathUtils.random(-100, 100);
						let y = gatemmorigt51.gate.position.y + MathUtils.random(-100, 100);
						api.moveWithFilter(x, y);
						if(api.attacking==true){
									window.movementDone = true;
								}
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}	
					} else if (window.hero.factionId == 2 && window.settings.piratebot &&api.lockedShip.percentOfHp < 97 ){
						if (distgate > 400){
						let x = gateeicrigt51.gate.position.x + MathUtils.random(-100, 100);
						let y = gateeicrigt51.gate.position.y + MathUtils.random(-100, 100);
						api.moveWithFilter(x, y);
						if(api.attacking==true){
									window.movementDone = true;
								}
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}				
					} else if (window.hero.factionId == 3 && window.settings.piratebot &&api.lockedShip.percentOfHp < 97 ){
						if (distgate > 400){
						let x = gatevrurigt51.gate.position.x + MathUtils.random(-100, 100);
						let y = gatevrurigt51.gate.position.y + MathUtils.random(-100, 100);
						api.moveWithFilter(x, y);
						if(api.attacking==true){
									window.movementDone = true;
								}
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}
					}
					} else if(window.hero.position.x > 30200|| window.hero.position.x < 41300){
						if (window.hero.factionId == 1 && window.settings.piratebot &&api.lockedShip.percentOfHp < 97 ){
						if (distgate > 400){
							let x = gatemmoleft51.gate.position.x + MathUtils.random(-100, 100);
							let y = gatemmoleft51.gate.position.y + MathUtils.random(-100, 100);
							api.moveWithFilter(x, y);
							if(api.attacking==true){
									window.movementDone = true;
								}
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}
					} else if (window.hero.factionId == 2 && window.settings.piratebot && api.lockedShip.percentOfHp < 97 ){
						if (distgate > 400){
							let x = gateeicleft51.gate.position.x + MathUtils.random(-100, 100);
							let y = gateeicleft51.gate.position.y + MathUtils.random(-100, 100);
							api.moveWithFilter(x, y);
							if(api.attacking==true){
									window.movementDone = true;
								}
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}
					} else if (window.hero.factionId == 3 && window.settings.piratebot && api.lockedShip.percentOfHp < 97 ){
						if (distgate > 400){
							let x = gatevruleft51.gate.position.x + MathUtils.random(-100, 100);
							let y = gatevruleft51.gate.position.y + MathUtils.random(-100, 100);
							api.moveWithFilter(x, y);
							if(api.attacking==true){
									window.movementDone = true;
								}
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}
					}
				}
				}else if (window.hero.mapId == 92){//5-2 başlar
					if (window.hero.position.x > 500 && window.hero.position.x < 12000){
						if (window.hero.factionId == 1 && window.settings.piratebot && api.lockedShip.percentOfHp < 97){
							if (distgate > 400){
							let x = gatemmorigt52.gate.position.x + MathUtils.random(-100, 100);
							let y = gatemmorigt52.gate.position.y + MathUtils.random(-100, 100);
							api.moveWithFilter(x, y);
							if(api.attacking==true){
									window.movementDone = true;
								}
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}	
						} else if (window.hero.factionId == 2 && window.settings.piratebot &&api.lockedShip.percentOfHp < 97 ){
							if (distgate > 400){
							let x = gateeicrigt52.gate.position.x + MathUtils.random(-100, 100);
							let y = gateeicrigt52.gate.position.y + MathUtils.random(-100, 100);
							api.moveWithFilter(x, y);
							if(api.attacking==true){
									window.movementDone = true;
								}
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}				
						} else if (window.hero.factionId == 3 && window.settings.piratebot &&api.lockedShip.percentOfHp < 97 ){
							if (distgate > 400){
							let x = gatevrurigt52.gate.position.x + MathUtils.random(-100, 100);
							let y = gatevrurigt52.gate.position.y + MathUtils.random(-100, 100);
							api.moveWithFilter(x, y);
							if(api.attacking==true){
									window.movementDone = true;
								}
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}
						}
					} else if(window.hero.position.x > 15400 |window.hero.position.x| window.hero.position.x < 20500){//sağ taraf
						if (window.hero.factionId == 1 && window.settings.piratebot &&api.lockedShip.percentOfHp < 97 ){
							if (distgate > 400){
								let x = gatemmoleft52.gate.position.x + MathUtils.random(-100, 100);
								let y = gatemmoleft52.gate.position.y + MathUtils.random(-100, 100);
								api.moveWithFilter(x, y);

								if(api.attacking==true){
									window.movementDone = true;
								}else{
									window.movementDone = false;
								}	
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}


							/*else{
								if(api.attacking==true){
									window.movementDone = true;
								}
							}*/
						} else if (window.hero.factionId == 2 && window.settings.piratebot && api.lockedShip.percentOfHp < 97 ){
							if (distgate > 400){
								let x = gateeicleft52.gate.position.x + MathUtils.random(-100, 100);
								let y = gateeicleft52.gate.position.y + MathUtils.random(-100, 100);
								api.moveWithFilter(x, y);
								if(api.attacking==true){
									window.movementDone = true;
								}
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}
						} else if (window.hero.factionId == 3 && window.settings.piratebot && api.lockedShip.percentOfHp < 97 ){
							if (distgate > 400){
								let x = gatevruleft52.gate.position.x + MathUtils.random(-100, 100);
								let y = gatevruleft52.gate.position.y + MathUtils.random(-100, 100);
								api.moveWithFilter(x, y);
								if(api.attacking==true){
									window.movementDone = true;
								}
								return;
							}else if (enemy.distanceTo(gate.gate.position) < 1000){
								if (api.targetShip == null){
									window.movementDone = false;
									return;
								}
							}
						} 
					} 
				}
				}
			}
		} else {
			if(api.attacking==false){
				window.movementDone = false;
			}
			api.resetTarget("enemy");
		}
	}

	if (x && y) {
		if (window.globalSettings.collectBoxWhenCircle && circleBox) {
			api.collectBox(circleBox.box);
			circleBox = null;
			window.movementDone = false;
		} else {
		  api.moveWithFilter(x, y);
		}
		window.movementDone = false;
	}
	window.dispatchEvent(new CustomEvent("logicEnd"));
}

function sentinelLogic() {
	let shipAround;
	for (let property in api.ships) {
		let ship = api.ships[property];

		if (ship.id == window.globalSettings.sentinelid) {
			shipAround = ship;
		}
	}
	
	let x;
	let y;
	

	if (shipAround) {
		if (shipAround.distanceTo(window.hero.position) > 200 && !api.targetShip && !window.settings.piratebot) {
			x = shipAround.position.x + MathUtils.random(-100, 100);
			y = shipAround.position.y + MathUtils.random(-100, 100);
			api.moveWithFilter(x, y);
			return;
		} else if (api.targetShip) {
			api.attackMode();
			api.targetShip.update();
			x = shipAround.position.x;
			y = shipAround.position.y;
		}
	} else {
		if(api.sentinelship.mapId == window.hero.mapId) {
			api.escapeMode();
			x = api.sentinelship.x;
			y = api.sentinelship.y;
			api.rute = null;
			api.move(x,y);
			return;
		} else {
			api.speedMode();
			api.goToMap(api.sentinelship.mapId);
			return;
		}
	}

	if (api.targetBoxHash == null && api.targetShip == null) {
		let finalShip = null;
		if (api.sentinelship.targetId != null) {
			for (let property in api.ships) {
				let ship = api.ships[property];
				if (ship.id == api.sentinelship.targetId) {
					finalShip = ship;
				}
			}
		}

		if (api.sentinelship.attackerID != null && window.globalSettings.defendSentinel && finalShip == null) {
			for (let property in api.ships) {
				let ship = api.ships[property];
				if (ship.id == api.sentinelship.attackerID) {
					finalShip = ship;
				}
			}
		}

		if (finalShip == null || finalShip.distance > 1000) {
			let box = api.findNearestBox();
			if (box.box) {
				api.collectBox(box.box);
				api.targetBoxHash = box.box.hash;
				return;
			}
			api.sentinelship.targetId = null;
		}
		if (finalShip && finalShip.distance < 1000 && finalShip.id != notrightId) {
			api.lockShip(finalShip);
			api.triedToLock = true;
			api.targetShip = finalShip;
			return;
		} else if (finalShip && finalShip.id != notrightId) {
			finalShip.update();
			api.moveWithFilter(finalShip.position.x - MathUtils.random(-50, 50), finalShip.position.y - MathUtils.random(-50, 50));
			api.targetShip = finalShip;
			return;
		}
	}

	if (api.targetShip) {
		if (!api.triedToLock && (api.lockedShip == null || api.lockedShip.id != api.targetShip.id)) {
			api.targetShip.update();
			let dist = api.targetShip.distanceTo(window.hero.position);
			if (dist < 600) {
				api.lockShip(api.targetShip);
				api.triedToLock = true;
				return;
			}
		}

		if (!api.attacking && api.lockedShip) {
			api.startLaserAttack();
			api.lastAttack = $.now();
			api.attacking = true;
			return;
		}
	}


	if (api.targetBoxHash && window.hero.position.x < 16000) {
		let box = api.boxes[api.targetBoxHash];
		if (box && box.position.x < 16000) {
			delete api.boxes[api.targetBoxHash];
			api.resetTarget("box");
			return;
		} else if(window.hero.position.x > 200&&window.hero.position.x < 4600){
			if (box && box.position.x > 4600) {
				delete api.boxes[api.targetBoxHash];
				api.resetTarget("box");
				return;
			}
		}
	}else {
		if (api.targetBoxHash && $.now() - api.collectTime > 7000) {
			let box = api.boxes[api.targetBoxHash];
			if (box && box.distanceTo(window.hero.position) > 1000) {
					api.collectTime = $.now();
			} else {
				delete api.boxes[api.targetBoxHash];
				api.blackListHash(api.targetBoxHash);
				api.resetTarget("box");
				return;
			}
		}
	}
	

	if ((api.targetShip && $.now() - api.lockTime > 5000 && !api.attacking) || ($.now() - api.lastAttack > 10000)) {
		api.resetTarget("enemy");
	}

	if (api.targetShip && window.settings.killNpcs && api.targetBoxHash == null) {
		api.targetShip.update();
		let dist = api.targetShip.distanceTo(window.hero.position);
		let radius = window.settings.getNpc(api.lockedShip.name)["range"];
		if(radius == null || radius < 400){
			radius = window.settings.npcCircleRadius;
		}
		if(api.attacking){
			if(window.globalSettings.useHability && dist < 1000){
				api.attackSkills();
			}
			if (!window.settings.cubiv2pro){
				api.attackMode();
			}else if (api.lockedShip.name == "-=[ Cubikon ]=-"){
				api.attackMode();
			}else if (api.lockedShip.name == "-=[ Protegit ]=-"){
				api.escapeMode();
			} else {
				api.attackMode();
			}
			if(window.globalSettings.useHability && window.hero.skillName && dist < 1000){
				if ((window.hero.skillname == "cyborg" && api.targetShip.hp > 100000)||
						(window.hero.skillName == "venom" && api.targetShip.hp > 60000))
				{ 
					api.useHability();
				} else if (window.hero.skillName == "diminisher" && api.targetShip.shd > 60000){
					api.useHability();
				} else if (window.hero.skillname == "sentinel" || window.hero.skillname == "tartarus"){
					api.useHability();
				} else if (window.hero.skillname == "spearhead") {
					api.useHabilityThree();   
				}
			}
		}
		if ((dist > radius && (api.lockedShip == null || api.lockedShip.id != api.targetShip.id) && $.now() - api.lastMovement > 1000)) {
			x = api.targetShip.position.x - MathUtils.random(-50, 50);
			y = api.targetShip.position.y - MathUtils.random(-50, 50);
			api.lastMovement = $.now();
		} else if (api.lockedShip && window.settings.dontCircleWhenHpBelow25Percent && api.lockedShip.percentOfHp < 25 && api.lockedShip.id == api.targetShip.id ) {
			if (dist > (radius+50)) {
				x = api.targetShip.position.x + MathUtils.random(-30, 30);
				y = api.targetShip.position.y + MathUtils.random(-30, 30);
			} else if (dist < radius){
				let enemy = api.targetShip.position;
				let f = Math.atan2(window.hero.position.x - enemy.x, window.hero.position.y - enemy.y) + 0.5;
				let s = Math.PI / 180;
				let rot = MathUtils.random(-10, 10);
				f += s;
				x = enemy.x + radius * Math.sin(f);
				y = enemy.y + radius * Math.cos(f);
			}
		} else if (window.settings.ggbot && api.resetTargetWhenHpBelow25Percent && api.lockedShip && api.lockedShip.percentOfHp < 25 && api.lockedShip.id == api.targetShip.id ) {
			api.resetTarget("enemy");
		} else if (dist > radius && api.lockedShip && api.lockedShip.id == api.targetShip.id & !window.settings.circleNpc && !window.settings.gatestonpc) {
			x = api.targetShip.position.x + MathUtils.random(-200, 200);
			y = api.targetShip.position.y + MathUtils.random(-200, 200);
		} else if (api.lockedShip && api.lockedShip.id == api.targetShip.id) {
			if (window.settings.circleNpc) {
				let enemy = api.targetShip.position;
				let rot = MathUtils.random(-10, 10);
				x = api.sentinelship.x;
				y = api.sentinelship.y;

				if(window.globalSettings.collectBoxWhenCircle){
					let nearestBox = api.findNearestBox();
					if (nearestBox && nearestBox.box && nearestBox.distance < 300) {
						circleBox = nearestBox;
					}
				}
			}
		} else {
			api.resetTarget("enemy");
		}
	}

	if (x && y) {
		api.moveWithFilter(x, y);
	}
	window.dispatchEvent(new CustomEvent("logicEnd"));
	return;
}
