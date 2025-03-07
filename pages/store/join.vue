<template>
	<view class="check_content ">
		<view class="success_bg" v-if="data.info.store_status && data.info.store_verify==4 || data.info.store_verify==2">
			<uni-icons v-show="data.info.store_verify==4" type="checkbox-filled" color="rgb(9, 187, 7)" size="60"></uni-icons>
			<text  v-show="data.info.store_verify==4" class="tit">已经申请成功</text>
			<uni-icons v-show="data.info.store_verify==2" type="checkbox-filled" color="rgb(239, 147, 0)" size="60"></uni-icons>
			<text  v-show="data.info.store_verify==2" class="tit">等待审核</text>
		</view>
	
		<view v-else class="pdbg">
			
			<view class="identityTop ct30 br20">
				<view class="title">商户入驻</view>
				<view class="bz">入驻商家请认真填写下面资料内容</view>
				<view class="idTitle">身份证照片</view>
				<view class="idTwo flex">
					<view class="upload flex front" @click="user_card(false)">
						<image :src="data.info.id_card_t==''?data.z_img:R.formatUrl(data.info.id_card_t)" mode="widthFix">
						</image>
						<view>点击上传<text>人像面</text></view>
					</view>
					<view class="upload flex back" @click="user_card(true)">
						<image :src="data.info.id_card_b==''?data.f_img:R.formatUrl(data.info.id_card_b)" mode="widthFix">
						</image>
						<view>点击上传<text>国徽面</text></view>
					</view>
				</view>
				
			</view>
			<view class="identityTwo ct30 br20">
				<view class="list hi-rows">
					<text>真实姓名</text>
					<input type="text" v-model="data.info.legal_person" placeholder="真实姓名" placeholder-style="color:#D7D7D7" />
				</view>
				<view class="list  hi-rows">
					<text>身份证号码</text>
					<input type="text" v-model="data.info.id_card_no" placeholder="身份证号"
						placeholder-style="color:#D7D7D7" />
				</view>
				<view class="list  hi-rows">
					<text>联系电话</text>
					<input type="text" v-model="data.info.store_mobile" placeholder="联系电话"
						placeholder-style="color:#D7D7D7" />
				</view>
			</view>
			
			<view class="identityTwo ct30 br20">
				<view class="list  hi-rows" style="height: 160rpx;display: flex;">
					<text style="line-height: 160rpx;">店铺LOGO</text>
					<view v-if="R.isEmpty(data.info.store_logo)" class="upload-add-btn" style="margin-left: 60rpx;" @click="imgUpload"></view>
					<image v-if="!R.isEmpty(data.info.store_logo)" style="width: 100rpx;height: 100rpx;margin-left: 60rpx;" :src="R.formatUrl(data.info.store_logo)||''" mode=""></image>
				</view>
				<view class="list hi-rows">
					<text>店铺名称</text>
					<input type="text" v-model="data.info.store_name" placeholder="店铺名称" placeholder-style="color:#D7D7D7" />
				</view>
				<view class="list hi-rows">
					<text>申请类目</text>
					<input type="text" @focus="openTree" v-model="data.classname" placeholder="申请类目" placeholder-style="color:#D7D7D7" />
				</view>
				<view class="list hi-rows">
					<text>地址区域</text>
					<view class="area_info">
						<picker mode="multiSelector" :value="data.rangeIndex" @columnchange="columnchange" :range="data.ranges" @change="areaChange">
							<view class="slh" style="color: #666;margin-left:70rpx;">{{data.info.area_info||'选择城市'}}</view>
						</picker>
					</view>
				</view>
				
			</view>
		</view>
		
		<ba-tree-picker ref="treePicker" :multiple='true' @select-change="selectChange" title="选择申请类目"
		        :localdata="data.class"   valueKey="id" textKey="name" childrenKey="children" />
		
		<view class="viewBtn" @tap="editCheck">立即入驻</view>
		<view style="height: 30rpx;width:100%">&nbsp;</view>

	</view>
</template>

