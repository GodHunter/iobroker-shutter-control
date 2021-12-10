// EINSTELLUNGEN
    
    // ALLGEMEINE EINSTELLUNGEN ZUM ROLLADEN
    var Bezeichnung = "Kinderzimmer"
    var RolladenID  = "hm-rpc.0.****.1."
    var SensorID    = "hm-rpc.1.****.1.STATE"
    var SensorState = "0"   // Status bei geschlossenem Zustand
    var Profil      = 2     // (0 = Wohnbereich / 1 = Schlafbereich / 2 = Kinderbereich)

    // SONNENSCHUTZ EINSTELLUNGEN
    var Hoehe           = 30    // Höhe in Prozent bei aktivem Sonnenschutz
    var Sonne_Hoehe     = 8     // Elevation ab der der Sonneschutz aktiv ist
    var Sonne_Position  = 118   // Sonnenposition des Fensters
    var Sonne_Offset    = 30    // Schwellwert zur aktivierung des Sonnenschutzes (+/- Sonne_Position)
    var Sonne_Temp      = 26    // Ab welcher Außentemperatur wird der Sonnenschutz aktiviert
    var Fuehler         = '0_userdata.0.Systemdaten.Wetter.aktuell.Temperatur'    // Temperaturfühler für die Außentemperatur


/******* Erstellen der Einstellungen *********/
var Pfad = "0_userdata.0.Rolladensteuerung.Rolladen."

createState(Pfad + Bezeichnung +'._ID', RolladenID, {type: 'string', name: 'RolladenID', role: 'id', read: true, write: true});
createState(Pfad + Bezeichnung +'._WARTE', false, {type: 'boolean', name: 'RolladenWarte', desc: 'Gibt an ob der Rolladen auf eine Ausführung wartet.', read: true, write: true});
createState(Pfad + Bezeichnung +'._EINBRUCHSCHUTZ', false, {type: 'boolean', name: 'Einbruchschutz', desc: 'Einbruchschutz aktivieren / deaktivieren.', read: true, write: true});
createState(Pfad + Bezeichnung +'._SONNENSCHUTZ', false, {type: 'boolean', name: 'Sonnenschutz', desc: 'Sonnenschutz aktivieren / deaktivieren.', read: true, write: true});

createState(Pfad + Bezeichnung +'.Positionen.Ist-Position', getState(RolladenID +'LEVEL').val, {type: 'number', name: 'Ist-Position', role: 'value', unit: '%', desc: 'Aktuelle Position des Rolladen', read: true, write: false});
createState(Pfad + Bezeichnung +'.Positionen.Soll-Position', 0, {type: 'number', name: 'Soll-Position', role: 'value', unit: '%', desc: 'Angestrebte Position des Rolladens', read: true, write: false});

createState(Pfad + Bezeichnung +'.Sensor.ID', SensorID, {type: 'string', name: 'SensorID', role: 'value', desc: 'Fenstersensor der abgefragt wird', read: true, write: true});
createState(Pfad + Bezeichnung +'.Sensor.StatusGeschlossen', SensorState, {type: 'string', name: 'SensorStatusGeschlossen', role: 'value', desc: 'Status des Fenstersensors im geschlossenen Zustand', read: true, write: true});
createState(Pfad + Bezeichnung +'.Sensor.Warte', false, {type: 'boolean', name: 'Warte', role: 'value', desc: 'Warte auf schließen des Sensors', read: true, write: false});

createState(Pfad + Bezeichnung +'.Einstellungen.Profil', Profil, {type: 'number', name: 'Profil', role: 'value', states: {0: 'Wohnbereich', 1: 'Schlafbereich', 2: 'Kinderbereich'}, desc: 'Anzuwendendes Profil', read: true, write: true});

createState(Pfad + Bezeichnung +'.Einstellungen.Sonnenschutz._STATUS', false, {type: 'boolean', name: 'Sonnenschutz_Status', role: 'value', desc: 'Aktueller Status des Sonnenschutzes', read: true, write: false});
createState(Pfad + Bezeichnung +'.Einstellungen.Sonnenschutz.Rolladenhoehe', Hoehe, {type: 'number', name: 'MaxHoehe', role: 'value', unit: '%', desc: 'Maximale Höhe bei aktivem Sonnenschutz', read: true, write: true});
createState(Pfad + Bezeichnung +'.Einstellungen.Sonnenschutz.Sonnenhoehe', Sonne_Hoehe, {type: 'number', name: 'SonnenHoehe', role: 'value', unit: '°', desc: 'Höhe der Sonne die zum Sonnenschutz erreicht sein muss', read: true, write: true});
createState(Pfad + Bezeichnung +'.Einstellungen.Sonnenschutz.Sonnenposition', Sonne_Position, {type: 'number', name: 'SonnenPosition', role: 'value', unit: '°', desc: 'Position der Sonne zum Fenster', read: true, write: true});
createState(Pfad + Bezeichnung +'.Einstellungen.Sonnenschutz.Schwellwert', Sonne_Offset, {type: 'number', name: 'SonnenSchwellwert', role: 'value', unit: '°', desc: 'Schwellwert zur Sonnenposition', read: true, write: true});
createState(Pfad + Bezeichnung +'.Einstellungen.Sonnenschutz.Aussentemperatur', Sonne_Temp, {type: 'number', name: 'Aussentemperatur', role: 'value', unit: '°C', desc: 'Mindest Temperatur zum Sonnenschutz', read: true, write: true});
createState(Pfad + Bezeichnung +'.Einstellungen.Sonnenschutz.Temperaturfuehler', Fuehler, {type: 'string', name: 'Temperaturfuehler', role: 'string', desc: 'ID zum Wert der Außentemperatur', read: true, write: true});

