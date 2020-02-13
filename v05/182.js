!window.Module && ( Module = {} );
/* =============== E:/Work/src/module/subEvents.js ==============*/
Module[ 'E:/Work/src/module/subEvents.js' ] = function( exports ) {


const is = 'ontouchstart' in window;

const Proto = {
    on: function ( ) {
        this.el.addEventListener( this.e, this.fn, this.a );
    },
    off: function ( ) {
        this.el.removeEventListener( this.e, this.fn, this.a );
    }
}

function addEvent ( el, e, f,a ) {

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
return exports; }.call( {}, {} );
/* =============== E:/Work/src/v05/wnd/month.jss ==============*/
Module[ 'E:/Work/src/v05/wnd/month.jss' ] = function( exports ) {
Template_Month ="<div class=\"Wmonth wnd-modal\" :is>\r\n    <div class=\"list\">\r\n        <div class=\"item\" :for=\"i,ind in m\" @click=\"( ind )\">\r\n            {{ i }}\r\n        </div>\r\n    </div>\r\n</div>";
var On = Module[ 'E:/Work/src/module/subEvents.js' ];

Month = function ( v ) {

    window.addEventListener( 'click', function ( ) {
        v.is = undefined;
    } )

    this.click = function ( i ) {
        v.is.month = i;
        this.parent.nd_month( v.is, i )
    }
}


return exports; }.call( {}, {} );
/* =============== E:/Work/src/v05/wnd/date.jss ==============*/
Module[ 'E:/Work/src/v05/wnd/date.jss' ] = function( exports ) {
Template_WDate ="<div class=\"wnd-modal wdate\" :is @click=\"in\">\r\n    <div class=\"info\">\r\n        <div class=\"day\">{{ day }}</div>\r\n        <div class=\"month\">\r\n            <div class=\"prev\" @click=\"prev\"><</div>\r\n            <div class=\"text\">{{ m[ month ] }}</div>\r\n            <div class=\"next\" @click=\"next\">></div>\r\n        </div>\r\n        <div class=\"year\">{{ year }}</div>\r\n    </div>\r\n    <div class=\"days\">\r\n        <div\r\n            class=\"day\"\r\n            :for=\"i,ind in days\"\r\n            @click=\"( i )\"\r\n            :class=\"{ over: i.over, today: i.td }\"\r\n        >{{ i.day }}</div>\r\n    </div>\r\n</div>";

WDate = function ( v ) {

    const set = ( date ) => {
        v.is.date = date.getTime();
        this.parent.nd_change( v.is, 'date' )
    }

    window.addEventListener( 'click', function ( ) {
        if ( close ) v.is = undefined;
        close = true
    } )
    this.in = function ( ) {
        close = false;
    }
    this.next = function (  ) {
        const date = new Date( v.date );
        date.setMonth( date.getMonth( ) + 1 )
        v.date = date;
        set( date )
    }
    this.prev = function (  ) {
        const date = new Date( v.date );
        date.setMonth( date.getMonth( ) - 1 )
        v.date = date;
        
        set( date )
    }
    this.click = function ( i ) {
        const d = new Date();
        d.setMonth( i.m );
        d.setFullYear( i.y );
        d.setDate( i.day );
        v.date = d

        set( d )
    }
    this.bind( 'date', date => {
        
        const m = [];

        if ( !date ) return

        let d = new Date( date ), mn, y;

        v.day = d.getDate();
        v.month = d.getMonth();
        v.year = d.getFullYear();

        //#region prev
        
        d.setDate( 1 );
        var off = d.getDay() - 1; if ( off < 0 ) off = 6;

        d.setDate( 0 );
        const totalLast = d.getDate();

        if ( off == 0 ) off = 7

        mn = d.getMonth(); y = d.getFullYear()
        for ( var j = totalLast - off; j < totalLast; j++ ) {
            m.push( { day: j + 1, m: mn, y: y, over: true } )
        }
        
        //#endregion
        //#region curr

        d = new Date( date );
        d.setMonth( v.month + 1 )
        d.setDate( 0 );
        const total = d.getDate();

        mn = d.getMonth(); y = d.getFullYear();
        
        for ( var j = 0; j < total; j++ ) {
            m.push( { day: j + 1, m: mn, y, td: j == v.day - 1 })
        }
        
        //#endregion
        //#region next

        let next = 7 - d.getDay()
        
        d = new Date( date );
        d.setMonth( v.month + 1 );

        mn = d.getMonth(); y = d.getFullYear();
        if ( m.length + next < 7 * 6 ) next += 7;
        for ( var j = 0; j < next; j++ ) {
            m.push( { day: j + 1, m: mn, y, over: true } )
        }
        
        //#endregion

        this.$data.set( 'days', m );
    } )



}


return exports; }.call( {}, {} );
/* =============== E:/Work/src/v05/wnd/load.jss ==============*/
Module[ 'E:/Work/src/v05/wnd/load.jss' ] = function( exports ) {
Template_Load ="<div class=\"load wnd-full\" :is>\r\n    <div class=\"wrap\">\r\n        load...\r\n    </div>\r\n</div>";

return exports; }.call( {}, {} );
/* =============== E:/Work/src/v05/wnd/login.jss ==============*/
Module[ 'E:/Work/src/v05/wnd/login.jss' ] = function( exports ) {
Template_Login ="<div class=\"login wnd-full\" :is=\"!uid\">\r\n    <div class=\"wrap\" :is=\"!type\">\r\n        <a href=\"#\"  @click=\"{ this.data.type = true }\">Регистрация</a>\r\n        <input type=\"text\" class=\"input\" :input=\"name\"  placeholder=\"Имя\">\r\n        <input type=\"password\" class=\"input\" :input=\"pass\" placeholder=\"Пароль\">\r\n        <button class=\"button\" @click>Войти</button>\r\n    </div>\r\n    <div class=\"wrap\" :is=\"type\">\r\n        <a href=\"#\"  @click=\"{ this.data.type = false }\">Войти</a>\r\n        <input type=\"text\" class=\"input\" :input=\"name\" placeholder=\"Имя\">\r\n        <input type=\"password\" class=\"input\" :input=\"pass\" placeholder=\"Пароль\">\r\n        <button class=\"button\" @click=\"signup\">Зарегестрироваться</button>\r\n    </div>\r\n</div>";

Login = function ( v ) {

    const users = db.child( 'users' );

    this.click = function ( ) {
        if ( !v.name || !v.pass ) return;

        users.child( v.name + '_' + v.pass )
        .once( 'value' )
        .then( s => {
            
            const uid = s.val();
            
            if ( !uid ) {
                alert( 'Пользователя с даннм именем и паролем не существует' )                
                return;
            } 

            v.uid = uid;
            localStorage.uid = uid;
        } )
    }
    this.signup = function ( ) {
        if ( !v.name || !v.pass ) return;
        
        users.child( v.name + '_' + v.pass )
        .once( 'value' )
        .then( s => {

            if ( s.val() ) {
                alert( 'Имя пользователя уже занято!' );
                return;
            } 

            const uid = Date.now()
            users.child( v.name + '_' + v.pass )
            .set( uid )
            .then( f => {
                v.uid = uid;
                localStorage.uid = uid;
            } )
        } )
    }
}


return exports; }.call( {}, {} );
/* =============== E:/Work/src/v05/wnd/price-list.jss ==============*/
Module[ 'E:/Work/src/v05/wnd/price-list.jss' ] = function( exports ) {
Template_PriceList ="<div class=\"price-list wnd-full\" :is>\r\n    <div class=\"top\">\r\n        <div class=\"big\">Цены</div>\r\n    </div>\r\n    <div class=\"list\">\r\n        <div class=\"item\" :for=\"i in items\">\r\n            <input type=\"text\" :input=\"i.name\" class=\"name\" @focus =\"{ el.select() }\" @change=\"( i, \'name\' )\">\r\n            <input type=\"number\" :input=\"i.price\" class=\"price\" @focus =\"{ el.select() }\" @change=\"( i, \'price\' )\">\r\n        </div>\r\n    </div>\r\n    <button class=\"btn add-btn\" @click=\"add\">\r\n        <span class=\"fa fa-plus\"></span>\r\n    </button>\r\n    <button class=\"btn back-btn\" @click=\"{ data.is = false }\">\r\n        <span class=\"fa fa-arrow-left\"></span>\r\n    </button>\r\n</div>";

PriceList = function ( v ) {
    this.bind( 'price', price => {
        if ( !price ) return;

        v.items = [];

        v.items = Object.keys( price ).map( k => ({
            key: k,
            name: price[ k ].name,
            price: price[ k ].price
        }))
    } )
    this.change = function ( i, key ) {
        this.parent.price_change( i, key );
    }
    this.add = function ( ) {
        this.parent.price_add_show( )
    }
}


return exports; }.call( {}, {} );
/* =============== E:/Work/src/v05/wnd/price-add.jss ==============*/
Module[ 'E:/Work/src/v05/wnd/price-add.jss' ] = function( exports ) {
Template_PriceAdd ="<div class=\"wnd-modal price-add\" :is @click=\"in\">\r\n    <input type=\"text\"   class=\"input\" :input=\"name\" @focus=\"{ el.select() }\" placeholder=\"Название\">\r\n    <input type=\"number\" class=\"input\" :input=\"price\"\r\n    @focus=\"{ el.select() }\"\r\n    placeholder=\"Цена\">\r\n    <button class=\"button\" @click>Добавить</button>\r\n</div>";

PriceAdd = function ( v ) {

    v.name = ''
    v.price= 0;

    var close = true;

    window.addEventListener( 'click', () => {
        if ( close ) v.is = undefined;
        close = true;
    })
    this.in = function ( ) {
        close = false
    }

    this.click = function (  ) {
        if ( !v.name || !v.price ) return;
        this.parent.price_add( v.name, v.price )
    }
}


return exports; }.call( {}, {} );
/* =============== E:/Work/src/v05/wnd/nd.jss ==============*/
Module[ 'E:/Work/src/v05/wnd/nd.jss' ] = function( exports ) {
Template_Nd ="<div class=\"wnd-full nd\" :is=\"nd\">\r\n    <div class=\"top\">\r\n        <div><span class=\"big\">{{ ( total ).toFixed( 2 ) }}</span>Всего</div>\r\n        <div :is=\"nd && nds[ nd ] && nds [ nd ].size != 1\">\r\n            <span class=\"big\">{{ nd && nds[ nd ] && ( total / nds [ nd ].size ).toFixed( 2 ) }}</span>\r\n            1/{{ nd && nds[ nd ] && nds [ nd ].size }}\r\n        </div>\r\n    </div>\r\n    <div class=\"list\">\r\n        <div class=\"item\" :for=\"i in items\">\r\n            <input type=\"number\" class=\"input-r\" :input=\"i.count\" @change=\"( i )\" @focus=\"{ el.select() }\">\r\n            <div class=\"name\">{{ i.name }}</div>\r\n            <div class=\"total\">{{ i.total && ( i.total ).toFixed( 2 ) }}</div>\r\n        </div>\r\n    </div>\r\n\r\n    <button class=\"btn add-btn\" @click=\"add\">\r\n        <span class=\"fa fa-plus\"></span>\r\n    </button>\r\n    <button class=\"btn back-btn\" @click=\"back\">\r\n        <span class=\"fa fa-arrow-left\"></span>\r\n    </button>\r\n</div>";

Nd = function ( v ) {

    this.bind( 'nd nds price', ( nd, nds, price ) => {

        if ( !price ) return;

        v.total = 0;

        v.items = Object.keys( price ).map( k =>({
            key: k,
            name: price[ k ].name,
            price: price[ k ].price,
            count: 0
        }) )

        if ( !nd || !nds ) return;

        const l = nds[ nd ] && nds[ nd ].list;

        if ( !l ) return;

        v.items.forEach( i => {
            if ( l[ i.key ] ){
                i.count = l[ i.key ];
                i.count > 0 && ( i.total = i.price * i.count, v.total += i.total );
            }
        } );
    } )

    this.change = function ( i ) {
        this.parent.nd_count( i );
    }
    this.add = function ( ) {
        this.parent.price_add_show( )
    }
    this.back = function ( ) {
        v.nd = undefined
    }
}


return exports; }.call( {}, {} );
/* =============== E:/Work/src/module/getDate.js ==============*/
Module[ 'E:/Work/src/module/getDate.js' ] = function( exports ) {



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
return exports; }.call( {}, {} );
/* =============== E:/Work/src/v05/wnd/nds.jss ==============*/
Module[ 'E:/Work/src/v05/wnd/nds.jss' ] = function( exports ) {
Template_Nds ="<div class=\"nds wnd-full\">\r\n        <div class=\"top\">\r\n            <div><span class=\"big\">{{ ( total ).toFixed( 2 ) }}</span></div>\r\n            <div><span class=\"big\" @click=\"{ this.parent.month_change() }\">{{ m[ month ] }}</span></div>\r\n        </div>\r\n    <div class=\"list\">\r\n        <div class=\"box\"\r\n            @down=\"( index )\"\r\n            :for=\"i,index in items\"\r\n            :class=\"[ i.color == 1 ? \'dell\' : i.color == 2 ? \'edit\' : \'\' ]\"\r\n        >\r\n            <div class=\"item\" :style=\"{ left: i.left + \'px\' }\">\r\n                <div class=\"bf\">\r\n                    <span class=\"fa fa-trash\"></span>\r\n                </div>\r\n                <div class=\"date\"  @click=\"{ this.parent.nd_date( i ); }\">{{ g( i.date, \'d.m.y\' )  }}</div>\r\n                <div class=\"total\">{{ i.total.toFixed( 2 ) }}</div>\r\n                <div class=\"month\" @click=\"{ this.parent.nd_month_show( i ); }\">{{ m[ i.month ] }}</div>\r\n                <input\r\n                    :input=\"i.size\"\r\n                    type=\"number\"\r\n                    class=\"size input-r\"\r\n                    @change=\"{ this.parent.nd_change( i, \'size\' ) }\"\r\n                    @focus =\"{ el.select() }\"\r\n                >\r\n                <div class=\"af\">\r\n                    <span class=\"fa fa-pencil\"></span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <button class=\"btn add-btn\" @click=\"add\">\r\n        <span class=\"fa fa-plus\"></span>\r\n    </button>\r\n</div>";
var G = Module[ 'E:/Work/src/module/getDate.js' ];
var On = Module[ 'E:/Work/src/module/subEvents.js' ];

var item, x, cur;

const move = On( window, 'move', function ( e, p ) {

    if ( !x ) x = p.clientX;

    cur.$data.set( 'items.' + item + '.left', p.clientX - x )

    if ( p.clientX - x > 100 ) {
        cur.$data.set( 'items.' + item + '.color', 1 )
    } else if ( p.clientX - x  < -100 )
        cur.$data.set( 'items.' + item + '.color', 2 )
    else 
        cur.$data.set( 'items.' + item + '.color', 0 )
} )
const up = On( window, 'up', function ( e, p ) {

    x = cur.data.items[ item ].left;

    if ( x >  100 )
        cur.parent.nd_dell( cur.data.items[ item ].key )
    if ( x < -100 )
        cur.parent.nd_edit( cur.data.items[ item ].key )

    cur.$data.set( 'items.' + item + '.left', 0 );
    cur.$data.set( 'items.' + item + '.color', 0 )
    move.off()
    up.off()
    x = undefined;
} )

Nds = function ( v ) {
    v.g = G;

    this.bind( 'nds price month', ( nds, price ) => {

        v.total = 0;

        v.items = Object.keys( nds ).map( k => ({
            key: k,
            date:  nds[ k ].date,
            size:  nds[ k ].size,
            month: nds[ k ].month,
            list: nds[ k ].list,
            total: 0
        }) );

        if ( price ) {
            v.items.forEach( i => i.list && Object.keys( i.list ).forEach( k => {
                if ( price[ k ] ) i.total += (i.list[ k ] * price[ k ].price )/ i.size;
                if ( i.total && i.month == v.month ) v.total += i.total
            } ) );
        }
    } )
    this.add = function ( ) {
        if ( !user ) return;
        
        user.child( 'nds' ).push().set( {
            date: Date.now(),
            month: new Date( Date.now() ).getMonth(),
            size: 1
        } )
    }

    this.down = function ( i, e, e ) {
        item = i;
        cur = this;
        move.on();
        up.on();
    }
}


return exports; }.call( {}, {} );
/* =============== E:/Work/src/module/app/data.js ==============*/
Module[ 'E:/Work/src/module/app/data.js' ] = function( exports ) {


const KeyWord = {}

'if else switch default this window console Math new break continue return const var let true false undefined null Nan'

.replace( /\w+/g, function ( e ) { KeyWord[ e ] = true; } );

//#region Construct


function Data ( data ) {
    this.binds = {};
    this.paths = {};
    this.data = data;

    this.member = {};

    this.interval = setInterval( this.watch.bind( this ) , 50 );
}
const pr = Data.prototype = {}


//#endregion
//#region Bind


var bind_count = 0;

function bind ( t, p, d ) {
    if ( !t.binds[ p ] ) t.binds[ p ] = {}; bind_count++;

    t.binds[ p ][ bind_count ] = d; !t.member[ p ] && ( t.member[ p ] = t.get( p ) );

    if ( d.el ) {
        if ( !d.el.__app__binds ) d.el.__app__binds = {};

        d.el.__app__binds[ bind_count ] = t.binds[ p ];
    }
}

pr.bind = function ( p, el, f, a, is ) {
    p = this.getPath( p );
    
    if ( !p ) return;

    bind( this, p, { el: el, f: f, a: a } );

    !is && f.call( this, this.get( p ), a )
}


//#endregion
//#region Emmit

function Emmit ( t, p, a ) {
    const b = t.binds[ p ], v = t.get( p );

    for ( var i in b ) {
        i = b[ i ]; i.f.call( t, i.fn ? i.fn() : v, i.a, a );
    }
}

pr.emmit = function ( p, a ) {
    Emmit( this, p, a ); p += '.';

    for ( var k in this.binds ) 
        if ( k.indexOf( p ) == 0 ) Emmit( this, k, a );
}

//#endregion
//#region Tolls


pr.getPath = function ( p ) {
    const e = /[^.]+/.exec( p );
    return  this.paths[ e[ 0 ] ] ? (
        this.paths[ e[ 0 ] ].p ? this.paths[ e[ 0 ] ].p + p.substring( e[ 0 ].length ) : null
    ) : p
}
pr.stop = function ( p ) {
    clearInterval( this.interval );
}


//#endregion
//#region set get

function find ( t, p, is ) {

    var d = t.data;

    p = p.replace( /^[^.]+/, function ( e ) {
        if ( t.paths[ e ] ) {
            if ( t.paths[ e ].v ) {
                d = {}; d[ e ] = t.paths[ e ].v; return e;
            } else {
                return t.paths[ e ].p;
            }
        }
        return e
    } )

    return {
        p: p,
        n: p.replace( /([^.]+)\./g, function ( e, b ) {
            
            if ( is && d[ b ] == undefined ) d[ b ] = {};

            d = d && d[ b ];
            
            return ''
        } ),
        d: d
    }
}

pr.get = function ( p ) {
    p = find( this, p ); return p.d != undefined && p.d[ p.n ];
}
pr.set = function ( p, v, a ) {
    p = find( this, p, true ); p.d[ p.n ] = v; this.emmit( p.p, a ); return true;
}

//#endregion
//#region eval

function eval ( t, s, d ) {
    var arg = {}, is = false;

    s
    .replace( /(['"])(\\\1|.)+?\1/g, '' )
    .replace( /\[\s*(\d+)\s*\]/g, '.$1')
    .replace( /(\?\s*)?([a-zA-Z_$][\w$_]*)([\.\w$_]*)\s*(\:)?/g, function ( e, q, n, p, w ) {
        if ( w && !q || KeyWord[ n ] || window[ n ] ) return '';
        
        arg[ n ] = t.paths[ n ] || { p: n };
        
        if ( d && arg[ n ].v == undefined ) { is = true; bind( t, arg[ n ].p + p, d ) }
    } );

    const f = new Function ( Object.keys( arg ).join( ',' ), s );

    var fn = function ( th ) {
        return f.apply( th || t,
            Object.keys( arg ).map( function ( i ) { i = arg[ i ]; return i.v != undefined ? i.v : t.get( i.p ) } )
        )
    };

    if ( d && is ) {
        d.fn = fn;
    }
    
    return fn
}

pr.eval__ = function ( s, el, f, a, is ) {
    if ( f ) {
        const fn = eval( this, s, { el: el, f: f, a: a } );
        !is && f.call( this, fn(), a );
    } else {
        return eval( this, s );
    }
}
pr.eval = function ( s, el, f, a, is ) {
    if ( f ) {
        const fn = eval( this, 'return ' + s, { el: el, f: f, a: a } );
        !is && f.call( this, fn(), a );
    } else {
        return eval( this, 'return ' + s );
    }
}

//#endregion
//#region freeze

function Freeze ( d ) {
    this.last = null;
    this.path = {};
    this.data = d;

    for ( var k in d.paths ) this.path[ k ] = d.paths[ k ];
}
Freeze.prototype = {
    on: function ( ) {
        this.last = this.data.paths;
        this.data.paths = this.path;
    },
    off: function ( ) {
        this.data.paths = this.last;
    }
}


pr.freeze = function ( ) {
    return new Freeze( this );
}

//#endregion
//#region Watch

function Watch ( t, p ) {
    var v 
    if (
        t.member[ p ] != ( v = t.get( p ) ) &&
        !(  Number.isNaN &&  Number.isNaN( v ) && Number.isNaN( t.member[ p ] )   )
    ) {
        t.member[ p ] = v; t.emmit( p );
    }
}

pr.watch = function ( ) {
    for ( var p in this.binds ) Watch( this, p );
}

//#endregion
//#region Unbind

function unbind ( el ) {
    
    if ( el.__app__binds ) 
    for ( var k in el.__app__binds ) {
        delete el.__app__binds[ k ][ k ]
        delete el.__app__binds[ k ]
    }

    var n = el.firstChild; while ( el = n ) { n = el.nextSibling; unbind.apply( this, arguments ); }
}

//#endregion
//#region Comb

pr.comb = function ( p, el1, d, n, el2 ) {
    this.bind( p, el1, fn, { data: d,    path:    d.getPath( n ) } )
       d.bind( n, el2, fn, { data: this, path: this.getPath( p ) }, true )
}

function fn ( val, a, el ) {
    if ( el != a.data ) {
        a.data.set( a.path, val, el != this ? this : el )
    }
}

//#endregion

exports = { Data: Data, unbind: unbind }
return exports; }.call( {}, {} );
/* =============== E:/Work/src/module/app/attrE.js ==============*/
Module[ 'E:/Work/src/module/app/attrE.js' ] = function( exports ) {


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

            v.replace( /\{([\s\S]+)\}/, function ( e, b ) {
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
        a.el.setAttribute( a.k, v );
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

return exports; }.call( {}, {} );
/* =============== E:/Work/src/module/app/attrC.js ==============*/
Module[ 'E:/Work/src/module/app/attrC.js' ] = function( exports ) {


exports = function ( el, c, a ) {
    const m = []; for ( var j = 0; j < el.attributes.length; j++ ) m.push( el.attributes[ j ].name );


    m.forEach( function ( name ) {
        var v = el.getAttribute( name ), n;

        if ( /^:/.test( name ) ) {
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
return exports; }.call( {}, {} );
/* =============== E:/Work/src/module/app/component.js ==============*/
Module[ 'E:/Work/src/module/app/component.js' ] = function( exports ) {




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
return exports; }.call( {}, {} );
/* =============== E:/Work/src/module/app/index.js ==============*/
Module[ 'E:/Work/src/module/app/index.js' ] = function( exports ) {
var Data = Module[ 'E:/Work/src/module/app/data.js' ].Data;
var unbind = Module[ 'E:/Work/src/module/app/data.js' ].unbind;
var attrElem = Module[ 'E:/Work/src/module/app/attrE.js' ];
var attrComp = Module[ 'E:/Work/src/module/app/attrC.js' ];
var compProto = Module[ 'E:/Work/src/module/app/component.js' ];

//#region Tools

function Clone ( o, t ) {
    var r = {};

    for ( var k in o ) r[ k ] = o[ k ];
    for ( var k in t ) r[ k ] = t[ k ];

    return r;
}
function CloneObj ( o ) {
    if ( typeof o != 'object' ) return o;

    const r = {};
    for ( var k in o ) r[ k ] = CloneObj( o[ k ] );
    return r;
}

//#endregion
//#region App

App = function App ( el, data, fn ) {

    const c = new Component( 'Body', {
        data: data,
        el: el,
        fn: fn
    } )

    Parse( el, {
        mainC: c,
        mainD: c.$data,
        comp: c,
        data: c.$data,
        parent: c
    } );

    c.run();
    c.redraw && c.redraw()

    return c;
}

//#endregion
//#region Parse

function Parse ( el, a ) {

    a.data.paths.data = { v: a.data.data };

    if ( el.nodeType == 3 ) { Text( el, a ); return }
    if ( el.nodeType != 1 ) return

    if ( el.tagName == 'SCRIPT' ) return
    if ( el.tagName == 'SLOT' ) {
        if ( a.slot ) {
            const c = a.slot.childNodes, p = el.parentNode;
            for ( var j = 0; j < c.length; j++ ) {

                const e = c[ j ].cloneNode( true );

                p.insertBefore( e, el );

                Parse( e, Clone( a, {
                    data: a.mainD,
                    comp: a.mainC
                } ) )
            }
        }
        el.parentNode.removeChild( el ); return;
    }

    if ( For( el, a ) ) return;
    if ( isComponent( el, a ) ) return;

    a.data.paths.el = { v: el };

    attrElem( el, a )

    var n = el.firstChild; while ( el = n ) { n = el.nextSibling; Parse.apply( this, arguments ); }
}

//#endregion
//#region Text

function TextFn ( v, el ) {
    el.textContent = v == undefined ? '' : v;
}
function Text ( el, a ) {
    var o, ind = 0, p = el.parentNode;

    el.textContent.replace( /\{\{(.+?)\}\}/g, function ( e, b, i  ) {

        p.insertBefore( document.createTextNode( el.textContent.substring( ind, i ) ), el );
        p.insertBefore( o = document.createTextNode( '--' ), el );

        a.data.eval( b, o, TextFn, o );

        ind = i + e.length;
    } )

    el.textContent = el.textContent.substring( ind );
}

//#endregion
//#region For

function ForFn ( v, a ) {

    a.path.on();
    
    v = a.p ? a.arg.data.get( a.p ) : v;
    
    a.els.splice( v && v.length || 0 ).forEach( function ( el ) {
        if ( el.removeCMP ) el.removeCMP();
        else {
            unbind( el );
            el.parentNode.removeChild( el );
        }
    } );

    if ( v && v.length )
    for ( var j = a.els.length; j < v.length; j++ ) {

        if ( a.i ) a.arg.data.paths[ a.i ] = { v: j }

        if ( a.p ) a.arg.data.paths[ a.n ] = { p: a.p + '.' + j }
        else a.arg.data.paths[ a.n ] = { v: v[ j ] }

        const c = isComponent( a.el, a.arg, a.anh );

        if ( c ) {
            a.els.push( c );
        } else { 
            const e = a.el.cloneNode( true );

            Parse( e, a.arg );

            a.els.push( e );
            a.anh.parentNode.insertBefore( e, a.anh );
        }
    }

    a.path.off();
}
function For ( el, a ) {
    var v = el.getAttribute( ':for' ); if ( !v ) return;
    var e = /([\w$_]+)( *, *([\w$_]+))? +in *(.+)/.exec( v ); if ( !v ) return;

    const is = /^[\w.$_]+$/.test( e[ 4 ] );
    
    const arg = {
        el: el, arg: Clone( a ),
        n: e[ 1 ], i: e[ 3 ], p: is ? a.data.getPath( e[ 4 ] ) : null,
        anh: document.createComment( 'for' ),
        path: a.data.freeze(), els: []
    }

    el.parentNode.insertBefore( arg.anh, el );
    el.parentNode.removeChild( el );
    el.removeAttribute( ':for' );

    if ( is ) {
        a.data.bind( arg.p, arg.anh, ForFn, arg )
        a.data.bind( arg.p + '.length', arg.anh, ForFn, arg )
    } else {
        a.data.eval( e[ 4 ], arg.anh, ForFn, arg )
    }

    return true;
}

//#endregion
//#region Component


function Component ( name, a ) {
    this.$data = a.data.isData ? a.data : new Data( a.data );
    this.data = this.$data.data;
    this.name = name;
    this.fn = a.fn
    this.el = a.el;
    this.child = [];
    this.ref = [];
    
    if ( a.parent ) {
        this.parent = a.parent;
        a.parent.child.push( this );
    }
}
Component.prototype = {
    removeCMP: function ( ) {
        unbind( this );
        unbind( this.el );
        this.el.parentNode && 
        this.el.parentNode.removeChild( this.el );
        this.$data.stop( );

        if ( this.parent ) {
            for ( var j = 0; j < this.parent.child.length; j++ ) 
            if ( this.parent.child[ j ] == this ) {
                this.parent.child.splice( j, 1 ); break;
            }
        }

        for ( var j = 0; j < this.child.length; j++ ) 
            this.child[ j ].removeCMP( );


        this.parent = null;
    },
    run: function ( ) {
        this.fn && this.fn.call( this, this.data );
    }
}
function getComponentData ( name, a ) {
    var el = document.createElement( 'div' ), fn;

    if ( window[ 'Template_' + name ] ) {
        el.innerHTML = window[ 'Template_' + name ];
        el = el.children[ 0 ];
        if ( window[ name ] ) fn = window[ name ];

    } else {
        console.error( 'Component ' + name + ' not finded' );
        el.innerHTML = "not find";
        el.className  = name;
    }
    return {
        el: el, fn: fn,
        data: {},
        parent: a.comp
    }
}
function isComponentFn ( name, a ) {

    a.path.on();
    a.component && a.component.removeCMP( );

    if ( name == '' ) return;

    const c = a.component = new Component( name, getComponentData( name, a.arg ) );

    attrComp( a.el, c, a.arg );
    
    Parse( c.el, Clone( a.arg, {
        parent: c,
        data: c.$data,
        comp: c,
        slot: a.el
    } ) )

    a.anh.parentNode.insertBefore( c.el, a.anh );
    c.run();

    c.redraw && c.redraw()

    a.path.off();
    return c;
}
function isComponent ( el, a, anh ) {

    if ( !/\-$/.test( el.tagName ) ) return

    const name = el.tagName
        .toLowerCase()
        .replace( /\-([\w])/g, function ( e, b ) { return b.toUpperCase() } )
        .replace( /^\w/, function ( e ) { return e.toUpperCase() } )
        .replace( /\-$/, '' )

    const arg = {
        el: el, arg: Clone( a ), anh: anh || el, path: a.data.freeze()
    }

    const is = !anh;
    
    if ( name == "Component" ) {

        anh = document.createComment( 'component' );
        arg.anh.parentNode.insertBefore( anh, arg.anh );

        if ( is ) {
            el.parentNode.removeChild( el );
        }

        a.data.eval( el.getAttribute( 'name' ), arg.anh = anh, isComponentFn, arg )

        return {
            removeCMP: function ( ) {
                unbind( anh );
                anh.parentNode.removeChild( anh );
                arg.component && arg.component.removeCMP();
            }
        }
    } else {
        const c = isComponentFn( name, arg );

        if ( is ) {
            el.parentNode.removeChild( el );
        }

        return c 
    }
}

compProto( Component )
//#endregion


App.Component = Component

exports = App;
return exports; }.call( {}, {} );
