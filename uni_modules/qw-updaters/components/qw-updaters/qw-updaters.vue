<template>
	<view class="qw_updater" v-show="data.mainShow">
		<!-- 白色背景 -->
		<view class="qw_update_main">
			<view class="qw_update_img"><image src="./ic_ar.png" mode="aspectFill"></image></view>
			<view class="qw_update_tit">{{data.updateData.name}}</view>
			<view class="qw_update_subtit" v-if="!data.downloading" v-html="data.updateData.content||'无更新信息~'"></view>
			<view class="qw_progress_box" v-if="data.downloading">
				<progress class="qw_progress" border-radius="45" :percent="data.downLoadPercent"
					:activeColor="progressColor" show-info stroke-width="10" />
				<view class="qw_progress_text">
					<text>{{data.downLoadingText}}</text>
					<text>({{data.downloadedSize}}/{{data.packageFileSize}}M)</text>
				</view>
			</view>
			<view class="qw_update_btn" v-if="!data.downloading">
				<view class="qw_update_cancel" 
				:style="{borderColor:cancelBorderColor,color:cancelColor,backgroundColor:cancelBg}"
				@click="cancel"
				>{{cancelText}}</view>
				<view class="qw_update_confirm" 
				@click="confirm"
				:style="{borderColor:confirmBorderColor,color:confirmColor,backgroundColor:confirmBg}"
				>{{confirmText}}</view>
			</view>
			<view class="qw_update_btn ck" v-if="data.downloading">
				<view class="qw_update_cancel" 
				@click="cancel"
				:style="{borderColor:cancelBorderColor,color:cancelColor,backgroundColor:cancelBg}"
				>后台更新</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive } from "vue";
	import { onLoad,onShow,onHide } from "@dcloudio/uni-app"
	const props = defineProps({
		cancelText:{
			type:String,
			default:'暂不升级'
		},
		cancelBg:{
			type:String,
			default:'#fff'
		},
		cancelColor:{
			type:String,
			default:'#666'
		},
		cancelBorderColor:{
			type:String,
			default:'#ddd'
		},
		confirmText:{
			type:String,
			default:'升级更新'
		},
		confirmBg:{
			type:String,
			default:'#dd524d'
		},
		confirmColor:{
			type:String,
			default:'#fff'
		},
		confirmBorderColor:{
			type:String,
			default:'none'
		},
		progressColor:{
			type:String,
			default:'#dd524d'
		},
	})
	
	const data = reactive({
		mainShow:false, // 控制升级主框打开关闭
		downloading:false,
		downLoadPercent:10,
		downLoadingText:'下载中...',
		downloadedSize:0,
		packageFileSize:0,
		tempFilePath:'', // 下载文件地址
		updateData:{
			name:'在线更新',
			content:'',
			version:'1.0.0',
			version_code:100,
			device:'android',
			apple_id:'',
			is_wgt:0,
			url:'',
		}
	})
	
	// 暂不升级
	const cancel = ()=>{
		data.mainShow = false
	}
	
	// 升级更新
	const confirm = ()=>{
		data.downloading = true
		downloadApp()
	}
	
	// 检查版本
	const checkVersion = (e,state)=>{
		data.updateData = e
		// #ifdef H5
			return uni.showToast({
				title:'H5无法更新~',
				position:"bottom"
			})
		// #endif
		let nowVersion = plus.runtime.versionCode
		console.log('当前版本：',nowVersion,'线上版本：',data.updateData.version_code)
		console.log(data.updateData.version_code <= nowVersion)
		if(data.updateData.version_code <= nowVersion&&state){
			return uni.showToast({
				title:'您已经是最新版本~',
				position:"bottom"
			})
		}
		data.mainShow = true
	}
	
	// 下载升级包
	const downloadApp = ()=>{
		// 如果是苹果和不是wgt更新
		if(data.updateData.device == 'ios' && data.updateData.is_wgt == 0){
			// plus.runtime.openURL
			return plus.runtime.launchApplication({
			    action: `itms-apps://itunes.apple.com/cn/app/id${ data.updateData.apple_id}?mt=8`
			}, function(e) {
			    uni.showToast({
			    	title:'打开AppStore失败~',
			    	position:"bottom"
			    })
			});
		}
		//下载包
		console.log(data.updateData.url)
		let downloadTask = uni.downloadFile({
			url: data.updateData.url,
			success: res => {
				if (res.statusCode == 200) {
					data.tempFilePath = res.tempFilePath
					installPackage()
				}
			},
			fail:(e)=> {
				console.log(e)
			},
			complete: () => {
				data.downloading = false
				data.mainShow = false
				data.downLoadPercent = 0
				data.downloadedSize = 0
				data.packageFileSize = 0
				downloadTask = null
			}
		})

		downloadTask.onProgressUpdate(res => {
			data.downLoadPercent = res.progress;
			data.downloadedSize = (res.totalBytesWritten / Math.pow(1024, 2)).toFixed(2);
			data.packageFileSize = (res.totalBytesExpectedToWrite / Math.pow(1024, 2)).toFixed(2);
		});
	}
	
	// 强制安装
	const installPackage = ()=>{
		// #ifdef APP-PLUS
		// wgt资源包安装
		plus.runtime.install(data.tempFilePath, {
			force: false
		}, async res => {
			// wgt包，安装后会提示 安装成功，是否重启
			if (data.updateData.is_wgt == 1) {
				// 强制更新安装完成重启
				uni.showLoading({
					icon: 'none',
					title: '安装成功，正在重启...'
				})

				setTimeout(() => {
					uni.hideLoading()
					plus.runtime.restart()
				}, 1000)
			}
		}, async err => {
			uni.showModal({
				title: '更新失败~',
				content: err.message,
				showCancel: false
			});
		});
		// #endif
	}
	
	
	// onShow(()=> uni.hideTabBar())
	// onHide(()=> uni.showTabBar())
	defineExpose({checkVersion})
	// uni.hideTabBar();
