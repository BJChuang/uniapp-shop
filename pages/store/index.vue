<template>
	<view class="store_info_sy">
		<view class="store_top_info"
			:style="data.storeInfo.store_face_image && data.storeInfo.store_face_image!=''?'background:url('+R.formatUrl(data.storeInfo.store_face_image)+')':''">
			<view class="store_top_block">
				<view class="apptop"></view>
				<view class="lr_btn">
					<view class="left_back" @click="R.nav('',3)"><uni-icons type="arrowleft" color="#fff"
							size="22"></uni-icons></view>
					<view class="right_back">
						<!-- <text :class="data.isFav?'follow':'follow ck'" @click="favClick">{{data.isFav?'已':'+ '}}关注</text> -->
						<!-- <text @click="share" class="iconfont qwfenxiang"></text> -->
					</view>
				</view>

				<view class="store_info_item">
					<view class="store_logo">
						<image :src="R.formatUrl(data.storeInfo.store_logo)||''" mode=""></image>
					</view>
					<view class="store_right_info">
						<view class="title">{{data.storeInfo.store_name||''}}</view>
						<view class="star">
							<view class="my-rate-box"><uni-rate :value="data.rate" :size="16" /></view>
							<!-- <sx-rate :disabled="true" :value="rate" container-class="my-rate-box" rate-class="my-rate" /> -->
							<text class="star_text f">评分 {{data.rate}} </text>
							<text class="star_text">已有 {{data.storeInfo.fav||0}} 人关注</text>
						</view>
					</view>
				</view>

				<view class="check-tab">
					<text :class="data.topIndex==0?'item ck':'item'" @click="topClick(0)">商品展示</text>
					<text :class="data.topIndex==1?'item ck':'item'" @click="topClick(1)">商品统计</text>
					<text :class="data.topIndex==2?'item ck':'item'" @click="topClick(2)">分销管理</text>
				</view>
			</view>

		</view>

		<!-- 主体内容开始 -->
		<view class="store_info_sy_main" v-if="data.topIndex==0">
			<view class="category_left">
				<scroll-view scroll-y="true" class="scroll-Y" :style="{height:data.viewHeight+'px'}">
					<view :class="data.navIndex==-1?'item ck':'item'" @click="navClick()">全部</view>
					<view v-for="(v,k) in data.classList" :key="k" :class="data.navIndex==k?'item ck':'item'"
						@click="navClick(k,true)">{{v}}</view>
				</scroll-view>
			</view>

			<view class="category_right">

				<!-- <scroll-view scroll-y="true" class="scroll-Y" :style="{height:data.viewHeight+'px'}"> -->
				<view class="list" :style="{height:data.viewHeight+'px'}">
					<z-paging ref="paging" width="100%" :height="data.viewHeight+'px'" :fixed="false"
						refresher-threshold="180rpx" :use-page-scroll="false" v-model="data.list" @query="upCallback">
						<!-- <uni-grid :column="2" :show-border="false"  :square="false" :highlight="false"> -->
						<view class="zpaging_block">
							<view class="grid_item" v-for="(v,k) in data.list" :key="k">
								<view class="item" @click="R.nav('/pages/goods/info?id='+v.goods_i.id+'&shop=1')">
									<image :src="R.formatUrl(v.goods_i.goods_images)||''" mode="aspectFill"></image>
									<view class="goods_name">{{v.goods_i.goods_name||''}}</view>
									<view class="price">
										<text class="goods_price">￥{{v.goods_i.goods_price||0.00}}</text>
										<!-- <text class="market_price">销量：{{v.goods_i.goods_sale}}</text> -->
									</view>
									<view class="btn-box">

										<button class="btn" @click.stop="del(v.id)">删除</button>
										<button class="btn" 
											@click.stop="sxj(v.goods_id,v.goods_status)">{{v.goods_status==0?'上架':'下架'}}</button>
									</view>

								</view>
							</view>
						</view>
						<!-- </uni-grid> -->
					</z-paging>
				</view>
				<!-- </scroll-view> -->

			</view>
		</view>

		<!-- 主体内容开始2 -->
		<view class="store_info_sy_main change" v-if="data.topIndex==1">
			<view class="store_more_info">

				<view class="item">
					<view class="title">当月订单数量：</view>
					<view class="content">{{statistics.monthOrders}}</view>
				</view>
				<view class="item">
					<view class="title">当月利润总额：</view>
					<view class="content">{{statistics.ordersProfilesMonth}}</view>
				</view>
				<view class="item">
					<view class="title">累积订单数量：</view>
					<view class="content">{{statistics.allOrders}}</view>
				</view>
				<view class="item">
					<view class="title">累积利润总额：</view>
					<view class="content">{{statistics.ordersProfilesAll}}</view>
				</view>
				<view class="item">
					<view class="title">当月销售额：</view>
					<view class="content">{{statistics.salesMoneyMonth}}</view>
				</view>
				<view class="item">
					<view class="title">累积销售额：</view>
					<view class="content">{{statistics.salesAllMoney}}</view>
				</view>
			</view>
		</view>

		<!-- 主体内容开始3 -->
		<view class="store_info_sy_main change" v-if="data.topIndex==2">
			<view class="store_more_info">
				<view class="top">
					<view class="">
						<view class="">
							<text>佣金</text>
							<text>{{fxData.commission || 0}}</text>
						</view>
						<view class="">
							<text>利润</text>
							<text>{{fxData.profile_sum || 0}}</text>
						</view>
					</view>
					<view class="right">
						<button class="btn" @click="onGetcommission">获取佣金</button>
						<button class="btn" @click="onWithdrawal" v-if="fxData.commission>0">佣金提取</button>
					</view>
				</view>
				<view class="fxTab">
					<text>店铺名称</text>
					<text>返佣</text>

				</view>
				<view class="fxItem" v-if="fxData.myInvite" v-for="(item,index) in fxData.myInvite.data" :key="index">
					<text>{{item.store_info.store_name}}</text>
					<!-- <text class="slh">{{item.o der_name}}</text> -->
					<text>{{item.commission_p}}</text>
				</view>

			</view>
		</view>

		<uni-popup ref="popup" type="share">
			<uni-popup-share title="分享到" @select="select"></uni-popup-share>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		customRef,
		nextTick,
		reactive,
		ref
	} from "vue"
	import {
		onLoad,
		onReachBottom
	} from "@dcloudio/uni-app"
	import Base64 from 'base-64';
	import {
		R
	} from '@/plugins/http.js' // 请求方式中间件
	const paging = ref(null)
	const popup = ref(null)
	
	const data = reactive({
		params: {
			page: 1,
			per_page: 10,
		},
		id: 0,
		storeInfo: {},
		classList: [],
		classIdList: [],
		list: [],
		topIndex: 0,
		navIndex: -1,
		rate: 5,
		isFav: false,
		viewHeight: 0,
		fxPage: 1
	})
	const statistics = ref()
	const fxData = ref()
	const getViewHeight = () => {
		uni.getSystemInfo({
			success: (res) => {
				data.viewHeight = res.windowHeight - 200
			}
		})
	}
	
	const del = (goods_join_id) =>{
		uni.showModal({
			title:'提示',
			content:'是否确认删除?',
			success: (ret) => {
				if(ret.confirm){
					R.post('/Wap/delGoodsByGid',{goods_join_id}).then(res => {
						paging.value.reload()
					})
				}
			}
		})
		
	}

	const loadData2 = () => {
		R.get('/Wap/stores/' + data.id).then(res => {
			data.storeInfo = res.data
			data.classList = []
			data.classIdList = data.storeInfo.store_classes_id
			data.rate = (res.data.rate.agreeAll + res.data.rate.scoreAll + res.data.rate.serviceAll + res.data
				.rate.speedAll) / 4
		})
	}
	const is_fav = () => {
		R.get('/Wap/is_fav', {
			out_id: data.id,
			is_type: 1
		}).then(res => {

		})
	}
	const sxj = async (id, status) => {
		R.post('/Wap/editGoodsStatus', {
			goods_status: status == 1 ? 0 : 1,
			goods_id: id
		}).then(res => {
			paging.value.reload()
		})
	}
	const onWithdrawal = () => {
		uni.showModal({
			title: '请输入提取金额',
			editable: true,
			success: (ret) => {
				if (ret.confirm) {
					R.post('/Wap/auth/extractCommission', {
						commision: ret.content
					}).then(res => {
						getFX()
						paging.value.reload()
					})
				}
			}
		})
	}
	const favClick = () => {
		R.post('/Wap/favorites', {
			out_id: data.id,
			is_type: 1
		}).then(res => {
			R.toast(res.msg)
			is_fav();
		})
	}
	const topClick = (e) => {
		data.topIndex = e;
	}
	const onGetcommission = () => {
		uni.showLoading({

		})
		R.get('/Wap/auth/getMyInvite?provider=users').then(res => {
			fxData.value.commission = res.data.commission
			uni.hideLoading()
		})
	}
	const navClick = (k = -1, status = false) => {
		if (!status) {
			data.params.class_id = 0;
		} else {
			data.params.class_id = data.classIdList[k];
		}
		data.navIndex = k
		paging.value.reload()
	}
	const share = () => {
		popup.value.open()
	}
	const select = (e) => {
		let type = 'WXSceneSession';
		if (e.index = 0) {
			type = 'WXSceneSession'
		}
		if (e.index = 1) {
			type = 'WXSenceTimeline'
		}
		if (e.index = 2) {
			type = 'WXSceneFavorite'
		}
		uni.share({
			provider: "weixin",
			scene: type,
			type: 0,
			title: data.storeInfo.store_name || '店铺',
			imageUrl: data.storeInfo.store_logo || '',
			summary: "欢迎您来" + data.storeInfo.store_name + "购物喔！",
			success: function(res) {
				R.toast('分享成功');
				console.log("success:" + JSON.stringify(res));
			},
			fail: function(err) {
				console.log("fail:" + JSON.stringify(err));
			}
		});
	}

	const loadData = (pageNo, pageSize) => {
		uni.showLoading({
			title: '加载中...'
		})

		R.get('/Wap/goodsJoinList', {
			per_page: pageSize,
			page: pageNo
		}).then(res => {
			if (res.code != 200) return paging.value.complete(false)
			res.data.data.map(item => {
				item.goods_i.goods_images = item.goods_i.goods_images.split(',')[0]
			})
			paging.value.complete(res.data.data)
		}).finally(() => {
			uni.hideLoading()
		})
	}

	const upCallback = (pageNo, pageSize) => {
		console.log(pageNo, pageSize)
		data.params.page = pageNo // 页码, 默认从1开始
		data.params.per_page = pageSize // 页长, 默认每页10条
		if (data.params.class_id == '' || data.params.class_id == 0) {
			let timer = setInterval(() => {
				if (data.params.class_id == '' || data.params.class_id == 0) {
					clearInterval(timer)
					loadData(pageNo, pageSize)
				}
			}, 500)
			return
		}
		loadData(pageNo, pageSize)
	}
	const getStatistics = () => {
		R.post('/Wap/store/summary').then(res => {
			console.log(res)
			statistics.value = res.data
		})
	}
	const getFX = () => {
		uni.showLoading({

		})
		R.get('/Wap/auth/getCommissionOrder?provider=users', {
			per_page: 20,
			page: data.fxPage
		}).then(res => {
			if (data.fxPage == 1) {
				fxData.value = res.data
			} else {
				fxData.value.myInvite.data = fxData.value.myInvite.data.concat(res.data.myInvite.data)
			}
			uni.hideLoading()
			console.log(res)

		})
	}
	onReachBottom(() => {
		data.fxPage++
		getFX()
	})
	onLoad((opt) => {
		getViewHeight()
		data.id = opt.id
		data.params.store_id = opt.id
		loadData2()
		getStatistics()
		getFX()
		nextTick(() => {
			paging.value.reload()
		})
		is_fav()
	})
