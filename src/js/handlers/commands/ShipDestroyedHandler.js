class ShipDestroyedHandler {
	static get ID() {
		return 17096;
	}

	constructor() {
		this._handler = function (e, a) {
			let parsed = JSON.parse(e.detail);
			let id = parsed[Variables.shipDestoyedId];

			if (a.pet) {
				if(id == a.pet.id && window.petReviveCount < window.globalSettings.petReviveLimit){
					if(a.pet.currentModule == 10){
						a.pet.moduleCooldown = $.now();
					}
					a.pet.destroyed = true;
					window.petReviveCount++;
					a.pet.currentModule = -1;
				}
			}
			
			if (a.targetShip && id == a.targetShip.id) {
				a.resetTarget("enemy");
			}

			let ship = a.ships[id];

			if (ship != null) {
				delete a.ships[id];
			}
		}
	}

	get handler() {
		return this._handler;
	}
}