</script>

<style>

.qw_updater{
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0, .65);
	z-index: 9999;
}
.qw_update_main{
	background: #fff;
	border-radius: 30rpx;
	position: absolute;
	top: 520rpx;
	left: calc(50% - 300rpx);
	width: 600rpx;
	background-color: #fff;
	box-sizing: border-box;
	padding: 0 50rpx;
	min-height: 400rpx;
	padding-top: 100rpx;
	padding-bottom: 120rpx;
	box-sizing: border-box;
}
.qw_update_img{
	width: 340rpx;
	height: 200rpx;
	position: absolute;
	top:-120rpx;
	left:calc(50% - 160rpx)
}
.qw_update_img image{
	width: 100%;
	height: 100%;
}
.qw_update_tit{
	font-size: 34rpx;
	font-weight: bold;
	color: #000;
	text-align: center;
}
.qw_update_subtit{
	font-size: 28rpx;
	color: #666;
	margin-top: 30rpx;
}
.qw_update_btn{
	position: absolute;
	bottom: 20rpx;
	display: flex;
	width: 100%;
	font-size: 26rpx;
	text-align: center;
	left: 100rpx;
}
.qw_update_btn .qw_update_cancel{
	flex:0 1 180rpx;
	border: 1px solid #fff;
	margin-right: 45rpx;
	padding:10rpx 0;
	border-radius: 10rpx;
}
.qw_update_btn .qw_update_confirm{
	flex:0 1 180rpx;
	border: 1px solid #fff;
	padding:10rpx 0;
	border-radius: 10rpx;
}
.qw_update_btn.ck{
	left: 210rpx;
}
.qw_progress_box{
	margin-top: 45rpx;
}
.qw_progress_text{
	font-size: 26rpx;
	color: #666;
}
.qw_progress_text text:first-child{
	margin-right: 30rpx;
}
</style>