</script>

<style lang="scss" scoped>
	.btn-box {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;

		.btn {
			width: 80rpx;
			height: 40rpx;
			margin: 0;
			padding: 0;
			font-size: 16rpx;
			line-height: 40rpx;
			// margin-left: 15rpx;
			border: none;
			background: red;
			color: #fff;
		}
	}

	.store_info_sy {
		.store_info_sy_main {
			height: 100%;
			font-size: $uni-font-size-base;
			display: flex;

			.store_more_info {
				margin: 30rpx;
				height: 100%;
				width: 690rpx;

				.item {
					margin-bottom: 40rpx;
					display: flex;
					align-items: center;

					.title {
						font-size: $uni-font-size-lg;
					}

					.content {
						// margin-top: 20rpx;
						font-size: $uni-font-size-lg;
						color: #666;
						font-weight: bold;
					}
				}

				.top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 50rpx;
					margin-bottom: 50rpx;

					>view {
						display: flex;

						// align-items: center;
						>view {
							display: flex;
							justify-content: center;
							flex-direction: column;
							align-items: center;
						}
					}

					.btn {
						background: #f00;
						color: #fff;
						width: 120rpx;
						height: 40rpx;
						display: block;
						margin: 0;
						padding: 0;
						margin-left: 30rpx;
						font-size: 24rpx;
						line-height: 40rpx;
					}

					text {
						display: block;
						margin-right: 30rpx;
						font-size: 30rpx;
						font-weight: bold;
					}
				}

				.fxTab {
					display: flex;
					justify-content: space-around;
					align-items: center;
					width: 660rpx;
					margin-bottom: 30rpx;
					font-weight: bold;

					text {
						display: block;
						width: 30%;
						text-align: center;

					}
				}

				.fxItem {
					display: flex;
					justify-content: space-around;
					align-items: center;
					width: 660rpx;
					border-bottom: 1rpx solid #eee;
					height: 60rpx;

					text {
						display: block;
						width: 30%;
						text-align: center;
					}

					.slh {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						/* 显示的行数，可以根据需要修改 */
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}

			&.change {
				background: #fff;
			}

		}

		.category_left {
			flex: 0 0 180rpx;
			border-radius: 0 10rpx 10rpx 0;
			line-height: 120rpx;
			height: 120rpx;
			height: 100%;
			width: 180rpx;
			background: #fff;

			.item {
				padding-left: 30rpx;
				height: 120rpx;

				overflow: hidden;

				// border-left: 8rpx solid #f8f8f8;
				&.ck {
					border-left: 8rpx solid $uni-color-error;
					background: #f8f8f8;
					color: $uni-color-error;
				}
			}

		}

		.category_right {
			flex: 1;
			margin: 20rpx 20rpx;
			position: relative;

			.list {
				.zpaging_block {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					width: 100%;

					.grid_item {
						flex: 0 0 50%;
						width: 0px;
					}
				}

				.grid_item:nth-child(2n) {
					// .item{
					// 	margin-right: 0;
					// 	margin-left: 10rpx;
					// }
				}

				.item {
					margin-right: 5rpx;
					margin-bottom: 10rpx;
					border-radius: 6rpx;
					background: #fff;
					box-sizing: border-box;
					padding: 20rpx;

					image {
						width: 100%;
						background: #eee;
						border-radius: 6rpx;
						height: 220rpx;
						box-sizing: border-box;
					}

					.comment {
						color: #999;
						font-size: $uni-font-size-sm;
						line-height: 60rpx;
						padding-left: 5rpx;
					}

					.price {
						overflow: hidden;

						.goods_price {
							color: $uni-color-error;
							margin-right: 20rpx;
							font-size: $uni-font-size-sm;
						}

						.market_price {
							color: #ccc;
							font-size: $uni-font-size-sm;
						}
					}

					.goods_name {
						line-height: 60rpx;
						text-align: left;
						font-size: $uni-font-size-sm;
						width: 100%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}

		.store_top_info {
			position: relative;
			background: url('../../static/store/store_face.jpg');
			min-height: calc(var(--status-bar-height) + 400rpx);
			background-position: top center;
			background-size: 100%;

			.check-tab {
				color: #fff;
				font-size: $uni-font-size-base;
				margin-left: 40rpx;
				margin-right: 40rpx;
				margin-top: 60rpx;
				line-height: 60rpx;
				height: 60rpx;
				display: flex;

				.item {
					text-align: center;
					color: #ccc;
					margin: 0 38rpx;

					flex: 1;

					&.ck {
						color: #fff;
						border-bottom: 2px solid #fff;
					}
				}

			}

			.store_info_item {
				padding-top: 60rpx;

				.store_logo {
					background: #eee;
					margin-left: 40rpx;
					float: left;
					width: 110rpx;
					height: 110rpx;
					border-radius: 8rpx;
					margin-right: 30rpx;

					image {
						border-radius: 8rpx;
						width: 110rpx;
						height: 110rpx;
					}
				}

				.store_right_info {
					color: #fff;
					float: left;
					max-width: 480rpx;

					.title {
						margin-top: 10rpx;
					}

					.star {
						margin-top: 15rpx;

						.star_text {
							float: left;
							font-size: $uni-font-size-sm;

							&.f {
								margin-right: 20rpx;
							}
						}

						.my-rate-box {
							float: left;
							font-size: 26rpx;
							margin-right: 20rpx;
						}

						&:after {
							clear: both;
							display: block;
							content: '';
						}
					}

				}

				&:after {
					clear: both;
					display: block;
					content: '';
				}
			}

			.store_top_block {
				background: rgba(#000, 0.6);
				position: absolute;
				min-height: calc(var(--status-bar-height) + 400rpx);
				width: 100%;

				.lr_btn {
					margin-top: 30rpx;
					padding: 0 40rpx;

					.left_back {
						float: left;
					}

					.right_back {
						float: right;

						.follow {
							background: #999;
							color: #fff;
							padding: 4rpx 25rpx;
							border-radius: 20rpx;
							font-size: $uni-font-size-base;
							margin-right: 30rpx;

							&.ck {
								background-color: $primary;
							}
						}

						.qwfenxiang {
							color: #fff;
							font-size: 32rpx;
						}
					}

					&:after {
						content: '';
						display: block;
						clear: both;
					}
				}

				.apptop {
					height: var(--status-bar-height);
				}
			}

		}
	}
</style>