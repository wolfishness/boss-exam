
/**
 * common request util
 * 从coookies 获取公共数据
 * @param params
 * @returns {{head: {deviceType, crypt, businessType, version, deviceId, token}, body: *}}
 */
export function commonRequestUtil(params) {
    return {
      requestHead: {
        // version: head.version,
        // token: getToken(),
        // businessType: head.businessType,
        // deviceId: head.deviceId,
        // deviceType: head.deviceType,
        // crypt: head.crypt
      },
      body: params
    }
  }
