/*                                *\
 *  APIDocs NETţ��
 *  Author��netnr
 *  Date��2018-03-30
 *  Site��https://ad.netnr.com
 *  PoweredBy��https://netnr.com 
\*                                */

(function (window, undefined) {

    var jz = function (se, rg) { return new jz.fn.init(se, rg); };

    jz.fn = jz.prototype = {
        init: function (se, rg) {
            if (!se) {
                return this;
            }

            var len, elem, match;

            if (typeof se === "string") {
                len = se.length;
                //#ID
                if (se[0] === "#" && len > 1) {
                    elem = document.getElementById(se.substring(1));
                    if (elem) {
                        this[0] = elem;
                        this.length = 1;
                        return this;
                    } else {
                        this.length = 0;
                        return this;
                    }
                }
                //.CLASS
                if (se[0] === "." && len > 1) {
                    var cln = se.substring(1);
                    if (document.getElementsByClassName) {
                        elem = document.getElementsByClassName(cln);
                        jz.each(elem, function (k, v) {
                            this[k] = v;
                        });
                        this.length = elem.length;
                        return this;
                    } else {
                        var rgs = (rg || document).getElementsByTagName('*'), mcln = ' ' + cln.trim() + ' ', k = 0;
                        jz.each(rgs, function () {
                            if ((" " + this.className + " ").indexOf(mcln) >= 0) {
                                this[k++] = this;
                            }
                        });
                        this.length = k;
                        return this;
                    }

                }
                //DOMElement
            } else if (se.nodeType) {
                this[0] = se;
                this.length = 1;
                return this;
            }

            //window
            if (se == window) {
                this[0] = se;
                this.length = 1;
                return this;
            }

            //�����α����
            if (se && se.length) {
                var i = 0, match = se || [];
                for (; i < match.length; i++) {
                    this[i] = match[i];
                }
                this.length = match.length;
                return this;
            }

            this[0] = se;
            this.length = 1;
            return this;
        },
        length: 0,
        //����
        each: function (callback) {
            jz.each(this, callback);
            return this;
        },
        //�¼���Ӵ������
        on: function (type, callback) {
            jz.each(this, function () {
                jz.on(type, callback, this);
            });
        },
        //�¼��Ƴ��������
        off: function (type, callback) {
            jz.each(this, function () {
                jz.off(type, callback, this);
            });
        },
        //��ߡ��߾ࡢ��������ࡢ���ݿ��
        px: function () {
            return jz.px(this[0]);
        },
        //�����ڵ�
        parent: function () {
            var match = [];
            jz.each(this, function () {
                var m = jz.dir(this, "parentNode");
                m.length && match.push(m[0]);
            });
            return new jz.fn.init(match);
        },
        //�Ƴ�
        remove: function () {
            jz.each(this, function () {
                var pt = jz(this).parent();
                if (pt.length && document.documentElement.contains(this)) {
                    pt[0].removeChild(this);
                }
            });
        },
        //��ʾ
        show: function () {
            jz.each(this, function () {
                this.style["display"] = "block";
            });
            return this;
        },
        //Ӱ��
        hide: function () {
            jz.each(this, function () {
                this.style["display"] = "none";
            });
            return this;
        },
        //�����ʽ
        addClass: function (className) {
            className = className.toString().trim();
            jz.each(this, function () {
                (" " + this.className + " ").indexOf(" " + className + " ") == -1 && (this.className += " " + className);
            });
            return this;
        }
    };

    jz.fn.init.prototype = jz.prototype;

    //���� object��array
    jz.each = function (object, callback) {
        var k, i = 0, len = object.length, isObj = len === undefined || typeof object == "function";
        if (isObj) {
            for (k in object) {
                if (callback.call(object[k], k, object[k]) === false) {
                    break;
                }
            }
        } else {
            for (; i < len;) {
                if (callback.call(object[i], i, object[i++]) === false) {
                    break;
                }
            }
        }
    };

    //�¼���Ӵ������
    jz.on = function (type, callback, obj) {
        if (obj.addEventListener) {
            obj.addEventListener(type, callback, false);
        } else if (obj.attachEvent) {
            obj.attachEvent("on" + type, callback["_eid"] = function () {
                callback.apply(obj, arguments)
            });
        } else {
            obj["on" + type] = callback
        }
    };

    //�Ƴ��¼��Ĵ������
    jz.off = function (type, callback, obj) {
        if (obj.removeEventListener) {
            obj.removeEventListener(type, callback, false);
        } else if (obj.detachEvent) {
            obj.detachEvent("on" + type, callback["_eid"]);
        }
    };

    //��Ӵ����¼�
    jz.each(("blur focus focusin focusout load resize scroll unload click dblclick "
        + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave "
        + "change select submit keydown keypress keyup error contextmenu").split(" ")
        , function (i, name) {
            jz.fn[name] = function (callback) {
                jz.each(this, function () { jz.on(name, callback, this); });
                return this;
            }
        });

    //event
    jz.event = function (e) { return e || window.event };

    //target
    jz.target = function (e) { e = e || window; return e.target || e.srcElement; };

    //��ֹ�¼�ð��
    jz.stopEvent = function (e) { if (e && e.stopPropagation) { e.stopPropagation() } else { window.event.cancelBubble = true } };

    //������� ���ȣ�Ĭ��4λ��1��15
    jz.random = function (len) { len = arguments.length ? len > 15 ? 15 : len : 4; return Math.random().toString().substr(2, len) };

    //����һ���ڵ�ĳ������Ľڵ� dir��ѡֵ��parentNode nextSibling previousSibling
    jz.dir = function (t, dir) {
        var match = [], cur = t[dir];
        while (cur && cur.nodeType != 9) {
            cur.nodeType == 1 && match.push(cur);
            cur = cur[dir];
        }
        return match;
    }

    //��ߡ��߾ࡢ��������ࡢ���ݿ��
    jz.px = function (element) {
        var result = {
            //��
            width: null,
            //��
            height: null,
            //�ϱ߾�
            top: null,
            //��߾�
            left: null,
            //��ֱ�������ϼ��
            scrollTop: null,
            //ˮƽ����������
            scrollLeft: null,
            //���ݸ߶�
            scrollHeight: null,
            //���ݿ��
            scrollWidth: null
        }, docEle = document.documentElement, body = document.body;
        if (element === window || element === document) {
            result.width = docEle.clientWidth || body.clientWidth;
            result.height = docEle.clientHeight || body.clientHeight;
            result.scrollTop = docEle.scrollTop || body.scrollTop;
            result.scrollLeft = docEle.scrollLeft || body.scrollLeft;
            result.scrollWidth = docEle.scrollWidth || body.scrollWidth;
            result.scrollHeight = docEle.scrollHeight || body.scrollHeight;
        } else {
            result.width = element.offsetWidth;
            result.height = element.offsetHeight;
            var mg = element.getBoundingClientRect();
            result.top = mg.top;
            result.left = mg.left;
            result.scrollTop = element.scrollTop;
            result.scrollLeft = element.scrollLeft;
            result.scrollWidth = element.scrollWidth;
            result.scrollHeight = element.scrollHeight;
        }
        return result;
    }

    window.j = jz;

})(window, undefined);


