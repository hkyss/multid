(function ($) {
  $.fn.multiphotos = function (cfg) {
    var inc = 0
    cfg.id = cfg.id || new Date().getTime()
    this.bind('addItem', function (e, image) {
      if (!image) {
        image = { 'image': '', 'title': '' }
      }
      var self = this
      var input_id = cfg.id + 'item_' + (inc++)
      var itemTitle = $('<textarea max="200" id="' + input_id + '_title" class="morephoto_itemTitle" placeholder="Подпись">' + image.title + '</textarea>')
      var itemInput = $('<input type="hidden" value="' + image.image + '" id="' + input_id + '" class="morephoto_item"/>')
      var itemRemove = $('<div/>', {
        'class': 'removeBtn',
        'click': function () {
          $(this).parent().animate({ 'opacity': 0.5 }, 200).animate({
            'width': 'hide',
            'margin-right': 'hide'
          }, 200, function () {
            $(this).remove()
            $(self).trigger('sync')
          })
        }
      })

      var imageWrap = $('<div/>').addClass('itemWrap').css('background-image', 'url(' + thumb(image.image) + ')')
      var item = $('<div/>', {
        'class': 'item',
        'html': itemInput.add(imageWrap).add(itemRemove).add(itemTitle)
      }).insertBefore($(this).siblings('.addButton'))
      $(this).parent().sortable('refresh')

      $(item).find('textarea.morephoto_itemTitle').on('keyup', function (e) {
        $(self).trigger('sync')
      })

      return item
    }).bind('sync', function () {
      var json = {}
      json.fieldValue = []

      $(this).parent().find('.item').each(function () {
        let src = $(this).find('input.morephoto_item').val()
        let title = $(this).find('textarea.morephoto_itemTitle').val()
        json.fieldValue.push({ 'image': src, 'title': title })
      })
      json.fieldSettings = { 'autoincrement': 1 }
      $(this).val(JSON.stringify(json))
    }).each(function () {
      var self = this,
        inputListner

      $(this).parent().addClass('mpTv').append(
        $('<div/>', {
          'class': 'addButton',
          'click': function () {
            var item = $(self).triggerHandler('addItem').hide()
            var lastVal = $('input', item).val()
            lastImageCtrl = $('input', item).attr('id')
            window.KCFinder = {}
            window.KCFinder.callBackMultiple = function (files) {
              window.KCFinder = null
              SetUrl(files[0])
              for (var i = 1; i < files.length; i++) {
                $(self).trigger('addItem', { image: files[i], title: '' })
                lastImageCtrl = $('input.morephoto_item', item).attr('id')
              }
              $(self).trigger('sync')
            }
            var w = screen.width * 0.7
            var h = screen.height * 0.7
            OpenServerBrowser('media/browser/mcpuk/browse.php?type=images&langCode=ru', w, h)

            clearInterval(inputListner)
            inputListner = setInterval(function () {
              if (lastVal != $('input.morephoto_item', item).val()) {
                clearInterval(inputListner)
                var src = $('input.morephoto_item', item).val()
                item.css({ 'opacity': 0 }).animate({ 'width': 'show', 'margin-right': 'show' }, 200, function () {
                  item.find('.itemWrap').css('background-image', 'url(' + thumb(src) + ')')
                  item.animate({ 'opacity': 1 }, 200).css({ 'overflow': 'auto' })
                })
                $(self).trigger('sync')
              }
            }, 50)
          }
        })
      )

      $(this).parent().sortable({
        'items': '>.item',
        'scroll': false,
        'sort': function (e, ui) {
          $('>.item', this).not(ui.placeholder).not(ui.helper).each(function () {
            if (Math.abs(ui.position.left - $(this).position().left) < ui.helper.outerWidth() * 0.5 && Math.abs(ui.position.top - $(this).position().top) < ui.helper.outerHeight() * 0.5) {
              ui.position.left > $(this).position().left ? $(this).before(ui.placeholder) : $(this).after(ui.placeholder)
            }
          })
        },
        'revert': 100,
        'stop': function () {
          $(self).trigger('sync')
          $('span', this).hide()
        }
      })

      if (this.value) {
        var json = JSON.parse(this.value)
        $(json.fieldValue).each(function (e, val) {
          $(self).trigger('addItem', val)
        })
      }
    })

    function thumb (src, w, h) {
      var image = (cfg.baseUrl + (src || '')).replace(cfg.baseUrl + 'assets/', '')
      var filename = image.replace(/^.*[\\\/]/, '')
      var folder = image.replace(filename, '')
      var extension = filename.split('.').pop()
      image = cfg.baseUrl + (src || '')
      image = image.replace('//', '/')
      if (extension === 'svg' || extension === 'jpeg' || extension === 'jpg' || extension === 'png' || extension === 'webp') {
        return image
      }
      return '/manager/media/browser/mcpuk/browse.php?type=images&lng=ru&act=thumb&file=' + filename + '&dir=' + folder
    }

    return this
  }

})(jQuery)

function function_exists (function_name) {
  if (typeof function_name === 'string') {
    return (typeof window[function_name] === 'function')
  } else {
    return (function_name instanceof Function)
  }
}

if (!function_exists('OpenServerBrowser')) {
  function OpenServerBrowser (url, width, height) {
    var iLeft = (screen.width - width) / 2
    var iTop = (screen.height - height) / 2
    var sOptions = 'toolbar=no,status=no,resizable=yes,dependent=yes'
    sOptions += ',width=' + width
    sOptions += ',height=' + height
    sOptions += ',left=' + iLeft
    sOptions += ',top=' + iTop
    var oWindow = window.open(url, 'FCKBrowseWindow', sOptions)
  }
}

/*!
 * DON'T MODIFY THIS!
 */

if (!function_exists('SetUrl')) {
  var lastFileCtrl, lastImageCtrl

  function SetUrl (url, width, height, alt) {
    if (lastFileCtrl) {
      var c = document.mutate[lastFileCtrl]
      if (c) c.value = url
      lastFileCtrl = ''
    } else if (lastImageCtrl) {
      var c = document.mutate[lastImageCtrl]
      if (c) c.value = url
      lastImageCtrl = ''
    } else {return}
  }
}

/*! jQuery UI - v1.10.0 - 2013-02-05
 * http://jqueryui.com
 * Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.sortable.js
 * Copyright (c) 2013 jQuery Foundation and other contributors Licensed MIT */
