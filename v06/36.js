!this.Module && ( Module = {} );

// --------------- E:/server/src/module/events.js --------------
Module[ 'E:/server/src/module/events.js' ] = function ( exports ) {
exports = function ( init ) {

    const ev = {};

    return {
        on: function ( e, succ ) {
           !ev[ e ] && ( ev[ e ] = [] );
            ev[ e ].push( succ );

            if ( init[ e ] ) init[ e ]( succ )
        },
        emmit: function ( ) {
            const e = Array.prototype.shift.call( arguments );
            const d = ev[ e ];
            for ( var k in d ) d[ k ].apply( window, arguments )
        },
        unbind: function ( e, succ ) {
            const d = ev[ e ];

            for ( var k in d ) if ( d[ k ] == succ ) d.splice( k, 1 );
        }
    }
}
return exports }.call( {}, {} );

// --------------- E:/server/src/work/i/data.js --------------
Module[ 'E:/server/src/work/i/data.js' ] = function ( exports ) {
var Events = Module[ 'E:/server/src/module/events.js' ]


//#region init


firebase.initializeApp( {
    apiKey: "AIzaSyA9Zs-N_tnUiYHl2tB5EJVznB8YhQsXreQ",
    authDomain: "tehnostil-55b35.firebaseapp.com",
    databaseURL: "https://tehnostil-55b35.firebaseio.com",
    projectId: "tehnostil-55b35",
    storageBucket: "tehnostil-55b35.appspot.com",
    messagingSenderId: "352249737589",
    appId: "1:352249737589:web:f5c8d4cf3a5a6061a6a33c"
} );

const nodes_data = {};
const node_data  = {};
const price_data = {};

const date = new Date( Date.now() );

const fire = firebase.firestore();
const users = fire.collection( 'Users' );
const nodes_bd = fire.collection( 'Nodes_' );
const price_bd = fire.collection( 'Price_' );


//#endregion

exports = { }

let uid = parseInt( localStorage.uid ) || null;
let nid = null//localStorage.nid || null;

let state = 0;
let month = date.getFullYear() + '_' + date.getMonth();

const events = Events( {
    user: ( succ ) => succ( uid ),
    nid:( succ ) => succ( nid )
} )

exports.on = ( e, f ) => events.on( e, f );

const NODES = 1;
const PRICE = 1 << 2;
const NODE = 1 << 3;


function load ( id ) {
           if ( id == NODES ) {
        events.emmit( 'nodes', nodes_data );
    } else if ( id == PRICE ) {
        events.emmit( 'price', price_data );
    } else if ( id == NODE ) {
        events.emmit( 'node', node_data );
    }
    state = state | id;

    if ( state & PRICE && state & NODES ) {
        events.emmit( 'default', nodes_data, price_data )
    }
    if ( state & PRICE && state & NODE ) {
        events.emmit( 'node+', node_data, price_data )
    }
    
    if ( state & PRICE && state & NODE && state & NODES ) {
        events.emmit( 'all', nodes_data, node_data, price_data );
    }
}
events.on( 'user', ( ) => {
    for ( var k in price_data ) delete price_data[ k ];
    for ( var k in nodes_data ) delete nodes_data[ k ];
    for ( var k in node_data  ) delete node_data [ k ];

    state = 0;

    if ( uid ) return;

    events.emmit( 'nodes', nodes_data );
    events.emmit( 'price', price_data );
    events.emmit( 'node', node_data );
    events.emmit( 'default', nodes_data, price_data )
    events.emmit( 'all', nodes_data, node_data, price_data );
} );

//#region Node


let node_unbind;

function node_bind ( ) {

    node_unbind && node_unbind();

    if ( !uid || !nid ) {
        return
    }

    node_unbind = nodes_bd
        .doc( nid )
        .onSnapshot( function ( s ) {
            const i = s.data();
            
            for ( var k in node_data ) delete node_data[ k ];
            for ( var k in i ) node_data[ k ] = i[ k ];
            node_data.id = nid
            
            load( NODE );
        } )
}

Object.defineProperty( exports, 'nid', {
    set: ( v ) => { nid = v; node_bind(); events.emmit( 'nid', nid ) }
} )
events.on( 'user', node_bind );
// exports.nid = localStorage.nid;

exports.node = {
    set: ( key, val, nid_ ) => {
        const i = {}; i[ key ] = val;
        nodes_bd.doc( nid_ || nid ).update( i );
    },
    count: ( id, count ) => {
        const i = {}; i[ 'items.' + id + '.count' ] = parseInt( count );
        nodes_bd.doc( nid ).update( i );
    },
    add: ( month_ ) => {

        if ( !uid ) return
    
        nodes_bd.add( {
            date: Date.now(),
            uid,
            month: month_ || month,
            size: 1,
            items: {}
        } )
    }
};




//#endregion
//#region Nodes

let nodes_unbind;

function nodes_bind ( ) {

    nodes_unbind && nodes_unbind(); console.log( '--+++++++----', uid, month );

    if ( !uid ) {
        return
    }

    nodes_unbind = nodes_bd
        .where( 'uid', '==', uid )
        .where( 'month', '==', month )
        .orderBy( 'date', 'desc' )
        .onSnapshot( function ( s ) {
            
            for ( var k in nodes_data ) delete nodes_data[ k ];

            s.forEach( function ( s ) {
                const i = s.data(); i.id = s.id;

                nodes_data[ i.id ] = i;
            } );

            load( NODES );
        } )
}

Object.defineProperty( exports, 'month', {
    set: ( v ) => { month = v; //localStorage.month = v || '';
    nodes_bind(); }
} )

events.on( 'user', nodes_bind );


//#endregion
//#region Price

let price_unbind;

function price_bind ( ) {

    price_unbind && price_unbind();

    if ( !uid ) return

    price_unbind = price_bd
        .where( 'uid', '==', uid )
        .orderBy( 'name' )
        .onSnapshot( function ( s ) {
            
            for ( var k in price_data ) delete price_data[ k ];

            s.forEach( function ( s ) {
                const i = s.data(); i.id = s.id;

                price_data[ i.id ] = i;
            } );

            load( PRICE );
        } )
}

events.on( 'user', price_bind );

exports.price = {
    set: ( id, key, val ) => {
        const i = {}; i[ key ] = val;
        price_bd.doc( id ).update( i );
    },
    set_name: ( id, name ) => {
        price_bd.doc( id ).update( { name: name } );
    },
    set_price: ( id, v ) => {
        price_bd.doc( id ).update( { price: v } );
    },
    add: ( name, price ) => {

        if ( !uid || !name || !price ) return;

        price_bd.add({
            uid,
            name,
            price
        })
    }
};

//#endregion


//#region User


exports.login = function ( name, pass ) {
    if ( !name || !pass ) return;

    users
        .doc( name + '_' + pass )
        .get( )
        .then( function( doc ) {

            var user = doc.data();
            
            if ( !user ) {
                alert( 'Пользователя с данным именем и паролем не существует' )                
                return;
            }
            
            events.emmit( 'user', localStorage.uid = uid = user.uid )

        } ).catch( function( e ) {
            events.emmit( 'user', null )
            console.log( "Error getting cached document:", e );
        } );
}
exports.signin = function ( name, pass ) {
    if ( !name || !pass ) return;

    users
        .doc( name + '_' + pass )
        .get( )
        .then( function( doc ) {

            var user = doc.data();
            
            if ( user ) {
                alert( 'Пользователя с данным именем уже существует' )                
                return;
            }

            localStorage.uid = uid = Date.now();
            
            users
                .doc( name + '_' + pass )
                .set( { uid } )
                .then( function ( s ) {
                    events.emmit( 'user', uid )
                } )

        } ).catch( function( e ) {
            events.emmit( 'user', null )
            console.log( "Error getting cached document:", e );
        } );
}
exports.logout = function ( ) {
    localStorage.uid = '';
    uid = undefined;

    events.emmit( 'user', null );
}

//#endregion
return exports }.call( {}, {} );

