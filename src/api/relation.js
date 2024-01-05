import request from "@/utils/request"


const baseApi = "/relation"

/**
 * 获取好友列表
 * @param {Object} params
 * @param {String} params.user_id         用户id
 * @returns {Promise<Object>}
 */
export function friendListApi(params) {
  return request({
    url: `${baseApi}/friend_list`,
    method: "get",
    params
  })
}

/**
 * 添加黑名单
 * @param {Object} data
 * @param {String} data.user_id         用户id
 * @param {String} data.friend_id       好友id
 * @returns {Promise<Object>}
 */
export function addBlackListApi(data) {
  return request({
    url: `${baseApi}/add_blacklist`,
    method: "post",
    data
  })
}

/**
 * 添加好友
 * @param {Object} data
 * @param {String} data.user_id         用户id
 * @param {String} data.friend_id       好友id
 * @returns {Promise<Object>}
 */
export function addFriendApi(data) {
  return request({
    url: `${baseApi}/add_friend`,
    method: "post",
    data
  })
}

/**
 * 获取黑名单列表
 * @param {Object} params
 * @param {String} params.user_id         用户id
 * @returns {Promise<Object>}
 */
export function blackListApi(params) {
  return request({
    url: `${baseApi}/blacklist`,
    method: "get",
    params
  })
}

/**
 * 确认添加好友
 * @param {Object} data
 * @param {String} data.user_id         用户id
 * @param {String} data.friend_id       好友id
 * @returns {Promise<Object>}
 */
export function confirmAddFriendApi(data) {
  return request({
    url: `${baseApi}/confirm_friend`,
    method: "post",
    data
  })
}

/**
 * 删除黑名单
 * @param {Object} data
 * @param {String} data.user_id         用户id
 * @param {String} data.friend_id       好友id
 * @returns {Promise<Object>}
 */
export function deleteBlackListApi(data) {
  return request({
    url: `${baseApi}/delete_blacklist`,
    method: "post",
    data
  })
}

/**
 * 删除好友
 * @param {Object} data
 * @param {String} data.user_id         用户id
 * @param {String} data.friend_id       好友id
 * @returns {Promise<Object>}
 */
export function deleteFriendApi(data) {
  return request({
    url: `${baseApi}/delete_friend`,
    method: "post",
    data
  })
}