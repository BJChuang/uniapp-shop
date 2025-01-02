// export const baseUrl = '/api'
export const baseUrl = 'https://www.amazontech.cc/api'
// export const baseUrl = 'http://pc.qingwuit.com'
const config = {
	path:baseUrl,
	requestUrl:baseUrl,
	originPath:'https://www.amazontech.cc',
	ws:()=>{
		if(baseUrl.indexOf('https://') != -1) return baseUrl.replace('https://','wss://')+'/ws'
		return baseUrl.replace('http://','ws://')+'/ws'
	}
}

export default config