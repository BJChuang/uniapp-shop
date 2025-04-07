// export const baseUrl = '/api'
// export const baseUrl = 'https://www.amazontech.cc/api'
export const baseUrl = 'https://www.amazonshop.io/api'
const config = {
	path:baseUrl,
	requestUrl:baseUrl,
	originPath:'https://www.amazonshop.io',
	ws:()=>{
		if(baseUrl.indexOf('https://') != -1) return baseUrl.replace('https://','wss://')+'/ws'
		return baseUrl.replace('http://','ws://')+'/ws'
	}
}

export default config