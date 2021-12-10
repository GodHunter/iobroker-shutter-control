schedule("* * * * *", main);

function main(){

    const breitengrad = getState('0_userdata.0.Systemdaten.Sonnenstand.Azimut').val;
    const sonnenhoehe = getState('0_userdata.0.Systemdaten.Sonnenstand.Elevation').val;

    var selector = $('state[state.id=0_userdata.0.Rolladensteuerung.Rolladen.*._ID]');
    selector.each(function (obj) {

        var objekt      = obj.split(/\.(?=[^\.]+$)/);
        var temperatur  = getState( objekt[0] +'.Einstellungen.Sonnenschutz.Temperaturfuehler' ).val

        //Breitengrade errechnen
        var breitemin = getState( objekt[0] +'.Einstellungen.Sonnenschutz.Sonnenposition' ).val - getState( objekt[0] +'.Einstellungen.Sonnenschutz.Schwellwert' ).val;
        var breitemax = getState( objekt[0] +'.Einstellungen.Sonnenschutz.Sonnenposition' ).val + getState( objekt[0] +'.Einstellungen.Sonnenschutz.Schwellwert' ).val;

        //Wenn Sonnenschutz inaktiv und Temperatur größer als angegeben
        if( getState(objekt[0] +'._SONNENSCHUTZ').val == true && ( getState(objekt[0] +'.Einstellungen.Sonnenschutz._STATUS').val === false && getState(objekt[0] +'.Einstellungen.Sonnenschutz.Aussentemperatur').val <= temperatur ) ){

            //Wenn Rolladen in Sonnenposition
            if( (breitengrad >= breitemin && breitengrad <= breitemax) && sonnenhoehe >= getState( objekt[0] +'.Einstellungen.Sonnenschutz.Sonnenhoehe' ).val ){

                sendTo("telegram.0", "send", {
                    "text": 'Setze Rolladen in Sonnenschutz',
                    parse_mode: "HTML"
                });

                setState(objekt[0] +'.Einstellungen.Sonnenschutz._STATUS', true);

            }

        } else if(getState(objekt[0] +'.Einstellungen.Sonnenschutz._STATUS').val == true && (breitengrad < breitemin || breitengrad > breitemax) ) {
            
            sendTo("telegram.0", "send", {
                "text": 'Deaktiviere Sonnenschutz',
                parse_mode: "HTML"
            });

            setState(objekt[0] +'.Einstellungen.Sonnenschutz._STATUS', false);

        }

    })

};
