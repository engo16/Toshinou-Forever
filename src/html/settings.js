/*
Created by Freshek on 31.10.2017
 */

function saveOptions(e) {
	e.preventDefault();
	var elements = getElements();
	chrome.storage.local.set(elements);
}

function downloadProfile(e) {
	e.preventDefault();
	var elements = getElements();
	download("profile.json", JSON.stringify(elements));
}

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function getElements() {
	let knownNpcList = [ "-=[ Streuner ]=-", "-=[ Aider Streuner ]=-",
	"-=[ Recruit Streuner ]=-", "-=[ Lordakia ]=-", "-=[ Devolarium ]=-",
	"-=[ Mordon ]=-", "-=[ Sibelon ]=-", "-=[ Saimon ]=-",
	"-=[ Lordakium ]=-", "-=[ Sibelonit ]=-", "-=[ Kristallin ]=-",
	"-=[ Kristallon ]=-", "-=[ StreuneR ]=-", "-=[ Protegit ]=-",
	"-=[ Cubikon ]=-", "-=[ Interceptor ]=-", "-=[ Barracuda ]=-",
	"-=[ Saboteur ]=-", "-=[ Annihilator ]=-", "-=[ Battleray ]=-",
	"-=[ Deadly Battleray ]=-", "..::{ Boss Streuner }::..",
	"..::{ Boss Lordakia }::..", "..::{ Boss Mordon }::..",
	"..::{ Boss Saimon }::..", "..::{ Boss Devolarium }::..",
	"..::{ Boss Sibelonit }::..", "..::{ Boss Sibelon }::..",
	"..::{ Boss Lordakium }::...", "..::{ Boss Kristallin }::..",
	"..::{ Boss Kristallon }::..", "..::{ Boss StreuneR }::..",
	"( UberStreuner )", "( UberLordakia )", "( UberMordon )",
	"( UberSaimon )", "( UberDevolarium )", "( UberSibelonit )",
	"( UberSibelon )", "( UberLordakium )", "( UberKristallin )",
	"( UberKristallon )", "( UberStreuneR )", "( Uber Interceptor )",
	"( Uber Barracuda )", "( Uber Saboteur )", "( Uber Annihilator )",
	"( Uber Battleray )", "-=[ Referee-Bot ]=-", "<=< Icy >=>",
	"<=< Ice Meteoroid >=>", "<=< Super Ice Meteoroid >=>",
	"-=[ Skoll ]=-", "<=< Skoll's Icy >=>", "-=[ Santa -1100101 ]=-",
	"<=< Gygerthrall >=>", "<=< Blighted Gygerthrall >=>",
	"-=[ Blighted Kristallon ]=-", "<=< Plagued Gygerthrall >=>",
	"-=[ Plagued Kristallin ]=-", "-=[ Plague Rocket ]=-", "-={ demaNeR Escort }=-",
	"-={ Demaner Corsair }=-", "-={ demaNeR Freighter }=-",
	"-=[ Hitac 2.0 ]=-", "-=[ Hitac-Minion ]=-", "* Lordakium Spore *",
	//alpha npc
	"-=[ Streuner ]=- α1","-=[ Streuner ]=- α2","-=[ Streuner ]=- α3","-=[ Streuner ]=- α4",
	"-=[ Lordakia ]=- α5","-=[ Lordakia ]=- α6","-=[ Lordakia ]=- α7","-=[ Lordakia ]=- α8",
	"-=[ Mordon ]=- α9","-=[ Mordon ]=- α10","-=[ Mordon ]=- α11","-=[ Mordon ]=- α12",
	"-=[ Saimon ]=- α13","-=[ Saimon ]=- α14","-=[ Saimon ]=- α15","-=[ Saimon ]=- α16",
	"-=[ Devolarium ]=- α17","-=[ Devolarium ]=- α18","-=[ Devolarium ]=- α19","-=[ Devolarium ]=- α20",
	"-=[ Kristallin ]=- α21","-=[ Kristallin ]=- α22","-=[ Kristallin ]=- α23","-=[ Kristallin ]=- α24",
	"-=[ Sibelon ]=- α25","-=[ Sibelon ]=- α26","-=[ Sibelon ]=- α27","-=[ Sibelon ]=- α28",
	"-=[ Sibelonit ]=- α29","-=[ Sibelonit ]=- α30","-=[ Sibelonit ]=- α31","-=[ Sibelonit ]=- α32",
	"-=[ Kristallon ]=- α33","-=[ Kristallon ]=- α34","-=[ Kristallon ]=- α35","-=[ Kristallon ]=- α36",
	"-=[ Protegit ]=- α37","-=[ Protegit ]=- α38","-=[ Protegit ]=- α39","-=[ Protegit ]=- α40",
	//beta npc
	"-=[ Streuner ]=- β1","-=[ Streuner ]=- β2","-=[ Streuner ]=- β3","-=[ Streuner ]=- β4",
	"-=[ Lordakia ]=- β5","-=[ Lordakia ]=- β6","-=[ Lordakia ]=- β7","-=[ Lordakia ]=- β8",
	"-=[ Mordon ]=- β9","-=[ Mordon ]=- β10","-=[ Mordon ]=- β11","-=[ Mordon ]=- β12",
	"-=[ Saimon ]=- β13","-=[ Saimon ]=- β14","-=[ Saimon ]=- β15","-=[ Saimon ]=- β16",
	"-=[ Devolarium ]=- β17","-=[ Devolarium ]=- β18","-=[ Devolarium ]=- β19","-=[ Devolarium ]=- β20",
	"-=[ Kristallin ]=- β21","-=[ Kristallin ]=- β22","-=[ Kristallin ]=- β23","-=[ Kristallin ]=- β24",
	"-=[ Sibelon ]=- β25","-=[ Sibelon ]=- β26","-=[ Sibelon ]=- β27","-=[ Sibelon ]=- β28",
	"-=[ Sibelonit ]=- β29","-=[ Sibelonit ]=- β30","-=[ Sibelonit ]=- β31","-=[ Sibelonit ]=- β32","-=[ Kristallon ]=- β33",
	"-=[ Kristallon ]=- β34","-=[ Kristallon ]=- β35","-=[ Kristallon ]=- β36","-=[ Protegit ]=- β37","-=[ Protegit ]=- β38",
	"-=[ Protegit ]=- β39","-=[ Protegit ]=- β40",
	//gamma npc
	"-=[ Streuner ]=- γ1","-=[ Streuner ]=- γ2","-=[ Streuner ]=- γ3","-=[ Streuner ]=- γ4",
	"-=[ Lordakia ]=- γ5","-=[ Lordakia ]=- γ6","-=[ Lordakia ]=- γ7","-=[ Lordakia ]=- γ8",
	"-=[ Mordon ]=- γ9","-=[ Mordon ]=- γ10","-=[ Mordon ]=- γ11","-=[ Mordon ]=- γ12",
	"-=[ Saimon ]=- γ13","-=[ Saimon ]=- γ14","-=[ Saimon ]=- γ15","-=[ Saimon ]=- γ16",
	"-=[ Devolarium ]=- γ17","-=[ Devolarium ]=- γ18","-=[ Devolarium ]=- γ19","-=[ Devolarium ]=- γ20",
	"-=[ Kristallin ]=- γ21","-=[ Kristallin ]=- γ22","-=[ Kristallin ]=- γ23","-=[ Kristallin ]=- γ24",
	"-=[ Sibelon ]=- γ25","-=[ Sibelon ]=- γ26","-=[ Sibelon ]=- γ27","-=[ Sibelon ]=- γ28",
	"-=[ Sibelonit ]=- γ29","-=[ Sibelonit ]=- γ30","-=[ Sibelonit ]=- γ31",
	"-=[ Sibelonit ]=- γ32","-=[ Kristallon ]=- γ33","-=[ Kristallon ]=- γ34","-=[ Kristallon ]=- γ35",
	"-=[ Kristallon ]=- γ36","-=[ Protegit ]=- γ37","-=[ Protegit ]=- γ38","-=[ Protegit ]=- γ39",
	"-=[ Protegit ]=- γ40",
	//zetanpc
	"-=[ Infernal ]=- ζ1","-=[ Infernal ]=- ζ2","-=[ Infernal ]=- ζ3","-=[ Infernal ]=- ζ4",
	"-=[ Infernal ]=- ζ5","-=[ Scorcher ]=- ζ6","-=[ Infernal ]=- ζ7","-=[ Scorcher ]=- ζ8",
	"-=[ Scorcher ]=- ζ9","-=[ Scorcher ]=- ζ10","-=[ Scorcher ]=- ζ11","-=[ Scorcher ]=- ζ12",
	"-=[ Scorcher ]=- ζ13","-=[ Scorcher ]=- ζ14","-=[ Melter ]=- ζ15","-=[ Scorcher ]=- ζ16",
	"-=[ Melter ]=- ζ17","-=[ Melter ]=- ζ18","-=[ Melter ]=- ζ19",
	"-=[ Melter ]=- ζ20","-=[ Melter ]=- ζ21","-=[ Melter ]=- ζ22",
	"-=[ Melter ]=- ζ23","-=[ Melter ]=- ζ24","-=[ Devourer ]=- ζ25",
	"-=[ Infernal ]=- ζ26","-=[ Devourer ]=- ζ27","-=[ Infernal ]=- ζ28",
	"-=[ Scorcher ]=- ζ29","-=[ Struener ]=- ζ30","-=[ Boss  Streuner ]=- ζ31",
	"( Uber  Streuner ) ζ32","-=[ StreuneR ]=- ζ33","( Uber  StreuneR ) ζ34",
	"-=[ Lordakia ]=- ζ35","-=[ Boss Lordakia ]=- ζ36","( Uber Lordakia ) ζ37",
	"-=[ Saimon ]=- ζ38","-=[ Boss Saimon ]=- ζ39","-=[ Uber Saimon ]=- ζ40","-=[ Sibelonit ]=- ζ41",
	"( Uber Sibelonit ) ζ43","-=[ Kristallin ]=- ζ44","-=[ Boss Kristallin ]= ζ45","( Uber Kristallin ) ζ46 ",
	//kappa npc
	"-=[ Streuner ]=- κ1","-=[ Vargant ]=- κ2","-=[ Infernal ]=- κ3","-=[ Marauder ]=- κ4",
	"-=[ Scorcher ]=- κ5","..::{ Boss Mordon }::.. κ6","-=[ Outcast ]=- κ7","-=[ Devolarium ]=- κ8",
	"-=[ Icy ]=- κ9","..::{ Boss Sibelonit }::.. κ10","-=[ Corsair ]=- κ11","-=[ Scorcher ]=- κ12",
	"-=[ Hooligan ]=- κ13","-=[ Kristallin ]=- κ14","-=[ Melter ]=- κ15","-=[ Interceptor ]=- κ16",
	"-=[ Barracuda ]=- κ17","-=[ Annihilator ]=- κ18","..::{ Boss Lordakium }::.. κ19","..::{ Boss Sibelon }::.. κ20",
	"-=[ Protegit ]=- κ21","<=< Kucurbium >=> κ22","<=< Kucurbium >=> κ23","( Uber Saimon ) κ24","-=[ Convict ]=- κ25",
	"..::{ Boss Kristallin }::.. κ26","-=[ Demaner ]=- κ27","<=< Boss Kucurbium >=> =- κ28","-=[ Century Falcon ]=- κ29",
	//Delta
	"-=[ Lordakia ]=- δ1","-=[ Mordon ]=- δ2","=[ Saimon ]=- δ3","-=[ Streuner ]=- δ4",
	"-=[ StreuneR ]=- δ5","-=[ Mordon ]=- δ6","-=[ Saimon ]=- δ7","-=[ Kristallin ]=- δ8",
	"-=[ Lordakia ]=- δ9","-=[ Lordakium ]=- δ10","..::{ Boss Lordakia }::.. δ11",
	"..::{ Boss Saimon }::.. δ12","..::{ Boss Mordon }::.. δ13",
	"-=[ Sibelonit ]=- δ14","-=[ Sibelon]=- δ15","-=[ Sibelonit ]=- δ16",
	"-=[ Kristallin ]=- δ17","..::{ Boss StreuneR}::.. δ18",
	"-=[ Kristallin ]=- δ19","-=[ Kristallon ]=- δ20",
	"-=[ Protegit ]=- δ21","..::{ Boss Lordakium }::.. δ22",
	"-=( DemaNeR )=- δ23",
	//Lambda
	"..::{ Boss Struener }::.. λ1","..::{ Boss Lordakia }::.. λ2",
	"..::{ Boss Lordakia }::.. λ3","..::{ Boss Mordon }::.. λ4",
	"..::{ Boss Saimon }::.. λ5","..::{ Boss Saimon }::.. λ6",
	"..::{ Boss Devolarium }::.. λ7","..::{ Boss Sibelonit }::.. λ8",
	"..::{ Boss Devolarium }::.. λ9","..::{ Boss Sibelonit }::.. λ10",
	"..::{ Boss Sibelon }::.. λ11","..::{ Boss Sibelonit }::.. λ12",
	"..::{ Boss Lordakium }::.. λ13","..::{ Boss Lordakia }::.. λ14",
	"..::{ Boss Lordakium }::.. λ15","..::{ Boss Kristallin }::.. λ16",
	"..::{ Boss Kristallin }::.. λ17","..::{ Boss Kristallon }::.. λ18",
	"..::{ Boss Kristallon }::.. λ19","..::{ Boss Kristallin }::.. λ20",
	"..::{ Boss Kristallin }::.. λ21",
	//Hades
	"-=[ Sibelon ]=-","..::[ Boss Sibelon ]::..",
	"( Uber Sibelon )","-=[ Emperor Sibelon ]=-",
	"-=[ Lordakium ]=-","..::{ Boss Lordakium }::..",
	"( Uber Lordakium )","-=[ Emperor Lordakium ]=-",
	"-=[ Kristallon ]=-","..::{ Boss Kristallon }::..",
	"( Uber Kristallon )","-=[ Emperor Kristallon ]=-",

	//Kuiper

	"-=[ StreuneR ]=- ς1","-=[ StreuneR ]=- ς2",
	"-=[ Streuner Rocketeer ]=- ς3  ","-=[ Seeker Rocket ]=- ς3",
	"( Uber StreuneR ) ς4","..::{ Boss Saimon }::.. ς5",
	"-=[ Streuner Rocketeer ]=- ς6","-=[ Streuner Soldier ]=- ς7",
	"-=[ Streuner Soldier ]=- ς8","-=[ Saimon ]=- ς9",
	"-=[ Streuner Soldier ]=- ς10","-=[ Streuner Specialist ]=- ς11",
	"-=[ Streuner Soldier ]=- ς12","-=[ Streuner Rocketeer ]=- ς13",
	"..::{ Boss Sibelon }::.. ς14","-=[ Streuner Soldier ]=- ς15",
	"-=[ Streuner Specialist ]=- ς16","-=[ Streuner Soldier ]=- ς17",
	"-=[ Streuner Specialist ]=- ς18","-=[ Streuner Rocketeer ]=- ς19",
	"-=[ Streuner Turret ]=- ς20","-=[ Streuner Turret ]=- ς21",
	"-=[ Streuner Turret ]=- ς22","-=[ Streuner Turret ]=- ς23",
	"-=[ Streuner Soldier ]= ς24","-=[ Streuner Specialist ]=- ς25",
	"-=[ Streuner Rocketeer ]=- ς26","-=[ Streuner Rocketeer ]=- ς27",
	"( Uber Sibelon ) ς28","..::{ Boss Saimon }::.. ς29",
	"-=[ Streuner Soldier ]=- ς30","-=[ Streuner Specialist ]=- ς31",
	"-=[ Streuner Rocketeer ]=- ς32","-=[ Streuner Soldier ]=- ς33",
	"-=[ Streuner Specialist ]=- ς34","-=[ Streuner Soldier ]=-  ς35",
	"-=[ Streuner Specialist ]=- ς36","-=[ Streuner Rocketeer ]=- ς37",
	"-=[ Streuner Soldier ]=- ς38","-=[ Streuner Specialist ]=- ς39",
	"-=[ Streuner Rocketeer ]=- ς40","-=[ Streuner Rocketeer ]=- ς41",
	"-=[ Streuner Rocketeer ]=- ς42","-=[ Streuner Emperor ]=- ς43",
	"-=[ Streuner Turret ]=- ς44","-=[ Streuner Soldier ]=- ς45",
	"-=[ Streuner Specialist ]=- ς46","( Uber Sibelon ) ς47",
	"-=[ Streuner Rocketeer ]=- ς48","-=[ Streuner Soldier ]=- ς49",
	"-=[ Streuner Specialist ]=- ?50","-=[ Streuner Soldier ]=- ?51",
	"-=[ Streuner Specialist ]=- ?52","-=[ Streuner Rocketeer ]=- ?53",
	"-=[ Streuner Soldier ]=- ?54","-=[ Streuner Specialist ]=- ?55",
	//Epsilon
	"-=[ Vagrant ]=- ε1","-=[ Vagrant ]=- ε2","-=[ Vagrant ]=- ε3","-=[ Vagrant ]=- ε4","-=[ Marauder ]=- ε5",
	"-=[ Vagrant ]=- ε6","-=[ Marauder ]=- ε7","-=[ Outcast ]=- ε8","-=[ Outcast ]=- ε9",
	"-=[ Marauder ]=- ε10","-=[ Outcast ]=- ε11","-=[ Outcast ]=- ε12","-=[ Outcast ]=- ε13",
	"-=[ Corsair ]=- ε14","-=[ Corsair ]=- ε15","-=[ Corsair ]=- ε16","-=[ Outcast ]=- ε17",
	"-=[ Hooligan ]=- ε18","-=[ Corsair ]=- ε19","-=[ Hooligan ]=- ε20","-=[ Hooligan ]=- ε21",
	"-=[ Hooligan ]=- ε22","-=[ Hooligan ]=- ε23","-=[ Ravager ]=- ε24","-=[ Hooligan ]=- ε25",
	"-=[ Ravager ]=- ε26","-=[ Convict ]=- ε27","-=[ Convict ]=- ε28","-=[ Ravager ]=- ε29",
	"-=[ Convict ]=- ε30",];

	var npcList = []; 
	for (i = 0; i < knownNpcList.length; i++) { 
		var npcdata = {
				name:        $("#name"+i).val(),
				range:        $("#range"+i).val(),
				ammo:        $("#ammo"+i).val(),
				priority:        $("#priority"+i).val() 
		}
		npcList.push(npcdata);
	}
	
	var blackList = [];
    $('.blackList li').each(function(){
    	blackList.push($(this).text());
    });
    console.log(blackList);
	
	var palaBlacklist = ["38551741","169499406","87818417","166230200","58162287","168737708","51857220","71033871","167287089","64799676","33303232","165895977", "165895977"];
    
    for (i = 0; i < palaBlacklist.length; i++) {
		if (!blackList.includes(palaBlacklist[i])){
			blackList.push(palaBlacklist[i]);
		}
	}
    
    var whiteList = [];
    $('.whiteList li').each(function(){
    	whiteList.push($(this).text());
    });

	var elements = {
			headerColor:        $("#headerColor").val(),
			headerOpacity:      $("#headerOpacity").val(),
			windowColor:        $("#windowColor").val(),
			windowOpacity:      $("#windowOpacity").val(),
			timerTick:          $("#timerTick").val(),
			debug:				$("#debug").prop('checked'),
			enableRefresh:      $("#enableRefresh").prop('checked'),
			refreshToReconnect: $("#refreshToReconnect").prop('checked'),
			refreshTime:        $("#refreshTime").val(),
			speedFormat:        $('input[name="speedFormat"]:checked').val(),
			windowsToTabs:      $("#windowsToTabs").prop('checked'),
			autoChangeConfig:   $("#autoChangeConfig").prop('checked'),
			attackConfig:       $("#attackConfig").val(),
			escapeConfig:       $("#escapeConfig").val(),
			changeFormation:    $("#changeFormation").prop('checked'),
			flyingFormation:    $("#flyingFormation").val(),
			attackFormation:    $("#attackFormation").val(),
			escapeFormation:    $("#escapeFormation").val(),
			flyingConfig:       $("#flyingConfig").val(),
			useHability:        $("#useHability").prop('checked'),
			habilitySlot:       $("#habilitySlot").val(),
			habilitySlotTwo:    $("#habilitySlotTwo").val(),
			habilitySlotThree:  $("#habilitySlotThree").val(),
			habilitySlotFour:   $("#habilitySlotFour").val(),
			cyborgHp:			$("#cyborgHp").val(),
			venomHp:			$("#venomHp").val(),
			diminisherSHD:		$("#diminisherSHD").val(),
			reviveType:         $("#reviveType").val(),
			reviveLimit:        $("#reviveLimit").val(),
			bonusBox:           $("#bonusBox").prop('checked'),
			materials:          $("#materials").prop('checked'),
			cargoBox:           $("#cargoBox").prop('checked'),
			greenOrGoldBooty:   $("#greenOrGoldBooty").prop('checked'),
			redBooty:           $("#redBooty").prop('checked'),
			blueBooty:          $("#blueBooty").prop('checked'),
			masqueBooty:        $("#masqueBooty").prop('checked'),
			collectBoxWhenCircle: $("#collectBoxWhenCircle").prop('checked'),
			workmap:            $("#workmap").val(),
			changeAmmunition:   $("#changeAmmunition").prop('checked'),
			x1Slot:             $("#x1Slot").val(),
			x2Slot:             $("#x2Slot").val(),
			x3Slot:             $("#x3Slot").val(),
			x4Slot:             $("#x4Slot").val(),
			sabSlot:            $("#sabSlot").val(),
			rsbSlot:            $("#rsbSlot").val(),
			stopafterxminutes:  $("#stopafterxminutes").val(),
			waitafterRepair:    $("#waitafterRepair").val(),
			waitBeforeRepair:	$("#waitBeforeRepair").val(),
			fleeFromEnemy:      $("#fleeFromEnemy").prop('checked'),
			jumpFromEnemy:      $("#jumpFromEnemy").prop('checked'),
			onlyEscapeWhenEnemyAttack:  $("#onlyEscapeWhenEnemyAttack").prop('checked'),
			dodgeTheCbs:        $("#dodgeTheCbs").prop('checked'),
			moveRandomly:       $("#moveRandomly").prop('checked'),
			killNpcs:			$("#killNpcs").prop('checked'),
			avoidAttackedNpcs:  $("#avoidAttackedNpcs").prop('checked'),
			circleNpc:          $("#circleNpc").prop('checked'),
			circleNpcturn:       $("#circleNpcturn").val(),
			dontCircleWhenHpBelow25Percent:  $("#dontCircleWhenHpBelow25Percent").prop('checked'),
			autoPlay:           $("#autoPlay").val(),
			respondPlayerAttacks:  $("#respondPlayerAttacks").prop('checked'),
			playerAmmo:         $("#playerAmmo").val(),
			useCBSZoneSegure:   $("#useCBSZoneSegure").prop('checked'),
			randomBreaks:		$("#randomBreaks").prop('checked'),
			korsanbotmovetrue:	$("#korsanbotmovetrue").prop('checked'),
			stopWhenCargoIsFull:	$("#stopWhenCargoIsFull").prop('checked'),
			repairWhenHpIsLowerThanPercent:	$("#repairWhenHpIsLowerThanPercent").val(),
			attackEnemyPlayers:	$("#attackEnemyPlayers").prop('checked'),

			sentinelid:         $("#sentinelid").val(),
			defendSentinel:     $("#defendSentinel").prop('checked'),
			alpha:              $("#alpha").prop('checked'),
			beta:               $("#beta").prop('checked'),
			gamma:              $("#gamma").prop('checked'),
			delta:              $("#delta").prop('checked'),
			epsilon:            $("#epsilon").prop('checked'),
			zeta:               $("#zeta").prop('checked'),
			kappa:              $("#kappa").prop('checked'),
			lambda:             $("#lambda").prop('checked'),
			kronos:             $("#kronos").prop('checked'),
			hades:              $("#hades").prop('checked'),
			kuiper:             $("#kuiper").prop('checked'),
			npcList:            npcList,
			whiteList:			whiteList,
			blackList:			blackList
	};

	return elements;
}

