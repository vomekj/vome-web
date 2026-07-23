declare namespace Eps {
	type RequestOptions = {
		url?: string;
		method?: string;
		data?: any;
		params?: any;
		[key: string]: any;
	};

	type Request = (options?: RequestOptions) => Promise<any>;

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

	interface I18n_packEntity {
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
		/** 实体信息与路径 */
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
		permission: { person: string; updatePerson: string; updatePassword: string; logoff: string; logout: string; bindPhone: string; bindEmail: string; miniPhone: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { person: boolean; updatePerson: boolean; updatePassword: boolean; logoff: boolean; logout: boolean; bindPhone: boolean; bindEmail: boolean; miniPhone: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
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

		/** 密码注册（手机号或邮箱） */
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

		page(data?: any): Promise<{ list: User_loginEntity[]; pagination: { page: number; size: number; total: number } }>;

		list(data?: any): Promise<User_loginEntity[]>;

		info(data?: { id: number | string }): Promise<User_loginEntity>;

		add(data?: any): Promise<any>;

		update(data?: any): Promise<any>;

		delete(data?: any): Promise<any>;

		restore(data?: any): Promise<any>;

		namespace: string;
		permission: { socialProviders: string; captcha: string; otpCode: string; otp: string; smsCode: string; emailCode: string; phone: string; email: string; password: string; register: string; mini: string; mp: string; wxApp: string; uniPhone: string; miniPhone: string; refreshToken: string; page: string; list: string; info: string; add: string; update: string; delete: string; restore: string };
		_permission: { socialProviders: boolean; captcha: boolean; otpCode: boolean; otp: boolean; smsCode: boolean; emailCode: boolean; phone: boolean; email: boolean; password: boolean; register: boolean; mini: boolean; mp: boolean; wxApp: boolean; uniPhone: boolean; miniPhone: boolean; refreshToken: boolean; page: boolean; list: boolean; info: boolean; add: boolean; update: boolean; delete: boolean; restore: boolean };
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
		base: {
			comm: Base_comm;
			dict: Base_dict;
			open: Base_open;
		};
		i18n: {
			pack: I18n_pack;
		};
		user: {
			comm: User_comm;
			info: User_info;
			login: User_login;
			rbac: User_rbac;
		};
	};
}
