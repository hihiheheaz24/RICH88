var GAME_TYPE = {
    NONE: 0,
    KING_SLOT: 1,
    FARM: 2,
    COW_BOY: 3,
    MINI_SLOT: 5,
    TAM_BAO: 4,
    TAI_XIU: 7,
    MINI_POKER: 8,
    FISH_HUNTER: 9,
    LUCKY_WHEEL: 10,
    ORACLE: 13,

    XOCDIA : 19,

    LODE : 14,

    POKER: 20,
    TLMN: 21,
    PHOM: 22,
    BA_CAY: 23,
    SAM: 24,
    BINH: 25,
    FISH: 30,
    FISH_CA_MAP: 31,
};

var CASHIN_TYPE = {
    ALL : 0,
    SMS : 1,
    IAP : 2,
    CARD : 3,
    MOMO : 4,
    BANK : 5
}

var BET_TYPE = {
    DE: 0,
    LO: 1,
    XIEN_2: 2,
    XIEN_3: 3,
    XIEN_4: 4,
    BA_CANG: 5,
    DAU: 6,
    DIT: 7,
    LO_3_SO: 8

};

var XocDiaStatus = {
    Betting : 1,
    Endgame : 2,
};

var GAME_CODE = {
    TLMN: "TMN",
    BINH: "MAB",
    POKER: "PKR",
    PHOM: "PHO",
    SAM: "SAM",
    BANCA: "BCA"
};

var LIST_SLOT = [GAME_TYPE.MINI_SLOT, GAME_TYPE.MINI_POKER, GAME_TYPE.TAM_BAO, GAME_TYPE.ORACLE];
var MINI_GAME = [GAME_TYPE.MINI_SLOT, GAME_TYPE.MINI_POKER, GAME_TYPE.TAI_XIU, GAME_TYPE.LUCKY_WHEEL];
var GAME_BAI = [GAME_TYPE.POKER, GAME_TYPE.TLMN, GAME_TYPE.PHOM, GAME_TYPE.BA_CAY, GAME_TYPE.SAM , GAME_TYPE.BINH];
var verChildGame = {
    4: "1.0.1",
    5: "1.0.1",
    7: "1.0.1",
    8: "1.0.1",
    9: "1.0.1",
    13: "1.0.1",
    20: "1.0.1",
    21: "1.0.1",
    22: "1.0.1",
    23: "1.0.1",
    24: "1.0.1",
    25: "1.0.1",
    31: "1.0.1",
}
var linkBundle = "%sBundleVPlay/%n/";
var linkFull = "%sFull/VPlay/";
var linkConfig = '%sConfigBundleVPlay.txt';


var linkFire = "";

var LIST_GAME_ASSET = [];// list game ko assetbundle
var LIST_REMOVE_BUNDLE_GAME = {};
var LIST_VERSION_REMOVE = [];



var actionEffectClose = function (node, func) {
    
    let action1 = cc.fadeOut(0.15);
    let action2 = cc.scaleTo(0.15, 1.5)//.easing(cc.easeBackIn());
    let action3 = cc.spawn(action1, action2);
    let funCall = cc.callFunc(()=>{
        node.opacity = 255;
        node.scale = 1;
    })
    let action = cc.sequence(action3, cc.callFunc(() => {
    }) , funCall, cc.callFunc(func));
    node.runAction(action);
};



var actionEffectOpen = function (node, func) {
    node.scale = 1.5;
    node.opacity = 0;
    let action1 = cc.fadeIn(0.15);
    let action2 = cc.scaleTo(0.15, 1)//.easing(cc.easeBackIn())
    let action3 = cc.spawn(action1, action2);
    let action = cc.sequence(action3, cc.callFunc(() => {
    }), cc.callFunc(func));
    node.runAction(action);
};


var NSP_TYPE = {
	NONE: 0,
	VIETTEL: 1,
	VINAPHONE: 2,
	MOBIFONE: 3,
	ZING: 5,
	MOMO: 4,
	DATA_VIETTEL: 6,
	DATA_VINAPHONE: 7,
	DATA_MOBIFONE: 8,

    BANK: 9,
    ZALO: 10,
    VISA: 11,
}

var CARD_AMOUNT_VALUE =[0,10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000, 2000000, 5000000 , 40000, 80000]

