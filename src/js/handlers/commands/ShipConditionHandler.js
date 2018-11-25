/**
 * Created by Alph4rd on 28.09.2018
 */

class ShipConditionHandler {
	static get ID() {
		return 27841;
	}

	constructor(f) {
		this._handler = function (e, a) {
			let obj = JSON.parse(e.detail);
			if(obj.userId == window.hero.id && obj.modifier == 26){
				if(obj.count == 1 ){
					window.invertedMovement = true;
				}else{
					window.invertedMovement = false;
				}
			}
		}
	}
	get handler() {
		return this._handler;
	}
}