// --------------- E:/module/subEvents.js --------------
Module[ 'E:/module/subEvents.js' ] = function ( exports ) {
const is = 'ontouchstart' in window;

const Proto = {
    on: function ( ) {
        this.el.addEventListener( this.e, this.fn, this.a );
    },
    off: function ( ) {
        this.el.removeEventListener( this.e, this.fn, this.a );
    }
}

function addEvent ( el, e, f, a ) {

    const d = {
        el: el, e: e, f: f, a: a
    }

    d.__proto__ = Proto;
    
    if ( e == 'down' ) {
        if ( is ) d.e = 'touchstart'
        else d.e = 'mousedown'
    }
    else if ( e == 'move' ) {
        if ( is ) d.e = 'touchmove'
        else d.e = 'mousemove'
    }
    else  if ( e == 'up' ) {
        if ( is ) d.e = 'touchend'
        else d.e = 'mouseup'
    }

    d.fn = function ( e ) {
        if ( e ) Array.prototype.push.call( arguments, ( is ? e.changedTouches[ 0 ] : e ) );
        d.f.apply( this, arguments );
    }

    // el.addEventListener( e, fn, a )

    return d
}

exports = addEvent
return exports }.call( {}, {} );

// --------------- E:/module/comps/itemList.jss --------------
Module[ 'E:/module/comps/itemList.jss' ] = function ( exports ) {
var On = Module[ 'E:/module/subEvents.js' ]

var cur, x, data;

const move = On( window, 'move', function ( e, p ) {
    e.preventDefault();

    var o = p.clientX - x;
    if ( data.way == 'right' ) {
        o = o > 0 ? 0 : o < -100 ? -100 : o;
    } else 
    if ( data.way == 'left' ) {
        o = o > 100 ? 100 : o < 0 ? 0 : o;
    } else 
        o = o > 100 ? 100 : o < -100 ? -100 : o;

    cur.$data.set( 'left', o );
} )

const up = On( window, 'up', function ( e, p ) {

    if ( cur.data.left > 70 ) {
        cur.parent.itemListLeft( cur.data.id )
    }
    else
    if ( cur.data.left < -70 ) {
        cur.parent.itemListRight( cur.data.id )
    }

    cur.$data.set( 'left', 0 );

    move.off();
    up.off();
} )
exports.data = { left: 0, id: 0 }
exports.func = function ( v ) {
    this.down = function ( e, p ) {
        cur = this; x = p.clientX; data = cur.data
        move.on();
        up.on();
    }
}

exports.template = '<div class=\"item-list\" @down :class=\"{ enable: left, active: left > 70 || left < -70 }\" :style=\"{ transform: left ? \'translateX( \' + left + \'px )\': \'\' }\"> \r\n    <slot></slot>\r\n</div>'
return exports }.call( {}, {} );

