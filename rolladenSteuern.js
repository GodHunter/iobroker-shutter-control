var Pfad = "0_userdata.0.Rolladensteuerung."

schedule("* * * * *", main);

function main(){

    var selector = $('state[state.id=0_userdata.0.Rolladensteuerung.Rolladen.*._WARTE]');
    selector.each(function (obj) {

        var objekt      = obj.split(/\.(?=[^\.]+$)/);        
        var rolladen    = getState(objekt[0] +'._ID').val;
        var sensor      = '{"id":"'+ getState(objekt[0] +'.Sensor.ID').val +'", "closedState":"'+ getState(objekt[0] +'.Sensor.StatusGeschlossen').val +'"}';

        //Einbruchschutz
        if( getState('ical.0.events.0.today.Urlaub').val === true && ( getState('0_userdata.0.Anwesenheit._Abwesenheitsdauer').val >= getState(objekt[0] +'.Einstellungen.Einbruchschutz.Abwesenheit').val && getState(objekt[0] +'._EINBRUCHSCHUTZ').val === true ) ){

            if( Number(getState(rolladen +'LEVEL').val)  !== getState(objekt[0] +'.Einstellungen.Einbruchschutz.Level').val ) {
                setState( rolladen +'LEVEL', getState(objekt[0] +'.Einstellungen.Einbruchschutz.Level').val );
                setState(obj, true);
            }

        } else if( getState(objekt[0] +'.Einstellungen.Sonnenschutz._STATUS').val === true ){ //Sonnenschutz

            if( getState( rolladen +'LEVEL' ).val !== getState( objekt[0] +'.Einstellungen.Sonnenschutz.Rolladenhoehe' ).val && checkSensor(sensor) === true){

                setState( rolladen +'LEVEL', Number(getState(objekt[0] +'.Einstellungen.Sonnenschutz.Rolladenhoehe').val) );
                setState(objekt[0] +'._WARTE', true);

            }    
        
        } else { //Zeitsteuerung (Normaler Ablauf)

            if( getState(obj).val === true && ( Number(getState(objekt[0] +'.Positionen.Soll-Position').val) != Number(getState(rolladen +'LEVEL').val) && checkSensor(sensor) === true ) ){        
                    
                setState(objekt[0] +'._WARTE', false);
                setState( rolladen +'LEVEL', Number(getState(objekt[0] +'.Positionen.Soll-Position').val) );

            }
        
        }

    });

};

// Steuere Rolladen nach Schließen des Fensters
var selector = $('state[state.id=*](functions=fensterkontakte)');
selector.on(function (obj) {
    log(obj.id);
});

// IST Position eintragen
var selector = $('state[state.id=*.WORKING](functions=blinds)');
selector.on(function (obj) {

    if(getState(obj.id).val === false){
        
        var objekt  = obj.id.split(/\.(?=[^\.]+$)/);
        var level   = getState(objekt[0] +'.LEVEL');
        var dir     = getShuttersByID(objekt[0] +'.', 'DIR');

        setState(dir +'.Positionen.Ist-Position', level);
            
    }

});

/*** FUNKTIONEN ***/
function checkSensor(data){ //Senoren prüfen

    var objekt  = JSON.parse(data);
    
    if( objekt.id.length === 0 || getState(objekt.id).val.toString() === objekt.closedState ) return true;
    else return false;
    
}

function getShuttersByID(objekt, info){
    
    let datenpunkt = new Array();

    $('state[state.id=0_userdata.0.Rolladensteuerung.Rolladen.*._ID]').each(function (id, i) {
        if(getState(id).val == objekt) datenpunkt  = id.split(/\.(?=[^\.]+$)/);
    });

    switch(info) {
        case "Sensor":
            return '{"sensor":[{"id":"'+ getState(datenpunkt[0] +'.Sensor.ID').val +'", "closedState":"'+ getState(datenpunkt[0] +'.Sensor.StatusGeschlossen').val +'"}]}';
        case "DIR":
            return datenpunkt[0];
    }

}
