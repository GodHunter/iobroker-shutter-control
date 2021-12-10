var Profile     = ['Wohnbereich', 'Schlafbereich', 'Kinderbereich'];
var debug       = true;

schedule("0 4 * * *", function () {

    var jetzt       = new Date();
    var dow         = jetzt.getDay();

    if(debug) log('Tag der Woche: '+ dow);

    //ASTROZEITEN ERMITTELN
    var zeit    = ( Number( timestampVonUhrzeit( getAstroDate("sunsetStart").toLocaleTimeString('de-DE', { hour12: false }) ) ) + Number( timestampVonUhrzeit( getAstroDate("dusk").toLocaleTimeString('de-DE', { hour12: false }) ) ) ) / 2;
    var temp    = new Date( zeit );

    //Rolladen Zeiten NEU
    const astroOpen     = getAstroDate("sunrise").toLocaleTimeString('de-DE', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const astroClose    = temp.toLocaleTimeString('de-DE', { hour12: false, hour: '2-digit', minute: '2-digit' });

    Profile.forEach(function(profil){

        if(debug) log('Profil: '+ profil);

        var open    = getState('0_userdata.0.Rolladensteuerung.Allgemein.Profile.'+ profil +'.'+ profilsub(dow, 'open') +'.Öffnen').val;
        var close   = getState('0_userdata.0.Rolladensteuerung.Allgemein.Profile.'+ profil +'.'+ profilsub(dow, 'close') +'.Schließen').val;

        if(open < getState('0_userdata.0.Rolladensteuerung.Allgemein.Astrozeiten.Oeffnen').val)     open = getState('0_userdata.0.Rolladensteuerung.Allgemein.Astrozeiten.Oeffnen').val;
        if(close > getState('0_userdata.0.Rolladensteuerung.Allgemein.Astrozeiten.Schliessen').val) close = getState('0_userdata.0.Rolladensteuerung.Allgemein.Astrozeiten.Schliessen').val;

        if(debug) log('Gewähltes Profil: '+ profilsub(dow, 'open') +' / Öffnungszeit: '+ open);
        if(debug) log('Gewähltes Profil: '+ profilsub(dow, 'close') +' / Schließzeit: '+ open);

        setState('0_userdata.0.Rolladensteuerung.Status.'+ profil +'.Oeffnungszeit', open);
        setState('0_userdata.0.Rolladensteuerung.Status.'+ profil +'.Schliesszeit', close);

    });   

});

function profilsub(wochentag, subject){ // Zwischen Arbeitswoche und Wochenende entscheiden
    
    var wochentage = [1, 2, 3, 4, 5];   // Montag - Freitag
    var wochenende = [0, 6];            // Sonntag, Samstag 

    if(subject == 'close' && (wochentag == 5 || wochentag == 0) ){ // Freitag Abend => Wochenende / Sonntag Abend => Arbeitswoche
        
        if(wochentag == 5) return 'Wochenende';
        else if(wochentag == 0 && getState('feiertage.0.morgen.boolean').val === true) return 'Wochenende';
        else return 'Arbeitswoche';

    } 
    
    else if(wochentage.includes(wochentag)) return 'Arbeitswoche';
    else if(wochenende.includes(wochentag)) return 'Wochenende';

    //Feiertage = Wochenende
    if( getState('feiertage.0.heute.boolean').val === true ){

        if(subject == 'open') return 'Wochenende';
        if( getState('feiertage.0.morgen.boolean').val === true && subject == 'close' ) return 'Wochenende';
        else if( getState('feiertage.0.morgen.boolean').val === false && subject == 'close' ) return 'Arbeitswoche';

    }

}