// --------------- E:/module/getDate.js --------------
Module[ 'E:/module/getDate.js' ] = function ( exports ) {
exports = function ( date, s ) {

    const D = new Date( date );

    return s.replace( /\w/g, function ( e ) {
        switch ( e ) {
            case 'd': e = D.getDate(); break;
            case 'm': e = D.getMonth() + 1; break;
            case 'y': e = D.getFullYear(); break;
            case 'H': e = D.getHours(); break;
            case 'M': e = D.getMinutes(); break;
            case 'S': e = D.getSeconds(); break;
        
            default:
                return e;
        }
        return ( e < 10 ? '0' : '' ) + e;
    } )

}
return exports }.call( {}, {} );

// --------------- E:/server/src/work/i/comps/node.jss --------------
Module[ 'E:/server/src/work/i/comps/node.jss' ] = function ( exports ) {
var Item = Module[ 'E:/module/comps/itemList.jss' ]
var D = Module[ 'E:/module/getDate.js' ]


exports.data = {
    D, items: [], nid: undefined, total: 0, total_: 0, show: false
}
exports.func = function ( v ) {

    Data.on( 'nid', id => v.nid = id );
    Data.on( 'node+', ( n, p ) => {

        v.items.splice( 0 );

        let t = 0;

        for ( var k in p ) {
            const i = p[ k ], c = n.items[ k ] && n.items[ k ].count;

            const o = {
                name: i.name,
                count: c || '',
                id: k,
                total: ( c * i.price ) || 0
            }

            t += o.total;

            v.items.push( o );
        }
        v.total = t;
        v.total_ = t / n.size;
    } )

    this.add = function ( ) {
        Data.node.add( v.month )
    }
    this.itemListRight = function ( id ) {
        this.parent.go( 'item-list', { iid: id } );
    }
    this.count = function ( i ) {
        Data.node.count( i.id, i.count, 'n' )
    }
}
exports.comps = { Item }

exports.template = '<div class=\"node full-wnd\" :is=\"show == \'node\'\">\r\n    <div class=\"top\">\r\n        <div class=\"text\">{{ ( total ).toFixed( 2 ) }}</div>\r\n        <div class=\"text e\">{{ ( total_ ).toFixed( 2 ) }}<span>1/3</span></div>\r\n    </div>\r\n    <div class=\"list\">\r\n        <item way=\"right\" p:id=\"i.id\" :for=\"i in items\">\r\n            <div class=\"total \">{{ i.total ? ( i.total ).toFixed( 2 ) : \'\' }}</div>\r\n            <div class=\"name r\">{{ i.name }}</div>\r\n            <input class=\"count\"\r\n                type=\"number\"\r\n                @change=\"count( i )\"\r\n                @focus=\"{ el.select() }\"\r\n                :input=\"i.count\"\r\n            >\r\n        </item>\r\n    </div>\r\n    <div class=\"bottom\">\r\n        <button class=\"btn center\" @click=\"add\">+</button>\r\n    </div>\r\n</div>'
return exports }.call( {}, {} );

// --------------- E:/server/src/work/i/comps/nodes.jss --------------
Module[ 'E:/server/src/work/i/comps/nodes.jss' ] = function ( exports ) {
var Item = Module[ 'E:/module/comps/itemList.jss' ]
var D = Module[ 'E:/module/getDate.js' ]



exports.data = {
    D, items: [], total: 0
}
exports.func = function ( v ) {

    Data.on( 'default', ( n, p ) => {

        v.items.splice( 0 );
        
        let t = 0;

        for ( var k in n ) {
            const i = n[ k ];

            if ( i.hide ) continue;

            const o = {
                date: i.date,
                month: i.month,
                size: i.size,
                id: k,
                total: 0,
            }
            
            const is = i.items;

            for ( var k in is ) {
                o.total += is[ k ].count * p[ k ].price;
            }

            o.total /= i.size;
            
            t += o.total;

            v.items.push( o );
        }
        v.total = t;
    } )


    this.itemListRight = function ( id ) {
        Data.nid = id;
        this.parent.go( 'node', { nid: id } )
    }
    this.itemListLeft = function ( id ) {
        Data.node.set( 'hide', true, id );
    }

    this.add = function ( ) {
        Data.node.add( v.month )
    }
    this.size = function ( i ) {
        Data.node.set( 'size', parseInt( i.size ), i.id )
    }
}
exports.comps = { Item }

exports.template = '<div class=\"nodes full-wnd\">\r\n    <div class=\"top\">\r\n            <div class=\"text\">{{ ( total ).toFixed( 2 ) }}</div>\r\n            <div class=\"text e\">Март</div>\r\n    </div>\r\n    <div class=\"list\">\r\n        <item :for=\"i,ind in items\" p:id=\"i.id\">\r\n            <div class=\"date\">{{ D( i.date, \'d.m.y\' ) }}</div>\r\n            <div class=\"total \">{{ i.total ? ( i.total ).toFixed( 2 ) : \'0\' }}</div>\r\n            <div class=\"month r\">{{ i.month }}</div>\r\n            <input class=\"size\" type=\"number\" @change=\"size( i )\" @focus=\"{ el.select() }\" :input=\"i.size\">\r\n        </item>\r\n    </div>\r\n    <div class=\"bottom\">\r\n        <button class=\"btn center\" @click=\"add\">+</button>\r\n    </div>\r\n</div>'
return exports }.call( {}, {} );

