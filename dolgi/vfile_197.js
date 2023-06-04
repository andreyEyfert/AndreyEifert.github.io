MODULES = {};
/* |||||||||||||||||||||||||  ./src/dolg/!modules/app/events.js */
MODULES.M188 = function( exports ) {
const EVS = {}


exports.on = function ( e, ...a ) {
    let s
    let i = a.pop( ); typeof i == 'boolean' ? ( s = a.pop() ) : ( s = i, i = false );

    i && ( e += '_LASTevent' )

   !EVS[ e ] && ( EVS[ e ] = [] );
    EVS[ e ].push( { s, a } )
}
exports.emit = function ( e, ...a ) {
    if ( EVS[ e ] )
    for ( var i of EVS[ e ] ) i.s.call( this, ...i.a, ...a )

    if ( EVS[ e + '_LASTevent' ] )
    for ( var i of EVS[ e + '_LASTevent' ] ) i.s.call( this, ...i.a, ...a )
}
return exports; }( {} )
/* ||||||||||||||||||||||||| */
/* |||||||||||||||||||||||||  ./src/dolg/!modules/app/index.js */
MODULES.M190 = function( exports ) {

const { on, emit }  = MODULES.M188
const store         = {};
const el_prototype = {
    redraw(  ) {
        this.obs.emit()
    }
}

function Remove ( e, S ) {
    for ( var j = S.length - 1; j >= 0; j-- ) 
    if ( S[ j ].e === e ) S.splice( j, 1 )

    var n = e.firstChild; while ( e = n ) { n = e.nextSibling; Remove( e, S ); }
}
const OP = {
    create( c, a ) {
        const { D, P } = this
        return new Function(
            'data' + ( a ? ', ' + a : '' ),
            Object.keys( D ).map( k => `var ${ k } = data.${ k };` ).join( '\r\n' ) +
            Object.keys( P ).map( k => `var ${ k } = ${ P[ k ] };` ).join( '\r\n' ) +
            'return ' + c
        )
    },
    remove( el ) {
        Remove( el, this.S )
    },
    bind ( e, c, f, ...a ) {
        this.S.push( { e, F: this.create( c ), f, a } )
    },
    emit() {
        const { S, D, W } = this;

        W && W( D )

        for ( var i of S )
            i.f( i.F( D ), ...i.a )
    },
    clone() {
        const r = {}
        for ( var k in this ) r[ k ] = this[ k ]
        const p = {}, P = this.P;
        for ( var k in P ) p[ k ] = P[ k ]
        r.P = p;

        return r
    }
}


function Obs ( data, C, W ) {
    const obs = {
        S: [],
        P: {},
        D: data,
        W,
        C,
        __proto__: OP
    }

    return obs
}
function T_ ( v, e ) {
    e.textContent = v == undefined ? '' : v
}
function T ( e, a ) {
    let p = e.parentNode, s = e.textContent, ind = 0, o;

    s.replace( /\{\{([\s\S]+?)\}\}/g, ( q, c, i ) => {
        p.insertBefore(     document.createTextNode( s.substring( ind, i ) ), e )
        p.insertBefore( o = document.createTextNode( '' ), e )

        a.bind( o, c, T_, o )

        ind = i + q.length
    } )

    e.textContent = s.substring( ind )
}
function F_ ( v, n, i, c, e, h, p, a, els ) {

    els.splice( v.length || 0 ).forEach( e => {
        a.remove( e )
        e.remove( )
    } );

    for ( var j = els.length; j < v.length; j++ ) {
        a.P[ n ] = `( ${ c } )[ ${ j } ]`
 i && ( a.P[ i ] = j )

        const el = e.cloneNode( true )

        Parse( el, a )

        p.insertBefore( el, h )

        els.push( el )
    }
    
    delete a.P[ n ]
    delete a.P[ i ]
}
function F ( e, a ) {
    const v = e.getAttribute( ':for' ); if ( !v ) return;
    const q = /([\w$_]+)( *, *([\w$_]+))? +in +(.+)/.exec( v ); if ( !q ) return;

    const p = e.parentNode;
    const h = document.createComment( 'for' )

    p.insertBefore( h, e )
    p.removeChild( e )

    a.bind( h, q[ 4 ], F_, q[ 1 ], q[ 3 ], q[ 4 ], e, h, p, a.clone(), [] )

    e.removeAttribute( ':for' )

    return true
}

function AS ( v, s ) {
    for ( var k in v ) s[ k ] = v[ k ]
}
function AC ( v, l, m ) {
    for ( var i of m ) l.remove( i )
    if ( Array.isArray( v ) )
        for ( var i of v ) i      && ( m.push( i ), l.add( i ) )
    else
        for ( var k in v ) v[ k ] && ( m.push( k ), l.add( k ) )
}
function AI ( v, e ) {
    e.value = v;
}

const isTouch = 'ontouchstart' in window

const G_EV = {
    down: isTouch ? 'touchstart' : 'down',
    move: isTouch ? 'touchmove'  : 'move',
    up:   isTouch ? 'touchend'   : 'up'
}

function A ( e, a ) {

    Array.from( e.attributes ).forEach( ({ name, value }) => {
        if ( name == ':style' ) {
            a.bind( e, value, AS, e.style )
        }
        else
        if ( name == ':class' ) {
            a.bind( e, value, AC, e.classList, [] )
        }
        else
        if ( name == ':input' ) {
            const f = a.create( `( ${ value } = VALUE )`, 'VALUE' )
            const i = e.type == 'number'

            a.bind( e, value, AI, e )

            e.addEventListener( 'input', ev => {
                f( a.D, i ? parseFloat( e.value ) : e.value )
            } )
        }
        else
        if ( name[ 0 ] == '@' ) {
            const E = name.substring( 1 )
            const P = /([\w$_]+)?(\:(.+))?/.exec( value )
            let N = P[ 1 ] || E;
            const V = P[ 3 ] && a.create( `[ ${ P[ 3 ] } ]`, 'event, pos, elem' )
            const { C, D } = a

            if ( /^G_/.test( N ) ) {
                N = N.substring( 2 )
                e.addEventListener( G_EV[ E ] || E, function ( ev ) {
                    emit.call( C, N, ...( V ? V( D, ev, ev.changedTouches && ev.changedTouches[ 0 ] || ev, e ) : [] ), D )
                } )
            }
            else {
                e.addEventListener( G_EV[ E ] || E, function ( ev ) {
                    C[ N ].call( C, ...( V ? V( D, ev, ev.changedTouches && ev.changedTouches[ 0 ] || ev, e ) : [] ), D )
                } )
            }
        }
        else return
        
        e.removeAttribute( name )
    } );
}


window.addEventListener( 'DOMContentLoaded', e => {
    emit( 'LOAD' )
} )
window.addEventListener( 'beforeunload', e => {
    emit( 'CLOSE' )
} )

const M = [ F, A ]


function Parse ( e, a ) {
    if ( e.nodeType == 3 ) return T( e, a )
    if ( e.nodeType != 1 ) return

    for ( var f of M ) if ( f( e, a ) ) return

    var n = e.firstChild; while ( e = n ) { n = e.nextSibling; Parse( e, a ); }
}
function Find ( el ) {
    const v = el.getAttribute( ':app-el' )

    if ( v ) {
        const c = store[ v ]
        if ( c ) {
            Parse( el, c.obs )
            c.obs.emit()
        }
    }

    for ( var i of el.children ) Find( i )
}
App = function App ( id, data ) {
    const c = store[ id ] = {
        __proto__: el_prototype
    }

    let D;
    
    const W = typeof data == 'function' ?
            ( D = {}, data( D ), data )
            :
            ( D = data, null )
            
    c.obs = Obs( D, c, W )

    return c;
}

App.emit = emit
App.on   = on
App.__FUNC = M;
App.EVENTS = G_EV;

on( 'LOAD', e => Find( document.body ) )
return exports; }( {} )
/* ||||||||||||||||||||||||| */
/* |||||||||||||||||||||||||  ./src/dolg/v1/js/index.js */
MODULES.M199 = function( exports ) {
MODULES.M190

const data = localStorage.DOLG_DATAv1 ? JSON.parse( localStorage.DOLG_DATAv1 ) : {
    total: 0,
    item: null,
    state: 1,
    names: [],
    items: []
}

App.on( 'STATE', function ( state, item ) {
    data.state  = state;
    data.item     = item
} )
const user = App( 'user', data )

user.obs.W = function ( D ) {

    let total = 0
    let gtotal = 0
    
    for ( var i of D.items ) {
        if ( i.id == D.id ) {
            total += i.val
        }
        gtotal += i.val
    }
    D.total  = total;
    D.gtotal = gtotal
}

let x

user.slide_down = ( i, ind, elem, pos ) => {
    x = pos.clientX
    y = pos.clientY
}
user.slide_move = ( i, ind, elem, pos ) => {
    let ox = pos.clientX - x; ox = ox > 60 ? 60 : ox < 0 ? 0 : ox
    
    elem.style.left = ox + 'px'
}
user.slide_up = ( i, ind, elem, pos, D ) => {
    let ox = parseInt( elem.style.left )

    if ( ox == 60 ) {
        D.items.splice( ind, 1 )
        user.redraw()
    }

    elem.style.left = '0px'
}
user.add = ( D ) => {
    D.items.push( { val: 0, id: D.item.id, comit: '', time: Date.now() } )
    user.redraw()
}
user.blur = ( D ) => {
    user.redraw()
}
user.focus = ( el ) => {
    el.select()
}
function s ( v ) {
    return v < 10 ? '0' + v : v
}
getDate = function ( time ) {
    const d = new Date( time )

    return `${ s( d.getDate() ) }.${ s( d.getMonth() + 1 ) }.${ d.getFullYear() }`
}

App.on( 'STATE',  function ( e ) {
    user.redraw()
} )



App.on( 'CLOSE',  function ( e ) {
    localStorage.DOLG_DATAv1 = JSON.stringify( data )
} )

getTotal = function ( id ) {
    let total = 0
    
    for ( var i of data.items ){

        if ( i.id == id ) {
            total += i.val
        }
    }
    return total
}

const main = App( 'main', data )
main.slide_down = ( i, ind, elem, pos ) => {
    x = pos.clientX
    y = pos.clientY
}
main.slide_move = ( i, ind, elem, pos ) => {
    let ox = pos.clientX - x; ox = ox > 60 ? 60 : ox < -60 ? -60 : ox
    
    elem.style.left = ox + 'px'
}
main.slide_up = ( i, ind, elem, pos, D ) => {
    let ox = parseInt( elem.style.left )
    
    if ( ox == 60 ) {
        D.names.splice( ind, 1 )

        const { items } = D;
        
        for ( var j = items.length - 1; j >= 0; j-- ) {
            if ( items[ j ].id === ind ) {
                items.splice( j, 1 )
            }
        }
        main.redraw()
    } else
    if ( ox == -60 ) {
        App.emit( 'STATE', 2, i,  )
    }

    elem.style.left = '0px'
}
main.add = (  D ) => {
    D.names.push( { name: '', id: Date.now() } )
    main.redraw()
}
main.focus = ( el ) => {
    el.select()
}



App.on( 'STATE',  function ( e ) {
    main.redraw()
} )
return exports; }( {} )
/* ||||||||||||||||||||||||| */
/* |||||||||||||||||||||||||  ./src/dolg/!modules/app/move-on-click.js */
MODULES.M191 = function( exports ) {

MODULES.M190


App.__FUNC.splice( 1, 0, ( e, a ) => {
    const v = e.getAttribute( '@onclickedmove' ); if ( !v ) return;
    const p = /([\w$_]+)?(\:(.+))?/.exec( v )
    const V = p[ 3 ] && a.create( `[ ${ p[ 3 ] } ]`, 'event, pos, elem' )
    const { C, D } = a;
    const n = p[ 1 ] || 'onclickedmove'
    const n_d = n + '_down'
    const n_u = n + '_up'
    const n_m = n + '_move'

    function down ( ev ) {

        C[ n_d ] && C[ n_d ].call( C, ...( V ? V( D, ev, ev.changedTouches && ev.changedTouches[ 0 ] || ev, e ) : [] ), D )
        
        window.addEventListener( App.EVENTS.move, move )
        window.addEventListener( App.EVENTS.up, up )
    }
    function move ( ev ) {
        C[ n_m ] && C[ n_m ].call( C, ...( V ? V( D, ev, ev.changedTouches && ev.changedTouches[ 0 ] || ev, e ) : [] ), D )
    }
    function up ( ev ) {
        C[ n_u ] && C[ n_u ].call( C, ...( V ? V( D, ev, ev.changedTouches && ev.changedTouches[ 0 ] || ev, e ) : [] ), D )

        window.removeEventListener( App.EVENTS.move, move )
        window.removeEventListener( App.EVENTS.up, up )
    }
    e.addEventListener( App.EVENTS.down, down )


    e.removeAttribute( '@onclickedmove' )
} )
return exports; }( {} )
/* ||||||||||||||||||||||||| */
