class DebugWindow {
	createWindow() {
		this.debugWindow = WindowFactory.createWindow({
			width: 320,
			text: "Debug"
		});

		let options = [
			{
				name: 'showCoordinates',
				labelText: 'Show Coordinates',
				appendTo: this.debugWindow,
				event: function () {
					window.settings.showCoordinates = this.checked;
				}
			},
			{
				name: 'minimapsekil',
				labelText: 'Minimapi Güzelleştir Fps düşebilir',
				appendTo: this.debugWindow,
				event: function () {
					window.settings.minimapefso = this.checked;
				}
			},
			{
				name: 'showNearestPortal',
				labelText: 'Show data from the nearest portal',
				appendTo: this.debugWindow,
				event: function () {
					window.settings.showNearestPortal = this.checked;
				}
			},
			{
				name: 'showenemy',
				labelText: 'Etraftakileri göster',
				appendTo: this.debugWindow,
				event: function () {
					window.settings.showenemy = this.checked;
				}
			},
			{
				name: 'showMapId',
				labelText: 'Show map id',
				appendTo: this.debugWindow,
				event: function () {
					window.settings.showMapID = this.checked;
				}
			}
			];

		options.forEach((option) => {
			this[option.name] = ControlFactory.createControl(option);
		});

	}
}