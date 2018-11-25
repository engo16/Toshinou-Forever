class BotModesWindow {
  createWindow() {
    this.BotModesWindow = WindowFactory.createWindow({width: 320, text: "Bot Modes"});

    let options = [
      {
        name: 'palladium',
        labelText: chrome.i18n.getMessage("palladiumbot"),
        appendTo: this.BotModesWindow,
        event: function () {
          window.settings.palladium = this.checked;
        }
      },
      {
        name: 'piratebot',
        labelText: chrome.i18n.getMessage("piratebot"),
        appendTo: this.BotModesWindow,
        event: function () {
          window.settings.piratebot = this.checked;
        }
      },
      {
        name: 'piratebotsag',
        labelText: chrome.i18n.getMessage("piratebotsag"),
        appendTo: this.BotModesWindow,
        event: function () {
          window.settings.piratebotsag = this.checked;
        }
      },
      {
        name: 'cubibot',
        labelText: chrome.i18n.getMessage("cubibot"),
        appendTo: this.BotModesWindow,
        event: function () {
          window.settings.cubibot = this.checked;
        }
      },
      {
        name: 'ggbot',
        labelText: chrome.i18n.getMessage("ggbot"),
        appendTo: this.BotModesWindow,
        event: function () {
          window.settings.ggbot = this.checked;
        }
  	  }
    ];

    options.forEach((option)=>{
      this[option.name] = ControlFactory.checkbox(option);
    });

  }
}