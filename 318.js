!window.Module && ( Module = {} );
/* =============== E:/Work/src/comp/input.jss ==============*/
Module[ 'E:/Work/src/comp/input.jss' ] = function( exports ) {
Template_InNum ="<div class=\"inNum\">\r\n    <input type=\"number\" :input=\"i.count\">\r\n</div>";

InNum = function ( v ) {


    this.bind( 'i.count', function ( ) {
        console.log( '--' );
    } )
}


return exports; }.call( {}, {} );
/* =============== E:/Work/src/module/app/data.js ==============*/
Module[ 'E:/Work/src/module/app/data.js' ] = function( exports ) {


const KeyWord = {}

'if else switch default this window console Math break continue return const var let true false undefined null Nan'

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

            d = d[ b ];
            
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
        if ( w && !q || KeyWord[ n ] ) return '';
        
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
        val != undefined && a.data.set( a.path, val, el != this ? this : el )
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

function InputFn ( v, a, e ) { console.log(  );
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
    a.f.call( a.c, v )
}

Component.prototype.bind = function ( n, f ) {
    this.$data.bind( n, this, Bindfn, { f: f, n: n, c: this } )
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
        if ( el.remove ) el.remove();
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
    remove: function ( ) {
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
            this.child[ j ].remove( );


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
    a.component && a.component.remove( );

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
        .replace( /\-([\w])/, function ( e, b ) { return b.toUpperCase() } )
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
            remove: function ( ) {
                unbind( anh );
                anh.parentNode.removeChild( anh );
                arg.component && arg.component.remove();
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
