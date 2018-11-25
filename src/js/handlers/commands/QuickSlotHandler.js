class QuickSlotHandler {
    static get ID() {
      return 8521; //up
    }
  // not used, might be needed in the future
    constructor(f) {
      this._handler = function (e, a) {
        let item = JSON.parse(e.detail);
        // THIS IS NOT RELIABLE AND SHOULD BE CHANGED
        if(item.iconLootId.indexOf("ability_"+window.hero.skillName) >= 0){
          a.habilityCoolDown = $.now();
        }
      }
    }
  
    get handler() {
      return this._handler;
    }
  }
  
  