if (typeof jQuery.ui == 'undefined') {
  (function (e, t) {
    function i (t, n) {
      var r, i, o, u = t.nodeName.toLowerCase()
      return 'area' === u ? (r = t.parentNode, i = r.name, !t.href || !i || r.nodeName.toLowerCase() !== 'map' ? !1 : (o = e('img[usemap=#' + i + ']')[0], !!o && s(o))) : (/input|select|textarea|button|object/.test(u) ? !t.disabled : 'a' === u ? t.href || n : n) && s(t)
    }

    function s (t) { return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function () { return e.css(this, 'visibility') === 'hidden' }).length }

    var n = 0,
      r = /^ui-id-\d+$/
    e.ui = e.ui || {}
    if (e.ui.version) return
    e.extend(e.ui, {
      version: '1.10.0',
      keyCode: {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
      }
    }), e.fn.extend({
      _focus: e.fn.focus,
      focus: function (t, n) {
        return typeof t == 'number' ? this.each(function () {
          var r = this
          setTimeout(function () { e(r).focus(), n && n.call(r) }, t)
        }) : this._focus.apply(this, arguments)
      },
      scrollParent: function () {
        var t
        return e.ui.ie && /(static|relative)/.test(this.css('position')) || /absolute/.test(this.css('position')) ? t = this.parents().filter(function () { return /(relative|absolute|fixed)/.test(e.css(this, 'position')) && /(auto|scroll)/.test(e.css(this, 'overflow') + e.css(this, 'overflow-y') + e.css(this, 'overflow-x')) }).eq(0) : t = this.parents().filter(function () { return /(auto|scroll)/.test(e.css(this, 'overflow') + e.css(this, 'overflow-y') + e.css(this, 'overflow-x')) }).eq(0), /fixed/.test(this.css('position')) || !t.length ? e(document) : t
      },
      zIndex: function (n) {
        if (n !== t) return this.css('zIndex', n)
        if (this.length) {
          var r = e(this[0]),
            i, s
          while (r.length && r[0] !== document) {
            i = r.css('position')
            if (i === 'absolute' || i === 'relative' || i === 'fixed') {
              s = parseInt(r.css('zIndex'), 10)
              if (!isNaN(s) && s !== 0) return s
            }
            r = r.parent()
          }
        }
        return 0
      },
      uniqueId: function () { return this.each(function () { this.id || (this.id = 'ui-id-' + ++n) }) },
      removeUniqueId: function () { return this.each(function () { r.test(this.id) && e(this).removeAttr('id') }) }
    }), e.extend(e.expr[':'], {
      data: e.expr.createPseudo ? e.expr.createPseudo(function (t) { return function (n) { return !!e.data(n, t) } }) : function (t, n, r) { return !!e.data(t, r[3]) },
      focusable: function (t) { return i(t, !isNaN(e.attr(t, 'tabindex'))) },
      tabbable: function (t) {
        var n = e.attr(t, 'tabindex'),
          r = isNaN(n)
        return (r || n >= 0) && i(t, !r)
      }
    }), e('<a>').outerWidth(1).jquery || e.each(['Width', 'Height'], function (n, r) {
      function u (t, n, r, s) { return e.each(i, function () { n -= parseFloat(e.css(t, 'padding' + this)) || 0, r && (n -= parseFloat(e.css(t, 'border' + this + 'Width')) || 0), s && (n -= parseFloat(e.css(t, 'margin' + this)) || 0) }), n }

      var i = r === 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom'],
        s = r.toLowerCase(),
        o = {
          innerWidth: e.fn.innerWidth,
          innerHeight: e.fn.innerHeight,
          outerWidth: e.fn.outerWidth,
          outerHeight: e.fn.outerHeight
        }
      e.fn['inner' + r] = function (n) { return n === t ? o['inner' + r].call(this) : this.each(function () { e(this).css(s, u(this, n) + 'px') }) }, e.fn['outer' + r] = function (t, n) { return typeof t != 'number' ? o['outer' + r].call(this, t) : this.each(function () { e(this).css(s, u(this, t, !0, n) + 'px') }) }
    }), e.fn.addBack || (e.fn.addBack = function (e) { return this.add(e == null ? this.prevObject : this.prevObject.filter(e)) }), e('<a>').data('a-b', 'a').removeData('a-b').data('a-b') && (e.fn.removeData = function (t) { return function (n) { return arguments.length ? t.call(this, e.camelCase(n)) : t.call(this) } }(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), e.support.selectstart = 'onselectstart' in document.createElement('div'), e.fn.extend({
      disableSelection: function () { return this.bind((e.support.selectstart ? 'selectstart' : 'mousedown') + '.ui-disableSelection', function (e) { e.preventDefault() }) },
      enableSelection: function () { return this.unbind('.ui-disableSelection') }
    }), e.extend(e.ui, {
      plugin: {
        add: function (t, n, r) {
          var i, s = e.ui[t].prototype
          for (i in r) s.plugins[i] = s.plugins[i] || [], s.plugins[i].push([n, r[i]])
        }, call: function (e, t, n) {
          var r, i = e.plugins[t]
          if (!i || !e.element[0].parentNode || e.element[0].parentNode.nodeType === 11) return
          for (r = 0; r < i.length; r++) e.options[i[r][0]] && i[r][1].apply(e.element, n)
        }
      }, hasScroll: function (t, n) {
        if (e(t).css('overflow') === 'hidden') return !1
        var r = n && n === 'left' ? 'scrollLeft' : 'scrollTop',
          i = !1
        return t[r] > 0 ? !0 : (t[r] = 1, i = t[r] > 0, t[r] = 0, i)
      }
    })
  })(jQuery);
  (function (e, t) {
    var n = 0,
      r = Array.prototype.slice,
      i = e.cleanData
    e.cleanData = function (t) {
      for (var n = 0, r;
        (r = t[n]) != null; n++) try { e(r).triggerHandler('remove') } catch (s) {}
      i(t)
    }, e.widget = function (t, n, r) {
      var i, s, o, u, a = {},
        f = t.split('.')[0]
      t = t.split('.')[1], i = f + '-' + t, r || (r = n, n = e.Widget), e.expr[':'][i.toLowerCase()] = function (t) { return !!e.data(t, i) }, e[f] = e[f] || {}, s = e[f][t], o = e[f][t] = function (e, t) {
        if (!this._createWidget) return new o(e, t)
        arguments.length && this._createWidget(e, t)
      }, e.extend(o, s, {
        version: r.version,
        _proto: e.extend({}, r),
        _childConstructors: []
      }), u = new n, u.options = e.widget.extend({}, u.options), e.each(r, function (t, r) {
        if (!e.isFunction(r)) {
          a[t] = r
          return
        }
        a[t] = function () {
          var e = function () { return n.prototype[t].apply(this, arguments) },
            i = function (e) { return n.prototype[t].apply(this, e) }
          return function () {
            var t = this._super,
              n = this._superApply,
              s
            return this._super = e, this._superApply = i, s = r.apply(this, arguments), this._super = t, this._superApply = n, s
          }
        }()
      }), o.prototype = e.widget.extend(u, { widgetEventPrefix: s ? u.widgetEventPrefix : t }, a, {
        constructor: o,
        namespace: f,
        widgetName: t,
        widgetFullName: i
      }), s ? (e.each(s._childConstructors, function (t, n) {
        var r = n.prototype
        e.widget(r.namespace + '.' + r.widgetName, o, n._proto)
      }), delete s._childConstructors) : n._childConstructors.push(o), e.widget.bridge(t, o)
    }, e.widget.extend = function (n) {
      var i = r.call(arguments, 1),
        s = 0,
        o = i.length,
        u, a
      for (; s < o; s++)
        for (u in i[s]) a = i[s][u], i[s].hasOwnProperty(u) && a !== t && (e.isPlainObject(a) ? n[u] = e.isPlainObject(n[u]) ? e.widget.extend({}, n[u], a) : e.widget.extend({}, a) : n[u] = a)
      return n
    }, e.widget.bridge = function (n, i) {
      var s = i.prototype.widgetFullName || n
      e.fn[n] = function (o) {
        var u = typeof o == 'string',
          a = r.call(arguments, 1),
          f = this
        return o = !u && a.length ? e.widget.extend.apply(null, [o].concat(a)) : o, u ? this.each(function () {
          var r, i = e.data(this, s)
          if (!i) return e.error('cannot call methods on ' + n + ' prior to initialization; ' + 'attempted to call method \'' + o + '\'')
          if (!e.isFunction(i[o]) || o.charAt(0) === '_') return e.error('no such method \'' + o + '\' for ' + n + ' widget instance')
          r = i[o].apply(i, a)
          if (r !== i && r !== t) return f = r && r.jquery ? f.pushStack(r.get()) : r, !1
        }) : this.each(function () {
          var t = e.data(this, s)
          t ? t.option(o || {})._init() : e.data(this, s, new i(o, this))
        }), f
      }
    }, e.Widget = function () {}, e.Widget._childConstructors = [], e.Widget.prototype = {
      widgetName: 'widget',
      widgetEventPrefix: '',
      defaultElement: '<div>',
      options: { disabled: !1, create: null },
      _createWidget: function (t, r) { r = e(r || this.defaultElement || this)[0], this.element = e(r), this.uuid = n++, this.eventNamespace = '.' + this.widgetName + this.uuid, this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this.bindings = e(), this.hoverable = e(), this.focusable = e(), r !== this && (e.data(r, this.widgetFullName, this), this._on(!0, this.element, { remove: function (e) { e.target === r && this.destroy() } }), this.document = e(r.style ? r.ownerDocument : r.document || r), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger('create', null, this._getCreateEventData()), this._init() },
      _getCreateOptions: e.noop,
      _getCreateEventData: e.noop,
      _create: e.noop,
      _init: e.noop,
      destroy: function () { this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr('aria-disabled').removeClass(this.widgetFullName + '-disabled ' + 'ui-state-disabled'), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass('ui-state-hover'), this.focusable.removeClass('ui-state-focus') },
      _destroy: e.noop,
      widget: function () { return this.element },
      option: function (n, r) {
        var i = n,
          s, o, u
        if (arguments.length === 0) return e.widget.extend({}, this.options)
        if (typeof n == 'string') {
          i = {}, s = n.split('.'), n = s.shift()
          if (s.length) {
            o = i[n] = e.widget.extend({}, this.options[n])
            for (u = 0; u < s.length - 1; u++) o[s[u]] = o[s[u]] || {}, o = o[s[u]]
            n = s.pop()
            if (r === t) return o[n] === t ? null : o[n]
            o[n] = r
          } else {
            if (r === t) return this.options[n] === t ? null : this.options[n]
            i[n] = r
          }
        }
        return this._setOptions(i), this
      },
      _setOptions: function (e) {
        var t
        for (t in e) this._setOption(t, e[t])
        return this
      },
      _setOption: function (e, t) { return this.options[e] = t, e === 'disabled' && (this.widget().toggleClass(this.widgetFullName + '-disabled ui-state-disabled', !!t).attr('aria-disabled', t), this.hoverable.removeClass('ui-state-hover'), this.focusable.removeClass('ui-state-focus')), this },
      enable: function () { return this._setOption('disabled', !1) },
      disable: function () { return this._setOption('disabled', !0) },
      _on: function (t, n, r) {
        var i, s = this
        typeof t != 'boolean' && (r = n, n = t, t = !1), r ? (n = i = e(n), this.bindings = this.bindings.add(n)) : (r = n, n = this.element, i = this.widget()), e.each(r, function (r, o) {
          function u () {
            if (!t && (s.options.disabled === !0 || e(this).hasClass('ui-state-disabled'))) return
            return (typeof o == 'string' ? s[o] : o).apply(s, arguments)
          }

          typeof o != 'string' && (u.guid = o.guid = o.guid || u.guid || e.guid++)
          var a = r.match(/^(\w+)\s*(.*)$/),
            f = a[1] + s.eventNamespace,
            l = a[2]
          l ? i.delegate(l, f, u) : n.bind(f, u)
        })
      },
      _off: function (e, t) { t = (t || '').split(' ').join(this.eventNamespace + ' ') + this.eventNamespace, e.unbind(t).undelegate(t) },
      _delay: function (e, t) {
        function n () { return (typeof e == 'string' ? r[e] : e).apply(r, arguments) }

        var r = this
        return setTimeout(n, t || 0)
      },
      _hoverable: function (t) {
        this.hoverable = this.hoverable.add(t), this._on(t, {
          mouseenter: function (t) { e(t.currentTarget).addClass('ui-state-hover') },
          mouseleave: function (t) { e(t.currentTarget).removeClass('ui-state-hover') }
        })
      },
      _focusable: function (t) {
        this.focusable = this.focusable.add(t), this._on(t, {
          focusin: function (t) { e(t.currentTarget).addClass('ui-state-focus') },
          focusout: function (t) { e(t.currentTarget).removeClass('ui-state-focus') }
        })
      },
      _trigger: function (t, n, r) {
        var i, s, o = this.options[t]
        r = r || {}, n = e.Event(n), n.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), n.target = this.element[0], s = n.originalEvent
        if (s)
          for (i in s) i in n || (n[i] = s[i])
        return this.element.trigger(n, r), !(e.isFunction(o) && o.apply(this.element[0], [n].concat(r)) === !1 || n.isDefaultPrevented())
      }
    }, e.each({ show: 'fadeIn', hide: 'fadeOut' }, function (t, n) {
      e.Widget.prototype['_' + t] = function (r, i, s) {
        typeof i == 'string' && (i = { effect: i })
        var o, u = i ? i === !0 || typeof i == 'number' ? n : i.effect || n : t
        i = i || {}, typeof i == 'number' && (i = { duration: i }), o = !e.isEmptyObject(i), i.complete = s, i.delay && r.delay(i.delay), o && e.effects && e.effects.effect[u] ? r[t](i) : u !== t && r[u] ? r[u](i.duration, i.easing, s) : r.queue(function (n) { e(this)[t](), s && s.call(r[0]), n() })
      }
    })
  })(jQuery);
  (function (e, t) {
    var n = !1
    e(document).mouseup(function () { n = !1 }), e.widget('ui.mouse', {
      version: '1.10.0',
      options: { cancel: 'input,textarea,button,select,option', distance: 1, delay: 0 },
      _mouseInit: function () {
        var t = this
        this.element.bind('mousedown.' + this.widgetName, function (e) { return t._mouseDown(e) }).bind('click.' + this.widgetName, function (n) { if (!0 === e.data(n.target, t.widgetName + '.preventClickEvent')) return e.removeData(n.target, t.widgetName + '.preventClickEvent'), n.stopImmediatePropagation(), !1 }), this.started = !1
      },
      _mouseDestroy: function () { this.element.unbind('.' + this.widgetName), this._mouseMoveDelegate && e(document).unbind('mousemove.' + this.widgetName, this._mouseMoveDelegate).unbind('mouseup.' + this.widgetName, this._mouseUpDelegate) },
      _mouseDown: function (t) {
        if (n) return
        this._mouseStarted && this._mouseUp(t), this._mouseDownEvent = t
        var r = this,
          i = t.which === 1,
          s = typeof this.options.cancel == 'string' && t.target.nodeName ? e(t.target).closest(this.options.cancel).length : !1
        if (!i || s || !this._mouseCapture(t)) return !0
        this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () { r.mouseDelayMet = !0 }, this.options.delay))
        if (this._mouseDistanceMet(t) && this._mouseDelayMet(t)) {
          this._mouseStarted = this._mouseStart(t) !== !1
          if (!this._mouseStarted) return t.preventDefault(), !0
        }
        return !0 === e.data(t.target, this.widgetName + '.preventClickEvent') && e.removeData(t.target, this.widgetName + '.preventClickEvent'), this._mouseMoveDelegate = function (e) { return r._mouseMove(e) }, this._mouseUpDelegate = function (e) { return r._mouseUp(e) }, e(document).bind('mousemove.' + this.widgetName, this._mouseMoveDelegate).bind('mouseup.' + this.widgetName, this._mouseUpDelegate), t.preventDefault(), n = !0, !0
      },
      _mouseMove: function (t) { return e.ui.ie && (!document.documentMode || document.documentMode < 9) && !t.button ? this._mouseUp(t) : this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted) },
      _mouseUp: function (t) { return e(document).unbind('mousemove.' + this.widgetName, this._mouseMoveDelegate).unbind('mouseup.' + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && e.data(t.target, this.widgetName + '.preventClickEvent', !0), this._mouseStop(t)), !1 },
      _mouseDistanceMet: function (e) { return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance },
      _mouseDelayMet: function () { return this.mouseDelayMet },
      _mouseStart: function () {},
      _mouseDrag: function () {},
      _mouseStop: function () {},
      _mouseCapture: function () { return !0 }
    })
  })(jQuery);
  (function (e, t) {
    function n (e, t, n) { return e > t && e < t + n }

    e.widget('ui.sortable', e.ui.mouse, {
      version: '1.10.0',
      widgetEventPrefix: 'sort',
      ready: !1,
      options: {
        appendTo: 'parent',
        axis: !1,
        connectWith: !1,
        containment: !1,
        cursor: 'auto',
        cursorAt: !1,
        dropOnEmpty: !0,
        forcePlaceholderSize: !1,
        forceHelperSize: !1,
        grid: !1,
        handle: !1,
        helper: 'original',
        items: '> *',
        opacity: !1,
        placeholder: !1,
        revert: !1,
        scroll: !0,
        scrollSensitivity: 20,
        scrollSpeed: 20,
        scope: 'default',
        tolerance: 'intersect',
        zIndex: 1e3,
        activate: null,
        beforeStop: null,
        change: null,
        deactivate: null,
        out: null,
        over: null,
        receive: null,
        remove: null,
        sort: null,
        start: null,
        stop: null,
        update: null
      },
      _create: function () {
        var e = this.options
        this.containerCache = {}, this.element.addClass('ui-sortable'), this.refresh(), this.floating = this.items.length ? e.axis === 'x' || /left|right/.test(this.items[0].item.css('float')) || /inline|table-cell/.test(this.items[0].item.css('display')) : !1, this.offset = this.element.offset(), this._mouseInit(), this.ready = !0
      },
      _destroy: function () {
        this.element.removeClass('ui-sortable ui-sortable-disabled'), this._mouseDestroy()
        for (var e = this.items.length - 1; e >= 0; e--) this.items[e].item.removeData(this.widgetName + '-item')
        return this
      },
      _setOption: function (t, n) { t === 'disabled' ? (this.options[t] = n, this.widget().toggleClass('ui-sortable-disabled', !!n)) : e.Widget.prototype._setOption.apply(this, arguments) },
      _mouseCapture: function (t, n) {
        var r = null,
          i = !1,
          s = this
        if (this.reverting) return !1
        if (this.options.disabled || this.options.type === 'static') return !1
        this._refreshItems(t), e(t.target).parents().each(function () { if (e.data(this, s.widgetName + '-item') === s) return r = e(this), !1 }), e.data(t.target, s.widgetName + '-item') === s && (r = e(t.target))
        if (!r) return !1
        if (this.options.handle && !n) {
          e(this.options.handle, r).find('*').addBack().each(function () { this === t.target && (i = !0) })
          if (!i) return !1
        }
        return this.currentItem = r, this._removeCurrentsFromItems(), !0
      },
      _mouseStart: function (t, n, r) {
        var i, s = this.options
        this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(t), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
          top: this.offset.top - this.margins.top,
          left: this.offset.left - this.margins.left
        }, e.extend(this.offset, {
          click: { left: t.pageX - this.offset.left, top: t.pageY - this.offset.top },
          parent: this._getParentOffset(),
          relative: this._getRelativeOffset()
        }), this.helper.css('position', 'absolute'), this.cssPosition = this.helper.css('position'), this.originalPosition = this._generatePosition(t), this.originalPageX = t.pageX, this.originalPageY = t.pageY, s.cursorAt && this._adjustOffsetFromHelper(s.cursorAt), this.domPosition = {
          prev: this.currentItem.prev()[0],
          parent: this.currentItem.parent()[0]
        }, this.helper[0] !== this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), s.containment && this._setContainment(), s.cursor && (e('body').css('cursor') && (this._storedCursor = e('body').css('cursor')), e('body').css('cursor', s.cursor)), s.opacity && (this.helper.css('opacity') && (this._storedOpacity = this.helper.css('opacity')), this.helper.css('opacity', s.opacity)), s.zIndex && (this.helper.css('zIndex') && (this._storedZIndex = this.helper.css('zIndex')), this.helper.css('zIndex', s.zIndex)), this.scrollParent[0] !== document && this.scrollParent[0].tagName !== 'HTML' && (this.overflowOffset = this.scrollParent.offset()), this._trigger('start', t, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions()
        if (!r)
          for (i = this.containers.length - 1; i >= 0; i--) this.containers[i]._trigger('activate', t, this._uiHash(this))
        return e.ui.ddmanager && (e.ui.ddmanager.current = this), e.ui.ddmanager && !s.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t), this.dragging = !0, this.helper.addClass('ui-sortable-helper'), this._mouseDrag(t), !0
      },
      _mouseDrag: function (t) {
        var n, r, i, s, o = this.options,
          u = !1
        this.position = this._generatePosition(t), this.positionAbs = this._convertPositionTo('absolute'), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs), this.options.scroll && (this.scrollParent[0] !== document && this.scrollParent[0].tagName !== 'HTML' ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - t.pageY < o.scrollSensitivity ? this.scrollParent[0].scrollTop = u = this.scrollParent[0].scrollTop + o.scrollSpeed : t.pageY - this.overflowOffset.top < o.scrollSensitivity && (this.scrollParent[0].scrollTop = u = this.scrollParent[0].scrollTop - o.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - t.pageX < o.scrollSensitivity ? this.scrollParent[0].scrollLeft = u = this.scrollParent[0].scrollLeft + o.scrollSpeed : t.pageX - this.overflowOffset.left < o.scrollSensitivity && (this.scrollParent[0].scrollLeft = u = this.scrollParent[0].scrollLeft - o.scrollSpeed)) : (t.pageY - e(document).scrollTop() < o.scrollSensitivity ? u = e(document).scrollTop(e(document).scrollTop() - o.scrollSpeed) : e(window).height() - (t.pageY - e(document).scrollTop()) < o.scrollSensitivity && (u = e(document).scrollTop(e(document).scrollTop() + o.scrollSpeed)), t.pageX - e(document).scrollLeft() < o.scrollSensitivity ? u = e(document).scrollLeft(e(document).scrollLeft() - o.scrollSpeed) : e(window).width() - (t.pageX - e(document).scrollLeft()) < o.scrollSensitivity && (u = e(document).scrollLeft(e(document).scrollLeft() + o.scrollSpeed))), u !== !1 && e.ui.ddmanager && !o.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t)), this.positionAbs = this._convertPositionTo('absolute')
        if (!this.options.axis || this.options.axis !== 'y') this.helper[0].style.left = this.position.left + 'px'
        if (!this.options.axis || this.options.axis !== 'x') this.helper[0].style.top = this.position.top + 'px'
        for (n = this.items.length - 1; n >= 0; n--) {
          r = this.items[n], i = r.item[0], s = this._intersectsWithPointer(r)
          if (!s) continue
          if (r.instance !== this.currentContainer) continue
          if (i !== this.currentItem[0] && this.placeholder[s === 1 ? 'next' : 'prev']()[0] !== i && !e.contains(this.placeholder[0], i) && (this.options.type === 'semi-dynamic' ? !e.contains(this.element[0], i) : !0)) {
            this.direction = s === 1 ? 'down' : 'up'
            if (this.options.tolerance !== 'pointer' && !this._intersectsWithSides(r)) break
            this._rearrange(t, r), this._trigger('change', t, this._uiHash())
            break
          }
        }
        return this._contactContainers(t), e.ui.ddmanager && e.ui.ddmanager.drag(this, t), this._trigger('sort', t, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1
      },
      _mouseStop: function (t, n) {
        if (!t) return
        e.ui.ddmanager && !this.options.dropBehaviour && e.ui.ddmanager.drop(this, t)
        if (this.options.revert) {
          var r = this,
            i = this.placeholder.offset()
          this.reverting = !0, e(this.helper).animate({
            left: i.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft),
            top: i.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop)
          }, parseInt(this.options.revert, 10) || 500, function () { r._clear(t) })
        } else this._clear(t, n)
        return !1
      },
      cancel: function () {
        if (this.dragging) {
          this._mouseUp({ target: null }), this.options.helper === 'original' ? this.currentItem.css(this._storedCSS).removeClass('ui-sortable-helper') : this.currentItem.show()
          for (var t = this.containers.length - 1; t >= 0; t--) this.containers[t]._trigger('deactivate', null, this._uiHash(this)), this.containers[t].containerCache.over && (this.containers[t]._trigger('out', null, this._uiHash(this)), this.containers[t].containerCache.over = 0)
        }
        return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.options.helper !== 'original' && this.helper && this.helper[0].parentNode && this.helper.remove(), e.extend(this, {
          helper: null,
          dragging: !1,
          reverting: !1,
          _noFinalSort: null
        }), this.domPosition.prev ? e(this.domPosition.prev).after(this.currentItem) : e(this.domPosition.parent).prepend(this.currentItem)), this
      },
      serialize: function (t) {
        var n = this._getItemsAsjQuery(t && t.connected),
          r = []
        return t = t || {}, e(n).each(function () {
          var n = (e(t.item || this).attr(t.attribute || 'id') || '').match(t.expression || /(.+)[\-=_](.+)/)
          n && r.push((t.key || n[1] + '[]') + '=' + (t.key && t.expression ? n[1] : n[2]))
        }), !r.length && t.key && r.push(t.key + '='), r.join('&')
      },
      toArray: function (t) {
        var n = this._getItemsAsjQuery(t && t.connected),
          r = []
        return t = t || {}, n.each(function () { r.push(e(t.item || this).attr(t.attribute || 'id') || '') }), r
      },
      _intersectsWith: function (e) {
        var t = this.positionAbs.left,
          n = t + this.helperProportions.width,
          r = this.positionAbs.top,
          i = r + this.helperProportions.height,
          s = e.left,
          o = s + e.width,
          u = e.top,
          a = u + e.height,
          f = this.offset.click.top,
          l = this.offset.click.left,
          c = r + f > u && r + f < a && t + l > s && t + l < o
        return this.options.tolerance === 'pointer' || this.options.forcePointerForContainers || this.options.tolerance !== 'pointer' && this.helperProportions[this.floating ? 'width' : 'height'] > e[this.floating ? 'width' : 'height'] ? c : s < t + this.helperProportions.width / 2 && n - this.helperProportions.width / 2 < o && u < r + this.helperProportions.height / 2 && i - this.helperProportions.height / 2 < a
      },
      _intersectsWithPointer: function (e) {
        var t = this.options.axis === 'x' || n(this.positionAbs.top + this.offset.click.top, e.top, e.height),
          r = this.options.axis === 'y' || n(this.positionAbs.left + this.offset.click.left, e.left, e.width),
          i = t && r,
          s = this._getDragVerticalDirection(),
          o = this._getDragHorizontalDirection()
        return i ? this.floating ? o && o === 'right' || s === 'down' ? 2 : 1 : s && (s === 'down' ? 2 : 1) : !1
      },
      _intersectsWithSides: function (e) {
        var t = n(this.positionAbs.top + this.offset.click.top, e.top + e.height / 2, e.height),
          r = n(this.positionAbs.left + this.offset.click.left, e.left + e.width / 2, e.width),
          i = this._getDragVerticalDirection(),
          s = this._getDragHorizontalDirection()
        return this.floating && s ? s === 'right' && r || s === 'left' && !r : i && (i === 'down' && t || i === 'up' && !t)
      },
      _getDragVerticalDirection: function () {
        var e = this.positionAbs.top - this.lastPositionAbs.top
        return e !== 0 && (e > 0 ? 'down' : 'up')
      },
      _getDragHorizontalDirection: function () {
        var e = this.positionAbs.left - this.lastPositionAbs.left
        return e !== 0 && (e > 0 ? 'right' : 'left')
      },
      refresh: function (e) { return this._refreshItems(e), this.refreshPositions(), this },
      _connectWith: function () {
        var e = this.options
        return e.connectWith.constructor === String ? [e.connectWith] : e.connectWith
      },
      _getItemsAsjQuery: function (t) {
        var n, r, i, s, o = [],
          u = [],
          a = this._connectWith()
        if (a && t)
          for (n = a.length - 1; n >= 0; n--) {
            i = e(a[n])
            for (r = i.length - 1; r >= 0; r--) s = e.data(i[r], this.widgetFullName), s && s !== this && !s.options.disabled && u.push([e.isFunction(s.options.items) ? s.options.items.call(s.element) : e(s.options.items, s.element).not('.ui-sortable-helper').not('.ui-sortable-placeholder'), s])
          }
        u.push([e.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
          options: this.options,
          item: this.currentItem
        }) : e(this.options.items, this.element).not('.ui-sortable-helper').not('.ui-sortable-placeholder'), this])
        for (n = u.length - 1; n >= 0; n--) u[n][0].each(function () { o.push(this) })
        return e(o)
      },
      _removeCurrentsFromItems: function () {
        var t = this.currentItem.find(':data(' + this.widgetName + '-item)')
        this.items = e.grep(this.items, function (e) {
          for (var n = 0; n < t.length; n++)
            if (t[n] === e.item[0]) return !1
          return !0
        })
      },
      _refreshItems: function (t) {
        this.items = [], this.containers = [this]
        var n, r, i, s, o, u, a, f, l = this.items,
          c = [
            [e.isFunction(this.options.items) ? this.options.items.call(this.element[0], t, { item: this.currentItem }) : e(this.options.items, this.element), this]
          ],
          h = this._connectWith()
        if (h && this.ready)
          for (n = h.length - 1; n >= 0; n--) {
            i = e(h[n])
            for (r = i.length - 1; r >= 0; r--) s = e.data(i[r], this.widgetFullName), s && s !== this && !s.options.disabled && (c.push([e.isFunction(s.options.items) ? s.options.items.call(s.element[0], t, { item: this.currentItem }) : e(s.options.items, s.element), s]), this.containers.push(s))
          }
        for (n = c.length - 1; n >= 0; n--) {
          o = c[n][1], u = c[n][0]
          for (r = 0, f = u.length; r < f; r++) a = e(u[r]), a.data(this.widgetName + '-item', o), l.push({
            item: a,
            instance: o,
            width: 0,
            height: 0,
            left: 0,
            top: 0
          })
        }
      },
      refreshPositions: function (t) {
        this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset())
        var n, r, i, s
        for (n = this.items.length - 1; n >= 0; n--) {
          r = this.items[n]
          if (r.instance !== this.currentContainer && this.currentContainer && r.item[0] !== this.currentItem[0]) continue
          i = this.options.toleranceElement ? e(this.options.toleranceElement, r.item) : r.item, t || (r.width = i.outerWidth(), r.height = i.outerHeight()), s = i.offset(), r.left = s.left, r.top = s.top
        }
        if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this)
        else
          for (n = this.containers.length - 1; n >= 0; n--) s = this.containers[n].element.offset(), this.containers[n].containerCache.left = s.left, this.containers[n].containerCache.top = s.top, this.containers[n].containerCache.width = this.containers[n].element.outerWidth(), this.containers[n].containerCache.height = this.containers[n].element.outerHeight()
        return this
      },
      _createPlaceholder: function (t) {
        t = t || this
        var n, r = t.options
        if (!r.placeholder || r.placeholder.constructor === String) n = r.placeholder, r.placeholder = {
          element: function () {
            var r = e(document.createElement(t.currentItem[0].nodeName)).addClass(n || t.currentItem[0].className + ' ui-sortable-placeholder').removeClass('ui-sortable-helper')[0]
            return n || (r.style.visibility = 'hidden'), r
          }, update: function (e, i) {
            if (n && !r.forcePlaceholderSize) return
            i.height() || i.height(t.currentItem.innerHeight() - parseInt(t.currentItem.css('paddingTop') || 0, 10) - parseInt(t.currentItem.css('paddingBottom') || 0, 10)), i.width() || i.width(t.currentItem.innerWidth() - parseInt(t.currentItem.css('paddingLeft') || 0, 10) - parseInt(t.currentItem.css('paddingRight') || 0, 10))
          }
        }
        t.placeholder = e(r.placeholder.element.call(t.element, t.currentItem)), t.currentItem.after(t.placeholder), r.placeholder.update(t, t.placeholder)
      },
      _contactContainers: function (t) {
        var n, r, i, s, o, u, a, f, l, c = null,
          h = null
        for (n = this.containers.length - 1; n >= 0; n--) {
          if (e.contains(this.currentItem[0], this.containers[n].element[0])) continue
          if (this._intersectsWith(this.containers[n].containerCache)) {
            if (c && e.contains(this.containers[n].element[0], c.element[0])) continue
            c = this.containers[n], h = n
          } else this.containers[n].containerCache.over && (this.containers[n]._trigger('out', t, this._uiHash(this)), this.containers[n].containerCache.over = 0)
        }
        if (!c) return
        if (this.containers.length === 1) this.containers[h]._trigger('over', t, this._uiHash(this)), this.containers[h].containerCache.over = 1
        else {
          i = 1e4, s = null, o = this.containers[h].floating ? 'left' : 'top', u = this.containers[h].floating ? 'width' : 'height', a = this.positionAbs[o] + this.offset.click[o]
          for (r = this.items.length - 1; r >= 0; r--) {
            if (!e.contains(this.containers[h].element[0], this.items[r].item[0])) continue
            if (this.items[r].item[0] === this.currentItem[0]) continue
            f = this.items[r].item.offset()[o], l = !1, Math.abs(f - a) > Math.abs(f + this.items[r][u] - a) && (l = !0, f += this.items[r][u]), Math.abs(f - a) < i && (i = Math.abs(f - a), s = this.items[r], this.direction = l ? 'up' : 'down')
          }
          if (!s && !this.options.dropOnEmpty) return
          this.currentContainer = this.containers[h], s ? this._rearrange(t, s, null, !0) : this._rearrange(t, null, this.containers[h].element, !0), this._trigger('change', t, this._uiHash()), this.containers[h]._trigger('change', t, this._uiHash(this)), this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[h]._trigger('over', t, this._uiHash(this)), this.containers[h].containerCache.over = 1
        }
      },
      _createHelper: function (t) {
        var n = this.options,
          r = e.isFunction(n.helper) ? e(n.helper.apply(this.element[0], [t, this.currentItem])) : n.helper === 'clone' ? this.currentItem.clone() : this.currentItem
        return r.parents('body').length || e(n.appendTo !== 'parent' ? n.appendTo : this.currentItem[0].parentNode)[0].appendChild(r[0]), r[0] === this.currentItem[0] && (this._storedCSS = {
          width: this.currentItem[0].style.width,
          height: this.currentItem[0].style.height,
          position: this.currentItem.css('position'),
          top: this.currentItem.css('top'),
          left: this.currentItem.css('left')
        }), (!r[0].style.width || n.forceHelperSize) && r.width(this.currentItem.width()), (!r[0].style.height || n.forceHelperSize) && r.height(this.currentItem.height()), r
      },
      _adjustOffsetFromHelper: function (t) {
        typeof t == 'string' && (t = t.split(' ')), e.isArray(t) && (t = {
          left: +t[0],
          top: +t[1] || 0
        }), 'left' in t && (this.offset.click.left = t.left + this.margins.left), 'right' in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), 'top' in t && (this.offset.click.top = t.top + this.margins.top), 'bottom' in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
      },
      _getParentOffset: function () {
        this.offsetParent = this.helper.offsetParent()
        var t = this.offsetParent.offset()
        this.cssPosition === 'absolute' && this.scrollParent[0] !== document && e.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop())
        if (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === 'html' && e.ui.ie) t = {
          top: 0,
          left: 0
        }
        return {
          top: t.top + (parseInt(this.offsetParent.css('borderTopWidth'), 10) || 0),
          left: t.left + (parseInt(this.offsetParent.css('borderLeftWidth'), 10) || 0)
        }
      },
      _getRelativeOffset: function () {
        if (this.cssPosition === 'relative') {
          var e = this.currentItem.position()
          return {
            top: e.top - (parseInt(this.helper.css('top'), 10) || 0) + this.scrollParent.scrollTop(),
            left: e.left - (parseInt(this.helper.css('left'), 10) || 0) + this.scrollParent.scrollLeft()
          }
        }
        return { top: 0, left: 0 }
      },
      _cacheMargins: function () {
        this.margins = {
          left: parseInt(this.currentItem.css('marginLeft'), 10) || 0,
          top: parseInt(this.currentItem.css('marginTop'), 10) || 0
        }
      },
      _cacheHelperProportions: function () {
        this.helperProportions = {
          width: this.helper.outerWidth(),
          height: this.helper.outerHeight()
        }
      },
      _setContainment: function () {
        var t, n, r, i = this.options
        i.containment === 'parent' && (i.containment = this.helper[0].parentNode)
        if (i.containment === 'document' || i.containment === 'window') this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, e(i.containment === 'document' ? document : window).width() - this.helperProportions.width - this.margins.left, (e(i.containment === 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
        /^(document|window|parent)$/.test(i.containment) || (t = e(i.containment)[0], n = e(i.containment).offset(), r = e(t).css('overflow') !== 'hidden', this.containment = [n.left + (parseInt(e(t).css('borderLeftWidth'), 10) || 0) + (parseInt(e(t).css('paddingLeft'), 10) || 0) - this.margins.left, n.top + (parseInt(e(t).css('borderTopWidth'), 10) || 0) + (parseInt(e(t).css('paddingTop'), 10) || 0) - this.margins.top, n.left + (r ? Math.max(t.scrollWidth, t.offsetWidth) : t.offsetWidth) - (parseInt(e(t).css('borderLeftWidth'), 10) || 0) - (parseInt(e(t).css('paddingRight'), 10) || 0) - this.helperProportions.width - this.margins.left, n.top + (r ? Math.max(t.scrollHeight, t.offsetHeight) : t.offsetHeight) - (parseInt(e(t).css('borderTopWidth'), 10) || 0) - (parseInt(e(t).css('paddingBottom'), 10) || 0) - this.helperProportions.height - this.margins.top])
      },
      _convertPositionTo: function (t, n) {
        n || (n = this.position)
        var r = t === 'absolute' ? 1 : -1,
          i = this.cssPosition !== 'absolute' || this.scrollParent[0] !== document && !!e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
          s = /(html|body)/i.test(i[0].tagName)
        return {
          top: n.top + this.offset.relative.top * r + this.offset.parent.top * r - (this.cssPosition === 'fixed' ? -this.scrollParent.scrollTop() : s ? 0 : i.scrollTop()) * r,
          left: n.left + this.offset.relative.left * r + this.offset.parent.left * r - (this.cssPosition === 'fixed' ? -this.scrollParent.scrollLeft() : s ? 0 : i.scrollLeft()) * r
        }
      },
      _generatePosition: function (t) {
        var n, r, i = this.options,
          s = t.pageX,
          o = t.pageY,
          u = this.cssPosition !== 'absolute' || this.scrollParent[0] !== document && !!e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
          a = /(html|body)/i.test(u[0].tagName)
        return this.cssPosition === 'relative' && (this.scrollParent[0] === document || this.scrollParent[0] === this.offsetParent[0]) && (this.offset.relative = this._getRelativeOffset()), this.originalPosition && (this.containment && (t.pageX - this.offset.click.left < this.containment[0] && (s = this.containment[0] + this.offset.click.left), t.pageY - this.offset.click.top < this.containment[1] && (o = this.containment[1] + this.offset.click.top), t.pageX - this.offset.click.left > this.containment[2] && (s = this.containment[2] + this.offset.click.left), t.pageY - this.offset.click.top > this.containment[3] && (o = this.containment[3] + this.offset.click.top)), i.grid && (n = this.originalPageY + Math.round((o - this.originalPageY) / i.grid[1]) * i.grid[1], o = this.containment ? n - this.offset.click.top >= this.containment[1] && n - this.offset.click.top <= this.containment[3] ? n : n - this.offset.click.top >= this.containment[1] ? n - i.grid[1] : n + i.grid[1] : n, r = this.originalPageX + Math.round((s - this.originalPageX) / i.grid[0]) * i.grid[0], s = this.containment ? r - this.offset.click.left >= this.containment[0] && r - this.offset.click.left <= this.containment[2] ? r : r - this.offset.click.left >= this.containment[0] ? r - i.grid[0] : r + i.grid[0] : r)), {
          top: o - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (this.cssPosition === 'fixed' ? -this.scrollParent.scrollTop() : a ? 0 : u.scrollTop()),
          left: s - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (this.cssPosition === 'fixed' ? -this.scrollParent.scrollLeft() : a ? 0 : u.scrollLeft())
        }
      },
      _rearrange: function (e, t, n, r) {
        n ? n[0].appendChild(this.placeholder[0]) : t.item[0].parentNode.insertBefore(this.placeholder[0], this.direction === 'down' ? t.item[0] : t.item[0].nextSibling), this.counter = this.counter ? ++this.counter : 1
        var i = this.counter
        this._delay(function () { i === this.counter && this.refreshPositions(!r) })
      },
      _clear: function (t, n) {
        this.reverting = !1
        var r, i = []
        !this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null
        if (this.helper[0] === this.currentItem[0]) {
          for (r in this._storedCSS)
            if (this._storedCSS[r] === 'auto' || this._storedCSS[r] === 'static') this._storedCSS[r] = ''
          this.currentItem.css(this._storedCSS).removeClass('ui-sortable-helper')
        } else this.currentItem.show()
        this.fromOutside && !n && i.push(function (e) { this._trigger('receive', e, this._uiHash(this.fromOutside)) }), (this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not('.ui-sortable-helper')[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !n && i.push(function (e) { this._trigger('update', e, this._uiHash()) }), this !== this.currentContainer && (n || (i.push(function (e) { this._trigger('remove', e, this._uiHash()) }), i.push(function (e) { return function (t) { e._trigger('receive', t, this._uiHash(this)) } }.call(this, this.currentContainer)), i.push(function (e) { return function (t) { e._trigger('update', t, this._uiHash(this)) } }.call(this, this.currentContainer))))
        for (r = this.containers.length - 1; r >= 0; r--) n || i.push(function (e) { return function (t) { e._trigger('deactivate', t, this._uiHash(this)) } }.call(this, this.containers[r])), this.containers[r].containerCache.over && (i.push(function (e) { return function (t) { e._trigger('out', t, this._uiHash(this)) } }.call(this, this.containers[r])), this.containers[r].containerCache.over = 0)
        this._storedCursor && e('body').css('cursor', this._storedCursor), this._storedOpacity && this.helper.css('opacity', this._storedOpacity), this._storedZIndex && this.helper.css('zIndex', this._storedZIndex === 'auto' ? '' : this._storedZIndex), this.dragging = !1
        if (this.cancelHelperRemoval) {
          if (!n) {
            this._trigger('beforeStop', t, this._uiHash())
            for (r = 0; r < i.length; r++) i[r].call(this, t)
            this._trigger('stop', t, this._uiHash())
          }
          return this.fromOutside = !1, !1
        }
        n || this._trigger('beforeStop', t, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper = null
        if (!n) {
          for (r = 0; r < i.length; r++) i[r].call(this, t)
          this._trigger('stop', t, this._uiHash())
        }
        return this.fromOutside = !1, !0
      },
      _trigger: function () { e.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel() },
      _uiHash: function (t) {
        var n = t || this
        return {
          helper: n.helper,
          placeholder: n.placeholder || e([]),
          position: n.position,
          originalPosition: n.originalPosition,
          offset: n.positionAbs,
          item: n.currentItem,
          sender: t ? t.element : null
        }
      }
    })
  })(jQuery)
}
