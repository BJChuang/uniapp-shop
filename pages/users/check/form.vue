<template>
	<view class="check_content ">
		<!-- <view class="pdbg">
			<view class="identityTop ct30 br20">
				<view class="title">实名认证</view>
				<view class="bz">为保证用户身份安全，身份证信息我们会严格保密</view>
				<view class="idTitle">身份证照片</view>
				<view class="idTwo flex">
					<view class="upload flex front" @click="user_card(false)">
						<image :src="data.info.card_t==''?data.z_img:R.formatUrl(data.info.card_t)" mode="widthFix">
						</image>
						<view>点击上传<text>人像面</text></view>
					</view>
					<view class="upload flex back" @click="user_card(true)">
						<image :src="data.info.card_b==''?data.f_img:R.formatUrl(data.info.card_b)" mode="widthFix">
						</image>
						<view>点击上传<text>国徽面</text></view>
					</view>
				</view>
			</view> -->
			<!-- <view class="identityTwo ct30 br20">
				<view class="list hi-rows">
					<text>真实姓名</text>
					<input type="text" v-model="data.info.name" placeholder="真实姓名" placeholder-style="color:#D7D7D7" />
				</view>
				<view class="list  hi-rows">
					<text>身份证号码</text>
					<input type="text" v-model="data.info.card_no" placeholder="身份证号"
						placeholder-style="color:#D7D7D7" />
				</view>
				<view class="list  hi-rows">
					<text>开户银行</text>
					<input type="text" v-model="data.info.bank_name" placeholder="银行公司"
						placeholder-style="color:#D7D7D7" />
				</view>
				<view class="list  hi-rows">
					<text>银行卡号</text>
					<input type="number" v-model="data.info.bank_no" placeholder="银行卡号 提现需要"
						placeholder-style="color:#D7D7D7" />
				</view>
			</view> -->
			<!-- 设置trc20 地址 -->
			<view class="identityTwo ct30 br20">
				<view class="list hi-rows">
					<text>TRC20</text>
					<input type="text" v-model="trc20address" placeholder="请输入TRC20地址" placeholder-style="color:#D7D7D7" />
				</view>
				
			</view>
		<!-- </view> -->

		<view class="viewBtn" @tap="editCheck">设置</view>

	</view>
</template>

<script setup>
	import {
		reactive, ref
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		R
	} from '@/plugins/http.js' // 请求方式中间件

	import config from "@/plugins/config.js";
	const trc20address = ref()
	const data = reactive({
		isshow: false, //弹出显示状态
		z_img: '/static/identity/front.jpg',
		f_img: '/static/identity/back.jpg',
		info: {
			name: '',
			card_no: '',
			card_b: '',
			card_t: '',
			bank_name: '',
			bank_no: '',
		},
	})

	let timer = null

	const editCheck = () => {
		// console.log(data.info);
		if (R.isEmpty(trc20address.value)) {
			return R.toast('请填写TRC20 地址')
		}

		R.post('/Wap/users/check', {trc20address:trc20address.value}).then(res => {
			if (res.code == 200) {
				R.toast('认证成功')
				uni.$emit('users')
				uni.$emit('check')
				R.nav('', 3)
			}
		})
	}
	const user_card = (type) => {
		let token = uni.getStorageSync('token');
		uni.chooseImage({
			count: 1, //默认9
			success: function(res) {
				// console.log(JSON.stringify(res.tempFilePaths));
				uni.showLoading({
					title: '上传中...'
				})
				uni.uploadFile({
					url: config.requestUrl + '/uploads', //地址
					filePath: res.tempFilePaths[0],
					name: 'file',
					header: {
						Authorization: 'Bearer ' + token
					},
					formData: {
						'name': 'card'
					},
				 success: (uploadFileRes) => {
						console.log(uploadFileRes)
						let fileInfo = JSON.parse(uploadFileRes.data);
						if (!type) {
							data.info.card_t = fileInfo.data
						} else {
							data.info.card_b = fileInfo.data
						}
					},
					complete() {
						uni.hideLoading();
					}
				});
			}
		});
	}

	const check = () => {
		R.get('/Wap/users/check', {
			provider: 'users'
		}).then(res => {
			if (res.code == 200 && res.data != null) {
				data.info = res.data
			}
		})
	}

	onLoad((opt) => {
		if(opt.edit){
			check()
		}
	})
</script>

<style lang="scss" scoped>

	.identityTwo {
		background-color: #fff;
		padding-left: 52rpx;
	}

	.identityTwo .list text {
		color: #222222;
		font-size: 30rpx;
		width: 150rpx;
		float: left;
	}

	.identityTwo .list input {
		flex: 1;
		float: left;
		margin-top: 24rpx;
	}

	.check_content {
		/* border-top: 1px solid #efefef; */
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.flex {
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
	}

	view,
	button,
	image {
		box-sizing: border-box;
	}

	.identityTop {
		padding: 40rpx 52rpx;
		background-color: #fff;
	}

	.identityTop .title {
		height: 50rpx;
		font-size: 52rpx;
		font-weight: normal;
		color: rgba(34, 34, 34, 1);
		line-height: 48rpx;
	}

	.identityTop .bz {
		margin-top: 16rpx;
		height: 24rpx;
		font-size: 24rpx;
		font-family: Adobe Heiti Std;
		font-weight: normal;
		color: rgba(153, 153, 153, 1);
		line-height: 48rpx;
		margin-bottom: 54rpx;
	}

	.idTitle {
		width: 100%;
		height: 48rpx;
		font-size: 30rpx;

		color: rgba(34, 34, 34, 1);
		line-height: 48rpx;
	}

	.idTwo {
		margin-top: 30rpx;
		height: 180rpx;
	}

	.idTwo .upload {
		width: 270rpx;
		height: 180rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 6px 16px 0px rgba(209, 209, 209, 0.35);
		border-radius: 4rpx;
		justify-content: center;
		padding: 18rpx 0;
		overflow: hidden;
	}

	.idTwo .upload image {
		width: 132rpx;
		height: 180rpx;
	}

	.idTwo image {
		width: 132rpx;
		height: 180rpx;
	}

	.idTwo view {
		width: 100%;
		height: 48rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
		line-height: 48rpx;
		text-align: center;
		margin-top: 18rpx;
	}

	.idTwo view text {
		color: #FF5C50;
		margin-left: 5rpx;
	}

	.identityTwo {
		margin-top: 26rpx;
	}

	.list {
		height: 100rpx;
		line-height: 100rpx;
		align-items: center;
		justify-content: flex-start;
		overflow: hidden;
	}

	.list:nth-of-type(1) {
		border-bottom: 1rpx solid rgba(248, 248, 248, 1);
	}

	.list input {
		font-size: 30rpx;
		padding-left: 70rpx;
	}



	.viewBtn {
		width: 92%;
		height: 88rpx;
		line-height: 88rpx;
		color: #fff;
		background: linear-gradient(to left,$primary,$gradient);
		border-radius: 10rpx;
		font-size: 30rpx;
		text-align: center;
		margin: 0 auto;
		margin-top: 100rpx;
	}
</style>
