export default {
  /**
     * 根据文件名称返回文件类型
     * @param {string} fileName 文件名称
     * @return {string} 文件类型
     * */
  getFileTypeByName(fileName) {
    return fileName.indexOf(".") > 0 ? fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) : "";
  },
  /**
     * css键值对对象转换为css字符串
     * @param {object} cssText css键值对对象
     * @return {string} css字符串
     * */
  cssObj2String(cssText) {
    var ret = ";";

    for (var i in cssText) {
      if (cssText.hasOwnProperty(i)) {
        ret += i + ":" + cssText[i] + ";";
      }
    }

    return ret;
  },
  /**
     * 将url的参数转换为对象
     * @param {String} url url字符串，默认不传，如果传的话将作为url解析
     */
  getUrlParamObject(url, decode) {
    var ret = {};
    var paramStr = (url || location.href).split("?")[1];

    if (decode) {
      paramStr = decodeURIComponent(paramStr);
    }

    var paramArr = paramStr && paramStr.split("&");

    if (!this.isNullOrEmpty(paramArr)) {
      var itemArr = [];

      paramArr.forEach(item => {
        itemArr = item.split("=");

        ret[itemArr[0]] = itemArr[1];
      });
    }

    return ret;
  },
  /**
     * 根据对象返回对象的formData
     * @param {object} obj 数据对象
     * @return {FormData} 对象formData格式化后的对象
     * */
  getFormDataByObject(obj) {
    var data = new FormData();

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        data.append(i, obj[i]);
      }
    }

    return data;
  },
  /**
     * 将参数对象转换为url参数字符串
     * @param {object} dataParam 参数对象
     * @param {boolean} partParam 是否是部分参数，即这部分参数之前是否已经有参数拼接在url后面了，用于确定结果字符串前面是"?"还是"&"
     * @return {string} url参数字符串
     * */
  transObjectToUrl(dataParam, partParam) {
    var ret = partParam ? "&" : "?";

    for (var i in dataParam) {
      if (dataParam.hasOwnProperty(i)) {
        ret += i + "=" + dataParam[i] + "&";
      }
    }

    return ret.substring(0, ret.length - 1);
  },
  /**
     * 判断一个对象是否是空对象，只用于判断JSON对象，其余对象将返回false
     * @param {object} obj 一个json对象
     * @return {boolean} true:是空对象，false不是空对象
     * */
  isEmptyObject(obj) {
    if (this.getObjType(obj) === "object") {
      for (var key in obj) {
        if (key && obj.hasOwnProperty(key)) {
          return false;
        }
      }

      return true;
    }
    else {
      return false;
    }
  },
  /**
     * 获取一个对象的类型
     * @param {object} obj 一个对象
     * @return {string} 对象的类型，原本是[object Object]只返回了后面的Object，并且小写
     * */
  getObjType(obj) {
    var objTypeString = Object.prototype.toString.call(obj);

    return objTypeString.substring(1, objTypeString.length - 1).split(" ")[1].toLocaleLowerCase();
  },
  /**
     * 合并两个对象的属性值，将源对象的属性与值合并到目标对象中，源对象中的属性值覆盖目标对象的属性值
     * @param {object} target 合并的目标对象
     * @param {object} source 合并的源对象
     * @param {boolean} deep 是否启用深层合并，如果采用深层合并，那么源对象中的子对象与数组对象将会去遍历，然后合并到目标对象中
     * @return {object} object 在目标对象的基础上返回合并后的对象
     * */
  extend(target, source, deep) {
    target = target || {};
    var sType = typeof source, i = 1, options;

    if (sType === "undefined" || sType === "boolean") {
      deep = sType === "boolean" ? source : false;
      source = target;
      target = this;
    }

    if (typeof source !== "object" && this.getObjType(source) !== "function") {
      source = {};
    }

    var src = null, copy = null;

    while (i <= 2) {
      options = i == 1 ? source : target;

      if (!this.isNullOrEmpty(options)) { //如果对象不为空
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            src = target[key];//目标对象的某一个子属性
            copy = options[key];//将要复制的属性

            if (target === copy) { //如果要复制的属性是目标对象，则不复制，并且进入下一个循环
              continue;
            }

            if (deep && !this.isNullOrEmpty(copy) && typeof copy === "object" && !copy.nodeType) { //如果是深拷贝，并且要拷贝的对象不为空
              target[key] = this.extend(src || (copy.length != null ? [] : {}), copy, deep);
            }
            else if (copy !== undefined) {
              target[key] = copy;
            }
          }
        }
      }

      i++;
    }

    return target;
  },
  /**
     * 判断一个对象是否是null|undefined|{}|""|[]
     * @param {object} obj 一个对象
     * @return {boolean} true:是空对象，false不是空对象
     * */
  isNullOrEmpty(obj) {
    var objType = this.getObjType(obj);

    return objType === "null"
      || objType === "undefined"
      || (objType === "object" && this.isEmptyObject(obj))
      || (objType === "array" && obj.length == 0)
      || obj === "";
  },
  /**
     * 将字节转换为对应的最大的单位
     * @param {number} byte 字节数
     * @return {string} 对应的单位
     * */
  byte2MaxUnit(byte) {
    var ret = "0 B";

    if (byte && byte != "0") {
      var fileSize = parseFloat(byte),
        model = 0,
        unitArr = ["B", "KB", "MB", "GB", "TB"];

      for (var i = unitArr.length - 1; i >= 0; i--) {
        model = fileSize / Math.pow(1024, i);
        ret = model >= 1 ? (model.toFixed(2).split(".")[1] == "00" ? model.toFixed(0) : model.toFixed(2)) + unitArr[i] : false;

        if (ret) break;
      }
    }

    return ret;
  },
  /**
     * 根据子节点以及父节点类名称判断子节点是否有类名对应的父节点
     * @param {HTMLElement} node 子节点
     * @param {String} className 父节点类名称
     * @param {Boolean} result 结果
     */
  isParentByParentClassName(node, className, result) {
    if (node && node.parentNode && !node.parentNode.tagName.toLocaleLowerCase().match(/(body|document|html|window)/i)) {
      if (node.parentNode.className.toLocaleLowerCase() === className.toLocaleLowerCase()) {
        result = true;
      }
      else {
        node = node.parentNode;

        return this.isParentByParentClassName(node, className, result);
      }
    }
    else {
      result = false;
    }

    return result;
  },
  /**
     * 根据子节点以及父节点类名称获取父节点集合
     * @param {HTMLElement} node 子节点
     * @param {String} className 父节点类名称
     * @param {Array} result 结果集
     */
  getParentsNodeByParentClassName(node, className, result) {
    result = result || [];

    if (node && node.parentNode && !node.parentNode.tagName.toLocaleLowerCase().match(/(body|document|html|window)/i)) {
      if (node.parentNode.className.toLocaleLowerCase() === className.toLocaleLowerCase()) {
        result.push(node.parentNode);
      }

      node = node.parentNode;

      return this.getParentsNodeByParentClassName(node, className, result);
    }
    else {
      return result;
    }
  },
  addClass(elem, className) {
    if (elem.className.indexOf(className) < 0) {
      elem.className += " " + className;
    }

    return elem;
  },
  removeClass(elem, className) {
    elem.className = this.replaceAll(elem.className, className, "");

    return elem;
  },
  getBrowserType() {
    var ret = {};
    var browserName = navigator.userAgent.toLowerCase();

    if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
      ret.type = "ie";
      ret.version = browserName.match(/msie ([\d.]+)/)[1];
    }
    else if (/firefox/i.test(browserName)) {
      ret.type = "firefox";
      ret.version = browserName.match(/firefox\/([\d.]+)/)[1];
    }
    else if (/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)) {
      ret.type = "chrome";
      ret.version = browserName.match(/chrome\/([\d.]+)/)[1];
    }
    else if (/opera/i.test(browserName)) {
      ret.type = "opera";
      ret.version = browserName.match(/opera.([\d.]+)/)[1];
    }
    else if (/webkit/i.test(browserName) && !(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))) {
      ret.type = "safari";
      ret.version = browserName.match(/safari.([\d.]+)/)[1];
    }
    else {
      ret.type = "unknown";
      ret.version = "";
    }

    return ret;
  },
  /**
     * 加载样式文件
     * @param {String} src css文件的路径
     */
  loadCssFile(src) {
    var link = document.createElement("link");

    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", src);

    return link;
  },
  /**
     * 将时间戳转换为时间字符串
     * @param {Number | String} stamp 时间戳数字或字符串
     * @param {String} type 要转换为哪种格式的字符串，默认为"yyyy-mm-dd"
     * @param {String} connector 连接字符串，"cn|-/"  cn（年月日）
     */
  getDateStringByStamp(stamp, type, connector) {
    var date = /(-|\/)/g.test(stamp) ? new Date(stamp) : new Date(parseInt(stamp)),
      connector = connector || "-",
      dateStr = "";
    var month = date.getMonth() + 1,
      _date = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      seconds = date.getSeconds();

    if (month.toString().length == 1) {
      month = "0" + month;
    }
    if (_date.toString().length == 1) {
      _date = "0" + _date;
    }
    if (hour.toString().length == 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length == 1) {
      minute = "0" + minute;
    }
    if (seconds.toString().length == 1) {
      seconds = "0" + seconds;
    }

    type = type || "yyyy-mm-dd";
    type = type.toLowerCase();

    if (type == "yyyy-mm-dd hh:mm:ss") {
      dateStr = date.getFullYear() + (connector === "cn" ? " 年 " : connector) + month + (connector === "cn" ? " 月 " : connector) + _date + (connector === "cn" ? " 日 " : " ") +
        hour + ":" + minute + ":" + seconds;
    }
    else if (type == "yyyy-mm-dd") {
      dateStr = date.getFullYear() + (connector === "cn" ? " 年 " : connector) + month + (connector === "cn" ? " 月 " : connector) + _date + (connector === "cn" ? " 日" : "");
    }
    else if (type == "hh:mm:ss") {
      dateStr = hour + ":" + minute + ":" + seconds;
    }
    else if (type == "hh:mm") {
      dateStr = hour + ":" + minute;
    }
    else {
      dateStr = date;
    }

    return dateStr;
  },
  /**
     * 克隆对象
     * @param {any} obj 任意对象
     */
  clone(obj) {
    var _ret;

    if (typeof obj === "object") {
      if (obj === null) {
        _ret = null;
      }
      else {
        if (obj instanceof Array) {
          _ret = [];

          for (var i = 0, len = obj.length; i < len; i++) {
            _ret.push(this.clone(obj[i]));
          }
        }
        else {
          _ret = {};

          for (var j in obj) {
            _ret[j] = this.clone(obj[j]);
          }
        }
      }
    }
    else {
      _ret = obj;
    }

    return _ret;
  },
  getIndex(arr, condition) {
    if (arr.length === 0) return -1;

    var _ret = -1;

    arr.forEach((item, index) => {
      if (condition(item, index)) {
        _ret = index;
      }
    });

    return _ret;
  },
  every(arr, condition) {
    if (arr.length === 0) return true;

    var _ret = true;

    arr.forEach((item, index) => {
      if (!condition(item, index)) {
        _ret = false;
      }
    });

    return _ret;
  },
  /**
     * 将缓存存入sessionStorage
     * @param {String} key 缓存对应的键
     * @param {Object | String} session 缓存内容
     */
  setSession(key, session) {
    var s = session,
      sType = this.getObjType(session);

    if (sType === "object") {
      s = JSON.stringify(s);
    }
    else if (sType === "function") {
      console.error("方法不能存入缓存");
    }

    sessionStorage.setItem(key, s);
  },
  getHoverColor(color, deeper, changeVal) {
    changeVal = changeVal || 2;

    var colorNum = color.split("#")[1];
    var colorNum1 = parseInt(colorNum.substring(0, 2), 16),
      colorNum2 = parseInt(colorNum.substring(2, 4), 16),
      colorNum3 = parseInt(colorNum.substring(4, 6), 16);

    colorNum1 = colorNum1 - changeVal * 16;
    colorNum2 = colorNum2 - changeVal * 16;
    colorNum3 = colorNum3 - changeVal * 16;

    if (colorNum1 > 255) {
      colorNum1 = 255;
    }

    if (colorNum2 > 255) {
      colorNum2 = 255;
    }

    if (colorNum3 > 255) {
      colorNum3 = 255;
    }

    return "#" + colorNum1.toString(16) + colorNum2.toString(16) + colorNum3.toString(16);
  },
  /**
     * 格式化数组的数据
     */
  formatArrayData: {
    /**
         * 将数组数据格式化为跨行表格的数据
         * @param {Array} data 数据来源
         * @param {String} childStr 子节点的键字符串
         * @param {Array} result 结果集
         * @param {Array} row 行数据
         */
    toRowSpanTableData(data, childStr, result, row) {
      result = result || [];
      childStr = childStr || "children";
      row = row || [];

      if (data && data.length > 0) {
        data.forEach((item, index) => {
          if (result.loopEnd) {
            row = [];
          }

          for (var i in item) {
            if (item.hasOwnProperty(i)) {
              if (i !== childStr && i !== "rowSpan") {
                row.push({
                  key: i,
                  rowSpan: item.rowSpan,
                  value: item[i] === null ? "-" : item[i]
                });
              }
            }
          }

          /**如果该节点没有指定名称对应的子节点 */
          if (item[childStr] === undefined || item[childStr].length === 0) {
            result.loopEnd = true;//标志位，表示循环到了最底层，循环结束
            result.push(row);//将行数据推入结果集中
          }
          /**如果找到了指定名称对应的子节点 */
          else {
            result.loopEnd = false;//标志位，表示还未循环到最底层
            /**继续循环 */
            this.toRowSpanTableData(item[childStr], childStr, result, row);
          }
        });
      }

      return result;
    }
  },
  layer: {
    create(opts) {
      opts = opts || {};

      var bgColor = opts.bgColor || "#666",
        opacity = opts.opacity || "0.3",
        elem = opts.elem || document.body,
        zIndex = opts.zIndex || 9999,
        id = opts.id || Math.random();

      var layer = document.createElement("div");

      layer.innerHTML = `<div class="block-layer" style="width:100%;height:100%;position:absolute;top:0;left:0;right:0;bottom:0;
                background-color:${bgColor};opacity:${opacity};z-index:${zIndex};cursor:wait;" layer-id="${id}"></div>`;

      elem.appendChild(layer.children[0]);

      return layer;
    },
    remove(opts) {
      opts = opts || {};

      var elem = opts.elem || document.body,
        layer = elem.querySelector(".block-layer");

      if (opts.id) {
        layer = elem.querySelector(".block-layer[layer-id='" + opts.id + "']");
      }

      if (!layer) return;

      elem.removeChild(layer);
    }
  },
  checkValid: {
    isEmail: email => {
      return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(email);
    },
    isIp: ip => {
      return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(ip);
    },
    isPosInteger(number) {
      if (isNaN(number)) {
        return false;
      }

      if (number.toString().indexOf("e") >= 0) {
        return false;
      }

      if (number.toString().indexOf("-") === 0) {
        return false;
      }

      return true;
    }
  },
  formatNumber(num, str) {
    if (isNaN(num)) {
      console.error("参数必须是数字！");

      return;
    }

    if (num < 1000 || !num) return num;

    str = str || ",";

    var result = "";
    var isFloat = false;
    var _integer,
      _float;

    num = num.toString();

    if (num.indexOf(".") > 0) {
      isFloat = true;

      let numArr = num.split(".");

      _integer = numArr[0];
      _float = numArr[1];
    }
    else {
      _integer = num;
    }

    var _length = _integer.length;

    for (var i = 1; i <= _length; i++) {
      result += _integer[i - 1];

      if (i !== 0 && (_length - i) % 3 === 0 && i != _length) {
        result += ",";
      }
    }

    return isFloat ? (result + "." + _float) : result;
  },
  xhr: {
    getRequest: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);

      if (r != null) {
        return unescape(r[2]);
      }

      return null;
    },
    joinUrlQuery: (url, data) => {
      if (!data) {
        return url;
      }

      const keys = Object.keys(data),
        joinChar = url.indexOf("?") > 0 ? "&" : "?";

      const query = keys.reduce((prev, key) => {
        const value = data[key];

        if (value == null) {
          return prev;
        }

        const valueStr = encodeURIComponent(key) + "=" + encodeURIComponent(value.toString());

        return prev ? (prev + "&" + valueStr) : valueStr;
      }, "");

      return query ? (url + joinChar + query) : url;
    },
    send: function (opts) {
      if (typeof opts === "string") {
        opts = {
          type: "GET",
          url: opts
        };
      }

      return new Promise((resolve, reject) => {

        if (opts.type.toUpperCase() === "GET") {
          opts.url = this.joinUrlQuery(opts.url, opts.data);
          opts.data = null;
        }

        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
          }

          if (xhr.status === 200) {
            try {
              var result = JSON.parse(xhr.responseText);

              if (result.code === 200) {
                resolve(result.data);
              }
              else {
                reject({ code: result.code, msg: result.msg });
              }
            }
            catch (err) {
              reject({ state: "-2", msg: "无法转换 JSON 数据！", response: xhr.responseText });
            }
          }
          else {
            reject({ state: xhr.status, msg: xhr.statusText });
          }
        };

        xhr.open(opts.type, opts.url, opts.async || true);
        xhr.setRequestHeader("Content-Type", "application/json");

        if (opts.header) {
          for (var i in opts.header) {
            xhr.setRequestHeader(i, opts.header[i]);
          }
        }
        // xhr.setRequestHeader('isphere-access-token', this.userId);
        xhr.send(opts.data);
      });
    }
  }
};