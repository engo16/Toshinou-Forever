class Pet {
    constructor(id) {
		this.id = id;
		this.destroyed = false;
		this.hasFuel = true;
		this.activated = true;
		this.currentModule = -1;
		this.activateTimer = -1;
		this.moduleCooldown = -1;
	}
}