<script setup>
	import baTreePicker from "@/components/ba-tree-picker/ba-tree-picker.vue"
	import {
		onMounted,
		reactive,ref
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		R
	} from '@/plugins/http.js' // 请求方式中间件

	import config from "@/plugins/config.js";
	
	const treePicker = ref(null)
	const data = reactive({
		isshow: false, //弹出显示状态
		z_img: '/static/identity/front.jpg',
		f_img: '/static/identity/back.jpg',
		class:[],
		ranges:[[],[],[]],
		rangeIndex:[0,0,0],
		areas:[],
		classname:'',
		info: {
			legal_person: '',
			id_card_no: '',
			id_card_b: '',
			id_card_t: '',
			class_id:[],
		},
	})
	
	const loadArea = async ()=>{
		let res = await R.get('/load_areas',{})
		if(res.code && res.code == 200){
			data.areas = res.data
			data.ranges = [[],[],[]]
			data.ranges[0] = await getAreaChildren(data.areas)
			data.ranges[1] = await getAreaChildren(data.areas[0])
			data.ranges[2] = await getAreaChildren(data.areas[0].children[0])
		}
	}
	
	const columnchange = async (e)=>{
		data.rangeIndex[e.detail.column] = e.detail.value
		if(e.detail.column == 0){
			data.ranges[1] = await getAreaChildren(data.areas[e.detail.value])
			data.ranges[2] = await getAreaChildren(data.areas[e.detail.value].children[0])
			data.rangeIndex[1] = 0
			data.rangeIndex[2] = 0
		}
		if(e.detail.column == 1){
			data.ranges[2] = await getAreaChildren(data.areas[data.rangeIndex[0]].children[e.detail.value])
			data.rangeIndex[2] = 0
		}
		console.log(data.rangeIndex)
	}
	
	// 根据父级数据获取children数据
	const getAreaChildren = async (e)=>{
		let childrens = []
		if(R.isEmpty(e.children)){
			e.map(item=>{
				childrens.push(item.name)
			})
		}else{
			e.children.map(item=>{
				childrens.push(item.name)
			})
		}
		return childrens
	}

	let timer = null

	const editCheck = () => {
		console.log(data.info);
		if (R.isEmpty(data.info.legal_person) ||
		 R.isEmpty(data.info.store_logo) ||
		 R.isEmpty(data.info.store_name) ||
		 R.isEmpty(data.info.class_id) ||
		 R.isEmpty(data.info.region_id) ||
		 R.isEmpty(data.info.store_mobile) ||
			R.isEmpty(data.info.id_card_no) ||
			R.isEmpty(data.info.id_card_b) ||
			R.isEmpty(data.info.id_card_t) 
			) {
			return R.toast('请认真填写认证信息')
		}
		R.put('/Wap/store', data.info).then(res => {
			if (res.code == 200) {
				R.toast('申请成功')
				uni.$emit('users')
				uni.$emit('check')
				uni.navigateBack()
				
				
			}
		})
		
	}
	const imgUpload = ()=>{
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
						'name': 'store_logo'
					},
				 success: (uploadFileRes) => {
						console.log(uploadFileRes)
						let fileInfo = JSON.parse(uploadFileRes.data);
						data.info.store_logo = fileInfo.data
					},
					complete() {
						uni.hideLoading();
					}
				});
			}
		});
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
							data.info.id_card_t = fileInfo.data
						} else {
							data.info.id_card_b = fileInfo.data
						}
					},
					complete() {
						uni.hideLoading();
					}
				});
			}
		});
	}

	
	const areaChange = (e)=>{
		let areaIndex = e.detail.value
		data.info.area_info = data.areas[areaIndex[0]].name + ' ' + data.areas[areaIndex[0]].children[areaIndex[1]].name + ' ' + data.areas[areaIndex[0]].children[areaIndex[1]].children[areaIndex[2]].name
		data.info.province_id = data.areas[areaIndex[0]].id
		data.info.city_id = data.areas[areaIndex[0]].children[areaIndex[1]].id
		data.info.region_id = data.areas[areaIndex[0]].children[areaIndex[1]].children[areaIndex[2]].id
	}
	
	const loadClass = async ()=>{
		R.get('/load_goods_classes',{}).then(res=>{
			data.class= res.data
		})
	}
	
	const selectChange = (e,name)=>{
		console.log(e,name)
		data.info.class_id = JSON.stringify(e)
		data.classname = name
	}
	
		
	const openTree = ()=>{
		treePicker.value._show();
	}
	
	// 加载店铺信息
	const loadStore = async ()=>{
		let rs = await R.get("/Wap/store",{},1)
		console.log(rs.data.id)
		if(R.isEmpty(rs.data.id)){
			R.post("/Wap/store/join",{},1)
		}
		// data.info = rs.data
	}
	
	
	
	
	
	// 加载所有商品类目

	onLoad((opt) => {
		loadClass()
		loadArea()
		loadStore()
		
		
	})
</script>

<style lang="scss" scoped>
	.slh{
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 400rpx;
	}
	.identityTwo {
		background-color: #fff;
		padding-left: 52rpx;
	}

	.identityTwo .list text {
		color: #222222;
		font-size: 30rpx;
		width: 180rpx;
		
	}

	.identityTwo .list input {
		flex: 1;
		
		// margin-top: 24rpx;
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
		display: flex;
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
	.success_bg{
		min-height: 400px;
		display: flex;
		justify-content: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.upload-add-btn {
		position: relative;
		display: flex;
		width: 100upx;
		height: 100upx;
		border-radius:8upx;
		background:#f5f5f5;
		&:before,
		&:after {
			content: " ";
			position: absolute;
			top: 50%;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			width: 4upx;
			height: 60upx;
			background-color: #ccc;
		}
		&:after {
			width: 60upx;
			height: 4upx;
		}
		&:active {
			background-color: #f7f7f7;
		}
	}
</style>
