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

let knownCirceList = [ "450", "500", "500", "450", "536", "500", "530", "500",
	"610", "575", "575", "600", "600", "525", "525", "500", "500", "500",
	"500", "500", "500", "450", "450", "520", "500", "575", "575", "570",
	"625", "575", "615", "600", "500", "500", "580", "500", "500", "575",
	"600", "600", "580", "625", "580", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500","450", "500", "500", "450", "536", "500", "530", "500",
	"610", "575", "575", "600", "600", "525", "525", "500", "500", "500",
	"500", "500", "500", "450", "450", "520", "500", "575", "575", "570",
	"625", "575", "615", "600", "500", "500", "580", "500", "500", "575",
	"600", "600", "580", "625", "580", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500","450", "500", "500", "450", "536", "500", "530", "500",
	"610", "575", "575", "600", "600", "525", "525", "500", "500", "500",
	"500", "500", "500", "450", "450", "520", "500", "575", "575", "570",
	"625", "575", "615", "600", "500", "500", "580", "500", "500", "575",
	"600", "600", "580", "625", "580", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500","450", "500", "500", "450", "536", "500", "530", "500",
	"610", "575", "575", "600", "600", "525", "525", "500", "500", "500",
	"500", "500", "500", "450", "450", "520", "500", "575", "575", "570",
	"625", "575", "615", "600", "500", "500", "580", "500", "500", "575",
	"600", "600", "580", "625", "580", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500","450", "500", "500", "450", "536", "500", "530", "500",
	"610", "575", "575", "600", "600", "525", "525", "500", "500", "500",
	"500", "500", "500", "450", "450", "520", "500", "575", "575", "570",
	"625", "575", "615", "600", "500", "500", "580", "500", "500", "575",
	"600", "600", "580", "625", "580", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500","610", "575", "575", "600", "600", "525", "525", "500",
	"500", "500", "500", "450", "450", "520", "500", "575", "575", "570",
	"625", "575", "615", "600", "500", "500", "580", "500", "500", "575",
	"600", "600", "580", "625", "580", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500","450", "500", "500", "450", "536", "500", "530", "500",
	"610", "575", "575", "600", "600", "525", "525", "500", "500", "500",
	"500", "500", "500", "450", "450", "520", "500", "575", "575", "570",
	"625", "575", "615", "600", "500", "500", "580", "500", "500", "575",
	"600", "600", "580", "625", "580", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500","610", "575", "575", "600", "600", "525", "525", "500", 
	"500", "500", "500", "450", "450", "520", "500", "575", "575", "570",
	"625", "575", "615", "600", "500", "500", "580", "500", "500", "575",
	"600", "600", "580", "625", "580", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500","450", "500", "500", "450", "536", "500", "530", "500",
	"610", "575", "575", "600", "600", "525", "525", "500", "500", "500",
	"500", "500", "500", "450", "450", "520", "500", "575", "575", "570",
	"625", "575", "615", "600", "500", "500", "580", "500", "500", "575",
	"600", "600", "580", "625", "580", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500", "500", "500", "500", "500", "500", "500", "500", "500",
	"500", "500" ];


for (i = 0	; i < 67; i++) { 
	document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
	document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
	document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
	document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
	document.write('</tr>');
	
}
document.write('<tr><td class="settingsTitle"colspan="4"><center><span data-resource="npclistAlpha">Alpha NPC List </span></center></th></tr>');
for (i = 67; i < 107; i++) {
document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
        document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
        document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
        document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
        document.write('</tr>');
}
document.write('<tr><td class="settingsTitle"colspan="4"><center><span data-resource="npclistbeta">Beta NPC List </span></center></th></tr>');
for (i = 107; i < 147; i++) {
document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
        document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
        document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
        document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
        document.write('</tr>');
}
document.write('<tr><td class="settingsTitle"colspan="4"><center><span data-resource="npclistgamma">Gamma NPC List </span></center></th></tr>');
for (i = 147; i < 187; i++) {
document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
        document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
        document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
        document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
        document.write('</tr>');
}
document.write('<tr><td class="settingsTitle"colspan="4"><center><span data-resource="npclistdelta">Delta NPC List </span></center></th></tr>');
for (i = 261; i < 284; i++) {
document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
        document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
        document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
        document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
        document.write('</tr>');
}
document.write('<tr><td class="settingsTitle"colspan="4"><center><span data-resource="npclistepsilon">Epsilon NPC List </span></center></th></tr>');
for (i = 373; i < 403; i++) {
document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
        document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
        document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
        document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
        document.write('</tr>');
}
document.write('<tr><td class="settingsTitle"colspan="4"><center><span data-resource="npclistzeta">zeta NPC List </span></center></th></tr>');
for (i = 187; i < 232; i++) {
document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
        document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
        document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
        document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
        document.write('</tr>');
}
document.write('<tr><td class="settingsTitle"colspan="4"><center><span data-resource="npclistkappa">Kappa NPC List </span></center></th></tr>');
for (i = 232; i < 261; i++) {
document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
        document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
        document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
        document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
        document.write('</tr>');
}
document.write('<tr><td class="settingsTitle"colspan="4"><center><span data-resource="npclistlambda">Lambda NPC List </span></center></th></tr>');
for (i = 284; i < 305; i++) {
document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
        document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
        document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
        document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
        document.write('</tr>');
}
document.write('<tr><td class="settingsTitle"colspan="4"><center><span data-resource="npclistkronos">Kronos NPC List </span></center></th></tr>');
/*for (i = 284; i < 305; i++) {
document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
        document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
        document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
        document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
        document.write('</tr>');
}*/
document.write('<tr><td class="settingsTitle"colspan="4"><center><span data-resource="npclistHades">Hades NPC List </span></center></th></tr>');
for (i = 305; i < 317; i++) {
document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
        document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
        document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
        document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
        document.write('</tr>');
}
document.write('<tr><td class="settingsTitle"colspan="4"><center><span data-resource="npclistkuiper">Kuiper NPC List </span></center></th></tr>');
for (i = 317; i < 373; i++) {
document.write('<tr><td><input style="width: 100%" type="text" id="name'+i+'" value="'+knownNpcList[i]+'" readonly></input></td>');
        document.write('<td><input type="number" id="range'+i+'" min="300" max="900" value="'+knownCirceList[i]+'"></td>');
        document.write('<td><select id="ammo'+i+'"><option value="1">X1</option><option value="2">X2</option><option value="3">X3</option><option value="4">X4</option><option value="11">X1 + SAB</option><option value="21">X2 + SAB</option><option value="31">X3 + SAB</option><option value="41">X4 + SAB</option><option value="45">X4 + RSB</option></select></td>');
        document.write('<td><select id="priority'+i+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="0">No attack</option></select></td>');
        document.write('</tr>');
}