<script>
	import {
		R
	} from '@/plugins/http.js' // 请求方式中间件
	// import {
	// 	debuggerModule,
	// 	installDebugger
	// } from 'uni_modules/imengyu-IMDebuggerWindow/common/debuggerExtern.js'

	import silenceUpdate from '@/uni_modules/rt-uni-update/js_sdk/silence-update.js' //引入静默更新
	export default {
		onLaunch: function() {
			// @ 需求：每次打开都输入密码
			uni.clearStorageSync()
			if (process.env.NODE_ENV === 'development')
				installDebugger({
					enableRequestInterceptor: false, //默认为false，指示是否拦截网络请求，参见下一条
					showGlobalFloatWindow: true //默认为true，指定是否添加一个全局的调试按钮，点击可跳转至窗口
				});
			// 根据情况获取openid
			let isOpenId = false
			// #ifdef H5
			let ua = navigator.userAgent.toLowerCase(); //判断是不是微信内核浏览器
			if (ua.indexOf('micromessenger') !== -1) isOpenId = true
			// #endif
			// 如果是微信小程序也需要获取Openid
			// #ifdef MP-WEIXIN
			isOpenId = true
			// #endif

			// 是否需要openid
			//* 这里暂时没地方测试
			if (isOpenId) {
				console.log(123)
				let openid = uni.getStorageSync('openid');
				//校验本地有没有openid
				if (!openid) {
					//检测url里面是否携带code
					// #ifdef H5
					if (window.location.href.indexOf('?code=') !== -1 || window.location.href.indexOf('&code=') !== -
						1) {
						let code;
						if (window.location.href.indexOf('?code=') !== -1) {
							code = window.location.href.split('?code=')[1].split('&')[0];
						} else {
							code = window.location.href.split('&code=')[1].split('&')[0];
						}
						R.get('/openid/code', {
							payment_name: 'wechat',
							device: 'mp',
							code: code
						}, 1).then(res => {
							console.log(res)
							if (res.data.openid) uni.setStorageSync('openid', res.data.openid)
						})
						//请求后端网络请求
					} else {
						//重点 这里getWxAppid这个是微信公众号的appid
						window.location.href =
							'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
							'APPID' +
							'&redirect_uri=' +
							location.protocol + '//' + location.host +
							'&response_type=code&scope=snsapi_userinfo#wechat_redirect';
					}
					// #endif
					// #ifdef MP-WEIXIN
					// 小程序的获取openid
					uni.login({
						timeout: 10000,
						provider: 'weixin', //如果是uniapp，在这里需要标明平台的类型，支持的参数请查阅uniapp官网的uni.login()文档
						success: (res) => {
							//登陆成功的回调
							console.log(res)
							R.get("openid/code", {
								code: res.code,
								device: "mini",
								payment_name: "wechat"
							}, 1).then(e => {
								if (e.data && e.data.openid) uni.setStorageSync('openid', e.data
									.openid)
							})
							// uni.request({  
							//       url: 'https://api.weixin.qq.com/sns/jscode2session',  
							//       method:'GET',  
							//       data: {  
							// 		  grant_type:'authorization_code',
							//           appid: 'wx xxxxxxxxxxxx,       //你的小程序的APPID  
							//           secret: 'xxxxxxxxxxxxx',       //你的小程序的secret,  
							//           js_code: res.code       //wx.login 登录成功后的code  
							//       },  
							//       success: (e) => {  
							//           console.log(e)
							// 		  if(e.data && e.data.openid) uni.setStorageSync('openid',e.data.openid)
							//       }  
							// 	  fail: (err) => {
							// 		console.log(err)
							// 	  }
							// })
						},
						fail: (err) => {
							R.toast(JONS.stringify(err))
						}
					})
					// #endif
				}
			}

		},
		onShow: function() {



		},
		onHide: function() {
			console.log('')
		},
		onUnload: function() {
			console.log('')
			uni.clearStorageSync()
		}
	}
</script>