//�������Ӧ
function vauto() {
    var ch = j(window).px().height, sh = ch - 38;
    j('#f1')[0].style.height = j('#f2')[0].style.height = sh + "px";
}

//�л�
function switchcard(t) {
    switch (t) {
        //view
        case 2:
            j('#dbox').hide();
            j('#vbox').show();
            j('#footer').hide();
            break;
        //index
        default:
            j('#dbox').show();
            j('#vbox').hide();
            j('#footer').show();
            document.title = window.origintitle;
            j('#bt')[0].innerHTML = "";
            break;
    }
}

//���
function vshow() {
    var isrc = location.hash.substring(1), arri = isrc.split('-'),
        path = ("libs/" + arri[0] + "/" + arri[1] + "/" + arri.join('')).toLowerCase();
    document.title = isrc + " " + window.origintitle;
    j('#bt')[0].innerHTML = "<a href='" + path + ".chm' target='_blank'>" + isrc + "</a>";
    isrc = isrc.toLowerCase();
    f1.src = path + "/nav.html";

    try {
        var deep = 20, si = setInterval(function () {
            if (deep) {
                deep--;
                try {
                    var fr = f1.contentWindow;
                    if (fr) {
                        var as = fr.document.getElementsByTagName('a'), ha, fa;
                        for (var i = 0; i < as.length; i++) {
                            var ai = as[i], cn = ai.className;
                            if (cn.indexOf('nodeSel') >= 0) {
                                ha = ai;
                                break;
                            }
                            if (!fa && ai.href.indexOf('.htm') >= 0 && cn.indexOf("node") >= 0) {
                                fa = ai;
                            }
                        }
                        var tar = ha || fa;
                        fr.location.hash = "#" + tar.id;
                        tar.click();
                        clearInterval(si);
                    }
                } catch (e) { }
            } else { clearInterval(si) }
        }, 100);
    } catch (e) { }
}

j(window).load(function () {
    window.origintitle = document.title;
    if (location.hash.length > 3) {
        switchcard(2);
        vshow();
    } else {
        switchcard();
    }
    vauto();
}).resize(vauto).on("hashchange", function () {
    if (location.hash.length > 3) {
        switchcard(2);
        vshow();
    } else {
        switchcard();
    }
})