var CONFIG = {	
	CONFIG_LINK: '', // poker
	
	TX_BET_PERIOD: 60,
	TX_AWARD_PERIOD: 20,
	MERCHANT : "1",
	VERSION : "1.0.0",
	IP_SEND : "178.128.127.199",
	//special gun type
	FREE_GUN_ID : 100,
	LIGHTING_GUN_ID : 101,
	FIRE_GUN_ID : 102,
	ICE_GUN_ID : 103,
	//fish type
	FISH_TYPE_1 : 1,
	FISH_TYPE_2 : 2,
	FISH_TYPE_3 : 3,
	FISH_TYPE_4 : 4,
	FISH_TYPE_5 : 5,
	FISH_TYPE_6 : 6,
	FISH_TYPE_7 : 7,
	FISH_TYPE_8 : 8,
	FISH_TYPE_9 : 9,
	FISH_TYPE_10 : 10,
	FISH_TYPE_11 : 11,
	FISH_TYPE_12 : 12,
	FISH_TYPE_13 : 13,
	FISH_TYPE_14 : 14,
	FISH_TYPE_15 : 15,
	FISH_TYPE_16 : 16,
	FISH_TYPE_17 : 17,
	FISH_TYPE_18 : 18,
	FISH_TYPE_19 : 19,
	FISH_TYPE_20 : 20,
	FISH_TYPE_21 : 21,
	FISH_TYPE_22 : 22,
	FISH_TYPE_23 : 23,
	FISH_TYPE_24 : 24,
	FISH_TYPE_25 : 25,
	FISH_TYPE_26 : 26,
	ELECTRIC_FISH_TYPE : 50,
	JACKPOT_TYPE : 100,
	MAMON_TYPE : 201,
	BONUS_TYPE : 202,
	GIFT_FISH : 150,
	SPECIAL_GUN_FISH : 155,
	//key
	KEY_USERNAME : "USER_NAME_CaMap",
	KEY_PASSWORD : "PASSWORD_CaMap",
	KEY_SOUND : "SOUND_CaMap",
	KEY_MUSIC : "MUSIC_CaMap",
	KEY_CHECK : "CHECK_ATHUEN_CaMap",
	KEY_SAVE_INFO : "save_info",
	//SOURCE ID
	SOURCE_ID_OTHERS : "0",
	SOURCE_ID_WEB : "1",
	SOURCE_ID_IOS : "2",
	SOURCE_ID_ANDROID : "3",
	SOURCE_ID_PC : "4",
 };








function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17,  606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12,  1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7,  1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7,  1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22,  1236535329);
    
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14,  643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9,  38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5,  568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20,  1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14,  1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16,  1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11,  1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4,  681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23,  76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16,  530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10,  1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6,  1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6,  1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21,  1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15,  718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
    
    }
    
    function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
    }
    
    function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    
    function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    
    function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    
    function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    
    function md51(s) {
    txt = '';
    var n = s.length,
    state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i=64; i<=s.length; i+=64) {
    md5cycle(state, md5blk(s.substring(i-64, i)));
    }
    s = s.substring(i-64);
    var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
    for (i=0; i<s.length; i++)
    tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
    tail[i>>2] |= 0x80 << ((i%4) << 3);
    if (i > 55) {
    md5cycle(state, tail);
    for (i=0; i<16; i++) tail[i] = 0;
    }
    tail[14] = n*8;
    md5cycle(state, tail);
    return state;
    }
    
    /* there needs to be support for Unicode here,
     * unless we pretend that we can redefine the MD-5
     * algorithm for multi-byte characters (perhaps
     * by adding every four 16-bit characters and
     * shortening the sum to 32 bits). Otherwise
     * I suggest performing MD-5 as if every character
     * was two bytes--e.g., 0040 0025 = @%--but then
     * how will an ordinary MD-5 sum be matched?
     * There is no way to standardize text to something
     * like UTF-8 before transformation; speed cost is
     * utterly prohibitive. The JavaScript standard
     * itself needs to look at this: it should start
     * providing access to strings as preformed UTF-8
     * 8-bit unsigned value arrays.
     */
    function md5blk(s) { /* I figured global was faster.   */
    var md5blks = [], i; /* Andy King said do it this way. */
    for (i=0; i<64; i+=4) {
    md5blks[i>>2] = s.charCodeAt(i)
    + (s.charCodeAt(i+1) << 8)
    + (s.charCodeAt(i+2) << 16)
    + (s.charCodeAt(i+3) << 24);
    }
    return md5blks;
    }
    
    var hex_chr = '0123456789abcdef'.split('');
    
    function rhex(n)
    {
    var s='', j=0;
    for(; j<4; j++)
    s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
    + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
    }
    
    function hex(x) {
    for (var i=0; i<x.length; i++)
    x[i] = rhex(x[i]);
    return x.join('');
    }
    
    function md5(s) {
    return hex(md51(s));
    }
    
    /* this function is much faster,
    so if possible we use it. Some IEs
    are the only ones I know of that
    need the idiotic second function,
    generated by an if clause.  */
    
    function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
    }
    
    if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
    function add32(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF),
    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
    }
    }
