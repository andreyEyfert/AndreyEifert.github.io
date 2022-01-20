/* ---------E:/src/!modules/app/copy.js------------ */
MODULE__1 = function( exports ) {
    function C ( d ) {
        if ( Array.isArray( d ) ) {    const r = []; for ( var k in d ) r.push(  C( d[ k ] )  ); return r }
        if ( typeof d === 'object' ) { const r = {}; for ( var k in d ) r[ k ] = C( d[ k ] );    return r }
        return d;
    }
    exports = C;
    return exports; }( {} );
    /* -------------------------------- */
    /* ---------E:/src/!modules/app/equal.js------------ */
    MODULE__2 = function( exports ) {
    function E ( a, b ) {
        // if ( typeof a === 'object' ) {
        //     if ( typeof b !== 'object' ) return false
        //     if ( Array.isArray( a ) && ( !Array.isArray( b ) || a.length != b.length ) ) return false
    
        //     for ( var k in a ) if ( a[ k ] != b[ k ] ) return false;
        //     return true
        // }
        // return a === b
        
        if ( typeof a != typeof b ) return false
        if ( typeof a == 'object' ) {
            if ( Array.isArray( a ) && ( !Array.isArray( b ) || b.length != a.length ) ) return false
            
            for ( var k in a ) if ( !E( a[ k ], b[ k ] ) ) return false
            return true
        }
        return a == b;
    
        
        if ( typeof a == 'object' ) {
            if ( Array.isArray( a ) && ( !Array.isArray( a ) || a.length != b.length ) ) return false
            if ( typeof b != 'object' ) return false
            if ( Object.keys( a ).length != Object.keys( b ).length ) return false;
            for ( var k in a ) if ( a[ k ] != b[ k ] ) return false
            return true
        }
        return a == b
    }
    exports = E;
    return exports; }( {} );
    /* -------------------------------- */
    /* ---------E:/src/!modules/app/obs.js------------ */
    MODULE__5 = function( exports ) {
    var C = MODULE__1;
    var E = MODULE__2;
    
    const proto = {
    
        create ( b, e ) {
            const l = this.L, K = this.K, d = this.D, c = this.C;
            const F = Function (
                'data, _____sub' + ( e ? ',' + e : '' ),
                Object
                    .keys( K )
                    .map( function ( k ) { return 'var ' + k + ' = ' + '_____sub.' + k + ';\r\n'  } )
                    .join( '' ) +
                Object
                    .keys( d )
                    .map( function ( k ) { return 'var ' + k + ' = ' + 'data.' + k + ';\r\n'  } )
                    .join( '' ) +
                Object
                    .keys( l )
                    .map( function ( k ) { return 'var ' + k + ' = ' + l[ k ] + ';\r\n'  } )
                    .join( '' ) +
                'return ' + b
            )
            return function ( ) {
                Array.prototype.unshift.call( arguments, d, K )
                return F.apply( c, arguments )
            }
        },
        add ( e, b, f ) {
            const F = this.create( b, 'el' );
            const i = {
                e: e, f: f, F: F
            }
            i.a = Array.prototype.splice.call( arguments, 2 );
            i.a[ 0 ] = C( F( e ) )
            
            this.S.push( i )
    
            f.apply( this.C, i.a )
        },
        sleep ( e ) {
            const s = this.S;
            for ( var j = s.length - 1; j >= 0; j-- ) {
                if ( s[ j ].e === e ) s[ j ].i = false;
            }
            var n = e.firstChild; while ( e = n ) { n = e.nextSibling; this.sleep( e ) }
        },
        unsleep ( e ) {
            const s = this.S;
            for ( var j = s.length - 1; j >= 0; j-- ) {
                if ( s[ j ].e === e ) s[ j ].i = true;
            }
            var n = e.firstChild; while ( e = n ) { n = e.nextSibling; this.unsleep( e ) }
        },
        check () {
            const s = this.S, c = this.C;
            for ( var k in s ) {
                const i = s[ k ]; if ( i.i === false ) continue
                const v = i.F( i.e );
                if ( !E( v, i.a[ 0 ] ) ) {
                    i.a[ 0 ] = C( v ); i.f.apply( c, i.a )
                }
            }
        },
        unbind ( e ) {
            const s = this.S;
            for ( var j = s.length - 1; j >= 0; j-- ) {
                if ( s[ j ].e === e ) s.splice( j, 1 )
            }
            var n = e.firstChild; while ( e = n ) { n = e.nextSibling; this.unbind( e ) }
        },
        setter: function ( k ) {
            const e = /^[\w_$]+$/.exec( k );
            
            if ( e ) {
                return this.create( (this.L[ k ] || 'data.' + k) +' = hh', 'hh' )
            } else {
                return this.create( k +' = hh', 'hh' )
            }
        },
        copy ( ) {
            const L = {}, l = this.L;
    
            for ( var k in l ) L[ k ] = l[ k ];
    
            const N = {
                L,
                __proto__: proto
            }
            
            for ( var k in this )
                if ( k !== 'L' )
                    N[ k ] = this[ k ];
            
            return N;
        }
    }
    
    exports = ( D, C, O ) => {
    
        const self = {
            S: [],
            L: {},
            K: {},
            D, C, O,
            __proto__: proto
        }
    
        C.obs = self;
    
        return self
    }
    return exports; }( {} );
    /* -------------------------------- */
    /* ---------E:/src/!modules/app/attr.js------------ */
    MODULE__0 = function( exports ) {
    function S ( v, s ) {
        for ( var k in v ) s[ k ] = v[ k ];
    }
    function IS ( v, s ) {
        s.display = v ? '' : 'none'
    }
    function C ( v, s, m ) {
        for ( var k in m ) s.remove( m[ k ] );
        if ( Array.isArray( v ) )
             for ( var k in v ) if ( v[ k ] && typeof v[ k ] == 'string' ) { s.add( v[ k ] ); m.push( v[ k ] ) }
        else for ( var k in v ) if ( v[ k ] && typeof v[ k ] == 'string' ) { s.add( k ); m.push( k ) }
    }
    function ATTR ( v, E, i, k ) {
        i ? E.setAttribute( k, v ) : E[ k ] = v;
    }
    const IE = /*@cc_on!@*/false || !!document.documentMode;
    const AI = function ( t ) {
        return t == 'checkbox' || t == 'range' && IE
    }
    exports = function ( e, a ) {
        Array.prototype.map.call( e.attributes, function ( i ) { return i.name } )
        .forEach( function ( n ) {
            var t
            var v = e.getAttribute( n );
            
                 if ( n == ':style' ) a.add( e, v, S, e.style )
            else if ( n == 'ref' ) a.C.ref[ v ] = e;
            else if ( n == ':class' ) a.add( e, v, C, e.classList, [] )
            else if ( n == ':is'    ) a.add( e, v, IS   , e.style )
            else if ( n == ':input' ) {
                const E = AI( e.type ) ? 'change'  : 'input'
                const k = e.type == 'checkbox' ? 'checked' : 'value';
                const s = a.setter( v )
                
                a.add( E, v, ATTR, e, null, k );
                e.addEventListener( E, function ( ev ) {
                    s( e[ k ] );  a.check()
                } )
            }
            else if ( n[ 0 ] === '@' ) {
                const N = n.substring( 1 );
                if ( t = /^\{(.+)\}$/.exec( v ) ) {
                    const f = a.create( t[ 1 ], 'ev,el' );
                    e.addEventListener( N, function ( ev ) { f( ev, e ); a.check() } )
                }
                else if ( t = /([\w$_]+)?(\((.+)\))?/.exec( v ) ) {
                    const f = a.create( '[' + t[ 3 ] + ']', 'ev,el' );
                    e.addEventListener( N, function ( ev ) {
                        const A = f( ev, e ); a.C[ t[ 1 ] || N ].apply( A.C, A ); a.check()
                    } )
                }
            }
            else if ( t = /(a)?:(.+)/.exec( n ) ) a.add( e, v, ATTR, e, t[ 1 ], t[ 2 ] )
            else return
    
            e.removeAttribute( n );
        } );
    }
    return exports; }( {} );
    /* -------------------------------- */
    /* ---------E:/src/!modules/app/index.js------------ */
    MODULE__4 = function( exports ) {
    var Obs = MODULE__5;
    var A = MODULE__0;
    
    function T_ ( v, o ) {
        o.textContent = v == undefined ? '' : v;
    }
    
    function T ( e, a ) {
        var s = e.textContent, p = e.parentNode, j = 0, o;
    
        s.replace( /\{\{(.+?)\}\}/g, function ( q, b, i ) {
            p.insertBefore( document.createTextNode( s.substring( j, i ) ), e )
            p.insertBefore( o = document.createTextNode( '-' ), e )
    
            a.add( o, b, T_, o )
    
            j = i + q.length;
        } )
    
        e.textContent = s.substring( j )
    }
    function F_ ( v, n, i, b, a, m, e, h ) {
        
        m.splice( v.length || 0 ).forEach( function ( e ) {
            if ( e instanceof HTMLElement ) {
                a.unbind( e )
                e.parentNode.removeChild( e )
            }
        } );
    
        for ( var j = m.length; j < v.length; j++ ) {
            a.L[ n ] = '(' + b + ')[' + j + ']'
            i && ( a.L[ i ] = j );
    
            const E = e.cloneNode( true );
    
            h.parentNode.insertBefore( E, h );
    
            m.push(
                P( E, a )
            )
        }
        delete a.L[ n ]
        delete a.L[ i ]
    }
    
    function F( e, a ) {
        const v = e.getAttribute( ':for' ); if ( !v ) return;
        const q = /([\w_$]+)(\s*,\s*([\w_$]+))?\s+in\s+(.+)/.exec( v ); if ( !q ) return;
    
        const m = [];
        const h = document.createComment( 'for' )
        const p = e.parentNode;
    
        e.removeAttribute( ':for' )
    
        p.insertBefore( h, e )
        p.removeChild( e );
    
        a.add( h, q[ 4 ], F_, q[ 1 ], q[ 3 ], q[ 4 ], a.copy(), m, e, h )
    
        return e
    }
    
    const Q1 = [ ]
    const Q2 = [ F ]
    
    history.replaceState( null, '', '' )
    
    const S = [];
    var I = 0;
    
    function C ( ) {
        const path = document.location;
    
        let t
        S.forEach( function ( i ) {
            if ( t = i.r.exec( path ) ) {
    
                if ( !i.e.parentNode ) {
                    i.h.parentNode.insertBefore( i.e, i.h )
                }
                i.a.K[ i.i ] = t
                i.a.unsleep( i.e )
                i.a.check();
            } else {
                if ( i.e.parentNode ) {
                    i.h.parentNode.removeChild( i.e )
                }
                i.a.sleep( i.e )
            }
        } );
    }
    function Go ( e ) {
        e.preventDefault();
    
        const path = this.getAttribute( ':path' ) || this.href
     console.log( path );
        history.pushState( null, '', path )
        C()
    }
    
    Q1.push( function ( e, a ) {
        a.C.go = function ( p ) {
            p = p.replace( /^\.\//, function ( ) {
                return document.location.pathname.replace( /\/$/, '' ) + '/'
            } )
            history.pushState( null, '', p )
            C()
        }
    } )
    
    Q2.push( function ( e, a ) {
        if ( e.tagName == 'A' || e.getAttribute( ':path' ) ) {
            e.onclick = Go
            return
        }
        
        let v = e.getAttribute( ':route' ); if ( !v ) return;
    
        const i = 'router' + I++;
        const m = []
        const h = document.createComment( 'route' )
    
        e.parentNode.insertBefore( h, e )
        e.removeAttribute( ':route' )
    
        a.K[ i ] = []
    
        v = v
        .replace( /[?&]/g, function ( e ) { return '\\' + e } )
        .replace( /\:(\:?)([\w$_]+)/g, function ( q, f, n ) {
            a.L[ n ] = i + '[' + (m.length + 1) + ']'
            m.push( n )
            return '([\\w\\d_-]+)' + ( f ? '?' : '' )
        } )
    
        e = P( e, a );
        
        S.push( { r: new RegExp( v, '' ), m, a, e, h, is: true, i } )
    
        C()
        
        return e
    } )
    
    window.onpopstate = C
    
    function P ( e, a ) {
        if ( e.nodeType == 3 ) return T( e, a );
        if ( e.nodeType != 1 || e.tagName == 'SCRIPT' ) return e;
        
        let r;
        for ( var k in Q2 ) if ( r = Q2[ k ]( e, a ) ) return r;
    
        A( e, a )
    
        var n = e.firstChild, t = e; while ( t = n ) { n = t.nextSibling; P( t, a ); }
        return e
    }
    
    exports = ( e, D, opt ) => {
    
        const c = {
            el: e, data: D
        };
    
        const a = Obs( D, c, opt );
    
        for ( var k in Q1 ) Q1[ k ]( e, a )
    
        P( e, a )
    
        return c
    }
    return exports; }( {} );
    /* -------------------------------- */