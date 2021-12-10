const Pfad = "0_userdata.0.Rolladensteuerung."

//Zeitsteuerung
schedule("* * * * *", function () {

    var date    = new Date();
    var now     = date.toLocaleTimeString('de-DE', { hour12: false, hour: '2-digit', minute: '2-digit' });
    var profile = ['Wohnbereich', 'Schlafbereich', 'Kinderbereich'];

    profile.forEach(function(profil){

        //Öffnen
        if(now == getState('0_userdata.0.Rolladensteuerung.Status.'+ profil +'.Oeffnungszeit').val){
            var objekte = getProfileDir(profil);
            objekte.forEach(function(objekt){
                setState(objekt +'Positionen.Soll-Position', 100);
                setState(objekt +'_WARTE', true);
            });
        }

        //Schließen
        if(now == getState('0_userdata.0.Rolladensteuerung.Status.'+ profil +'.Schliesszeit').val){
            var objekte = getProfileDir(profil);
            objekte.forEach(function(objekt){
                setState(objekt +'Positionen.Soll-Position', 0);
                setState(objekt +'_WARTE', true);
            });
        }

    });

});

function getShuttersByProfileName(profilename){
    
    switch(profilename) {
        case "Wohnbereich":
            profilename = 0;
            break;
        case "Schlafbereich":
            profilename = 1;
            break;
        case "Kinderbereich":
            profilename = 2;
            break;
    }

    let shutters = new Array();

    $('state[state.id=0_userdata.0.Rolladensteuerung.Rolladen.*.Einstellungen.Profil]').each(function (id, i) {
        var datenpunkt  = id.split(/Einstellungen\.(?=[^\.]+$)/);

        if(getState(datenpunkt[0] +'Einstellungen.Profil').val == profilename) {
            shutters.push(getState(datenpunkt[0] +'_ID').val);        
        }
    });

    return shutters;
}

function getProfileDir(profilname){

    switch(profilname) {
        case "Wohnbereich":
            profilname = 0;
            break;
        case "Schlafbereich":
            profilname = 1;
            break;
        case "Kinderbereich":
            profilname = 2;
            break;
    }

    let shutters = new Array();

    $('state[state.id=0_userdata.0.Rolladensteuerung.Rolladen.*.Einstellungen.Profil]').each(function (id, i) {
        var datenpunkt  = id.split(/Einstellungen\.(?=[^\.]+$)/);
        if(getState(datenpunkt[0] +'Einstellungen.Profil').val == profilname) shutters.push(datenpunkt[0]);
    });

    return shutters;

}
