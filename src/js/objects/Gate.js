class Gate extends Movable {
	constructor(x, y, gatefactionId, gateId, gateType) {
	  super(x, y);
	  this.gatefactionId = gatefactionId;
	  this.gateId = gateId;
	  this.gateType = gateType;
	}
  }