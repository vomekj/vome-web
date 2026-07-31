declare namespace Eps {
	type RequestOptions = {
		url?: string;
		method?: string;
		data?: any;
		params?: any;
		[key: string]: any;
	};

	type Request = (options?: RequestOptions) => Promise<any>;

	interface Agent_authEntity {
		id?: number;

		[key: string]: any;
	}

	interface Agent_kbEntity {
		id?: number;

		[key: string]: any;
	}

	interface Base_commEntity {
		id?: number;

		[key: string]: any;
	}

	interface Base_dictEntity {
		id?: number;

		[key: string]: any;
	}

	interface Base_openEntity {
		id?: number;

		[key: string]: any;
	}

	interface FaqPostEntity {
		/** ID */
		id?: number;

		/** 类型 */
		typeId?: number;

		/** 作者 */
		userId?: string;

		/** 标题 */
		title?: string;

		/** 内容 */
		content?: string;

		/** 浏览 */
		viewCount?: number;

		/** 回复数 */
		replyCount?: number;

		/** 置顶 */
		isTop?: number;

		/** 已解决 */
		isSolved?: number;

		/** 状态 */
		status?: number;

		/** 创建时间 */
		createTime?: string;

		/** 更新时间 */
		updateTime?: string;

		/** 删除时间 */
		deletedAt?: string;

		[key: string]: any;
	}

	interface FaqReplyEntity {
		/** ID */
		id?: number;

		/** 帖子 */
		postId?: number;

		/** 用户 */
		userId?: string;

		/** 内容 */
		content?: string;

		/** 图片 */
		images?: any;

		/** 状态 */
		status?: number;

		/** 创建时间 */
		createTime?: string;

		/** 更新时间 */
		updateTime?: string;

		/** 删除时间 */
		deletedAt?: string;

		[key: string]: any;
	}

	interface FaqTypeEntity {
		/** ID */
		id?: number;

		/** 名称 */
		name?: string;

		/** 备注 */
		remark?: string;

		/** 排序 */
		orderNum?: number;

		/** 状态 */
		status?: number;

		/** 创建时间 */
		createTime?: string;

		/** 更新时间 */
		updateTime?: string;

		/** 删除时间 */
		deletedAt?: string;

		[key: string]: any;
	}

	interface I18n_packEntity {
		id?: number;

		[key: string]: any;
	}

	interface PluginListEntity {
		/** ID */
		id?: number;

		/** 类型 */
		typeId?: number;

		/** 标签 */
		tagIds?: any;

		/** 作者 */
		userId?: string;

		/** 名称 */
		pluginName?: string;

		/** 价格 */
		price?: number;

		/** 加席单价 */
		extraSeatPrice?: number;

		/** 标题 */
		title?: string;

		/** 版本号 */
		version?: string;

		/** 封面 */
		cover?: string;

		/** 头像 */
		avatar?: string;

		/** 插件包 */
		fileUrl?: string;

		/** 市场ID */
		marketId?: string;

		/** 示例图 */
		examples?: any;

		/** 联系方式 */
		contact?: string;

		/** 描述 */
		description?: string;

		/** 审核状态 */
		auditStatus?: number;

		/** 审核描述 */
		auditDescription?: string;

		/** 创建时间 */
		createTime?: string;

		/** 更新时间 */
		updateTime?: string;

		/** 删除时间 */
		deletedAt?: string;

		[key: string]: any;
	}

	interface PluginReplyEntity {
		/** ID */
		id?: number;

		/** 插件 */
		pluginId?: number;

		/** 用户 */
		userId?: string;

		/** 内容 */
		content?: string;

		/** 图片 */
		images?: any;

		/** 状态 */
		status?: number;

		/** 创建时间 */
		createTime?: string;

		/** 更新时间 */
		updateTime?: string;

		/** 删除时间 */
		deletedAt?: string;

		[key: string]: any;
	}

	interface PluginTagEntity {
		/** ID */
		id?: number;

		/** 名称 */
		name?: string;

		/** 备注 */
		remark?: string;

		/** 状态 */
		status?: number;

		/** 创建时间 */
		createTime?: string;

		/** 更新时间 */
		updateTime?: string;

		/** 删除时间 */
		deletedAt?: string;

		[key: string]: any;
	}

	interface PluginStore_seatEntity {
		id?: number;

		[key: string]: any;
	}

	interface PluginStore_walletEntity {
		id?: number;

		[key: string]: any;
	}

	interface Project_pageEntity {
		id?: number;

		[key: string]: any;
	}

	interface Project_projectEntity {
		id?: number;

		[key: string]: any;
	}

	interface User_commEntity {
		id?: number;

		[key: string]: any;
	}

	interface User_infoEntity {
		id?: number;

		[key: string]: any;
	}

	interface User_loginEntity {
		id?: number;

		[key: string]: any;
	}

	interface User_rbacEntity {
		id?: number;

		[key: string]: any;
	}

	interface Agent_auth {
		/** 刷新 Token TTL */
		heartbeat(data?: any): Promise<any>;

		/** 吊销当前 Token */
		closeSession(data?: any): Promise<any>;

		/** 当前会话上下文 */
		me(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: Agent_authEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<Agent_authEntity[]>;

		info(data?: { id: number | string }): Promise<Agent_authEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { heartbeat: string; closeSession: string; me: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { heartbeat: boolean; closeSession: boolean; me: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface Agent_kb {
		/** 检索知识库 */
		search(data?: any): Promise<any>;

		/** 采纳结果写回知识库 */
		adoptionWriteback(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: Agent_kbEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<Agent_kbEntity[]>;

		info(data?: { id: number | string }): Promise<Agent_kbEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { search: string; adoptionWriteback: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { search: boolean; adoptionWriteback: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface Base_comm {
		/** 获取云端上传签名 */
		upload(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: Base_commEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<Base_commEntity[]>;

		info(data?: { id: number | string }): Promise<Base_commEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { upload: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { upload: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface Base_dict {
		/** 字典类型列表 */
		types(data?: any): Promise<any>;

		/** 获得字典数据（扁平，前端组树） */
		data(data?: any): Promise<any>;

		/** 按类型 key 获得字典树 */
		get(data?: any): Promise<any>;

		/** 按类型 key + value 找树节点 */
		find(data?: any): Promise<any>;

		/** 存值反查展示名 */
		getValues(data?: any): Promise<any>;

		/** 按名称路径直取树上 value */
		pathValue(data?: any): Promise<any>;

		/** 按父 value + 子名称直取子 value */
		childValue(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: Base_dictEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<Base_dictEntity[]>;

		info(data?: { id: number | string }): Promise<Base_dictEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { types: string; data: string; get: string; find: string; getValues: string; pathValue: string; childValue: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { types: boolean; data: boolean; get: boolean; find: boolean; getValues: boolean; pathValue: boolean; childValue: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface Base_open {
		/** 实体信息与路径（含完整字典） */
		eps(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: Base_openEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<Base_openEntity[]>;

		info(data?: { id: number | string }): Promise<Base_openEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { eps: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { eps: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface Faq_faqPost {
		/** 问答分页 */
		page(data?: any): Promise<{ list: FaqPostEntity[]; pagination: { page: number; size: number; total: number } }>;

		/** 问答详情 */
		info(data?: { id: number | string }): Promise<FaqPostEntity>;

		/** 新增 */
		add(data?: any): Promise<any>;

		/** 下载导入模板 */
		importTemplate(data?: any): Promise<any>;

		/** 导入 */
		import(data?: any): Promise<any>;

		list(data?: any): Promise<FaqPostEntity[]>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { page: string; info: string; add: string; importTemplate: string; import: string; list: string; update: string; delete: string; restore: string };
		_permission: { page: boolean; info: boolean; add: boolean; importTemplate: boolean; import: boolean; list: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface Faq_faqReply {
		/** 回复分页 */
		page(data?: any): Promise<{ list: FaqReplyEntity[]; pagination: { page: number; size: number; total: number } }>;

		/** 新增 */
		add(data?: any): Promise<any>;

		/** 下载导入模板 */
		importTemplate(data?: any): Promise<any>;

		/** 导入 */
		import(data?: any): Promise<any>;

		list(data?: any): Promise<FaqReplyEntity[]>;

		info(data?: { id: number | string }): Promise<FaqReplyEntity>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { page: string; add: string; importTemplate: string; import: string; list: string; info: string; update: string; delete: string; restore: string };
		_permission: { page: boolean; add: boolean; importTemplate: boolean; import: boolean; list: boolean; info: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface Faq_faqType {
		/** 类型列表 */
		list(data?: any): Promise<FaqTypeEntity[]>;

		page(data?: any): Promise<{ list: FaqTypeEntity[]; pagination: { page: number; size: number; total: number } }>;

		info(data?: { id: number | string }): Promise<FaqTypeEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { list: string; page: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { list: boolean; page: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface I18n_pack {
		/** 已生成语言包的可切换语种 */
		locales(data?: any): Promise<any>;

		/** 运行时拉取语言包 */
		active(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: I18n_packEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<I18n_packEntity[]>;

		info(data?: { id: number | string }): Promise<I18n_packEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { locales: string; active: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { locales: boolean; active: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface PluginStore_pluginList {
		/** 市场分页 */
		page(data?: any): Promise<{ list: PluginListEntity[]; pagination: { page: number; size: number; total: number } }>;

		/** 市场列表 */
		list(data?: any): Promise<PluginListEntity[]>;

		/** 市场详情 */
		info(data?: { id: number | string }): Promise<PluginListEntity>;

		/** 新增 */
		add(data?: any): Promise<any>;

		/** 下载导入模板 */
		importTemplate(data?: any): Promise<any>;

		/** 导入 */
		import(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { page: string; list: string; info: string; add: string; importTemplate: string; import: string; update: string; delete: string; restore: string };
		_permission: { page: boolean; list: boolean; info: boolean; add: boolean; importTemplate: boolean; import: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface PluginStore_pluginReply {
		/** 讨论分页 */
		page(data?: any): Promise<{ list: PluginReplyEntity[]; pagination: { page: number; size: number; total: number } }>;

		/** 新增 */
		add(data?: any): Promise<any>;

		/** 下载导入模板 */
		importTemplate(data?: any): Promise<any>;

		/** 导入 */
		import(data?: any): Promise<any>;

		list(data?: any): Promise<PluginReplyEntity[]>;

		info(data?: { id: number | string }): Promise<PluginReplyEntity>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { page: string; add: string; importTemplate: string; import: string; list: string; info: string; update: string; delete: string; restore: string };
		_permission: { page: boolean; add: boolean; importTemplate: boolean; import: boolean; list: boolean; info: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface PluginStore_pluginTag {
		/** 标签列表 */
		list(data?: any): Promise<PluginTagEntity[]>;

		/** 标签分页 */
		page(data?: any): Promise<{ list: PluginTagEntity[]; pagination: { page: number; size: number; total: number } }>;

		info(data?: { id: number | string }): Promise<PluginTagEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { list: string; page: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { list: boolean; page: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface PluginStore_seat {
		/** 我的席位概览 */
		info(data?: { id: number | string }): Promise<PluginStore_seatEntity>;

		/** 加购席位（单价 0 则免费） */
		upgrade(data?: any): Promise<any>;

		/** 席位占用与已卸载列表 */
		occupies(data?: any): Promise<any>;

		/** 市场端卸载席位（吊销，禁止自动占回） */
		forceRelease(data?: any): Promise<any>;

		/** 允许站点重新占用席位 */
		allowReoccupy(data?: any): Promise<any>;

		/** 占用席位（签发 ticket） */
		occupy(data?: any): Promise<any>;

		/** 席位心跳（签发 ticket） */
		heartbeat(data?: any): Promise<any>;

		/** 释放席位（签发 ticket） */
		release(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: PluginStore_seatEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<PluginStore_seatEntity[]>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { info: string; upgrade: string; occupies: string; forceRelease: string; allowReoccupy: string; occupy: string; heartbeat: string; release: string; page: string; list: string; add: string; update: string; delete: string; restore: string };
		_permission: { info: boolean; upgrade: boolean; occupies: boolean; forceRelease: boolean; allowReoccupy: boolean; occupy: boolean; heartbeat: boolean; release: boolean; page: boolean; list: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface PluginStore_wallet {
		/** 钱包余额 */
		info(data?: { id: number | string }): Promise<PluginStore_walletEntity>;

		/** 创建充值订单 */
		rechargecreate(data?: any): Promise<any>;

		/** 模拟充值到账 */
		rechargemockPay(data?: any): Promise<any>;

		/** 购买插件 */
		purchase(data?: any): Promise<any>;

		/** 是否已拥有插件包 */
		packageaccess(data?: any): Promise<any>;

		/** 下载插件包 */
		packagedownload(data?: any): Promise<any>;

		/** 下载离线 license（签名文件） */
		packagelicense(data?: any): Promise<any>;

		/** 联网安装签发签名 license（非 boolean） */
		licenseissue(data?: any): Promise<any>;

		/** 核销下载码 */
		packageticket(data?: any): Promise<any>;

		/** 我的销售订单 */
		salespage(data?: any): Promise<any>;

		/** 我购买的插件与席位 */
		myPluginspage(data?: any): Promise<any>;

		/** 申请提现 */
		withdrawapply(data?: any): Promise<any>;

		/** 我的提现记录 */
		withdrawpage(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: PluginStore_walletEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<PluginStore_walletEntity[]>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { info: string; rechargecreate: string; rechargemockPay: string; purchase: string; packageaccess: string; packagedownload: string; packagelicense: string; licenseissue: string; packageticket: string; salespage: string; myPluginspage: string; withdrawapply: string; withdrawpage: string; page: string; list: string; add: string; update: string; delete: string; restore: string };
		_permission: { info: boolean; rechargecreate: boolean; rechargemockPay: boolean; purchase: boolean; packageaccess: boolean; packagedownload: boolean; packagelicense: boolean; licenseissue: boolean; packageticket: boolean; salespage: boolean; myPluginspage: boolean; withdrawapply: boolean; withdrawpage: boolean; page: boolean; list: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface Project_page {
		/** 页面图谱（pages + links） */
		list(data?: any): Promise<Project_pageEntity[]>;

		/** 新增页面节点 */
		create(data?: any): Promise<any>;

		/** 更新页面（改名/路径/坐标/schema） */
		update(data?: any): Promise<any>;

		/** 删除页面（并清理连线） */
		delete(data?: any): Promise<any>;

		/** 回收站图谱（已删页面 + 相关连线） */
		trash(data?: any): Promise<any>;

		/** 从回收站恢复页面 */
		restore(data?: any): Promise<any>;

		/** 回收站彻底删除页面 */
		forceDelete(data?: any): Promise<any>;

		/** 批量保存画布坐标 */
		layout(data?: any): Promise<any>;

		/** 新增或更新跳转边 */
		linkUpsert(data?: any): Promise<any>;

		/** 删除跳转边 */
		linkDelete(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: Project_pageEntity[]; pagination: { page: number; size: number; total: number } }>;

		info(data?: { id: number | string }): Promise<Project_pageEntity>;

		add(data?: any): Promise<any>;

		namespace: string;
		permission: { list: string; create: string; update: string; delete: string; trash: string; restore: string; forceDelete: string; layout: string; linkUpsert: string; linkDelete: string; page: string; info: string; add: string };
		_permission: { list: boolean; create: boolean; update: boolean; delete: boolean; trash: boolean; restore: boolean; forceDelete: boolean; layout: boolean; linkUpsert: boolean; linkDelete: boolean; page: boolean; info: boolean; add: boolean };
		request: Eps.Request;
	}

	interface Project_project {
		/** 创建官方项目（零代码保存） */
		create(data?: any): Promise<any>;

		/** 项目筛选（scope） */
		filter(data?: any): Promise<any>;

		/** 更新项目（名称/简介/封面/路径） */
		update(data?: any): Promise<any>;

		/** 保存后刷新最近编辑标记（打开勿调；update 已内含） */
		touch(data?: any): Promise<any>;

		/** 删除项目（仅拥有者） */
		delete(data?: any): Promise<any>;

		/** 转移项目：向对方手机发送验证码（须图片验证码） */
		transferCode(data?: any): Promise<any>;

		/** 转让项目（对方手机号 + 短信验证码） */
		transfer(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: Project_projectEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<Project_projectEntity[]>;

		info(data?: { id: number | string }): Promise<Project_projectEntity>;

		add(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { create: string; filter: string; update: string; touch: string; delete: string; transferCode: string; transfer: string; page: string; list: string; info: string; add: string; restore: string };
		_permission: { create: boolean; filter: boolean; update: boolean; touch: boolean; delete: boolean; transferCode: boolean; transfer: boolean; page: boolean; list: boolean; info: boolean; add: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface User_comm {
		/** 获取微信公众号配置 */
		wxMpConfig(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: User_commEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<User_commEntity[]>;

		info(data?: { id: number | string }): Promise<User_commEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { wxMpConfig: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { wxMpConfig: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface User_info {
		/** 获取用户信息 */
		person(data?: any): Promise<any>;

		/** 更新用户信息 */
		updatePerson(data?: any): Promise<any>;

		/** 更新用户密码 */
		updatePassword(data?: any): Promise<any>;

		/** 注销 */
		logoff(data?: any): Promise<any>;

		/** 退出登录 */
		logout(data?: any): Promise<any>;

		/** 绑定微信（提现） */
		bindWx(data?: any): Promise<any>;

		/** 绑定/验证手机号（验证码，只验一次） */
		bindPhone(data?: any): Promise<any>;

		/** 绑定/验证邮箱（验证码，只验一次） */
		bindEmail(data?: any): Promise<any>;

		/** 绑定小程序手机号 */
		miniPhone(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: User_infoEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<User_infoEntity[]>;

		info(data?: { id: number | string }): Promise<User_infoEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { person: string; updatePerson: string; updatePassword: string; logoff: string; logout: string; bindWx: string; bindPhone: string; bindEmail: string; miniPhone: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { person: boolean; updatePerson: boolean; updatePassword: boolean; logoff: boolean; logout: boolean; bindWx: boolean; bindPhone: boolean; bindEmail: boolean; miniPhone: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface User_login {
		/** 已启用的社交 SSO */
		socialProviders(data?: any): Promise<any>;

		/** 图片验证码 */
		captcha(data?: any): Promise<any>;

		/** 发送验证码（手机/邮箱自动分流） */
		otpCode(data?: any): Promise<any>;

		/** 验证码登录（登录即注册，手机/邮箱自动分流） */
		otp(data?: any): Promise<any>;

		/** 发送短信验证码 */
		smsCode(data?: any): Promise<any>;

		/** 发送邮箱验证码 */
		emailCode(data?: any): Promise<any>;

		/** 手机号验证码登录（登录即注册） */
		phone(data?: any): Promise<any>;

		/** 邮箱验证码登录（登录即注册） */
		email(data?: any): Promise<any>;

		/** 密码登录（手机号或邮箱） */
		password(data?: any): Promise<any>;

		/** 密码注册（须短信/邮箱验证码；手机/邮箱自动分流） */
		register(data?: any): Promise<any>;

		/** 小程序登录 */
		mini(data?: any): Promise<any>;

		/** 公众号登录 */
		mp(data?: any): Promise<any>;

		/** 微信APP授权登录 */
		wxApp(data?: any): Promise<any>;

		/** 一键手机号登录 */
		uniPhone(data?: any): Promise<any>;

		/** 小程序手机号登录 */
		miniPhone(data?: any): Promise<any>;

		/** 刷新token */
		refreshToken(data?: any): Promise<any>;

		/** 桥接票换可吊销会话（Docs SSO） */
		exchange(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: User_loginEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<User_loginEntity[]>;

		info(data?: { id: number | string }): Promise<User_loginEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { socialProviders: string; captcha: string; otpCode: string; otp: string; smsCode: string; emailCode: string; phone: string; email: string; password: string; register: string; mini: string; mp: string; wxApp: string; uniPhone: string; miniPhone: string; refreshToken: string; exchange: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { socialProviders: boolean; captcha: boolean; otpCode: boolean; otp: boolean; smsCode: boolean; emailCode: boolean; phone: boolean; email: boolean; password: boolean; register: boolean; mini: boolean; mp: boolean; wxApp: boolean; uniPhone: boolean; miniPhone: boolean; refreshToken: boolean; exchange: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	interface User_rbac {
		/** 当前权限 */
		perms(data?: any): Promise<any>;

		page(data?: any): Promise<{ list: User_rbacEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<User_rbacEntity[]>;

		info(data?: { id: number | string }): Promise<User_rbacEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { perms: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { perms: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
		request: Eps.Request;
	}

	type Service = {
		request: Request;
		agent: {
			auth: Agent_auth;
			kb: Agent_kb;
		};
		base: {
			comm: Base_comm;
			dict: Base_dict;
			open: Base_open;
		};
		faq: {
			faqPost: Faq_faqPost;
			faqReply: Faq_faqReply;
			faqType: Faq_faqType;
		};
		i18n: {
			pack: I18n_pack;
		};
		pluginStore: {
			pluginList: PluginStore_pluginList;
			pluginReply: PluginStore_pluginReply;
			pluginTag: PluginStore_pluginTag;
			seat: PluginStore_seat;
			wallet: PluginStore_wallet;
		};
		project: {
			page: Project_page;
			project: Project_project;
		};
		user: {
			comm: User_comm;
			info: User_info;
			login: User_login;
			rbac: User_rbac;
		};
	};
}
