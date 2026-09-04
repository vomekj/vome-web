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

	interface Base_paramEntity {
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

		namespace: string;
		permission: { upload: string };
		_permission: { upload: boolean };
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

		namespace: string;
		permission: { types: string; data: string; get: string; find: string; getValues: string; pathValue: string; childValue: string };
		_permission: { types: boolean; data: boolean; get: boolean; find: boolean; getValues: boolean; pathValue: boolean; childValue: boolean };
		request: Eps.Request;
	}

	interface Base_open {
		/** 实体信息与路径（含完整字典） */
		eps(data?: any): Promise<any>;

		namespace: string;
		permission: { eps: string };
		_permission: { eps: boolean };
		request: Eps.Request;
	}

	interface Base_param {
		/** 按 keyName 取值（可带 JSON path） */
		get(data?: any): Promise<any>;

		/** 点路径取值，如 user.info.name */
		getByPath(data?: any): Promise<any>;

		namespace: string;
		permission: { get: string; getByPath: string };
		_permission: { get: boolean; getByPath: boolean };
		request: Eps.Request;
	}

	interface I18n_pack {
		/** 已生成语言包的可切换语种（宿主） */
		locales(data?: any): Promise<any>;

		/** 运行时拉取语言包（宿主） */
		active(data?: any): Promise<any>;

		/** 插件语言包可切换语种 */
		pluginlocales(data?: any): Promise<any>;

		/** 插件运行时语言包 */
		pluginactive(data?: any): Promise<any>;

		namespace: string;
		permission: { locales: string; active: string; pluginlocales: string; pluginactive: string };
		_permission: { locales: boolean; active: boolean; pluginlocales: boolean; pluginactive: boolean };
		request: Eps.Request;
	}

	interface User_comm {
		/** 获取微信公众号配置 */
		wxMpConfig(data?: any): Promise<any>;

		namespace: string;
		permission: { wxMpConfig: string };
		_permission: { wxMpConfig: boolean };
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

		namespace: string;
		permission: { person: string; updatePerson: string; updatePassword: string; logoff: string; logout: string; bindPhone: string; bindEmail: string; miniPhone: string };
		_permission: { person: boolean; updatePerson: boolean; updatePassword: boolean; logoff: boolean; logout: boolean; bindPhone: boolean; bindEmail: boolean; miniPhone: boolean };
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

		namespace: string;
		permission: { socialProviders: string; captcha: string; otpCode: string; otp: string; smsCode: string; emailCode: string; phone: string; email: string; password: string; register: string; mini: string; mp: string; wxApp: string; uniPhone: string; miniPhone: string; refreshToken: string; exchange: string };
		_permission: { socialProviders: boolean; captcha: boolean; otpCode: boolean; otp: boolean; smsCode: boolean; emailCode: boolean; phone: boolean; email: boolean; password: boolean; register: boolean; mini: boolean; mp: boolean; wxApp: boolean; uniPhone: boolean; miniPhone: boolean; refreshToken: boolean; exchange: boolean };
		request: Eps.Request;
	}

	interface User_rbac {
		/** 当前权限 */
		perms(data?: any): Promise<any>;

		namespace: string;
		permission: { perms: string };
		_permission: { perms: boolean };
		request: Eps.Request;
	}

	type Service = {
		request: Request;
		base: {
			comm: Base_comm;
			dict: Base_dict;
			open: Base_open;
			param: Base_param;
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