// --------------- E:/server/src/work/i/comps/item-stat.jss --------------
Module[ 'E:/server/src/work/i/comps/item-stat.jss' ] = function ( exports ) {
var D = Module[ 'E:/module/getDate.js' ]


exports.data = { items: [], name: '1', D, show: false, total: 0, count: 0 };
exports.func = function ( v ) {

    var nodes, price, iid, load = 0;

    function print ( i ) {
        if ( ( load = load | i ) != 3 ) return

        v.name = price[ iid ].name;

        const p = price[ iid ].price

        let count = 0, total = 0;
        v.items.splice( 0 );

        for ( var k in nodes ) {
            if ( nodes[ k ].hide ) continue;
            const i = nodes[ k ].items[ iid ]


            if ( i && i.count ) {
                const o = {
                    id: k,
                    date: nodes[ k ].date,
                    count: i.count,
                    total: ( i.count * p ) / nodes[ k ].size,
                    size: nodes[ k ].size
                }

                count += i.count;
                total += o.total;

                v.items.push( o );
            }
        }

        v.count = count;
        v.total = total;
    }

    Data.on( 'default', function ( n, p ) {
        nodes = n; price = p;
        print( 2 )
    } )
    this.bind( 'iid', function ( id ) {
        if ( iid = id ) print( 1 )
    } )
}

exports.template = '<div class=\"item-stat full-wnd\" :is=\"show == \'item-list\'\">\r\n    <div class=\"top\">\r\n        <div class=\"text\">{{ name }}</div>\r\n        <div>{{ (count).toFixed( 0 ) }}</div>\r\n        <div class=\"e\">{{ (total).toFixed( 2 ) }}</div>\r\n    </div>\r\n    <div class=\"list\">\r\n        <div class=\"item-list\" :for=\"i in items\">\r\n                <div class=\"r\">{{ D( i.date, \'d.m.y\' ) }}</div>\r\n                <div class=\"count t\">{{ i.count }}</div>\r\n                <div class=\"size t\">{{ i.size }}</div>\r\n                <div class=\"total t\">{{ ( i.total ).toFixed( 2 ) }}</div>\r\n        </div>\r\n    </div>\r\n    <div class=\"bottom\">\r\n        <button class=\"btn center\" @click=\"add\">+</button>\r\n        <button class=\"btn exit\" @click=\"back\"><</button>\r\n    </div>\r\n</div>'
return exports }.call( {}, {} );

// --------------- E:/server/src/work/i/comps/price.jss --------------
Module[ 'E:/server/src/work/i/comps/price.jss' ] = function ( exports ) {
var Item = Module[ 'E:/module/comps/itemList.jss' ]


exports.data = { show: '', total: 0, items: [] }
exports.func = function ( v ) {

    Data.on( 'price', function ( p ) {

        v.items.splice( 0 );

        for ( var k in p ) {
            const i = {
                id: k,
                name: p[ k ].name,
                price: p[ k ].price
            }

            v.items.push( i )
        }
    } )

    this.itemListRight = function ( id ) {
        this.parent.go( 'item-list', { iid: id } )
        // this.parent.data.iid = id
    }

    this.price = function ( i ) {
        Data.price.set_price( i.id, i.price )
    }
    this.name = function ( i ) {
        Data.price.set_name( i.id, i.name )
    }
}
exports.comps = { Item }

exports.template = '<div class=\"price full-wnd\" :is=\"show == \'price\'\">\r\n    <div class=\"top\">\r\n        <div class=\"text\">Цены</div>\r\n    </div>\r\n    <div class=\"list\">\r\n        <item way=\"right\" p:id=\"i.id\" :for=\"i in items\">\r\n            <input class=\"name r\"\r\n                type=\"text\"\r\n                @change=\"name( i )\"\r\n                @focus=\"{ el.select() }\"\r\n                :input=\"i.name\"\r\n            >\r\n            <input class=\"price\"\r\n                type=\"number\"\r\n                @change=\"price( i )\"\r\n                @focus=\"{ el.select() }\"\r\n                :input=\"i.price\"\r\n            >\r\n        </item>\r\n    </div>\r\n    <div class=\"bottom\">\r\n        <button class=\"btn center\" @click=\"add\">+</button>\r\n    </div>\r\n</div>'
return exports }.call( {}, {} );

// --------------- E:/server/src/work/i/comps/login.jss --------------
Module[ 'E:/server/src/work/i/comps/login.jss' ] = function ( exports ) {
exports.data = {
    is: true,
    name: 'name',
    pass: 'pass'
}
exports.func = function ( v ) {
    this.login = function ( ) {
        Data.login( v.name, v.pass )
    }
    this.signin = function ( ) {
        Data.signin( v.name, v.pass )
    }
}

exports.template = '<div class=\"login full-wnd\">\r\n    <div class=\"box\">\r\n        <a href=\"#\" :is @click=\"{ data.is = !is }\">Регистрация</a>\r\n        <a href=\"#\" :is=\"!is\" @click=\"{ data.is = !is }\">Войти</a>\r\n        <input type=\"text\" :input=\"name\">\r\n        <input type=\"text\" :input=\"pass\">\r\n        <button @click=\"login\" :is>Войти</button>\r\n        <button @click=\"signin\" :is=\"!is\">Зарегистрироваться</button>\r\n    </div>\r\n</div>'
return exports }.call( {}, {} );

