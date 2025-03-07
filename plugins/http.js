import config from "./config.js";
function request(url, data, method = 'get',customUrl = 0) {
	let urlLink = config.requestUrl + url
	// if(customUrl == 1) urlLink = '/api/' + url
	// if(customUrl == 2) urlLink = '/api/' + url
	let defaultOpt = {
		url: urlLink,
		data: data,
		method: method,
		header: method == 'get' ? {
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		} : {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		dataType: 'json',                                                                                                                                                                                                                                                                                                                                     
	}


	let token = uni.getStorageSync('token');
	// let token = sessionStorage.getItem('token')
	if (token != undefined && token != null && token != '') {
		defaultOpt.header.Authorization = 'Bearer ' + token;
	}

	let promise = new Promise((resolve, reject) => {
		uni.request(defaultOpt).then((res) => {
			if(res.statusCode != 200){
				// console.log(res)
				if(res.data && res.data.message){
					return uni.showToast({
						title:res.data.message,
						icon:'none',
						position:'bottom'
					})
				}
				if(res.data && res.data.msg){
					return uni.showToast({
						title:res.data.msg,
						icon:'none',
						position:'bottom'
					})
				}
				return uni.showToast({
					title:res.errMsg,
					icon:'none',
					position:'bottom'
				})
			}
			if(res.data.code == 401){
				uni.showToast({
					title:res.data.msg,
					icon:'none',
					position:'bottom'
				})
				uni.navigateTo({
					url: '/pages/auth/login'
				})
				return
			}else if(res.data.code == 500){
				uni.showToast({
					title:res.data.msg,
					icon:'none',
					position:'bottom'
				})
				reject()
				return
			}else{
				resolve(res.data)
			}

		}).catch((resp) => {
			reject(resp)
		})
	})
	return promise
}

//wangditor 中断字符串
const editSplitStr = '##qingwuit##'

export const R = {
	get: (url, data , customUrl = 0) => {
		return request(url, data, 'get', customUrl)
	},
	post: (url, data, customUrl = 0) => {
		return request(url, data, 'post', customUrl)
	},
	put: (url, data, customUrl = 0) => {
		return request(url, data, 'put', customUrl)
	},
	del: (url, data, customUrl = 0) => {
		return request(url, data, 'delete', customUrl)
	},
	/*判断是否为空*/
	isEmpty(str){
		if (str === '' || str === null || str === undefined) {
			return true;
		}
		return false;
	},

	// 格式化金额
	formatFloat(value, length = 2){
		let tempNum = 0;
		let s, temp;
		let s1 = value + "";
		let start = s1.indexOf(".");
		if(start == -1) s1 += '.00'
		start = s1.indexOf(".");
		if (s1.substr(start + length + 1, 1) >= 5) {
			tempNum = 1;
		}
		temp = Math.pow(10, length);
		s = Math.floor(value * temp) + tempNum;
		return s / temp;
	},
	
	toast(title){
		uni.showToast({
			icon:'none',
			title:title,
			position:'bottom',
		})
	},
	
	nav(url,type=0){
		if(type == 0){
			uni.navigateTo({
				url:url
			})
		}else if(type == 1){
			uni.switchTab({
				url:url
			})
		}else if(type == 3){
			uni.navigateBack({
				
			})
		}
	},
	
	formatUrl(url){
		if(!url || url == '') return undefined
		if(url.indexOf('http://') == -1 && url.indexOf('https://') == -1) return 'https://www.cnmall.io'+url
		console.log(url)
		return url
		
	},
	
	// wangeditor数据处理
	editorHandle(data,index=0){
	    if(!data && index==0) return '';
	    if(!data && index==1) return {};
	    const htmls = data.split(editSplitStr)
	    if(htmls.length == 2){
	        if(index == 1) return JSON.parse(htmls[index])
			htmls[index] = htmls[index].replace(/<video /gi,'<video mode="aspectFill" style="width:100%;display:block;object-fit:contain" ')
			htmls[index] = htmls[index].replace(/style=""/gi,'')
			return htmls[index].replace(/<img src="\/storage\/editor\//gi,'<img style="width:100%;display:block;object-fit:contain" mode="aspectFill" src="'+ config.originPath +'/storage/editor/')
			
		}
	    return ''
	},
	
	// wangeditor数据处理
	editorHandle2(data,index=0){
		if(!data) return ''
		data = data.replace(/style=""/gi,'')
		return data.replace(/<img /gi,'<img mode="aspectFill" style="width:100%;display:block;object-fit:contain" ')
		return data.replace(/<video /gi,'<video mode="aspectFill" style="width:100%;display:block;object-fit:contain" ')
	},
	
	// 格式化时间戳
	formatTime(timeVal,type=true){
	    var d = Math.floor(timeVal / (24 * 3600));
	    var h = Math.floor((timeVal - 24 * 3600 * d) / 3600);
	    var m = Math.floor((timeVal - 24 * 3600 * d - h * 3600) / 60);
	    var s = Math.floor((timeVal - 24 * 3600 * d - h * 3600 - m * 60));
	    // console.log(d + '天' + hh + '时' + mm + '分' + ss + '秒'); // 打印出转换后的时间
	    //  当时分秒小于10的时候补0
	    var hh = h < 10 ? '0' + h : h;
	    var mm = m < 10 ? '0' + m : m;
	    var ss = s < 10 ? '0' + s : s;
	    // this.seckills.format_time =  d + '天' + hh + '时' + mm + '分' + ss + '秒';
	    if(!type) return  hh + ' : ' + mm + ' : ' + ss 
	    return d + ' 天 ' + hh + ' 时 ' + mm + ' 分 ' + ss + ' 秒'
	}
}
