/**
 * 身份证校验
 */
export const checkIdcard = idCard => {
  if (idCard && idCard.slice(17, 18) == 'x') {
    idCard = idCard.replace('x', 'X')
    idCard = idCard.toString()
  }
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  }
  var tip = ''
  var pass = true

  if (!idCard) {
    tip = '身份证号不能为空'
    pass = false
  } else if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(idCard)) {
    tip = '身份证号格式错误'
    pass = false
  } else if (!city[idCard.substr(0, 2)]) {
    tip = '地址编码错误'
    pass = false
  } else {
    // 18位身份证需要验证最后一位校验位
    if (idCard.length == 18) {
      idCard = idCard.split('')
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      var sum = 0
      var ai = 0
      var wi = 0
      for (var i = 0; i < 17; i++) {
        ai = idCard[i]
        wi = factor[i]
        sum += ai * wi
      }
      // var last = parity[sum % 11]
      if (parity[sum % 11] != idCard[17]) {
        tip = '身份证号格式错误'
        pass = false
      }
    }
  }
  var obj = {
    status: pass,
    msg: tip
  }
  if (!pass) {
    return obj
  }
  return obj
}

/**
 * @检查证件合法性
 */
export const checkIdcardValid = (cardtype_id, cardnum) => {
  const result = {}
  result.status = true
  result.errtips = ''
  if (!cardnum) {
    result.status = false
    result.errtips = '请输入证件号码'
  } else {
    // 2护照 '/^[a-z0-9]{5,17}$/i'
    // 3港澳通行证、4台湾通行证、5军官证、6士兵证 '/^[a-z0-9]{5,12}$/i'
    switch (cardtype_id) {
      case 1:
        if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/g.test(cardnum)) {
          result.status = false
          result.errtips = '身份证格式错误'
        }
        break
      case 2:
        if (!/^[A-Z0-9]{5,17}$/g.test(cardnum)) {
          result.status = false
          result.errtips = '护照格式错误'
        }
        break
      case 3:
        if (!/^[HM]\d{8}$/g.test(cardnum)) {
          result.status = false
          result.errtips = '港澳居民来往内地通行证格式错误'
        }
        break
      case 4:
        if (!/^[0-9]{8}$/.test(cardnum)) {
          result.status = false
          result.errtips = '台湾居民来往大陆通行证格式错误'
        }
        break
      case 5:
        if (!/^[0-9]{7}$/.test(cardnum)) {
          result.status = false
          result.errtips = '军官证格式错误'
        }
        break
      case 6:
        if (!/^[a-z0-9]{5,12}$/i.test(cardnum)) {
          result.status = false
          result.errtips = '证件格式错误'
        }
        break
    }
  }
  return result
}

/**
 * 根据身份证号计算年龄
 */
export const calcIDCard = (IDCard) => {
  // 获取用户身份证号码
  var userCard = IDCard.toString()
  // 获取出生年月日
  var yearBirth = Number(userCard.substring(6, 10)) // 出生年份
  var monthBirth = Number(userCard.substring(10, 12)) // 出生月份
  var dayBirth = Number(userCard.substring(12, 14)) // 出生日
  // 获取当前年月日并计算年龄
  var myDate = new Date()
  var yearNow = Number(myDate.getFullYear()) // 当前年份
  var monthNow = Number(myDate.getMonth() + 1) // 当前月份
  var dayNow = Number(myDate.getDate()) // 当前日
  var age = yearNow - yearBirth //
  // 6岁
  if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
    age--
  }
  // 6岁半算作7岁
  // if (monthNow > monthBirth || (monthNow == monthBirth && dayNow > dayBirth)) {
  //   age++;
  // }
  return age
}
/**
 *
 * @param {*} val
 */
export const calcBirthAge = (birthday) => {
  birthday = birthday.split("-")
  const yearBirth = birthday[0]
  const monthBirth = birthday[1]
  const dayBirth = birthday[2]
  // 获取当前年月日并计算年龄
  var myDate = new Date()
  var yearNow = Number(myDate.getFullYear()) // 当前年份
  var monthNow = Number(myDate.getMonth() + 1) // 当前月份
  var dayNow = Number(myDate.getDate()) // 当前日
  var age = yearNow - yearBirth //
  // 6岁
  if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
    age--
  }
  // 6岁半算作7岁
  // if (monthNow > monthBirth || (monthNow == monthBirth && dayNow > dayBirth)) {
  //   age++;
  // }

  return age
}

/**
 * 手机号校验
 */
export const phoneReg = (val) => {
  const PHONE_REG = /^1\d{10}$/
  var tip = ''
  var pass = true
  if (!val) {
    tip = '手机号不能为空'
    pass = false
  } else if (!PHONE_REG.test(val)) {
    tip = '手机号格式错误'
    pass = false
  }
  var obj = {
    status: pass,
    errtips: tip
  }
  return obj
}