//Profile erstellen
function createProfiles(){
    
    //Allgemeine Einstellungen
    createState(Pfad +'Allgemein.Sommerzeit.Beginn', '28.03.', {read: true, write: true, type: 'string', desc: 'Beginn der Sommerzeit'});
    createState(Pfad +'Allgemein.Sommerzeit.Ende', '24.10.', {read: true, write: true, type: 'string', desc: 'Ende der Sommerzeit'});
    createState(Pfad +'Allgemein.Winterzeit.Beginn', '25.10.', {read: true, write: true, type: 'string', desc: 'Beginn der Winterzeit'});
    createState(Pfad +'Allgemein.Winterzeit.Ende', '27.03.', {read: true, write: true, type: 'string', desc: 'Ende der Winterzeit'});

    //Profile
    createState(Pfad +'Allgemein.Profile.Wohnbereich.Arbeitswoche.Öffnen', '06:00', {read: true, write: true, type: 'string', desc: 'Öffnungszeit in der Arbeitswoche'});
    createState(Pfad +'Allgemein.Profile.Wohnbereich.Arbeitswoche.Schließen', '22:00', {read: true, write: true, type: 'string', desc: 'Schließzeit in der Arbeitswoche'});
    createState(Pfad +'Allgemein.Profile.Wohnbereich.Wochenende.Öffnen', '08:00', {read: true, write: true, type: 'string', desc: 'Öffnungszeit am Wochenende'});
    createState(Pfad +'Allgemein.Profile.Wohnbereich.Wochenende.Schließen', '22:00', {read: true, write: true, type: 'string', desc: 'Schließzeit am Wochenende'});
    
    createState(Pfad +'Allgemein.Profile.Schlafbereich.Arbeitswoche.Öffnen', '06:00', {read: true, write: true, type: 'string', desc: 'Öffnungszeit in der Arbeitswoche'});
    createState(Pfad +'Allgemein.Profile.Schlafbereich.Arbeitswoche.Schließen', '22:00', {read: true, write: true, type: 'string', desc: 'Schließzeit in der Arbeitswoche'});
    createState(Pfad +'Allgemein.Profile.Schlafbereich.Wochenende.Öffnen', '08:00', {read: true, write: true, type: 'string', desc: 'Öffnungszeit am Wochenende'});
    createState(Pfad +'Allgemein.Profile.Schlafbereich.Wochenende.Schließen', '21:00', {read: true, write: true, type: 'string', desc: 'Schließzeit am Wochenende'});

    createState(Pfad +'Allgemein.Profile.Kinderbereich.Arbeitswoche.Öffnen', '06:15', {read: true, write: true, type: 'string', desc: 'Öffnungszeit in der Arbeitswoche'});
    createState(Pfad +'Allgemein.Profile.Kinderbereich.Arbeitswoche.Schließen', '19:00', {read: true, write: true, type: 'string', desc: 'Schließzeit in der Arbeitswoche'});
    createState(Pfad +'Allgemein.Profile.Kinderbereich.Wochenende.Öffnen', '08:00', {read: true, write: true, type: 'string', desc: 'Öffnungszeit am Wochenende'});
    createState(Pfad +'Allgemein.Profile.Kinderbereich.Wochenende.Schließen', '19:00', {read: true, write: true, type: 'string', desc: 'Schließzeit am Wochenende'});

    //Status (Heutige Öffnungs- / Schließzeiten)
    createState(Pfad +'Status.Wohnbereich.Oeffnungszeit', '06:00', {read: true, write: true, type: 'string', desc: 'Öffnungszeit Heute'});
    createState(Pfad +'Status.Wohnbereich.Schliesszeit', '18:00', {read: true, write: true, type: 'string', desc: 'Schließzeit Heute'});
    createState(Pfad +'Status.Schlafbereich.Oeffnungszeit', '06:00', {read: true, write: true, type: 'string', desc: 'Öffnungszeit Heute'});
    createState(Pfad +'Status.Schlafbereich.Schliesszeit', '18:00', {read: true, write: true, type: 'string', desc: 'Schließzeit Heute'});
    createState(Pfad +'Status.Kinderbereich.Oeffnungszeit', '06:00', {read: true, write: true, type: 'string', desc: 'Öffnungszeit Heute'});
    createState(Pfad +'Status.Kinderbereich.Schliesszeit', '18:00', {read: true, write: true, type: 'string', desc: 'Schließzeit Heute'});
}
