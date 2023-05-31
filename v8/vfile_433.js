MODULES = {};
/* |||||||||||||||||||||||||  ./src/work/v2/!modules/app/events.js */
MODULES.M426 = function( exports ) {


const store = {}
const store1 = {}

function on ( e, ...a ) {

    let is = false
    let f = a.pop();
    
    typeof f == 'boolean' && ( is = f, f = a.pop() )

    if ( is ) {
        !store1[ e ] && ( store1[ e ] = [] )    
         store1[ e ].push( { succ: f, a } )
    } else {
       !store[ e ] && ( store[ e ] = [] )    
        store[ e ].push( { succ: f, a } )
    }
}
function emit ( e, ...a ) {
    if ( store[ e ] )
    for ( var i of store[ e ] ) 
        i.succ.call( this, ...i.a, ...a )
    
    if ( store1[ e ] )
    for ( var i of store1[ e ] ) 
        i.succ.call( this, ...i.a, ...a )
}

window.addEventListener( 'DOMContentLoaded', e => {
    emit( 'LOAD' )
} )
window.addEventListener( 'beforeunload', e => {
    emit( 'CLOSE' )
} )

exports = {
    on, emit
}
return exports; }( {} )
/* ||||||||||||||||||||||||| */
/* |||||||||||||||||||||||||  ./src/work/v2/!modules/app/obs.js */
MODULES.M429 = function( exports ) {

function Remove ( el, A ) {
        const { S } = A

        for ( var j = S.length - 1; j >= 0; j-- ) {
            if ( S[ j ].o == el ) S.splice( j, 1 )
        }
    

    var n = el.firstChild; while ( el = n ) { n = el.nextSibling; Remove.apply( this, arguments ); }
}


const proto = {
    create ( code, vs ) {
        const { D, P, S } = this

        const F = Function( 'data' + ( vs ? ',' + vs : '' ),
            Object.keys( D ).map( k => `var ${ k } = data.${ k };` ).join( '\r\n' ) +
            '\r\n' +
            Object.keys( P ).map( k => `var ${ k } = ${ P[ k ] };` ).join( '\r\n' ) +
            '\r\nreturn ' + code
        )

        return F
    },
    bind ( o, code, succ, ...a ) {
        const { D, P, S } = this
        const F = this.create( code )

        S.push( { F, o, succ, a } )
        
        succ( F( D ), ...a )
    },
    draw ( ) {
        const { D, S } = this

        for ( var { F, succ, a } of S ) {
            succ( F( D ), ...a )
        }
    },
    remove ( el ) {
        Remove( el, this )
    },
    clone () {
        const R = {}
        for ( var k in this ) {
            R[ k ] = this[ k ]
        }

        const P = {};

        for ( var k in this.P ) {
            P[ k ] = this.P[ k ]
        }

        R.P = P;

        return R
    }
}
exports = ( data, EVS ) => {
    const obs = {
        D: data, P: { }, S: [], ref: {}, EVS,
        __proto__: proto
    }
    return obs
}
return exports; }( {} )
/* ||||||||||||||||||||||||| */
/* |||||||||||||||||||||||||  ./src/work/v2/!modules/app/index.js */
MODULES.M428 = function( exports ) {
const { on, emit } = MODULES.M426
const Obs = MODULES.M429


function Text_ ( v, el ) {
    el.textContent = v == undefined ? '': v
}
function Text ( el, a ) {

    let p = el.parentNode, s = el.textContent, ind = 0, o

    s.replace( /\{\{([\s\S]*?)\}\}/g, ( e, code, i ) => {
        p.insertBefore( document.createTextNode( s.substring( ind, i ) ), el )
        p.insertBefore( o = document.createTextNode( '' ), el )

        a.bind( o, code, Text_, o )

        ind = i + e.length
    } )

    el.textContent = s.substring( ind )
}

function F_ ( v, n, i, c, a, p, h, el, els ) {

    els.splice( v.length || 0 ).forEach( el => {
        a.remove( el )
        p.removeChild( el )
    } );

    for ( var j = els.length; j < v.length; j++ ) {

        a.P[ n ] = c + '[ ' + j + ' ]'
        i && ( a.P[ i ] = j )
        
        const e = el.cloneNode( true )

        Parse( e, a )
        
        p.insertBefore( e, h )
        els.push( e )
    }

    delete a.P[ n ]
    i && delete a.P[ i ]
}
function F ( el, a ) {
    const v = el.getAttribute( ':for' ); if ( !v ) return;
    const e = /([\w_$]+)( *, *([\w_$]+))? *in *(.+)/.exec( v ); if ( !e ) return;

    const p = el.parentNode
    const h = document.createComment( 'for' )

    el.removeAttribute( ':for' )

    p.insertBefore( h, el )
    p.removeChild( el )

    a.bind( h, e[ 4 ], F_, e[ 1 ], e[ 3 ], e[ 4 ], a.clone(), p, h, el, [] )

    return true
}


const isTouch = 'ontouchstart' in window;

const EV_NAMES = {
    down: isTouch ? 'touchstart' : 'mousedown',
    move: isTouch ? 'touchmove'  : 'mousemove',
    up:   isTouch ? 'touchend'   : 'mouseup'
}

function Style ( v, s ) {
    for ( var k in v ) {
        s[ k ] = v[ k ]
    }
}
function Input ( v, el ) {
    el.value = v
}

function A ( el, a ) {
    Array.from( el.attributes ).forEach( ({ name, value }) => {

        if( name == ':style' ) {
            a.bind( el, value, Style, el.style )
        } else
        if ( name == ':input' ) {
            const E = /([\w$_]+)?(\:(.*))?/.exec( value )
            const F = a.create( '(' + E[ 3 ] + ' = APP_VALUE)', 'APP_VALUE, event, pos, el' ) 
            
            a.bind( el, E[ 3 ], Input, el )

            el.addEventListener( 'input', e => {
                F( a.D, el.value )
            } )

        } else
        if ( name[ 0 ] === '@' ) {
            const E = /([\w$_]+)?(\:(.*))?/.exec( value )
            const F = E && E[ 3 ] ? a.create( '[' + E[ 3 ] + ']', 'event, pos, el' ) : () => []
            const n = name.substring( 1 )
            const EV = E[ 1 ] || n
            
            const FN = /G_\w+/.test( EV ) ?
                function ( e ) {
                    const v = F( a.D, e, e.changedTouches && e.changedTouches[ 0 ] || e, el )
                    emit( EV.substring( 2 ), ...v )
                }
                :
                function ( e ) {
                    const v = F( a.D, e, e.changedTouches && e.changedTouches[ 0 ] || e, el )
                    a.EVS[ EV ]( ...v )
                }
            
            el.addEventListener( EV_NAMES[ n ] || n, FN )
        }
        else return

        el.removeAttribute( name )
    } );
}


function Parse ( el, a ) {
    if ( el.nodeType == 3 ) Text( el, a )
    if ( el.nodeType != 1 ) return;
    if ( F( el, a ) ) return

    if ( el.id ) {
        a.ref[ el.id ] = el
    }

    A( el, a )
    
    var n = el.firstChild; while ( el = n ) { n = el.nextSibling; Parse.apply( this, arguments ); }
}
function bind ( id, data, evs ) {

    const el = document.querySelector( id )

    if ( !el )
        return;

    const obs = Obs( data, evs )
    const c = {
        el, evs,
        obs
    }

    Parse( el, obs )

    return c
}

function move ( move, up ) {

    let A
    
    function move_h ( e ) {
        move && move( ...A, e, isTouch ? e.changedTouches[ 0 ] : e )
    }
    function up_h ( e ) {
        up && up( ...A, e, isTouch ? e.changedTouches[ 0 ] : e )

        window.removeEventListener( EV_NAMES.move, move_h )
        window.removeEventListener( EV_NAMES.up, up_h )
    }
    return ( ...a ) => {
        A = a
        window.addEventListener( EV_NAMES.move, move_h )
        window.addEventListener( EV_NAMES.up, up_h )
    }
}


exports = {
    on,
    emit,
    bind,
    EV_NAMES,
    isTouch,
    move
}
return exports; }( {} )
/* ||||||||||||||||||||||||| */
/* |||||||||||||||||||||||||  ./src/work/v2/js/data.js */
MODULES.M435 = function( exports ) {

const app = MODULES.M428

exports = localStorage.v0001data ? JSON.parse( localStorage.v0001data ) : {
    item: 1,
    state: 1,
    month: 5,
    year: 2023,
    prices: [],
    items: []
}

app.on( 'STATE', ( state, item ) => {
    exports.state = state;
    if ( state == 2 ) exports.item = item;
} )
app.on( 'MONTH_CHANGE', ( month ) => {
    exports.min = new Date( exports.year, month - 1, 1, 0)
    exports.max = new Date( exports.year, month    , 1, 0 )
    exports.month = month

    app.emit( 'CHANGE' )
} )
app.on( 'LOAD', ( ) => {
    app.emit( 'MONTH_CHANGE', exports.month )
    app.emit( 'STATE', exports.state, exports.item )

}, true )
app.on( 'CLOSE', ( ) => {
    localStorage.v0001data = JSON.stringify( exports )
}, true )

return exports; }( {} )
/* ||||||||||||||||||||||||| */
/* |||||||||||||||||||||||||  ./src/work/v2/js/fns.js */
MODULES.M436 = function( exports ) {
const { prices, items } = MODULES.M435

const s = v => v > 9 ? v : '0' + v

function getDate ( time ) {
    const d = new Date( time );
    
    return `${ s( d.getDate( ) ) }.${ s( d.getMonth( ) + 1 ) }.${ s( d.getFullYear( ) ) }`
}

function getTotalDay ( day ) {
    let t = 0

    if ( !day ) return 0;

    const { items } = day;

    for ( var k in items ) {
        const i = items[ k ]
        t += i.count * prices[ k ].price;
    }
    return t
}



exports = {
    months: [ '',
        'Январь','Февраль','Март',
        'Апрель','Май','Июнь',
        'Июль','Август','Сентябрь',
        'Октябрь','Ноябрь', 'Декабрь'
    ],
    getDate,
    getTotalDay
}
return exports; }( {} )
/* ||||||||||||||||||||||||| */
/* |||||||||||||||||||||||||  ./src/work/v2/js/items.js */
MODULES.M438 = function( exports ) {

const app = MODULES.M428
const fns = MODULES.M436

const { prices, items } = MODULES.M435
const D = MODULES.M435

let is = true

const data = {
    date: '',
    total: '',
    items: []
}

function calc ( ) {
    data.items.splice( 0 )

    let t = 0, c = 0, j = -1

    for ( var i of items ) {
        j++;

        if ( i.time < D.min || i.time > D.max ) continue

        const total = fns.getTotalDay( i )

        c++;

        data.items.push( {
            index: j,
            time: fns.getDate( i.time ),
            total: ( total * i.koef ).toFixed( 2 ),
            koef: i.koef == 1 ? '' : i.koef
        } )

        t += total * i.koef
    }
    data.month = fns.months[ D.month ]
    data.count = c
    data.total = t.toFixed( 2 )
    data.midle = ( (t / c) || 0 ).toFixed( 2 )
}


const start = app.move(
    ( c, index, x, y, el, e, p ) => {
        let Y = p.clientY - y
        let X = p.clientX - x

        if ( is == true && Math.abs( Y ) > 10 ) {
            el.style.left = 0 + 'px'
        }

        if ( Math.abs( X ) > 15 ) {
            if ( is == true ) {
                x = p.clientX
                X = p.clientX - x
            }
            is = false
        } else return

        el.style.left = X > 60 ? 60 : X < -60 ? -60 : X + 'px'
    },
    ( c, index, x, y, el, e, p ) => {
        is = true
        let X = p.clientX - x
    
        if ( X > 60 ) {
            items.splice( index, 1 )
            app.emit( 'CHANGE' )
        }
        else if ( X < -60 ) {
            app.emit( 'STATE', 2, index )
        }

        el.style.left = 0 + 'px'
    }
)

let item

app.on( 'LOAD', e => {

    calc()

    const c = app.bind( '#w_items', data, {
        down( index, pos, el ) {
            start( c, index, pos.clientX, pos.clientY, el )
        },
        add ( ) {
            let time = Date.now()

            if ( time < D.min || time > D.max ) {
                time = new Date( D.year, D.month - 1, 1, 8, 0 ).getTime()
            }
            
            items.unshift( { time, items: {}, koef: 1 } )
            app.emit( 'CHANGE' )
        },
        click ( i ) {
            item = items[ i ]
            c.obs.ref.i_time.focus()
        },
        input ( el ) {

            let v = parseInt( el.value )
            const day = new Date( item.time )
            const max = new Date( D.max - 7 * 60 * 60 * 1000 -1 ).getDate()

            if ( v > max ) {
                v = v % 100
            }
            if ( v > max ) {
                v = v % 10
            }

            day.setDate( v )

            el.value = v
            item.time = day.getTime()

            app.emit( 'CHANGE' )
        }
    } )

    app.on( 'CHANGE', e => {
        if ( D.state == 1 ) {
            calc()
            c.obs.draw()
        }
    } )

    app.on( 'STATE', ( state ) => {
        if ( state == 1 ) {
            document.body.appendChild( c.el )
            calc()
            c.obs.draw()
        } else {
            c.el.remove()
        }
    } )
} )
return exports; }( {} )
/* ||||||||||||||||||||||||| */
/* |||||||||||||||||||||||||  ./src/work/v2/js/prices.js */
MODULES.M440 = function( exports ) {

const app = MODULES.M428
const fns = MODULES.M436

const { prices, items } = MODULES.M435
const D = MODULES.M435


const data = {
    items: []
}

function calc ( ) {
    data.items.splice( 0 )

    let t = 0, c = 0, j = -1

    for ( var i of prices ) {
        j++;

        if ( i.hide ) continue

        const total = fns.getTotalDay( i )

        c++;

        data.items.push( {
            index: j,
            name:  i.name,
            price: i.price
        } )

        t += total * i.koef
    }
    data.month = fns.months[ D.month ]
    data.count = c
    data.total = t.toFixed( 2 )
    data.midle = ( (t / c) || 0 ).toFixed( 2 )
}



app.on( 'LOAD', e => {

    calc()

    const c = app.bind( '#w_prices', data, {
        add ( ) {
            prices.push( { name: '', price: 0 } )
            app.emit( 'CHANGE' )
        },
        focus ( el ) {
            el.select()
        },
        set ( i, index, k, is ) {
            prices[ index ][ k ] = is ? parseFloat( i[ k ] ) : i[ k ]
            app.emit( 'CHANGE' )
        }
    } )

    app.on( 'CHANGE', e => {
        if ( D.state == 3 ) {
            calc()
            c.obs.draw()
        }
    } )

    app.on( 'STATE', ( state ) => {
        if ( state == 3 ) {
            document.body.appendChild( c.el )
            calc()
            c.obs.draw()
        } else {
            c.el.remove()
        }
    } )

} )

return exports; }( {} )
/* ||||||||||||||||||||||||| */
/* |||||||||||||||||||||||||  ./src/work/v2/js/item.js */
MODULES.M437 = function( exports ) {

const app = MODULES.M428
const fns = MODULES.M436

const { prices, items } = MODULES.M435
const D = MODULES.M435


const data = {
    date: '',
    koef: '',
    total: '',
    items: []
}

function calc ( ) {
    data.items.splice( 0 )

    const item = items[ D.item ]
    const total = fns.getTotalDay( item )


    if ( !item ) return;

    let j = -1

    for ( var i of prices ) {
        j++;

        if ( i.hide ) continue

        const count = item.items[ j ] && item.items[ j ].count || 0
        const total = i.price * count

        data.items.push( {
            index: j,
            total: total && total.toFixed( 2 ) || '',
            name:  i.name,
            count: count || ''
        } )
    }
    data.date = fns.getDate( item.time )
    data.koef = item.koef
    data.total = ( total * item.koef ).toFixed( 2 )
}



app.on( 'LOAD', e => {

    calc()

    const c = app.bind( '#w_item', data, {
        add ( ) {
            prices.push( { name: '', price: 0 } )
            app.emit( 'CHANGE' )
        },
        focus ( el ) {
            el.select()
        },
        set ( i, index ) {
            const item = items[ D.item ]
            const v = item.items[ index ] || ( item.items[ index ] = {} )

            v.count = parseInt( i.count )
            
            app.emit( 'CHANGE' )
        },
        koef( el ) {
            items[ D.item ].koef = parseInt( el.value )
            app.emit( 'CHANGE' )
        }
    } )

    app.on( 'CHANGE', e => {
        if ( D.state == 2 ) {
            calc()
            c.obs.draw()
        }
    } )

    app.on( 'STATE', ( state ) => {
        if ( state == 2 ) {
            document.body.appendChild( c.el )
            calc()
            c.obs.draw()
        } else {
            c.el.remove()
        }
    } )
} )

return exports; }( {} )
/* ||||||||||||||||||||||||| */
/* |||||||||||||||||||||||||  ./src/work/v2/js/list.js */
MODULES.M439 = function( exports ) {

const app = MODULES.M428
const fns = MODULES.M436

const { prices, items } = MODULES.M435
const D = MODULES.M435


const data = {
    items: []
}

function calc ( ) {
    data.items.splice( 0 )
    
    const totalI = {
        title: 'За ' + fns.months[ D.month ],
        total: 0,
        koef: '',
        items: []
    }

    for ( var k in prices ) {
        const i = prices[ k ]
        totalI.items.push( {
            name: i.name,
            count: 0,
            total: 0
        } )
    }

    data.items.push( totalI )

    for ( var i of items ) {
        if ( i.time < D.min || i.time > D.max ) continue

        const total = fns.getTotalDay( i ) * i.koef
        const item  = {
            title: fns.getDate( i.time ),
            total: total,
            koef: i.koef != 1 ? i.koef : '',
            items: []
        }

        for ( var k in prices ) {
            const price = prices[ k ]
            const d = i.items[ k ]

            if ( d && d.count != 0 ) {
                const total = d.count * price.price * i.koef

                item.items.push( {
                    name: price.name,
                    count: d.count,
                    total: total
                } )

                totalI.items[ k ].count += d.count
                totalI.items[ k ].total += total
            }
        }

        totalI.total += total
        
        data.items.push( item )
    }
}



app.on( 'LOAD', e => {

    calc()

    const c = app.bind( '#w_list', data, {
        down( index, pos, el ) {
        },
        add ( ) {
            items.push( { time: Date.now(), items: {}, koef: 1 } )
            app.emit( 'CHANGE' )
        }
    } )

    app.on( 'CHANGE', e => {
        if ( D.state == 4 ) {
            calc()
            c.obs.draw()
        }
    } )

    app.on( 'STATE', ( state ) => {
        if ( state == 4 ) {
            document.body.appendChild( c.el )
            calc()
            c.obs.draw()
        } else {
            c.el.remove()
        }
    } )

} )
return exports; }( {} )
/* ||||||||||||||||||||||||| */