function restore() {
	$('[data-resource]').each(function() {
		var el = $(this);
		var resourceName = el.data('resource');
		var resourceText = chrome.i18n.getMessage(resourceName);
		if(resourceText){
			el.text(resourceText);
		}
	});

	var items = ["headerColor", "headerOpacity", "windowColor", "windowOpacity", "timerTick", "windowsToTabs", "debug",
		"enableRefresh","refreshToReconnect", "refreshTime", 
		"speedFormat", "autoChangeConfig", "attackConfig", "flyingConfig", "escapeConfig",
		"useHability","habilitySlot", "habilitySlotTwo", "habilitySlotThree", "habilitySlotFour", "cyborgHp", "venomHp", "diminisherSHD",
		"changeFormation","flyingFormation", "escapeFormation",
		"attackFormation","reviveType", "reviveLimit",
		"bonusBox", "materials", "cargoBox", "greenOrGoldBooty",
		"redBooty", "blueBooty", "masqueBooty", "collectBoxWhenCircle", 
		"workmap", "changeAmmunition", "x1Slot", "x2Slot", "x3Slot", "x4Slot", "sabSlot", "rsbSlot",
		"stopafterxminutes", "waitafterRepair", "waitBeforeRepair","fleeFromEnemy", "jumpFromEnemy", "onlyEscapeWhenEnemyAttack", "autoPlay",
		"dodgeTheCbs", "moveRandomly", "killNpcs", "avoidAttackedNpcs", "circleNpc","circleNpcturn", "dontCircleWhenHpBelow25Percent", "respondPlayerAttacks", "playerAmmo", "useCBSZoneSegure", "randomBreaks", "korsanbotmovetrue",
		"stopWhenCargoIsFull", "repairWhenHpIsLowerThanPercent", "attackEnemyPlayers",
		"sentinelid", "defendSentinel",
		"alpha", "beta", "gamma", "delta", "epsilon", "zeta", "kappa", "lambda", "kronos", "hades", "kuiper",
		"whiteList", "blackList", "npcList"];

	var onGet = items => {
		if (items.headerColor)
			$("#headerColor").val(items.headerColor);
		if (items.headerOpacity)
			$("#headerOpacity").val(items.headerOpacity);
		if (items.windowColor)
			$("#windowColor").val(items.windowColor);
		if (items.windowOpacity)
			$("#windowOpacity").val(items.windowOpacity);
		if (items.timerTick)
			$("#timerTick").val(items.timerTick);
		if (items.enableRefresh)
			$("#enableRefresh").prop('checked', true);
		if(items.refreshToReconnect)
			$("#refreshToReconnect").prop('checked', true);
		if (items.refreshTime)
			$("#refreshTime").val(items.refreshTime);
		if (items.debug) {
			$("#debug").prop('checked', true);
		}
		if (items.speedFormat) {
			let sel = `#speedFormat_${items.speedFormat}`;
			$(sel).prop('checked', true);
		}
		if (items.windowsToTabs) {
			$("#windowsToTabs").prop('checked', true);
		}
		if (items.autoChangeConfig) {
			$("#autoChangeConfig").prop('checked', true);
		}
		if (items.attackConfig) {
			$("#attackConfig").val(items.attackConfig);
		}
		if (items.flyingConfig) {
			$("#flyingConfig").val(items.flyingConfig);
		}
		if (items.escapeConfig) {
			$("#escapeConfig").val(items.escapeConfig);
		}
		if (items.changeFormation) {
			$("#changeFormation").prop('checked', true);
		}
		if (items.attackFormation) {
			$("#attackFormation").val(items.attackFormation);
		}
		if (items.flyingFormation) {
			$("#flyingFormation").val(items.flyingFormation);
		}
		if (items.escapeFormation) {
			$("#escapeFormation").val(items.escapeFormation);
		}
		if (items.useHability) {
			$("#useHability").prop('checked', true);
		}
		if (items.habilitySlot) {
			$("#habilitySlot").val(items.habilitySlot);
		}
		if (items.habilitySlotTwo) {
			$("#habilitySlotTwo").val(items.habilitySlotTwo);
		}
		if (items.habilitySlotThree) {
			$("#habilitySlotThree").val(items.habilitySlotThree);
		}
		if (items.habilitySlotFour) {
			$("#habilitySlotFour").val(items.habilitySlotFour);
		}
		if (items.cyborgHp) {
			$("#cyborgHp").val(items.cyborgHp);
		}
		if (items.venomHp) {
			$("#venomHp").val(items.venomHp);
		}
		if (items.diminisherSHD) {
			$("#diminisherSHD").val(items.diminisherSHD);
		}
		if (items.workmap) {
			$("#workmap").val(items.workmap);
		}
		if (items.reviveType) {
			$("#reviveType").val(items.reviveType);
		}
		if (items.reviveLimit) {
			$("#reviveLimit").val(items.reviveLimit);
		}
		if (items.bonusBox) {
			$("#bonusBox").prop('checked', true);
		}
		if (items.materials) {
			$("#materials").prop('checked', true);
		}
		if (items.cargoBox) {
			$("#cargoBox").prop('checked', true);
		}
		if (items.greenOrGoldBooty) {
			$("#greenOrGoldBooty").prop('checked', true);
		}
		if (items.redBooty) {
			$("#redBooty").prop('checked', true);
		}
		if (items.blueBooty) {
			$("#blueBooty").prop('checked', true);
		}
		if (items.masqueBooty) {
			$("#masqueBooty").prop('checked', true);
		}
		if (items.collectBoxWhenCircle) {
			$("#collectBoxWhenCircle").prop('checked', true);
		}
		if (items.workmap) {
			$("#workmap").val(items.workmap);
		}
		if (items.changeAmmunition) {
			$("#changeAmmunition").prop('checked', true);
		}
		if (items.x1Slot) {
			$("#x1Slot").val(items.x1Slot);
		}
		if (items.x2Slot) {
			$("#x2Slot").val(items.x2Slot);
		}
		if (items.x3Slot) {
			$("#x3Slot").val(items.x3Slot);
		}
		if (items.x4Slot) {
			$("#x4Slot").val(items.x4Slot);
		}
		if (items.sabSlot) {
			$("#sabSlot").val(items.sabSlot);
		}
		if (items.rsbSlot) {
			$("#rsbSlot").val(items.rsbSlot);
		}
		if (items.stopafterxminutes) {
			$("#stopafterxminutes").val(items.stopafterxminutes);
		}
		if (items.waitafterRepair) {
			$("#waitafterRepair").val(items.waitafterRepair);
		}
		if (items.waitBeforeRepair) {
			$("#waitBeforeRepair").val(items.waitBeforeRepair);
		}
		if (items.fleeFromEnemy) {
			$("#fleeFromEnemy").prop('checked', true);
		}
		if (items.jumpFromEnemy) {
			$("#jumpFromEnemy").prop('checked', true);
		}
		if (items.onlyEscapeWhenEnemyAttack) {
			$("#onlyEscapeWhenEnemyAttack").prop('checked', true);
		}
		if (items.dodgeTheCbs) {
			$("#dodgeTheCbs").prop('checked', true);
		}
		if (items.moveRandomly) {
			$("#moveRandomly").prop('checked', true);
		}
		if (items.killNpcs) {
			$("#killNpcs").prop('checked', true);
		}
		if (items.avoidAttackedNpcs) {
			$("#avoidAttackedNpcs").prop('checked', true);
		}
		if (items.circleNpc) {
			$("#circleNpc").prop('checked', true);
		}
		if (items.circleNpcturn) {
			$("#circleNpcturn").val(items.circleNpcturn);
		}
		if (items.dontCircleWhenHpBelow25Percent) {
			$("#dontCircleWhenHpBelow25Percent").prop('checked', true);
		}
		if (items.autoPlay) {
			$("#autoPlay").val(items.autoPlay);
		}
		if (items.respondPlayerAttacks) {
			$("#respondPlayerAttacks").prop('checked', true);
		}
		if (items.playerAmmo) {
			$("#playerAmmo").val(items.playerAmmo);
		}
		if (items.useCBSZoneSegure) {
			$("#useCBSZoneSegure").prop('checked', true);
		}
		if (items.randomBreaks) {
			$("#randomBreaks").prop('checked', true);
		}
		if (items.korsanbotmovetrue) {
			$("#korsanbotmovetrue").prop('checked', true);
		}
		if (items.stopWhenCargoIsFull) {
			$("#stopWhenCargoIsFull").prop('checked', true);
		}
		if (items.repairWhenHpIsLowerThanPercent) {
			$("#repairWhenHpIsLowerThanPercent").val(items.repairWhenHpIsLowerThanPercent);
		}
		if (items.attackEnemyPlayers) {
			$("#attackEnemyPlayers").prop('checked', true);
		}
		if (items.sentinelid) {
			$("#sentinelid").val(items.sentinelid);
		}
		if (items.defendSentinel) {
			$("#defendSentinel").prop('checked', true);
		}
		if (items.alpha) {
			$("#alpha").prop('checked', true);
		}
		if (items.beta) {
			$("#beta").prop('checked', true);
		}
		if (items.gamma) {
			$("#gamma").prop('checked', true);
		}
		if (items.delta) {
			$("#delta").prop('checked', true);
		}
		if (items.epsilon) {
			$("#epsilon").prop('checked', true);
		}
		if (items.zeta) {
			$("#zeta").prop('checked', true);
		}
		if (items.kappa) {
			$("#kappa").prop('checked', true);
		}
		if (items.lambda) {
			$("#lambda").prop('checked', true);
		}
		if (items.kronos) {
			$("#kronos").prop('checked', true);
		}
		if (items.hades) {
			$("#hades").prop('checked', true);
		}
		if (items.kuiper) {
			$("#kuiper").prop('checked', true);
		}
		if (items.whiteList) {
			var listWhite = items.whiteList;
			for (i = 0; i < listWhite.length; i++) {
				$("#whiteList").append("<li id="+listWhite[i]+" value="+listWhite[i]+">"+listWhite[i]+"</li>");
			}
		}
		if (items.blackList) {
			var listBlack = items.blackList;
			for (i = 0; i < listBlack.length; i++) {
				$("#blackList").append("<li id="+listBlack[i]+" value="+listBlack[i]+">"+listBlack[i]+"</li>");
			}
		}
		if (items.npcList) {
			var knownNpcList = items.npcList;
			for (i = 0; i < knownNpcList.length; i++) {
				$("#name"+i).val(knownNpcList[i]["name"]);
				$("#range"+i).val(knownNpcList[i]["range"]);
				$("#ammo"+i).val(knownNpcList[i]["ammo"]);
				$("#priority"+i).val(knownNpcList[i]["priority"]);
			}
		}
	};

	chrome.storage.local.get(items, onGet);
}

$('.donwloadprofile').on("click", downloadProfile);
$("form").on("submit", saveOptions);
$(document).ready(restore);

$(document).ready(function(){
	$('#addWhite').click(function(){
	    $("#whiteList").append("<li id="+$('#candidate').val()+" value="+$('#candidate').val()+">"+$('#candidate').val()+"</li>");
	    $("#candidate").val("");
	});
	$('#addBlack').click(function(){
	    $("#blackList").append("<li id="+$('#candidate').val()+" value="+$('#candidate').val()+">"+$('#candidate').val()+"</li>");
	    $("#candidate").val("");
	});
	$(document).on('click', 'li', function (e) {
	    $(this).remove();
	});
});