// --------------- E:/module/app/data.js --------------
Module[ 'E:/module/app/data.js' ] = function ( exports ) {
const bind_m = {}

function Data ( data ) {
    this.data = data;
    this.binds = {};
    this.path = {
        data: { v: data }
    };
    this.mem = {};

    const t = this;

    this.int = setInterval( function () {
        Watch( t )
    }, 100)
};
Data.prototype = {
    isData: true
}

//#region Freese


function Freeze ( data ) {
    this.data = data;
    this.path = {};

    for ( var k in data.path ) {
        this.path[ k ] = data.path[ k ]
    }
};
Freeze.prototype = {
    on: function ( ) {
        this.last = this.data.path;
        this.data.path = this.path;
    },
    off: function ( ) {
        this.data.path = this.last;
    }
}

//#endregion
//#region bind

var index = 0;

const bind = function ( t, p, d ) {

    t.mem[ p ] = t.get( p );

   !t.binds[ p ] && ( t.binds[ p ] = {} ); index++;
    t.binds[ p ][ index ] = d;

    if ( !d.el ) return;

   !d.el.app_binds && ( d.el.app_binds = {} );
    d.el.app_binds[ index ] = t.binds[ p ];
}
Data.prototype.bind = function ( p, el, f, a, is ) {

    p = getPath( this, p );
    
    if ( !p ) return;

    bind( this, p, { f: f, a: a, el: el } ); !is && f.call( this, this.get( p ), a )
}


//#endregion
//#region emmit

const emmit = function ( t, p, a ) {
    if ( !t.binds[ p ] ) return

    var v = t.get( p ); t.mem[ p ] = v;
    for ( var i in t.binds[ p ] ) {
        i = t.binds[ p ][ i ]; i.f.call( t, i.fn ? i.fn() : v, i.a, a );
    }
}
Data.prototype.emmit = function ( p, a ) {

    emmit( this, p, a ); p +='.';

    for ( var k in this.binds ) {
        if ( k.indexOf( p ) == 0 ) {
            emmit( this, k, a );
        }
    }
}

//#endregion
//#region set get

const getPath =function ( t, p ) {
    const e = /[^\.]+/.exec( p )[ 0 ], o = t.path[ e ];
    return o ? ( 'v' in o ? null : o.p + p.substring( e.length ) ) : p;
}
Data.prototype.getPath = function ( p ) {
    return getPath( this, p )
}


const find = function ( t, p ) {
    var d = t.data;
    
    var e = /[^\.]+/.exec( p );

    if ( e && t.path[ e = e[ 0 ] ] ) {

        if ( 'v' in t.path[ e ] ) {
            p = 'v' + p.substring( e.length ); d = t.path[ e ];
        } else {
            p = t.path[ e ].p;
        }
    }

    return {
        p: p,
        n: p.replace( /([^.]+)\./g, function ( e, n ) { d = d && d[ n ]; return ''; } ),
        d: d
    }
}

Data.prototype.set = function ( p, v, a ) {
    p = find( this, p ); p.d[ p.n ] = v; this.emmit( p.p, a );
}
Data.prototype.get = function ( p ) {
    p = find( this, p ); return p.d && p.d[ p.n ];
}

//#endregion
//#region Unbind

function Unbind ( el ) {
    if ( el.app_binds ) {
        for ( var k in el.app_binds ) {
            delete el.app_binds[ k ][ k ]
            delete el.app_binds[ k ]
        }
    }
    var n = el.firstChild; while ( el = n ) { n = el.nextSibling; Unbind.apply( this, arguments ); }

}


//#endregion
//#region eval

function eval ( t, s, d ) {

    var arg = {}, b = [];

    s.replace( /\[\s*(\d+)\s*\]/g, '.$1' )
    .replace( /(['"`])(\\\1|.)+?\1/g, '$1$1' )
    .replace( /(\?)?\s*([a-zA-Z_$][\w$_]*)([\w$_.]*)\s*(:)?/g, function ( e, q, n, p, w ) {
        if ( !( n in t.data ) && !( n in t.path ) || w && !q  ) return e
        

        arg[ n ] = t.path[ n ] || { p: n };


        d && !( 'v' in arg[ n ] ) && b.push( arg[ n ].p + p );
    } )

    for ( var k in b ) bind( t, b[ k ], d );

    const fn = new Function( Object.keys( arg ).join( ',' ), s );

    const f = function ( th ) {
        return fn.apply( th || t, Object.keys( arg ).map( function ( i ) {
            i = arg[ i ]; return i.v == undefined ? t.get( i.p ) : i.v
        } ) )
    }
    d && ( d.fn = f );
    return f;
}

Data.prototype.eval = function ( s, el, f, a ) {
    if ( f ) {
        const fn = eval( this, 'return ' + s, { el: el, f: f, a: a } );
        f.call( this, fn(), a );
    } else {
        return eval( this, 'return ' + s );
    }
}
Data.prototype.eval__ = function ( s, el, f, a ) {
    if ( f ) {
        const fn = eval( this, s, { el: el, f: f, a: a } );
        f.call( this, fn(), a );
    } else {
        return eval( this, s );
    }
}

//#endregion
//#region Freeze

Data.prototype.freeze = function ( ) {
    return new Freeze( this );
}

//#endregion
//#region Comb

Data.prototype.stop = function ( ) {
    clearInterval( this.int );
}
Data.prototype.comb = function ( p, el1, d, n, el2 ) {

    this.bind( p, el1, fn, { data: d,    path: getPath( d, n ) } )
       d.bind( n, el2, fn, { data: this, path: getPath( this, p ) }, true )
}

function fn ( val, a, el ) {
    if ( el != a.data ) {
        a.data.set( a.path, val, el != this ? this : el )
    }
}

//#endregion
function Watch ( t ) {
    for ( var p in t.binds ) {
        if( t.mem[ p ] != t.get( p ) ){
            t.emmit( p );
        }
    }
}

exports = {
    Data: Data,
    Unbind: Unbind
}
return exports }.call( {}, {} );

// --------------- E:/module/app/element.js --------------
Module[ 'E:/module/app/element.js' ] = function ( exports ) {
const attr = {}; isTouch = 'ontouchstart' in window
//#region Tools

function Case ( s ) {
    return s
        .toLowerCase()
        .replace( /-(\w)/, function ( e, b ) { return b.toUpperCase() } )
}


//#endregion
//#region Main


exports = function ( el, a ) {
    
    const m = []; for ( var j = 0; j < el.attributes.length; j++ ) m.push( el.attributes[ j ].name );

    m.forEach( function ( name ) {
        var v = el.getAttribute( name );
        if ( attr[ name ] ) {
            el.removeAttribute( name );

            attr[ name ]( v || name.substring( 1 ), el, a );

        } else if ( /^a:/.test( name ) ) {
            el.removeAttribute( name );

            a.data.eval( v, el, AttributeFn, {
                el: el, is: true, k: Case( name.substring( 2 ) )
            } )

        } else if ( /^:/.test( name ) ) {
            el.removeAttribute( name );

            a.data.eval( v, el, AttributeFn, {
                el: el, is: false, k: Case( name.substring( 1 ) )
            } )
            
        } else if ( /^@/.test( name ) ) {
            el.removeAttribute( name );

            var n = name.substring( 1 ), f, k = n, is = false;

            if ( n == 'down' ) {
                if ( isTouch ) { n = 'touchstart', is = true }
                else n = 'mousedown';
            }
            if ( n == 'move' ) {
                if ( isTouch ) { n = 'touchmove', is = true }
                else n = 'mousemove';
            }
            if ( n == 'up' ) {
                if ( isTouch ) { n = 'touchend', is = true }
                else n = 'mouseup';
            }

            v.replace( /^\s*\{([\s\S]+)\}\s*$/, function ( e, b ) {
                f = a.data.eval__(  b  ); return '';
            } )

            if ( f ) {
                el.addEventListener( n, function ( e ) { f( a.comp ); } ); return;
            }

            v.replace( /\((.+)\)/, function ( e, b ) {
                f = a.data.eval( '[' + b + ']' ); return '';
            } )
            .replace( /[\w_$]+/, function ( e, b ) {
                k = e
            } )

            el.addEventListener( n, function ( e ) {
                var m = f ? f() : []; m.push( e ); m.push( is ? e.changedTouches[ 0 ] : e ); m.push( this );
                
                if ( !a.comp[ k ] ) {
                    console.error( 'Component "' + a.comp.name + '" not Have event"' + k + '"' ); return
                }
                
                a.comp[ k ].apply( a.comp, m, { passive: false } )
            } )
        }
    } );
}


//#endregion

//#region Attribute


function AttributeFn ( v, a ) {
    if ( a.is ) {
        if ( v == undefined ) a.el.removeAttribute( a.k );
        else a.el.setAttribute( a.k, v );
    } else {
        a.el[ a.k ] = v;
    }
}


//#endregion
//#region Style

function StyleFn ( v, el ) {
    for ( var k in v ) {
        el.style[ k ] = v[ k ];
    }
}

attr[ ':style' ] = function ( v, el, a ) {
    a.data.eval( v, el, StyleFn, el )
}

//#endregion
//#region Class

function ClassFn ( v, a ) {
    if ( Array.isArray( v ) ) {
        
        h:for ( var j = 0; j < a.m.length; j++ ) {
            for ( var k in v ) {
                if ( v[ k ] == a.m[ j ] ) { continue h; }
            }
            
            a.el.classList.remove( a.m[ j ] ); a.m.splice( j, 1 );
        }

        for ( var k in v ) {
            if ( !v[ k ] ) return;
            
            a.el.classList.add( v[ k ] );
            a.m.push( v[ k ] );
        }

    } else 
    for ( var k in v ) {
        a.el.classList[ v[ k ] ? 'add' : 'remove' ]( k );
    }
}

attr[ ':class' ] = function ( v, el, a ) {
    a.data.eval( v, el, ClassFn, { el: el, m: [] } )
}

//#endregion
//#region Is

function IsFn ( v, el ) {
    el.style.display = v ? '' : 'none'
}

attr[ ':is' ] = function ( v, el, a ) {
    a.data.eval( v, el, IsFn, el )
}

//#endregion
//#region ref

attr[ 'ref' ] = function ( v, el, a ) {

    a.comp.ref[ v ] = el
}

//#endregion
//#region Input

function InputFn ( v, a, e ) {
    if ( a.el != e ) a.el[ a.k ] = v;
}

attr[ ':input' ] = function ( v, el, a ) {

    const d = {
        el: el, k: 'value', e: 'input', p: 'input'
    }
    
    v.replace( /([\w$_.]+)(\s*\:\s*([\w$_]+)\s*)?(\s*\:\s*([\w$_]+)\s*)?/, function ( q, p, q1, e, q2, k ) {
        p && ( d.p = p );
        e && ( d.e = e );
        k && ( d.k = k );
    } )

    d.p = a.data.getPath( d.p );

    if ( d.p == null ) return;

    a.data.bind( d.p, el, InputFn, d ); 

    el.addEventListener( d.e, function ( e ) { a.data.set( d.p, el[ d.k ], el, 'kk' )  } );
}

//#endregion
return exports }.call( {}, {} );

// --------------- E:/module/app/component.js --------------
Module[ 'E:/module/app/component.js' ] = function ( exports ) {
exports = function ( el, c, a ) {
    const m = []; for ( var j = 0; j < el.attributes.length; j++ ) m.push( el.attributes[ j ].name );


    m.forEach( function ( name ) {
        var v = el.getAttribute( name ), n;

        if ( name == 'ref' ) {
            a.comp.ref[ v ] = c;
        }
        else if ( /^:/.test( name ) ) {
            n = name.substring( 1 );
            a.comp.$data.comb( v || n, c, c.$data, n, a.comp );
        }
        else if ( /^g:/.test( name ) ) {
            n = name.substring( 2 );
            c.$data.set( n, a.comp.$data.eval( v || n )() )
        }
        else if ( /^p\:/.test( name ) ) {
            n = name.substring( 2 );
            a.comp.$data.eval( v || n, c, AttrComponentFn, { d: c.$data, p: n } );
        }
        else if ( /^c\:/.test( name ) ) {
            n = name.substring( 2 );
            c.$data.eval( v || n, a.comp, AttrComponentFn, { d: a.comp.$data, p: n } );
        }
        else {
            c.data[ name ] = v;
        }
    } );
}

function AttrComponentFn ( v, a ) {
    a.d.set( a.p, v )
}
return exports }.call( {}, {} );

// --------------- E:/module/app/prototype.js --------------
Module[ 'E:/module/app/prototype.js' ] = function ( exports ) {
exports = function ( Component ) {
    
//#region bind

function Bindfn ( v, a ) {
    a.m[ a.i ] = v;
    a.f.apply( a.c, a.m )
}

Component.prototype.bind = function ( n, f ) {

    const m = [], t = this

    n.replace( /[\w_$.]+/g, function ( e ) {

        m.push( t.$data.get( e ) )
        t.$data.bind( e, t, Bindfn, { f: f, n: n, c: t, m: m, i: m.length - 1 }, true )

    } )

    f.apply( t, m );
}

//#endregion
}
return exports }.call( {}, {} );

// --------------- E:/module/app/index.js --------------
Module[ 'E:/module/app/index.js' ] = function ( exports ) {
var Data = Module[ 'E:/module/app/data.js' ].Data
var Unbind = Module[ 'E:/module/app/data.js' ].Unbind
var attrEl = Module[ 'E:/module/app/element.js' ]
var attrCP = Module[ 'E:/module/app/component.js' ]
var Proto = Module[ 'E:/module/app/prototype.js' ]


//#region Tools

function cloneObj ( o ) {
    if ( typeof o != 'object' ) return o

    const r = { __proto__: o.__proto__ }; o.__proto__ = Object.prototype

    for ( var k in o ) r[ k ] = cloneObj( o[ k ] );

    if ( Array.isArray( o ) ) r.length = o.length


    o.__proto__ = r.__proto__;
    return r
}
function clone ( ) {

    const o = Array.prototype.shift.call( arguments );

    for ( var j = 0; j < arguments.length; j++ ) {
        for ( var k in arguments[ j ] ) o[ k ] = arguments[ j ][ k ];
    }

    return o;
}
function Case ( s ) {
    return s
        .toLowerCase()
        .replace( /-(\w)/g, function ( e, n ) { return n.toUpperCase() } )
        .replace( /^\w/g, function ( e ) { return e.toUpperCase() } )
}

//#endregion
//#region App


function App ( el, data, func, comps ) {

    const c = new Component( 'Body', {
        el, data, func, comps
    } )

    c.parse( {
        mData: c.$data,
        mComp: c,
        insert: c
    } );

    c.run();

    return c;
}

exports = App;


//#endregion
//#region Parse

function Parse ( el, arg ) {

    arg.data.path.el = { v: el };

    if ( el.nodeType == 3 ) return ParseText( el, arg );
    if ( el.nodeType != 1 ) return ;
    if ( For( el, arg ) ) return;
    if ( isComponent( el, arg ) ) return;
    
    if ( el.tagName == 'SLOT' && arg.slot ) {
        for ( var j = 0; j < arg.slot.childNodes.length; j++ ) {
            const e = arg.slot.childNodes[ j ].cloneNode( true );

            el.parentNode.insertBefore( e, el );

            Parse( e, clone( {}, arg, {
                data: arg.mData,
                comp: arg.mComp
            } ) )

        }
        el.parentNode.removeChild( el );
    }

    if ( el.tagName == 'SCRIPT' ) return;

    attrEl( el, arg );

    var n = el.firstChild; while ( el = n ) { n = el.nextSibling; Parse.apply( this, arguments ); }
}

//#endregion
//#region Text


function ParseTextFn ( v, el ) {
    el.textContent = v;    
}
function ParseText ( el, arg ) {
    var ind = 0, p = el.parentNode, o;

    el.textContent.replace( /\{\{(.+?)\}\}/g, ( e, b, i ) => {
        p.insertBefore( document.createTextNode( el.textContent.substring( ind, i ) ), el );
        p.insertBefore( o = document.createTextNode( '' ), el );

        arg.data.eval( b, o, ParseTextFn, o );

        ind = i + e.length;
    } )
    
    el.textContent = el.textContent.substring( ind );
}


//#endregion
//#region For

function ForFn ( v, a ) {
    a.path.on();
    
    v = a.p ? a.data.get( a.p ) : v;

    a.els.splice( v && v.length || 0 ).forEach( el => {
        if ( 'nodeType' in el ) {
            Unbind( el );
            el.parentNode.removeChild( el );
        } else {
            el.remove();
        }
    } );

    if ( !v ) return

    for ( var j = a.els.length; j < v.length; j++ ) {

        if( a.i )
        a.data.path[ a.i ] = { v: j };
        a.data.path[ a.n ] = a.p ? { p: a.p + '.' + j } : { v: v[ j ] };
        
        const c = isComponent( a.el, a.arg, a.anh );

        if ( c ) {
            a.els.push( c );
        } else {
            const el = a.el.cloneNode( true );

            a.els.push( el );

            Parse( el, a.arg );

            a.anh.parentNode.insertBefore( el, a.anh );
        }
    }

    a.path.off();
}

function For ( el, arg ) {

    var v = el.getAttribute( ':for' ); if ( !v ) return;
        v = /([\w$_]+)(\s*,\s*([\w$_]+))?\s+in +(.+)/.exec( v ); if ( !v ) return;

    const a = {
        el, arg, n: v[ 1 ], i: v[ 3 ], p: /^[\w$_]+$/.test( v[ 4 ] ) ? arg.data.getPath( v[ 4 ] ): null,
        path: arg.data.freeze(), els: [], anh: document.createComment( 'for' ), data: arg.data, comp: arg.comp
    }

    el.parentNode.insertBefore( a.anh, el );
    el.parentNode.removeChild( el );
    el.removeAttribute( ':for' );

    if ( a.p ) {
        arg.data.bind( a.p + '.length', a.anh, ForFn, a );
        arg.data.bind( a.p            , a.anh, ForFn, a );
    } else {
        arg.data.eval( v[ 4 ], a.anh, ForFn, a );
    }

    return true;
}

//#endregion
//#region Component

function Component ( name, opt ) {

    this.name = name;
    this.$data = opt.data ? ( opt.data.isData ? opt.data : new Data( opt.data ) ) : new Data( {} );
    this.data = this.$data.data;
    this.child = [];
    this.ref = {};
    this.func = opt.func;
    this.comps = opt.comps;
    this.el = opt.el;
    this.insert = [];

    if ( !opt.el ) {
        this.el = document.createElement( 'div' );
        this.el.textContent = 'Not Find';
    }

    if ( opt.insert ) {
        opt.insert.insert.push( this );
    } 

    if ( opt.parent ) {
        this.parent = opt.parent;
        opt.parent.child.push( this );
    } else {
        this.parent = null;
    }
};
Component.prototype = {
    remove: function ( ) {

        Unbind( this );
        Unbind( this.el );

        this.el.parentNode && 
        this.el.parentNode.removeChild( this.el );


        this.insert.forEach( c => c.remove() );
    },
    parse: function ( arg ) {
        arg.comp = this;
        arg.data = this.$data;
        
        Parse( this.el, arg );
    },
    run: function ( ) {
        this.func && this.func( this.data, this.$data );
    }
}
Proto( Component )

//#endregion
//#region isComponent

function isComponentFN ( name, a ) {

    a.path.on();
    a.component && a.component.remove();
    
    const c = a.component = new Component( name, getComponentData( name, a ) );

    attrCP( a.el, c, a.arg );

    c.parse( clone( {}, a.arg, {
        slot: a.el,
        data: c.$data,
        comp: c, parent: c, insert: c,
        mComp: a.arg.comp,
        mData: a.arg.data
    } ) );

    a.anh.parentNode.insertBefore( c.el, a.anh );

    c.run( );

    a.path.off()
    return c
}
function isComponent ( el, arg, anh ) {

    const name = Case( el.tagName );

    if ( name != 'Component' && ( !arg.comp.comps || !( name in arg.comp.comps ) ) ) return;

    const a = {
        el, arg: clone( arg ), data: arg.data, comp: arg.comp, path: arg.data.freeze(),
        comps:arg.comp.comps, anh: anh || el
    }

    if ( name == 'Component' ) {
        
        const n = el.getAttribute( 'name' );
        const an = document.createComment( 'component' );

        a.anh.parentNode.insertBefore( an, a.anh );

        if ( !anh ) {
            el.parentNode.removeChild( el );
        }

        a.data.eval( n, a.anh = an, isComponentFN, a );

        return {
            remove: function ( ) {
                a.component && a.component.remove();
                Unbind( a.anh );
                a.anh.parentNode.removeChild( a.anh );
            }
        }

    } else {
        const c = isComponentFN( name, a );

        if ( !anh ) el.parentNode.removeChild( el );

        return c;
    }
}
function getComponentData ( name, a ) {

    const el = document.createElement( 'div' ); el.innerHTML = 'not fined';
    const p = a.comps[ name ];

    if ( !p ) {
        console.error( 'Component "' + name + '" not Finded' )
    }

    if ( p ) return {
        el: p.template ? ( el.innerHTML = p.template, el.children[ 0 ] ) : el,
        data: cloneObj( p.data ), func: p.func, comps: p.comps, parent: a.comp, insert: a.arg.insert
    }; else return {
        el, data: {}, parent: a.comp, insert: a.arg.insert
    }
}


//#endregion
return exports }.call( {}, {} );

// --------------- E:/module/spa.js --------------
Module[ 'E:/module/spa.js' ] = function ( exports ) {
exports = function ( o, succ ) {

    window.onpopstate = function ( e ) {
        for ( var k in e.state ) o[ k ] = e.state[ k ];
    }
    
    history.replaceState( o, null, location.url );


    return function go ( url, data, title ) {
        history.replaceState( o, null, location.url );
        
        for ( var k in data ) o[ k ] = data[ k ];

        history.pushState( o, title, url );
    }
}
return exports }.call( {}, {} );