<style lang="scss">
	@import url('plugins/fonts/iconfont.css');

	/* 兼容app刘海顶部 */
	page {
		background: $uni-bg-color-grey;
		height: 100%;
	}

	.qwshop {
		&.top_bar {
			/*  #ifdef APP || H5 */
			padding-top: var(--status-bar-height);
			/* #endif */
		}

		.top_bars {
			padding-top: var(--status-bar-height);
		}

		&.bt_bar {
			padding-bottom: 100rpx;
		}
	}

	.ct30 {
		margin: 0 $block-margin;
	}

	.pd30 {
		padding: $block-padding;
	}

	.pd20 {
		padding: 20rpx;
	}

	.pd10 {
		padding: 10rpx;
	}

	.br20 {
		border-radius: $block-radius;
	}

	// 按钮
	.list_b_btn {
		background: linear-gradient(to left, $primary, $gradient);
		color: #fff;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		margin-top: 40rpx;
		border-radius: 15rpx;

		&.fixed {
			position: fixed;
			bottom: 30rpx;
			width: 90%;
			z-index: 500;
		}
	}

	.back_icon {
		position: absolute;
		background: rgba(0, 0, 0, 0.4);
		width: 70rpx;
		height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		left: 30rpx;
		/* #ifdef APP */
		/* #endif */
		top: calc(30rpx + var(--status-bar-height));
		z-index: 999;
	}

	// 顶部tab
	.top_tab {
		display: flex;

		.item {
			flex: 0 1 110rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 40rpx;

			text {
				flex: 0 1 110rpx;
				border-bottom: 4rpx solid $uni-bg-color-grey;
				padding-bottom: 10rpx;
				display: flex;
				justify-content: center;
			}

			.ck {
				border-bottom: 4rpx solid $primary;
				padding-bottom: 10rpx;
				color: $primary;
			}
		}
	}

	// 商品列表css
	.home_goods {
		&.mt30 {
			margin-top: 30rpx;
		}

		.goods_h3 {
			padding: 10rpx 0;
			border-left: 6rpx solid $primary;
			padding-left: 30rpx;
			background: #fff;
			border-radius: 0 20rpx 20rpx 0;

			text {
				&:nth-child(2) {
					font-size: $uni-font-size-sm;
					color: #ccc;
					margin-left: 20rpx;
				}
			}
		}

		.goods_list {
			display: flex;
			flex-direction: row;
			margin-top: 30rpx;
			flex-wrap: wrap;

			&.other {
				flex-direction: row;
				flex-wrap: wrap;
				margin-top: 0;

				.goods_item {
					flex: 0 1 48%;
					// margin-right:1.2%;
					margin-bottom: 20rpx;
					background: #fff;
					overflow: hidden;

					&:nth-child(2n) {
						margin-right: 0;
					}
				}
			}

			.goods_item {
				width: calc((100% - 20rpx) / 2);
				margin-bottom: 20rpx;
				height: 504rpx;
				background: #fff;
				border-radius: 10rpx;
				position: relative;

				&:nth-child(2n) {
					margin-right: 0;
					margin-left: 20rpx;
				}

				.goods_thumb {
					height: 334rpx;
					background: #ccc;
					border-radius: 10rpx;

					image {
						height: 100%;
						width: 100%;
						border-radius: 10rpx 10rpx;
					}
				}

				.goods_tit {
					padding: 0 20rpx;
					font-size: 26rpx;
					color: #1a1a1a;
					font-weight: 600;
					line-height: 40rpx;
					height: 80rpx;
					margin-top: 20rpx;

					// 多行省略
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.goods_price {
					padding: 0 18rpx;
					display: flex;
					flex-direction: row;
					margin-top: 15rpx;
					align-items: center;
					height: 44rpx;
					flex: 1;
					width: 100%;
					display: block;
					overflow: hidden;
					// justify-content: space-between;

					text {
						font-size: 12rpx;
						font-weight: 500;
						// text-decoration:  line-through;
						color: #79808a;

						&:first-child {
							color: $uni-color-error;
							font-size: 34rpx;
							font-weight: 600;
							text-decoration: none;
						}

						&:last-child {
							margin-top: 10rpx;
							margin-left: 10rpx;
							font-size: 20rpx;
							/* #ifndef APP-PLUS */
							transform: scale(0.9);
							/* #endif */
						}
					}
				}

				.delbtn {
					position: absolute;
					z-index: 66;
					right: 10rpx;
					bottom: 5rpx;
				}
			}
		}
	}
</style>