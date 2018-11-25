class ShipSelectedHandler {
	static get ID() {
		return 28988 ;//up
	}

	constructor() {
		this._handler = function (e, a) {
			let parsedJson = JSON.parse(e.detail);
			try {
				let ship = a.ships[parsedJson.userId];
				ship.maxHp = parsedJson[Variables.selectMaxHp];
				ship.maxShd = parsedJson[Variables.selectMaxShd]; 
				ship.hp = parsedJson[Variables.selectHp];
				ship.shd = parsedJson.shield;

				if (ship != null){
					a.lockedShip = ship;
					if(window.settings.autoAttack && a.autoLocked && $.now() - a.lastAutoLock < 900){
						if (!a.attacking && window.globalSettings.avoidAttackedNpcs || !a.attacking && a.lockedShip) {
							a.startLaserAttack();
							a.lastAttack = $.now();
							a.attacking = true;
						}
					}
				}
			} catch (exception) {
				console.error(exception.message);
				console.log(parsedJson);  
			};
		}
	}

	get handler() {
		return this._handler;
	}
}